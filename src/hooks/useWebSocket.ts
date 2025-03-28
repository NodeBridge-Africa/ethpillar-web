import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

// Re-use or import event/data types from server definition if possible
interface ServerToClientEvents {
  connect_error: (err: { message: string }) => void;
  log_data: (data: { service: string; line: string }) => void;
  status_update: (data: { service: string; status: string }[]) => void;
  error: (data: { message: string }) => void;
  authenticated: () => void; // Added for authentication confirmation
}

interface ClientToServerEvents {
  authenticate: (token: string, callback?: (success: boolean) => void) => void;
  subscribe_logs: (data: { service: string }) => void;
  unsubscribe_logs: (data: { service: string }) => void;
  subscribe_status: (data: { interval?: number }) => void;
  unsubscribe_status: () => void;
}

// Specify the types for the socket instance
type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Get WebSocket server URL from environment variable
const WS_SERVER_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";
console.log(`WebSocket URL: ${WS_SERVER_URL}`);

export function useWebSocket() {
  const [socket, setSocket] = useState<AppSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const authAttempted = useRef(false);
  const connectionAttemptRef = useRef<NodeJS.Timeout | null>(null);

  // Use useRef to avoid re-creating the socket on every render
  const socketRef = useRef<AppSocket | null>(null);

  // Function to authenticate the socket
  const authenticate = useCallback((socket: AppSocket, token: string) => {
    if (!token) {
      console.error("WS Authentication failed: No token provided");
      setLastError("Authentication failed: Missing session token.");
      socket.disconnect();
      return;
    }

    // Store token in localStorage for future reconnects
    try {
      localStorage.setItem("ssh_session_token", token);
    } catch (e) {
      console.warn("Could not store token in localStorage:", e);
    }

    console.log("WS Authenticating with token...");
    authAttempted.current = true;

    socket.emit("authenticate", token, (success) => {
      if (success) {
        console.log("WS Authentication successful via callback");
        setIsAuthenticated(true);
        setLastError(null);
        reconnectAttempts.current = 0; // Reset reconnect attempts on successful auth
      } else {
        console.error("WS Authentication failed via callback");
        setLastError("Authentication failed: Server rejected token.");
        socket.disconnect();
      }
    });
  }, []);

  // Function to create a new socket connection
  const createSocketConnection = useCallback(() => {
    // Clear any existing connection attempt
    if (connectionAttemptRef.current) {
      clearTimeout(connectionAttemptRef.current);
      connectionAttemptRef.current = null;
    }

    // Clean up any existing socket
    if (socketRef.current) {
      console.log("WS: Cleaning up existing connection before reconnecting...");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Get the session token - try cookies first, then localStorage
    let token = Cookies.get("ssh_session") || Cookies.get("ssh_session_ws");

    // Fallback to localStorage if needed
    if (!token) {
      const storedToken = localStorage.getItem("ssh_session_token");
      if (storedToken) {
        console.log("WS: Using token from localStorage");
        token = storedToken;
      }
    }

    if (!token) {
      console.log("WS: No session token found in any storage, not connecting.");
      setLastError("Authentication failed: Missing session token.");
      return; // Don't connect if no token
    }

    // Store the token in localStorage as fallback
    try {
      localStorage.setItem("ssh_session_token", token);
    } catch (e) {
      console.warn("Could not store token in localStorage:", e);
    }

    console.log(`WS: Connecting to ${WS_SERVER_URL} with token available`);

    // Connect to the external WebSocket server with improved options
    const socket = io(WS_SERVER_URL, {
      path: "/", // Root path for dedicated WebSocket server
      addTrailingSlash: false,
      transports: ["websocket", "polling"], // Try both websocket and polling
      extraHeaders: {
        cookie: `ssh_session=${token}`, // Explicitly send the token as cookie
      },
      withCredentials: true, // Important for cookies
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000, // Increase timeout to 20 seconds
      auth: {
        token: token, // Also send token in auth object as fallback
      },
      forceNew: true, // Force a new connection
    });

    socketRef.current = socket;
    setSocket(socket);
    setIsConnected(false);
    setIsAuthenticated(false);
    authAttempted.current = false;

    // Set a safety timeout in case the connection hangs
    connectionAttemptRef.current = setTimeout(() => {
      if (!isConnected && socketRef.current) {
        console.log("WS: Connection attempt timed out, forcing disconnect.");
        socketRef.current.disconnect();

        // Try to reconnect if under the max attempts
        reconnectAttempts.current += 1;
        if (reconnectAttempts.current < maxReconnectAttempts) {
          console.log(
            `WS: Attempting reconnect ${reconnectAttempts.current}/${maxReconnectAttempts}...`
          );
          connectionAttemptRef.current = setTimeout(
            createSocketConnection,
            2000
          );
        } else {
          setLastError(
            `Connection failed after ${maxReconnectAttempts} attempts. Please check your network or try refreshing.`
          );
        }
      }
    }, 15000); // 15-second safety timeout

    // Setup event handlers
    setupSocketEventHandlers(socket, token);

    return socket;
  }, []);

  // Function to setup socket event handlers
  const setupSocketEventHandlers = useCallback(
    (socket: AppSocket, token: string) => {
      // Handle connection
      socket.on("connect", () => {
        console.log("WS Connected:", socket.id);
        setIsConnected(true);

        // Clear safety timeout since we're connected
        if (connectionAttemptRef.current) {
          clearTimeout(connectionAttemptRef.current);
          connectionAttemptRef.current = null;
        }

        // Only reset the error if it was a connection-related error
        if (
          lastError &&
          (lastError.includes("connection") ||
            lastError.includes("connect") ||
            lastError.includes("timeout"))
        ) {
          setLastError(null);
        }

        // Authentication state is reset on connect
        setIsAuthenticated(false);
        authAttempted.current = false;

        // Authenticate immediately after connection
        if (token && socket.connected) {
          authenticate(socket, token);
        } else {
          console.error(
            "WS Authentication failed: No session token found post-connect."
          );
          setLastError("Authentication failed: Missing session token.");
          socket.disconnect();
        }
      });

      // Handle explicit authentication success
      socket.on("authenticated", () => {
        console.log("WS Explicitly authenticated via server event");
        setIsAuthenticated(true);
        setLastError(null);
        reconnectAttempts.current = 0; // Reset reconnect attempts on successful auth
      });

      // Handle disconnection
      socket.on("disconnect", (reason) => {
        console.log("WS Disconnected:", reason);
        setIsConnected(false);
        setIsAuthenticated(false);

        // If we're explicitly disconnecting, don't increment attempt counter
        if (
          reason !== "io client disconnect" &&
          reason !== "io server disconnect"
        ) {
          // Increase reconnect counter
          reconnectAttempts.current += 1;

          // If we've exceeded max attempts, show a more severe error
          if (reconnectAttempts.current >= maxReconnectAttempts) {
            setLastError(
              `Connection lost. Exceeded maximum reconnection attempts.`
            );
          } else {
            // Attempt to reconnect or notify user
            setLastError(
              `Disconnected: ${reason}. Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`
            );
          }
        }
      });

      // Handle connection errors
      socket.on("connect_error", (err) => {
        console.error("WS Connection Error:", err);
        setIsConnected(false);
        setIsAuthenticated(false);

        // Increase reconnect counter
        reconnectAttempts.current += 1;

        // If we've exceeded max attempts, show a more severe error
        if (reconnectAttempts.current >= maxReconnectAttempts) {
          setLastError(
            `Connection failed: ${err.message}. Exceeded maximum reconnection attempts.`
          );
        } else {
          setLastError(
            `Connection failed: ${err.message}. Retrying... (${reconnectAttempts.current}/${maxReconnectAttempts})`
          );
        }
      });

      // Handle server errors
      socket.on("error", (data) => {
        console.error("WS Server Error:", data.message);
        setLastError(`Server error: ${data.message}`);
        // If error indicates an auth issue, try to re-authenticate
        if (data.message.toLowerCase().includes("auth") && socket.connected) {
          const currentToken =
            Cookies.get("ssh_session") ||
            Cookies.get("ssh_session_ws") ||
            localStorage.getItem("ssh_session_token") ||
            token;
          if (currentToken) {
            console.log("Attempting re-authentication after server error...");
            authenticate(socket, currentToken);
          }
        }
      });
    },
    [authenticate, lastError]
  );

  // Create and manage WebSocket connection
  useEffect(() => {
    // Create socket connection
    createSocketConnection();

    // Cleanup function
    return () => {
      if (connectionAttemptRef.current) {
        clearTimeout(connectionAttemptRef.current);
        connectionAttemptRef.current = null;
      }

      if (socketRef.current) {
        console.log("WS Cleaning up connection...");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
        setIsAuthenticated(false);
        reconnectAttempts.current = 0;
        authAttempted.current = false;
      }
    };
  }, [createSocketConnection]);

  // Memoize emit function to prevent unnecessary re-renders in consuming components
  const emit = useCallback(
    <T extends keyof ClientToServerEvents>(
      event: T,
      ...args: Parameters<ClientToServerEvents[T]>
    ) => {
      if (socket?.connected && isAuthenticated) {
        socket.emit(event, ...args);
      } else {
        console.warn(
          `WS: Cannot emit '${event}', socket not connected or authenticated.`
        );
        // Try to re-authenticate if socket is connected but not authenticated
        if (socket?.connected && !isAuthenticated && !authAttempted.current) {
          let token =
            Cookies.get("ssh_session") || Cookies.get("ssh_session_ws");

          // Try localStorage as fallback
          if (!token) {
            const storedToken = localStorage.getItem("ssh_session_token");
            if (storedToken) {
              token = storedToken;
            }
          }

          if (token) {
            console.log("Attempting authentication before emitting event...");
            authenticate(socket, token);
          }
        } else if (!socket?.connected) {
          // If not connected at all, try reconnecting
          console.log("WS: Socket not connected, attempting to reconnect...");
          createSocketConnection();
        }
      }
    },
    [socket, isAuthenticated, authenticate, createSocketConnection]
  );

  // Memoize on function
  const on = useCallback(
    <T extends keyof ServerToClientEvents>(
      event: T,
      callback: ServerToClientEvents[T]
    ) => {
      if (socket) {
        // Remove existing listener before adding a new one to prevent duplicates if called multiple times
        socket.off(event, callback as any); // Need 'as any' due to complex typing, be careful
        socket.on(event, callback as any);
      }
      // Return an off function for cleanup
      return () => {
        socket?.off(event, callback as any);
      };
    },
    [socket]
  );

  // Function to force a reconnection
  const reconnect = useCallback(() => {
    console.log("WS: Forcing reconnection...");
    reconnectAttempts.current = 0; // Reset attempts
    setLastError(null);
    createSocketConnection();
  }, [createSocketConnection]);

  return {
    socket,
    isConnected,
    isAuthenticated,
    lastError,
    emit,
    on,
    reconnect,
  };
}
