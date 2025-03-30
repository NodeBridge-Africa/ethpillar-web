"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Play,
  StopCircle,
  RefreshCw,
  Loader2,
  Settings,
} from "lucide-react";
import { useNodeStatus } from "@/hooks/useNodeStatus";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import Loading from "@/components/ui/loading";

export default function MevBoostPage() {
  const { statuses, isLoading: statusLoading } = useNodeStatus();
  const { isConnected, isAuthenticated } = useWebSocket();
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );
  const serviceName = "mevboost";
  const currentStatus = statuses[serviceName];

  const handleControlAction = async (action: "start" | "stop" | "restart") => {
    if (!isConnected || !isAuthenticated) {
      toast({
        title: "Connection Error",
        description: "WebSocket not connected or authenticated.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading((prev) => ({ ...prev, [action]: true }));

    try {
      const response = await fetch("/api/ssh/controlService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: serviceName, action }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${action} ${serviceName}`);
      }

      toast({
        title: `Success`,
        description: `${serviceName} ${action} command sent. Status will update shortly.`,
      });
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || `Could not ${action} ${serviceName}.`,
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const handleUpdate = async () => {
    setActionLoading((prev) => ({ ...prev, update: true }));
    try {
      const response = await fetch("/api/ssh/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "sudo ethpillar update_mevboost" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update MEV-Boost");
      }

      toast({
        title: "Update Started",
        description:
          "MEV-Boost update process has begun. This may take some time.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update MEV-Boost.",
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleShowRelays = async () => {
    setActionLoading((prev) => ({ ...prev, showRelays: true }));
    try {
      const response = await fetch("/api/ssh/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "sudo ethpillar show_relays" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to show MEV-Boost relays");
      }

      toast({
        title: "MEV-Boost Relays",
        description:
          result.output || "Relay information retrieved. See logs for details.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Show Relays",
        description:
          error.message || "Could not retrieve MEV-Boost relay information.",
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, showRelays: false }));
    }
  };

  const isServiceActive =
    currentStatus === "active" || currentStatus === "running";
  const isServiceInactive =
    currentStatus === "inactive" || currentStatus === "exited";
  const isActionInProgress =
    actionLoading.start ||
    actionLoading.stop ||
    actionLoading.restart ||
    actionLoading.update ||
    actionLoading.showRelays;
  const canPerformActions =
    isConnected && isAuthenticated && currentStatus !== "not_installed";

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-100">
        MEV-Boost Management
      </h1>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <Zap className="h-5 w-5 text-yellow-400" /> Service Control (
            {serviceName})
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage the MEV-Boost service. Status updates are live.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-md bg-slate-800/40 border border-slate-700">
            <span className="text-sm font-medium text-slate-300">
              Current Status:
            </span>
            {statusLoading ? (
              <Loading size="sm" />
            ) : (
              <StatusIndicator status={currentStatus || "unknown"} />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 disabled:opacity-50"
              onClick={() => handleControlAction("start")}
              disabled={
                !canPerformActions || isServiceActive || isActionInProgress
              }
            >
              {actionLoading.start ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Start
            </Button>
            <Button
              variant="outline"
              className="border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
              onClick={() => handleControlAction("stop")}
              disabled={
                !canPerformActions || isServiceInactive || isActionInProgress
              }
            >
              {actionLoading.stop ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <StopCircle className="mr-2 h-4 w-4" />
              )}
              Stop
            </Button>
            <Button
              variant="outline"
              className="border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 disabled:opacity-50"
              onClick={() => handleControlAction("restart")}
              disabled={!canPerformActions || isActionInProgress}
            >
              {actionLoading.restart ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Actions */}
      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            MEV-Boost Management
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage MEV-Boost service and relay configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="secondary"
            className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
            onClick={handleUpdate}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading.update ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Update MEV-Boost
          </Button>
          <Button
            variant="secondary"
            className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
            onClick={handleShowRelays}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading.showRelays ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            Show Configured Relays
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
