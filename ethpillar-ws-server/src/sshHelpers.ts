import { Socket } from "socket.io";
import { Client } from "ssh2";

// Stream logs for a specific service
export const streamServiceLogs = (
  socket: Socket,
  client: Client,
  service: string
): (() => void) => {
  console.log(`Starting log stream for ${service}`);

  // Command to get the logs using journalctl
  const command = `sudo journalctl -fu ${service}.service --no-pager --output cat -n 50`;

  let stream: any = null;

  client.exec(command, { pty: true }, (err, _stream) => {
    if (err) {
      console.error(`Error executing log command for ${service}:`, err);
      socket.emit("error", {
        message: `Failed to start log stream for ${service}: ${err.message}`,
      });
      return;
    }

    stream = _stream;

    stream.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        if (line.trim()) {
          // Only emit non-empty lines
          socket.emit("log_data", { service, line: line.trim() });
        }
      });
    });

    stream.stderr?.on("data", (data: Buffer) => {
      const errorLine = data.toString();
      console.error(`Stderr from log stream for ${service}:`, errorLine);

      // Filter out sudo password prompts if pty captures them
      if (!errorLine.includes("sudo:")) {
        socket.emit("log_data", {
          service,
          line: `stderr: ${errorLine}`,
        });
      }
    });

    stream.on("close", () => {
      console.log(`Log stream for ${service} closed`);
    });

    stream.on("error", (streamErr: Error) => {
      console.error(`Error in log stream for ${service}:`, streamErr);
      socket.emit("error", {
        message: `Log stream error for ${service}: ${streamErr.message}`,
      });
    });
  });

  // Return a function to stop the stream
  return () => {
    if (stream) {
      console.log(`Stopping log stream for ${service}`);
      stream.close();
    }
  };
};

// Poll for service status updates
export const startStatusPolling = (
  socket: Socket,
  client: Client,
  interval: number = 5000
): NodeJS.Timeout => {
  console.log(`Starting status polling with interval: ${interval}ms`);

  // Function to fetch status of services
  const fetchStatus = async () => {
    if (!client) {
      console.log("SSH client not available, stopping status polling");
      return;
    }

    try {
      // Command to check status of ethpillar services
      const command =
        "systemctl list-units '*eth*' '*pillar*' --all --no-pager --plain";

      const output = await new Promise<string>((resolve, reject) => {
        client.exec(command, (err, stream) => {
          if (err) {
            reject(err);
            return;
          }

          let output = "";

          stream.on("data", (data: Buffer) => {
            output += data.toString();
          });

          stream.stderr.on("data", (data: Buffer) => {
            console.error("Status command stderr:", data.toString());
          });

          stream.on("close", () => {
            resolve(output);
          });

          stream.on("error", (err: Error) => {
            reject(err);
          });
        });
      });

      // Parse the output to get service status
      const serviceStatuses = parseServiceStatus(output);

      // Emit the status update
      socket.emit("status_update", serviceStatuses);
    } catch (error: any) {
      console.error("Error fetching service status:", error.message);
      socket.emit("error", {
        message: `Status check failed: ${error.message}`,
      });
    }
  };

  // Run the initial status check
  fetchStatus();

  // Set up interval for status checks
  return setInterval(fetchStatus, interval);
};

// Parse systemctl output to get service statuses
function parseServiceStatus(
  output: string
): { service: string; status: string }[] {
  const lines = output.split("\n").filter((line) => line.trim() !== "");
  const services: { service: string; status: string }[] = [];

  // Skip the header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const parts = line.split(/\s+/);

      if (parts.length >= 3) {
        const service = parts[0].replace(".service", "");
        // Usually the 3rd column has the status like "loaded active running"
        const status = parts.slice(2, 5).join(" ");

        services.push({ service, status });
      }
    }
  }

  return services;
}
