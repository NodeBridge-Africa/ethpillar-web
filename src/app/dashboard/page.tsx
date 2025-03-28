"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Server, Activity, FileText, AlertCircle } from "lucide-react";
import Loading from "@/components/ui/loading";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useNodeStatus } from "@/hooks/useNodeStatus";
import { useClientLogs } from "@/hooks/useClientLogs";
import { Badge } from "@/components/ui/badge";

interface ConnectionInfo {
  host: string;
  port: number;
  username: string;
  authMethod: string;
}

// Enhanced Status Indicator Component
const StatusIndicator = ({ status }: { status: string | undefined }) => {
  let colorClass = "bg-gray-500"; // Default/Unknown
  let textClass = "text-gray-300";
  let text = status || "Unknown";
  let pulseClass = "";

  switch (status) {
    case "active":
    case "running":
      colorClass = "bg-green-500";
      textClass = "text-green-300";
      text = "Active";
      break;
    case "inactive":
      colorClass = "bg-red-500";
      textClass = "text-red-300";
      text = "Inactive";
      break;
    case "activating":
      colorClass = "bg-yellow-500";
      textClass = "text-yellow-300";
      text = "Activating";
      pulseClass = "animate-pulse";
      break;
    case "deactivating":
      colorClass = "bg-orange-500";
      textClass = "text-orange-300";
      text = "Deactivating";
      pulseClass = "animate-pulse";
      break;
    case "reloading":
      colorClass = "bg-blue-500";
      textClass = "text-blue-300";
      text = "Reloading";
      pulseClass = "animate-pulse";
      break;
    case "failed":
      colorClass = "bg-red-700";
      textClass = "text-red-400";
      text = "Failed";
      break;
    case "not_installed":
      colorClass = "bg-gray-400";
      textClass = "text-gray-400";
      text = "Not Installed";
      break;
    case "loaded active running":
      colorClass = "bg-green-500";
      textClass = "text-green-300";
      text = "Active (Running)";
      break;
    case "loaded active exited":
      colorClass = "bg-blue-500";
      textClass = "text-blue-300";
      text = "Active (Exited)";
      break;
    case "loaded inactive dead":
      colorClass = "bg-red-500";
      textClass = "text-red-300";
      text = "Inactive (Dead)";
      break;
  }

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1.5 ${textClass}`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${colorClass} ${pulseClass}`}
      ></span>
      <span className="capitalize">{text}</span>
    </Badge>
  );
};

// Enhanced Log Viewer Component
const LogViewer = ({ service }: { service: string | null }) => {
  const { logs, isLoading, error, clearLogs } = useClientLogs(service, 200); // Use 200 lines
  const logContainerRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottomRef = useRef(true); // Track if user is scrolled to bottom

  // Handle scrolling
  useEffect(() => {
    const container = logContainerRef.current;
    if (container) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        // Check if scrolled to the bottom (with a small threshold)
        isScrolledToBottomRef.current =
          scrollHeight - scrollTop - clientHeight < 50;
      };
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto-scroll only if the user was already at the bottom
  useEffect(() => {
    if (logContainerRef.current && isScrolledToBottomRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]); // Trigger scroll check when logs update

  if (!service) {
    return (
      <div className="h-72 flex items-center justify-center bg-black text-gray-500 text-sm font-mono p-2 rounded border border-slate-700">
        Select a service above to view logs.
      </div>
    );
  }

  // Define colors for log levels
  const levelColorClasses: { [key: string]: string } = {
    ERROR: "text-red-400",
    WARN: "text-yellow-400",
    INFO: "text-blue-300",
    DEBUG: "text-gray-500",
    TRACE: "text-purple-400",
    // Add more as needed
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={clearLogs}
          disabled={logs.length === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 h-3.5 w-3.5"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          Clear Logs
        </Button>
      </div>
      <div
        ref={logContainerRef}
        className="h-72 overflow-y-auto bg-black text-white text-xs font-mono p-3 rounded border border-slate-700 relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loading
              size="md"
              text={`Loading ${service} logs...`}
              className="text-white"
            />
          </div>
        )}
        {!isLoading && logs.length === 0 && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Waiting for logs...
          </div>
        )}
        {/* Render logs */}
        {logs.map((log) => (
          <div
            key={log.id}
            className="whitespace-pre-wrap break-words hover:bg-gray-800/50 px-1"
          >
            {log.timestamp && (
              <span className="text-gray-500 mr-2">{log.timestamp}</span>
            )}
            <span
              className={`font-semibold mr-2 ${
                levelColorClasses[log.level || ""] || "text-gray-400"
              }`}
            >
              {log.level || "LOG"}
            </span>
            <span>{log.message}</span>
            {/* Optionally display metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <span className="text-gray-600 ml-2">
                {JSON.stringify(log.metadata)}
              </span>
            )}
          </div>
        ))}
        {/* Display error entry distinctly */}
        {error && !isLoading && (
          <div className="whitespace-pre-wrap break-words px-1 text-red-500 font-bold mt-2">
            --- ERROR: {error} ---
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [selectedLogService, setSelectedLogService] = useState<string | null>(
    null
  );

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

  // Use the reconnect function from the hook
  const handleReconnect = () => {
    reconnect();
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span
            className={`flex items-center gap-1.5 text-sm ${
              isConnected
                ? isAuthenticated
                  ? "text-green-400"
                  : "text-yellow-400"
                : "text-red-400"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isConnected
                  ? isAuthenticated
                    ? "bg-green-500"
                    : "bg-yellow-500"
                  : "bg-red-500"
              } ${(!isConnected || !isAuthenticated) && "animate-pulse"}`}
            ></span>
            {isConnected
              ? isAuthenticated
                ? "Connected"
                : "Connecting..."
              : wsError
              ? "Connection Error"
              : "Disconnected"}
          </span>
          <Button variant="outline" size="sm" onClick={handleReconnect}>
            Reconnect
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Display WebSocket errors prominently */}
      {wsError && (
        <Card className="border-red-500/50 bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" /> WebSocket Error
            </CardTitle>
            <CardDescription className="text-red-300">
              There was an issue with the real-time connection. Some features
              might be unavailable. Try reconnecting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-200 font-mono">{wsError}</p>
            <div className="mt-4">
              <Button variant="destructive" size="sm" onClick={handleReconnect}>
                Reconnect WebSocket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" /> Connection Information
          </CardTitle>
          <CardDescription>Your current SSH connection details</CardDescription>
        </CardHeader>
        <CardContent>
          {userInfo ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Host
                </p>
                <p>{userInfo.host}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Port
                </p>
                <p>{userInfo.port}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Username
                </p>
                <p>{userInfo.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Authentication Method
                </p>
                <p className="capitalize">{userInfo.authMethod}</p>
              </div>
            </div>
          ) : (
            <p>No connection information available</p>
          )}
        </CardContent>
      </Card>

      {/* Node Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Node Status
          </CardTitle>
          <CardDescription>
            Real-time status of your node services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusLoading ? (
            <Loading size="md" text="Fetching status..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(statuses).map(([service, status]) => (
                <div
                  key={service}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                >
                  <p className="text-sm font-medium capitalize text-slate-300">
                    {service.replace(/_/g, " ")}
                  </p>
                  <StatusIndicator status={status} />
                </div>
              ))}
              {Object.keys(statuses).length === 0 && !statusLoading && (
                <p className="text-muted-foreground col-span-full text-center">
                  No status data available.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Viewer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Live Logs
          </CardTitle>
          <CardDescription>
            View real-time logs from your node services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(statuses)
              .filter((s) => statuses[s] !== "not_installed") // Only show buttons for installed services
              .map((service) => (
                <Button
                  key={service}
                  variant={
                    selectedLogService === service ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedLogService(service)}
                >
                  {service.replace(/_/g, " ").toUpperCase()} Logs
                </Button>
              ))}
          </div>
          <LogViewer service={selectedLogService} />
        </CardContent>
      </Card>
    </div>
  );
}
