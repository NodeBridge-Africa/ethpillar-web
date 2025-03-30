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
  Rocket,
  Play,
  StopCircle,
  RefreshCw,
  Loader2,
  ListChecks,
  UploadCloud,
  Settings2,
  FileText,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useNodeStatus } from "@/hooks/useNodeStatus";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import Loading from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MevBoostPage() {
  const { statuses, isLoading: statusLoading } = useNodeStatus();
  const { isConnected, isAuthenticated } = useWebSocket();
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [configContent, setConfigContent] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isRpcExposed, setIsRpcExposed] = useState<boolean | null>(null);
  const [isRpcLoading, setIsRpcLoading] = useState(false);

  const serviceName = "mevboost";
  const currentStatus = statuses[serviceName];

  // Check RPC status on initial load
  useEffect(() => {
    if (
      isConnected &&
      isAuthenticated &&
      !isRpcLoading &&
      isRpcExposed === null
    ) {
      // Determine RPC status by checking the configuration
      handleViewConfig(true);
    }
  }, [isConnected, isAuthenticated]);

  const handleApiAction = async (
    endpoint: string,
    body: Record<string, any>,
    actionDesc: string,
    loadingKey: string
  ) => {
    if (!isConnected || !isAuthenticated) {
      toast({
        title: "Connection Error",
        description: "WebSocket not connected or authenticated.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${actionDesc}`);
      }

      toast({
        title: `Success`,
        description: `${actionDesc} command sent. Status may update shortly.`,
      });

      return result; // Return result for potential further processing
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || `Could not ${actionDesc}.`,
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleControlAction = (action: "start" | "stop" | "restart") => {
    handleApiAction(
      "/api/ssh/controlService",
      { service: serviceName, action },
      `${action} ${serviceName}`,
      `${serviceName}-${action}`
    );
  };

  const handleUpdate = () => {
    handleApiAction(
      "/api/ssh/updateClient",
      { clientType: serviceName },
      `update ${serviceName}`,
      `${serviceName}-update`
    );
  };

  const handleViewConfig = async (silent = false) => {
    if (!silent) {
      setConfigError(null);
      setConfigContent(null); // Clear previous content
    }

    setActionLoading((prev) => ({ ...prev, viewConfig: true }));

    await handleApiAction(
      "/api/ssh/getConfig",
      { service: serviceName },
      `view config for ${serviceName}`,
      `${serviceName}-viewConfig`
    )
      .then((result) => {
        if (result?.success && result.content) {
          if (!silent) {
            setConfigContent(result.content);
          }

          // Check if RPC is exposed by looking for port flag in the config
          if (result.content.includes("-relays")) {
            setIsRpcExposed(true);
          } else {
            setIsRpcExposed(false);
          }
        } else if (result?.message && !silent) {
          setConfigError(result.message);
        }
      })
      .finally(() =>
        setActionLoading((prev) => ({ ...prev, viewConfig: false }))
      );
  };

  const handleToggleRpc = async () => {
    setIsRpcLoading(true);

    try {
      await handleApiAction(
        "/api/ssh/exposeRpc",
        { clientType: serviceName, expose: !isRpcExposed },
        `${isRpcExposed ? "disable" : "enable"} MEV-Boost relays`,
        `${serviceName}-toggleRpc`
      );

      // Update the RPC status after toggling
      setIsRpcExposed((prev) => !prev);

      // Restart service to apply changes
      handleControlAction("restart");
    } finally {
      setIsRpcLoading(false);
    }
  };

  const handleShowRelays = () => {
    handleApiAction(
      "/api/ssh/execute",
      { command: "sudo ethpillar show_mevboost_relays" },
      `show MEV-Boost relays`,
      `${serviceName}-showRelays`
    );
  };

  const isServiceActive =
    currentStatus === "active" || currentStatus === "running";
  const isServiceInactive =
    currentStatus === "inactive" || currentStatus === "exited";
  const isActionInProgress = Object.values(actionLoading).some(Boolean);
  const canPerformActions =
    isConnected &&
    isAuthenticated &&
    currentStatus !== "not_installed" &&
    !statusLoading;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-100">
        MEV-Boost Management
      </h1>

      {/* Service Control Card */}
      <Card className="mb-6 overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
              <Rocket className="h-5 w-5 text-orange-400" /> Service Control (
              {serviceName})
            </CardTitle>
            {statusLoading ? (
              <Loading size="sm" />
            ) : (
              <StatusIndicator status={currentStatus || "unknown"} />
            )}
          </div>
          <CardDescription className="text-slate-400 pt-1">
            Manage the MEV-Boost service. Status updates are live.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 disabled:opacity-50"
              onClick={() => handleControlAction("start")}
              disabled={
                !canPerformActions ||
                isServiceActive ||
                isActionInProgress ||
                actionLoading[`${serviceName}-start`]
              }
            >
              {actionLoading[`${serviceName}-start`] ? (
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
                !canPerformActions ||
                isServiceInactive ||
                isActionInProgress ||
                actionLoading[`${serviceName}-stop`]
              }
            >
              {actionLoading[`${serviceName}-stop`] ? (
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
              disabled={
                !canPerformActions ||
                isActionInProgress ||
                actionLoading[`${serviceName}-restart`]
              }
            >
              {actionLoading[`${serviceName}-restart`] ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MEV-Boost Management Card */}
      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <Settings2 className="h-5 w-5 text-orange-400" /> MEV-Boost
            Management
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage MEV-Boost service and configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Update Button */}
          <Button
            variant="secondary"
            className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
            onClick={handleUpdate}
            disabled={
              !canPerformActions ||
              isActionInProgress ||
              actionLoading[`${serviceName}-update`]
            }
          >
            {actionLoading[`${serviceName}-update`] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            Update MEV-Boost
          </Button>

          {/* Show Relays Button */}
          <Button
            variant="secondary"
            className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
            onClick={handleShowRelays}
            disabled={
              !canPerformActions ||
              isActionInProgress ||
              actionLoading[`${serviceName}-showRelays`]
            }
          >
            {actionLoading[`${serviceName}-showRelays`] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ListChecks className="mr-2 h-4 w-4" />
            )}
            Show Relays
          </Button>

          {/* View Config Button with Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
                onClick={() => handleViewConfig()}
                disabled={
                  !canPerformActions ||
                  isActionInProgress ||
                  actionLoading[`${serviceName}-viewConfig`]
                }
              >
                {actionLoading[`${serviceName}-viewConfig`] ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                View Config
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-slate-200">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-400" /> {serviceName}
                  .service Configuration
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Read-only view of the systemd service file. Editing must be
                  done directly on the server or via future UI features.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] w-full rounded-md border border-slate-700 bg-slate-950 p-4 my-4">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all">
                  {actionLoading[`${serviceName}-viewConfig`] && (
                    <Loading text="Fetching config..." />
                  )}
                  {configError && (
                    <p className="text-red-400">Error: {configError}</p>
                  )}
                  {configContent && !configError && configContent}
                  {!configContent &&
                    !configError &&
                    !actionLoading[`${serviceName}-viewConfig`] && (
                      <p>No content loaded.</p>
                    )}
                </pre>
              </ScrollArea>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          {/* Toggle Relays Button */}
          <Button
            variant="secondary"
            className={cn(
              "bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50",
              isRpcExposed &&
                "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
            )}
            onClick={handleToggleRpc}
            disabled={
              !canPerformActions ||
              isRpcLoading ||
              isRpcExposed === null ||
              isActionInProgress
            }
          >
            {isRpcLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isRpcExposed ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {isRpcExposed ? "Disable" : "Enable"} Relays
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
