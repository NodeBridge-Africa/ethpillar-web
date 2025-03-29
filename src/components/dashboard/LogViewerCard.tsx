import React, { useRef } from "react";
import { format } from "date-fns";
import { Terminal, ScrollText, Ban, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loading from "@/components/ui/loading";
import { LogEntry } from "@/hooks/useClientLogs";

interface LogViewerCardProps {
  statuses: Record<string, string>;
  selectedService: string | null;
  setSelectedService: (service: string) => void;
  logs: LogEntry[];
  isLoading: boolean;
  clearLogs: () => void;
  autoScroll: boolean;
  setAutoScroll: (autoScroll: boolean) => void;
  getStatusColor: (status: string, isDot: boolean) => string;
}

export function LogViewerCard({
  statuses,
  selectedService,
  setSelectedService,
  logs,
  isLoading,
  clearLogs,
  autoScroll,
  setAutoScroll,
  getStatusColor,
}: LogViewerCardProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="mt-6 overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 bg-slate-800/40 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
          <Terminal className="h-5 w-5 text-cyan-400" /> Service Logs
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              isLoading
                ? "animate-pulse bg-blue-500/10 text-blue-400 border-blue-500/20"
                : "bg-slate-800/60 text-slate-400 border-slate-700"
            }
          >
            {isLoading ? "Loading..." : "Ready"}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setAutoScroll(!autoScroll)}
                >
                  {autoScroll ? (
                    <ScrollText className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Ban className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-slate-800 text-slate-200 border-slate-700"
              >
                {autoScroll ? "Auto-scroll enabled" : "Auto-scroll disabled"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={clearLogs}
                >
                  <Trash className="h-4 w-4 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-slate-800 text-slate-200 border-slate-700"
              >
                Clear logs
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <div className="flex border-b border-slate-800 bg-slate-800/20 px-6 py-2">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-300">Select service:</p>
          {Object.keys(statuses).length > 0 ? (
            Object.keys(statuses).map((service) => (
              <Button
                key={service}
                variant={selectedService === service ? "default" : "outline"}
                size="sm"
                className={`h-7 gap-1 text-xs ${
                  selectedService === service
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0"
                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => setSelectedService(service)}
              >
                <div
                  className={`h-2 w-2 rounded-full ${getStatusColor(
                    statuses[service],
                    true
                  )}`}
                />
                <span className="capitalize">{service.replace(/_/g, " ")}</span>
              </Button>
            ))
          ) : (
            <p className="text-xs text-slate-400">No services available</p>
          )}
        </div>
      </div>
      <CardContent className="p-0">
        <div className="relative">
          <div
            ref={logContainerRef}
            className="h-[400px] overflow-auto bg-slate-950 p-4 font-mono text-xs text-emerald-400 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
          >
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="whitespace-pre-wrap break-words">
                  <span className="mr-2 text-slate-500">
                    {log.timestamp
                      ? `[${format(new Date(log.timestamp), "HH:mm:ss")}]`
                      : ""}
                  </span>
                  {log.message}
                </div>
              ))
            ) : selectedService ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-slate-500">
                  No logs available for this service.
                </p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-slate-500">
                  Select a service to view logs.
                </p>
              </div>
            )}
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
              <Loading size="lg" text="Loading logs..." />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-slate-800 bg-slate-800/40 px-6 py-3">
        <div className="text-xs text-slate-400">
          {logs && logs.length > 0 ? (
            <span>Showing {logs.length} log entries</span>
          ) : (
            <span>No logs to display</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-3 h-8 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
            onClick={clearLogs}
          >
            <Trash className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
