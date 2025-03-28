import { useState, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";

export interface ServiceStatus {
  [service: string]: string; // e.g., { execution: 'active', consensus: 'inactive' }
}

export function useNodeStatus(pollInterval: number = 5000) {
  const { isConnected, lastError, emit, on } = useWebSocket();
  const [statuses, setStatuses] = useState<ServiceStatus>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(true);
      return;
    }

    // Subscribe to status updates
    console.log("useNodeStatus: Subscribing to status updates");
    emit("subscribe_status", { interval: pollInterval });

    // Handler for status updates
    const handleStatusUpdate = (
      data: { service: string; status: string }[]
    ) => {
      // console.log("Received status update:", data); // Debug
      setStatuses((prevStatuses) => {
        const newStatuses = { ...prevStatuses };
        data.forEach(({ service, status }) => {
          newStatuses[service] = status;
        });
        return newStatuses;
      });
      setIsLoading(false);
    };

    // Register listener
    const cleanupListener = on("status_update", handleStatusUpdate);

    // Cleanup: Unsubscribe when component unmounts
    return () => {
      console.log("useNodeStatus: Unsubscribing from status updates");
      emit("unsubscribe_status");
      cleanupListener();
      setIsLoading(true);
    };
  }, [isConnected, pollInterval, emit, on]);

  return { statuses, isLoading, error: lastError };
}
