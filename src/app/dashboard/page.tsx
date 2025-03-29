"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useNodeStatus } from "@/hooks/useNodeStatus";
import { useClientLogs } from "@/hooks/useClientLogs";
import { getStatusColor } from "@/components/dashboard/utils";

// Import dashboard components
import { Header } from "@/components/dashboard/Header";
import { ConnectionCard } from "@/components/dashboard/ConnectionCard";
import { NodeStatusCard } from "@/components/dashboard/NodeStatusCard";
import { LogViewerCard } from "@/components/dashboard/LogViewerCard";
import { ErrorAlert } from "@/components/dashboard/ErrorAlert";
import Loading from "@/components/ui/loading";

// Define interfaces
interface ConnectionInfo {
  host: string;
  port: number;
  username: string;
  authMethod: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    isConnected,
    lastError: wsError,
    isAuthenticated,
    reconnect,
  } = useWebSocket();
  const { statuses, isLoading: statusLoading } = useNodeStatus();
  const [userInfo, setUserInfo] = useState<ConnectionInfo | null>(null);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const clientLogs = useClientLogs(selectedService);
  const [autoScroll, setAutoScroll] = useState(true);

  // Load user info from localStorage
  useEffect(() => {
    const connectionInfoStr = localStorage.getItem("connectionInfo");
    if (connectionInfoStr) {
      try {
        setUserInfo(JSON.parse(connectionInfoStr));
      } catch (err) {
        console.error("Failed to parse connection info:", err);
      }
    }
    setIsUserInfoLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      // Call the disconnect API
      await fetch("/api/ssh/disconnect", {
        method: "POST",
      });

      // Clear localStorage items
      localStorage.removeItem("connectionInfo");
      localStorage.removeItem("ssh_session_token");

      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Render Loading state
  if (isUserInfoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      <Header
        isConnected={isConnected}
        isAuthenticated={isAuthenticated}
        wsError={wsError}
        onReconnect={reconnect}
        onLogout={handleLogout}
      />

      <main className="container px-4 py-6 mx-auto space-y-6">
        {/* Display WebSocket errors prominently */}
        {wsError && <ErrorAlert error={wsError} onReconnect={reconnect} />}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ConnectionCard
            userInfo={userInfo}
            isConnected={isConnected}
            isAuthenticated={isAuthenticated}
          />

          <NodeStatusCard statuses={statuses} isLoading={statusLoading} />
        </div>

        <LogViewerCard
          statuses={statuses}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          logs={clientLogs.logs}
          isLoading={clientLogs.isLoading}
          clearLogs={clientLogs.clearLogs}
          autoScroll={autoScroll}
          setAutoScroll={setAutoScroll}
          getStatusColor={getStatusColor}
        />

        {/* Ethereum logo in background */}
        <div className="fixed bottom-0 right-0 opacity-[0.02] pointer-events-none">
          <svg
            width="400"
            height="600"
            viewBox="0 0 40 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9976 0L19.6367 1.16991V43.0591L19.9976 43.314L39.9953 31.728L19.9976 0Z"
              fill="white"
            />
            <path
              d="M19.9975 0L0 31.728L19.9975 43.314V23.1919V0Z"
              fill="white"
            />
            <path
              d="M19.9975 46.9784L19.7956 47.1927V61.8281L19.9975 62.4L40.0047 35.3976L19.9975 46.9784Z"
              fill="white"
            />
            <path
              d="M19.9975 62.4V46.9784L0 35.3976L19.9975 62.4Z"
              fill="white"
            />
            <path
              d="M19.9976 43.3139L39.9953 31.7279L19.9976 23.1918V43.3139Z"
              fill="white"
            />
            <path
              d="M0 31.7279L19.9975 43.3139V23.1918L0 31.7279Z"
              fill="white"
            />
          </svg>
        </div>
      </main>
    </div>
  );
}
