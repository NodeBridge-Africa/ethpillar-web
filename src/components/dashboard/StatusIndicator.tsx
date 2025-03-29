import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: string;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusInfo = (
    status: string
  ): { color: string; label: string; icon: React.ReactNode } => {
    switch (status) {
      case "active":
      case "running":
        return {
          color: "bg-green-500/10 text-green-400 border-green-500/20",
          label: "Active",
          icon: (
            <svg
              className="mr-1 h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ),
        };
      case "inactive":
        return {
          color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          label: "Inactive",
          icon: (
            <svg
              className="mr-1 h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          ),
        };
      case "failed":
        return {
          color: "bg-red-500/10 text-red-400 border-red-500/20",
          label: "Failed",
          icon: (
            <svg
              className="mr-1 h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          ),
        };
      case "activating":
      case "reloading":
        return {
          color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
          label: "Starting",
          icon: (
            <svg
              className="mr-1 h-3.5 w-3.5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          ),
        };
      default:
        return {
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          label: "Unknown",
          icon: (
            <svg
              className="mr-1 h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          ),
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <Badge
      variant="outline"
      className={`${statusInfo.color} flex items-center gap-1`}
    >
      {statusInfo.icon}
      {statusInfo.label}
    </Badge>
  );
}
