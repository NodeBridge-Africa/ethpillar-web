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
  Wrench,
  Loader2,
  Search,
  Rocket,
  Network,
  Scale,
  BarChart3,
  Layers,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function ToolboxPage() {
  const { isConnected, isAuthenticated } = useWebSocket();
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );

  const executeToolCommand = async (command: string, action: string) => {
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
          action.includes("Check") ? " Check logs for details." : ""
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

  const handleCheckNetworkStatus = () => {
    executeToolCommand("sudo ethpillar check_network", "Check Network Status");
  };

  const handleSyncStatus = () => {
    executeToolCommand("sudo ethpillar check_sync_status", "Check Sync Status");
  };

  const handleCheckEthereumPrice = () => {
    executeToolCommand(
      'curl -s https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd | jq ".ethereum.usd"',
      "Check ETH Price"
    );
  };

  const handleReadinessCheck = () => {
    executeToolCommand("sudo ethpillar check_readiness", "Readiness Check");
  };

  const handleHealthCheck = () => {
    executeToolCommand("sudo ethpillar health_check", "Health Check");
  };

  const handleShowContainers = () => {
    executeToolCommand("sudo docker ps", "Show Containers");
  };

  const handleExecutionMetrics = () => {
    executeToolCommand(
      "sudo ethpillar show_execution_metrics",
      "Execution Metrics"
    );
  };

  const handleConsensusMetrics = () => {
    executeToolCommand(
      "sudo ethpillar show_consensus_metrics",
      "Consensus Metrics"
    );
  };

  const handleEthPillarHelp = () => {
    executeToolCommand("sudo ethpillar --help", "EthPillar Help");
  };

  const isActionInProgress = Object.values(actionLoading).some(
    (loading) => loading
  );
  const canPerformActions = isConnected && isAuthenticated;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-100">
        Ethereum Node Toolbox
      </h1>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <Search className="h-5 w-5 text-blue-400" /> Status & Monitoring
          </CardTitle>
          <CardDescription className="text-slate-400">
            Tools to check the status and health of your Ethereum node.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 disabled:opacity-50"
            onClick={handleCheckNetworkStatus}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Check Network Status"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Network className="mr-2 h-4 w-4" />
            )}
            Check Network Status
          </Button>

          <Button
            variant="outline"
            className="border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 disabled:opacity-50"
            onClick={handleSyncStatus}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Check Sync Status"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            Check Sync Status
          </Button>

          <Button
            variant="outline"
            className="border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300 disabled:opacity-50"
            onClick={handleCheckEthereumPrice}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Check ETH Price"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Scale className="mr-2 h-4 w-4" />
            )}
            Check ETH Price
          </Button>

          <Button
            variant="outline"
            className="border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 disabled:opacity-50"
            onClick={handleReadinessCheck}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Readiness Check"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Wrench className="mr-2 h-4 w-4" />
            )}
            Readiness Check
          </Button>

          <Button
            variant="outline"
            className="border-teal-500/50 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 disabled:opacity-50"
            onClick={handleHealthCheck}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Health Check"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <HelpCircle className="mr-2 h-4 w-4" />
            )}
            Health Check
          </Button>

          <Button
            variant="outline"
            className="border-slate-500/50 bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 hover:text-slate-300 disabled:opacity-50"
            onClick={handleShowContainers}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Show Containers"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Layers className="mr-2 h-4 w-4" />
            )}
            List Docker Containers
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <BarChart3 className="h-5 w-5 text-indigo-400" /> Metrics & Advanced
            Tools
          </CardTitle>
          <CardDescription className="text-slate-400">
            Advanced tools and metrics for node operators.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
            onClick={handleExecutionMetrics}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Execution Metrics"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Execution Client Metrics
          </Button>

          <Button
            variant="secondary"
            className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
            onClick={handleConsensusMetrics}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["Consensus Metrics"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Consensus Client Metrics
          </Button>

          <Button
            variant="secondary"
            className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
            onClick={handleEthPillarHelp}
            disabled={!canPerformActions || isActionInProgress}
          >
            {actionLoading["EthPillar Help"] ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Terminal className="h-4 w-4 mr-2" />
            )}
            EthPillar CLI Help
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
