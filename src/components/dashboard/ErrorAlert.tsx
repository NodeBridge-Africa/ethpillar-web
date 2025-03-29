import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  error: string;
  onReconnect: () => void;
}

export function ErrorAlert({ error, onReconnect }: ErrorAlertProps) {
  return (
    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 dark:border-red-500/20 dark:bg-red-500/5">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium leading-tight">
            WebSocket Connection Error
          </h3>
          <p className="text-sm mt-1">
            There was an issue with the real-time connection. Some features
            might be unavailable.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs font-mono bg-red-500/10 py-0.5 px-1 rounded">
              {error}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReconnect}
              className="h-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              Reconnect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
