"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { useClientLogs } from "@/hooks/useClientLogs";
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useNodeStatus } from "@/hooks/useNodeStatus";
import { getStatusColor } from "@/components/dashboard/utils";
import { LogViewerCard } from "@/components/dashboard/LogViewerCard";

export default function LogsPage() {
  const { isConnected, isAuthenticated } = useWebSocket();
  const { statuses } = useNodeStatus();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { logs, isLoading } = useClientLogs(selectedClient, 500); // Fetch up to 500 lines
  const [autoScroll, setAutoScroll] = useState(true);

  const clientOptions = [
    {
      id: "execution",
      label: "Execution Client",
      icon: <Terminal className="mr-2 h-4 w-4" />,
    },
    {
      id: "consensus",
      label: "Consensus Client",
      icon: <Terminal className="mr-2 h-4 w-4" />,
    },
    {
      id: "validator",
      label: "Validator Client",
      icon: <Terminal className="mr-2 h-4 w-4" />,
    },
    {
      id: "mevboost",
      label: "MEV-Boost",
      icon: <Terminal className="mr-2 h-4 w-4" />,
    },
    {
      id: "system",
      label: "System Logs",
      icon: <Terminal className="mr-2 h-4 w-4" />,
    },
  ];

  const handleClientSelect = (client: string) => {
    setSelectedClient(client);
  };

  const handleDownloadLogs = async () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Select a client first to download its logs.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/ssh/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: `sudo ethpillar get_${selectedClient}_logs`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to download logs");
      }

      if (result.output) {
        // Create text file and download
        const blob = new Blob([result.output], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${selectedClient}-logs-${
          new Date().toISOString().split("T")[0]
        }.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        toast({
          title: "Success",
          description: `${selectedClient} logs downloaded successfully.`,
        });
      } else {
        toast({
          title: "Warning",
          description: "No logs were found to download.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Could not download logs.",
        variant: "destructive",
      });
    }
  };

  const handleClearLogs = async () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Select a client first to clear its logs.",
        variant: "destructive",
      });
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to clear the ${selectedClient} logs? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/ssh/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: `sudo ethpillar clear_${selectedClient}_logs`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to clear logs");
      }

      toast({
        title: "Success",
        description: `${selectedClient} logs cleared successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Could not clear logs.",
        variant: "destructive",
      });
    }
  };

  const canPerformActions = isConnected && isAuthenticated;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-100">
        Service Logs
      </h1>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg mb-6">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <Terminal className="h-5 w-5 text-blue-400" /> Log Management
          </CardTitle>
          <CardDescription className="text-slate-400">
            Download or clear service logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {clientOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedClient === option.id ? "default" : "outline"}
                className={
                  selectedClient === option.id
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                }
                onClick={() => handleClientSelect(option.id)}
                disabled={!canPerformActions}
              >
                {option.icon} {option.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              className="border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 disabled:opacity-50"
              onClick={handleDownloadLogs}
              disabled={!canPerformActions || !selectedClient}
            >
              <Download className="mr-2 h-4 w-4" /> Download Logs
            </Button>

            <Button
              variant="outline"
              className="border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
              onClick={handleClearLogs}
              disabled={!canPerformActions || !selectedClient}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Use the LogViewerCard component */}
      <LogViewerCard
        statuses={statuses}
        selectedService={selectedClient}
        setSelectedService={setSelectedClient}
        logs={logs || []}
        isLoading={isLoading}
        clearLogs={() => {}} // This would need to be implemented properly
        autoScroll={autoScroll}
        setAutoScroll={setAutoScroll}
        getStatusColor={getStatusColor}
      />
    </>
  );
}
