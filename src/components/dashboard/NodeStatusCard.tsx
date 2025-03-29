import React from "react";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { StatusIndicator } from "./StatusIndicator";

interface NodeStatusCardProps {
  statuses: Record<string, string>;
  isLoading: boolean;
}

export function NodeStatusCard({ statuses, isLoading }: NodeStatusCardProps) {
  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 bg-slate-800/40 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
          <Activity className="h-5 w-5 text-indigo-400" /> Node Status
        </CardTitle>
        <Badge
          variant="outline"
          className="animate-pulse bg-blue-500/10 text-blue-400 border-blue-500/20"
        >
          Live Updates
        </Badge>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loading size="md" text="Fetching status..." />
          </div>
        ) : (
          <div className="grid gap-4">
            {Object.keys(statuses).length === 0 ? (
              <div className="flex items-center justify-center h-40 rounded-md border border-dashed border-slate-700 bg-slate-800/20">
                <p className="text-center text-sm text-slate-400">
                  No status data available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {Object.entries(statuses).map(([service, status]) => (
                  <div
                    key={service}
                    className="flex justify-between items-center rounded-md border border-slate-800 bg-slate-800/30 px-4 py-3 shadow-md transition-colors hover:bg-slate-800/50"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium capitalize text-slate-200">
                        {service.replace(/_/g, " ")}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {status === "active" || status === "running"
                          ? "Service is running normally"
                          : status === "failed"
                          ? "Service has failed"
                          : status === "inactive"
                          ? "Service is stopped"
                          : status === "activating" || status === "reloading"
                          ? "Service is changing state"
                          : "Service status is unknown"}
                      </p>
                    </div>
                    <StatusIndicator status={status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
