import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Client } from "ssh2";
import cookie from "cookie";
import dotenv from "dotenv";
import { connectionManager } from "./connectionManager";
import { streamServiceLogs, startStatusPolling } from "./sshHelpers";

// Load environment variables
dotenv.config();

// Enable debug mode for socket.io
process.env.DEBUG = process.env.DEBUG || "socket.io:*";

// Define interfaces for type safety
interface ServerToClientEvents {
  connect_error: (err: { message: string }) => void;
  log_data: (data: { service: string; line: string }) => void;
  status_update: (data: { service: string; status: string }[]) => void;
  error: (data: { message: string }) => void;
  authenticated: () => void;
}

interface ClientToServerEvents {
  authenticate: (token: string, callback?: (success: boolean) => void) => void;
  subscribe_logs: (data: { service: string }) => void;
  unsubscribe_logs: (data: { service: string }) => void;
  subscribe_status: (data: { interval?: number }) => void;
  unsubscribe_status: () => void;
}

interface InterServerEvents {
  // placeholder
}

interface SocketData {
  sessionId: string | null;
  sshClient: Client | null;
  logStopFunctions: Map<string, () => void>;
  statusIntervalId: NodeJS.Timeout | null;
  sshListeners?: {
    error: (err: Error) => void;
    close: () => void;
  };
}

// Create HTTP server
const httpServer = createServer();

// Create Socket.IO server
const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  path: "/", // Use root path for dedicated server
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 30000, // Increase ping timeout to 30 seconds
  pingInterval: 10000, // Check connection every 10 seconds
  connectTimeout: 30000, // Increase connect timeout
  transports: ["websocket", "polling"], // Allow polling as fallback
});

console.log(
  `🔌 WebSocket server allowing connections from: ${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }`
);

// Also add a heartbeat check to keep connections alive
setInterval(() => {
  const sockets = Array.from(io.sockets.sockets.values());
  console.log(`🔌 WebSocket server has ${sockets.length} connected clients`);
}, 30000); // Log connection count every 30 seconds

// Enhanced socket authentication middleware
io.use(async (socket, next) => {
  try {
    // Check if cookies exist in different ways
    const cookies = socket.handshake.headers.cookie;
    let token = null;

    // Try to get token from cookies
    if (cookies) {
      console.log(`Socket ${socket.id} has cookies. Parsing...`);
      const parsedCookies = cookie.parse(cookies);
      token = parsedCookies.ssh_session;

      // Log if we found the token
      if (token) {
        console.log(
          `Socket ${socket.id} has ssh_session cookie: ${token.substring(
            0,
            8
          )}...`
        );
      } else {
        console.log(
          `Socket ${
            socket.id
          } has cookies but no ssh_session cookie found. Cookie keys: ${Object.keys(
            parsedCookies
          ).join(", ")}`
        );
      }
    } else {
      console.log(`Socket ${socket.id} has no cookies.`);
    }

    // If no token in cookies, try auth object
    if (!token && socket.handshake.auth && socket.handshake.auth.token) {
      token = socket.handshake.auth.token;
      console.log(
        `Socket ${socket.id} has token in auth object: ${token.substring(
          0,
          8
        )}...`
      );
    }

    // Allow connection without a token initially, but authentication will be required
    // in the 'authenticate' event
    if (!token) {
      console.log(
        `Socket ${socket.id} allowed to connect, will require explicit authentication`
      );
      (socket as any)._requiresAuth = true;
      return next();
    }

    // Pre-validate token with Redis before establishing full connection
    try {
      const sessionExists = await connectionManager.sessionExists(token);
      if (!sessionExists) {
        console.log(`Socket ${socket.id} has invalid session token`);
        return next(
          new Error("Authentication error: Invalid or expired session.")
        );
      }

      // Store token temporary for the 'authenticate' event handler
      console.log(
        `Socket ${socket.id} has valid session token, continuing to connect`
      );
      (socket as any)._tempToken = token;
      next();
    } catch (error: any) {
      console.error("Redis check error:", error);
      return next(
        new Error("Authentication error: Server error during validation.")
      );
    }
  } catch (error: any) {
    console.error(`Socket middleware error: ${error.message}`);
    return next(new Error(`Authentication error: ${error.message}`));
  }
});

// Handle socket connections
io.on("connection", (socket) => {
  const token = (socket as any)._tempToken;
  const requiresAuth = (socket as any)._requiresAuth || false;

  // Clean up temp properties
  delete (socket as any)._tempToken;
  delete (socket as any)._requiresAuth;

  console.log(
    `🔌 Socket connected: ${socket.id}, requires auth: ${requiresAuth}`
  );

  // Initialize socket data
  socket.data = {
    sessionId: null,
    sshClient: null,
    logStopFunctions: new Map(),
    statusIntervalId: null,
  };

  // If we already validated the token in middleware, auto-authenticate the socket
  if (token && !requiresAuth) {
    (async () => {
      try {
        console.log(
          `Auto-authenticating socket ${socket.id} with pre-validated token`
        );
        const sshClient = await connectionManager.getConnection(token);

        socket.data.sessionId = token;
        socket.data.sshClient = sshClient;

        console.log(
          `✅ Socket ${socket.id} auto-authenticated successfully for session ${token}`
        );

        // Add SSH error/close handlers
        setupSSHListeners(socket, sshClient);

        // Confirm authentication to client
        socket.emit("authenticated");
      } catch (error: any) {
        console.error(
          `Auto-authentication failed for socket ${socket.id}:`,
          error.message
        );
        socket.emit("error", {
          message: error.message || "Auto-authentication failed",
        });
      }
    })();
  }

  // Client must emit 'authenticate' with the token after connection
  socket.on("authenticate", async (clientToken, callback) => {
    // Only check against pre-validated token if we have one
    if (token && !requiresAuth && clientToken !== token) {
      console.error(
        `Authentication failed for socket ${socket.id}: Token mismatch.`
      );
      socket.emit("error", {
        message: "Authentication token mismatch.",
      });

      if (callback) callback(false);
      return;
    }

    try {
      console.log(
        `Authenticating socket ${socket.id} with token: ${clientToken.substring(
          0,
          8
        )}...`
      );

      // Check if session exists first
      const sessionExists = await connectionManager.sessionExists(clientToken);
      if (!sessionExists) {
        throw new Error("Invalid or expired session");
      }

      const sshClient = await connectionManager.getConnection(clientToken);

      socket.data.sessionId = clientToken;
      socket.data.sshClient = sshClient;

      console.log(
        `✅ Socket ${socket.id} authenticated successfully for session ${clientToken}`
      );

      // Add SSH error/close handlers
      setupSSHListeners(socket, sshClient);

      // Confirm authentication to client
      socket.emit("authenticated");
      if (callback) callback(true);
    } catch (error: any) {
      console.error(
        `Authentication failed for socket ${socket.id}:`,
        error.message
      );
      socket.emit("error", {
        message: error.message || "Invalid session ID.",
      });

      if (callback) callback(false);
    }
  });

  // Helper function to setup SSH event listeners
  function setupSSHListeners(socket: any, sshClient: Client) {
    // Add SSH error/close handlers specific to this socket
    const sshErrorHandler = (err: Error) => {
      console.error(
        `SSH Error for session ${socket.data.sessionId} (Socket ${socket.id}):`,
        err.message
      );
      socket.emit("error", {
        message: `SSH connection error: ${err.message}`,
      });
      socket.disconnect(true);
    };

    const sshCloseHandler = () => {
      console.log(
        `SSH connection closed for session ${socket.data.sessionId} (Socket ${socket.id})`
      );
      socket.emit("error", {
        message: "SSH connection closed unexpectedly.",
      });
      socket.disconnect(true);
    };

    sshClient.on("error", sshErrorHandler);
    sshClient.on("close", sshCloseHandler);

    // Store handlers to remove later on disconnect
    socket.data.sshListeners = {
      error: sshErrorHandler,
      close: sshCloseHandler,
    };
  }

  // Handle log subscription
  socket.on("subscribe_logs", ({ service }) => {
    if (!socket.data.sshClient || !socket.data.sessionId) {
      socket.emit("error", { message: "Not authenticated." });
      return;
    }

    if (socket.data.logStopFunctions.has(service)) {
      console.log(
        `Socket ${socket.id} already subscribed to logs for ${service}`
      );
      return;
    }

    console.log(`Socket ${socket.id} subscribing to logs for ${service}`);

    // Start log streaming and store the stop function
    const stopFunction = streamServiceLogs(
      socket,
      socket.data.sshClient,
      service
    );

    socket.data.logStopFunctions.set(service, stopFunction);
  });

  // Handle log unsubscription
  socket.on("unsubscribe_logs", ({ service }) => {
    const stopFunction = socket.data.logStopFunctions.get(service);
    if (stopFunction) {
      console.log(`Socket ${socket.id} unsubscribing from logs for ${service}`);
      stopFunction(); // Call the stop function
      socket.data.logStopFunctions.delete(service);
    }
  });

  // Handle status subscription
  socket.on("subscribe_status", ({ interval = 5000 }) => {
    if (!socket.data.sshClient || !socket.data.sessionId) {
      socket.emit("error", { message: "Not authenticated." });
      return;
    }

    if (socket.data.statusIntervalId) {
      console.log(`Socket ${socket.id} already subscribed to status updates.`);
      return;
    }

    console.log(
      `Socket ${socket.id} subscribing to status updates (interval: ${interval}ms)`
    );

    // Start polling for status updates
    const intervalId = startStatusPolling(
      socket,
      socket.data.sshClient,
      interval
    );

    socket.data.statusIntervalId = intervalId;
  });

  // Handle status unsubscription
  socket.on("unsubscribe_status", () => {
    if (socket.data.statusIntervalId) {
      console.log(`Socket ${socket.id} unsubscribing from status updates.`);
      clearInterval(socket.data.statusIntervalId);
      socket.data.statusIntervalId = null;
    }
  });

  // Handle disconnection cleanup
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);

    // Clean up log subscriptions
    for (const stopFunction of socket.data.logStopFunctions.values()) {
      stopFunction();
    }
    socket.data.logStopFunctions.clear();

    // Clean up status subscription
    if (socket.data.statusIntervalId) {
      clearInterval(socket.data.statusIntervalId);
      socket.data.statusIntervalId = null;
    }

    // Clean up SSH listeners
    if (socket.data.sshClient && socket.data.sshListeners) {
      socket.data.sshClient.removeListener(
        "error",
        socket.data.sshListeners.error
      );
      socket.data.sshClient.removeListener(
        "close",
        socket.data.sshListeners.close
      );
    }

    // Keep the SSH client in the connection manager for reuse
    // It will be managed and cleaned up by the connection manager's own cleanup mechanism
  });
});

// Start the server
const PORT = process.env.WS_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket Server listening on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing WebSocket server");
  io.close(async () => {
    console.log("WebSocket server closed");
    httpServer.close(() => {
      console.log("HTTP server closed");
      // Close Redis connection and SSH connections
      connectionManager
        .shutdown()
        .then(() => {
          console.log("Connection manager shutdown complete");
          process.exit(0);
        })
        .catch((err) => {
          console.error("Error during shutdown:", err);
          process.exit(1);
        });
    });
  });
});
