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
  Settings,
  Loader2,
  HardDrive,
  Upload,
  Power,
  CpuIcon,
  MemoryStick,
  Wifi,
  AlarmClock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function SystemPage() {
  const { isConnected, isAuthenticated } = useWebSocket();
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );

  const executeSystemCommand = async (command: string, action: string) => {
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
      const response = await fetch("/api/ssh/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to execute ${action}`);
      }

      toast({
        title: `Success`,
        description: `${action} command executed successfully.${
          action === "Update System" ? " This may take some time." : ""
        }`,
      });

      if (result.output) {
        console.log(`${action} output:`, result.output);
      }
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || `Could not execute ${action}.`,
        variant: "destructive",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const handleSystemUpdate = () => {
    executeSystemCommand("sudo ethpillar update_system", "Update System");
  };

  const handleSystemInfo = () => {
    executeSystemCommand("sudo ethpillar show_system_info", "System Info");
  };

  const handleDiskUsage = () => {
    executeSystemCommand("df -h", "Disk Usage");
  };

  const handleMemoryInfo = () => {
    executeSystemCommand("free -h", "Memory Info");
  };

  const handleNetworkInfo = () => {
    executeSystemCommand("ip addr show", "Network Info");
  };

  const handleUptime = () => {
    executeSystemCommand("uptime", "Uptime");
  };

  const handleReboot = () => {
    if (
      window.confirm(
        "Are you sure you want to reboot the system? This will restart all services."
      )
    ) {
      executeSystemCommand("sudo reboot", "Reboot");
    }
  };

  const isActionInProgress = Object.values(actionLoading).some(
    (loading) => loading
  );
  const canPerformActions = isConnected && isAuthenticated;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-100">
        System Management
      </h1>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <Settings className="h-5 w-5 text-blue-400" /> System Operations
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage system-level operations and view system information.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              className="flex justify-start bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
              onClick={handleSystemUpdate}
              disabled={!canPerformActions || isActionInProgress}
            >
              {actionLoading["Update System"] ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Update System Packages
            </Button>

            <Button
              variant="secondary"
              className="flex justify-start bg-red-700/60 hover:bg-red-700 text-slate-200 disabled:opacity-50"
              onClick={handleReboot}
              disabled={!canPerformActions || isActionInProgress}
            >
              {actionLoading["Reboot"] ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Power className="mr-2 h-4 w-4" />
              )}
              Reboot System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <CpuIcon className="h-5 w-5 text-green-400" /> System Information
          </CardTitle>
          <CardDescription className="text-slate-400">
            View detailed information about the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 disabled:opacity-50"
            onClick={handleSystemInfo}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["System Info"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Settings className="mr-2 h-4 w-4" />
            )}
            System Info
          </Button>

          <Button
            variant="outline"
            className="border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 disabled:opacity-50"
            onClick={handleDiskUsage}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Disk Usage"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <HardDrive className="mr-2 h-4 w-4" />
            )}
            Disk Usage
          </Button>

          <Button
            variant="outline"
            className="border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 disabled:opacity-50"
            onClick={handleMemoryInfo}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Memory Info"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MemoryStick className="mr-2 h-4 w-4" />
            )}
            Memory Info
          </Button>

          <Button
            variant="outline"
            className="border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 disabled:opacity-50"
            onClick={handleNetworkInfo}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Network Info"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Wifi className="mr-2 h-4 w-4" />
            )}
            Network Info
          </Button>

          <Button
            variant="outline"
            className="border-teal-500/50 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 disabled:opacity-50"
            onClick={handleUptime}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Uptime"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <AlarmClock className="mr-2 h-4 w-4" />
            )}
            Uptime
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
