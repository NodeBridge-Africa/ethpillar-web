import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import { parseLogLine } from "@/app/api/lib/utils"; // Import from the correct path

// Define ParsedLog interface (if not already defined/imported)
interface ParsedLog {
  timestamp?: string;
  level?: string;
  service?: string; // Parser might add this
  message: string;
  metadata?: Record<string, string>;
  raw?: string;
}

export interface LogEntry extends ParsedLog {
  id: number; // For React key prop
  raw: string; // Keep the original line
  service: string; // Ensure service is always present
}

export function useClientLogs(service: string | null, maxLines: number = 200) {
  const { isConnected, lastError, emit, on } = useWebSocket();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const logCounterRef = useRef(0);

  useEffect(() => {
    // Clear logs and reset state when service changes or socket disconnects
    setLogs([]);
    logCounterRef.current = 0;
    setIsLoading(!!service); // Set loading true when a service is selected

    if (!isConnected || !service) {
      setIsLoading(false);
      return;
    }

    console.log(`useClientLogs: Subscribing to ${service}`);
    emit("subscribe_logs", { service });

    // Define the handler for incoming log data
    const handleLogData = (data: { service: string; line: string }) => {
      if (data.service === service) {
        // Only stop loading once the first log line (or potential stream end) arrives
        setIsLoading(false);

        // Don't process empty lines that might come from split('\n')
        if (data.line.trim() === "") return;

        const parsed = parseLogLine(data.line); // Use the parser
        const newLogEntry: LogEntry = {
          id: logCounterRef.current++,
          service: data.service,
          raw: data.line,
          timestamp: parsed.timestamp,
          level: parsed.level,
          message: parsed.message || data.line, // Fallback to raw if message is empty
          metadata: parsed.metadata,
        };

        setLogs((prevLogs) => {
          const newLogs = [...prevLogs, newLogEntry];
          return newLogs.length > maxLines
            ? newLogs.slice(newLogs.length - maxLines)
            : newLogs;
        });
      }
    };

    // Register the event listener
    const cleanupListener = on("log_data", handleLogData);

    // Cleanup function: Unsubscribe when component unmounts or service changes
    return () => {
      console.log(`useClientLogs: Unsubscribing from ${service}`);
      emit("unsubscribe_logs", { service });
      cleanupListener(); // Clean up the specific listener instance
      setIsLoading(false); // Ensure loading is false on cleanup
    };
  }, [isConnected, service, maxLines, emit, on]); // Add dependencies

  // Handle WebSocket errors specific to this hook's context
  useEffect(() => {
    if (
      lastError &&
      service &&
      lastError.toLowerCase().includes(service.toLowerCase())
    ) {
      // Handle errors relevant to this service's log stream
      console.error(`Error related to ${service} logs: ${lastError}`);
      setIsLoading(false); // Stop loading on error
      // Add a specific log entry indicating the error
      setLogs((prev) => [
        ...prev,
        {
          id: logCounterRef.current++,
          service: service || "system",
          raw: `--- ERROR: ${lastError} ---`,
          message: `Log stream error: ${lastError}`,
          level: "ERROR",
        },
      ]);
    }
  }, [lastError, service]);

  const clearLogs = () => {
    setLogs([]);
    logCounterRef.current = 0;
  };

  return { logs, isLoading, error: lastError, clearLogs }; // Expose clearLogs
}
