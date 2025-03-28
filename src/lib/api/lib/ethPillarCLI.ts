import { Client, ClientChannel } from "ssh2";
import { Socket } from "socket.io";

// Define types for the socket events
interface ServerToClientEvents {
  log_data: (data: { service: string; line: string }) => void;
  status_update: (data: { service: string; status: string }[]) => void;
  error: (data: { message: string }) => void;
}

/**
 * Streams logs for a specific service over a WebSocket connection.
 * Returns a function to stop the stream.
 */
export function streamServiceLogs(
  sshClient: Client,
  socket: Socket<any, ServerToClientEvents>,
  service: string
): (() => void) | null {
  // Return a cleanup function or null on error
  console.log(
    `Attempting to stream logs for ${service} via socket ${socket.id}`
  );
  const command = `sudo journalctl -fu ${service}.service --no-pager --output cat -n 50`; // Start with recent lines
  let sshStream: ClientChannel | null = null;

  sshClient.exec(command, { pty: true }, (err, stream) => {
    if (err) {
      console.error(`Error executing log command for ${service}:`, err);
      socket.emit("error", {
        message: `Failed to start log stream for ${service}: ${err.message}`,
      });
      return;
    }

    sshStream = stream; // Store the stream reference

    stream.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        socket.emit("log_data", { service, line });
      });
    });

    stream.stderr?.on("data", (data: Buffer) => {
      const errorLine = data.toString();
      console.error(`Stderr from log stream for ${service}:`, errorLine);
      if (!errorLine.includes("sudo:")) {
        socket.emit("log_data", { service, line: `stderr: ${errorLine}` });
      }
    });

    stream.on("close", () => {
      console.log(`SSH log stream for ${service} closed.`);
      sshStream = null;
      // Optionally notify client that the stream ended naturally
    });
    stream.on("error", (streamErr: Error) => {
      console.error(`Error in SSH log stream for ${service}:`, streamErr);
      socket.emit("error", {
        message: `Log stream error for ${service}: ${streamErr.message}`,
      });
      sshStream = null;
    });
  });

  // Return a function to stop the stream
  return () => {
    if (sshStream) {
      console.log(`Stopping log stream for ${service} requested by client.`);
      sshStream.close(); // Close the SSH stream
    }
  };
}

/**
 * Periodically fetches service statuses and emits them over WebSocket.
 * Returns an interval ID to allow stopping.
 */
export function startStatusPolling(
  sshClient: Client,
  socket: Socket<any, ServerToClientEvents>,
  interval: number = 5000
): NodeJS.Timeout | null {
  console.log(
    `Starting status polling for socket ${socket.id} (interval: ${interval}ms)`
  );

  const fetchAndEmitStatus = async () => {
    if (!socket.connected) {
      // Stop if socket disconnected
      console.log(`Socket ${socket.id} disconnected, stopping status poll.`);
      if (intervalId) clearInterval(intervalId);
      return;
    }

    const services = [
      "execution",
      "consensus",
      "validator",
      "mevboost",
      "csm_nimbusvalidator",
    ];
    const statuses: { service: string; status: string }[] = [];
    const command = services
      .map(
        (s) =>
          `test -f /etc/systemd/system/${s}.service && (systemctl is-active ${s}.service || echo "inactive") || echo "not_installed"`
      )
      .join(" ; ");

    try {
      const output = await new Promise<string>((resolve, reject) => {
        let stdoutData = "";
        let stderrData = "";
        sshClient.exec(command, (err, stream) => {
          if (err) return reject(err);
          stream.on("data", (data: Buffer) => (stdoutData += data.toString()));
          stream.stderr.on(
            "data",
            (data: Buffer) => (stderrData += data.toString())
          );
          stream.on("close", () => {
            if (stderrData.trim())
              console.warn(
                `Status poll stderr (Socket ${socket.id}): ${stderrData.trim()}`
              );
            resolve(stdoutData);
          });
          stream.on("error", (streamErr: Error) => reject(streamErr));
        });
      });

      const results = output.trim().split("\n");
      services.forEach((service, index) => {
        statuses.push({
          service,
          status: results[index] ? results[index].trim() : "unknown",
        });
      });
      socket.emit("status_update", statuses);
    } catch (error: any) {
      console.error(
        `Error fetching status poll for socket ${socket.id}:`,
        error
      );
      socket.emit("error", {
        message: `Failed to fetch node status: ${error.message}`,
      });
    }
  };

  fetchAndEmitStatus(); // Run immediately
  const intervalId = setInterval(fetchAndEmitStatus, interval);
  return intervalId;
}

/**
 * Execute a single SSH command and return the result.
 * For non-streaming, one-time commands.
 */
export async function executeSSHCommand(
  sshClient: Client,
  command: string
): Promise<string> {
  const wrappedCommand = `/bin/bash -i -c 'source ~/.bashrc 2>/dev/null; ${command}'`;
  return new Promise<string>((resolve, reject) => {
    let output = "";
    let errorOutput = "";
    sshClient.exec(wrappedCommand, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }
      stream.on("data", (data: Buffer) => {
        output += data.toString();
      });
      stream.stderr.on("data", (data: Buffer) => {
        errorOutput += data.toString();
      });
      stream.on("close", (code: number | null) => {
        // Prioritize error output if it exists and code is non-zero or null
        if (errorOutput && (code !== 0 || code === null)) {
          reject(new Error(errorOutput));
        } else {
          resolve(output || errorOutput); // Return stdout or stderr if stdout is empty
        }
      });
      stream.on("error", (streamErr: Error) => {
        reject(streamErr);
      });
    });
  });
}
