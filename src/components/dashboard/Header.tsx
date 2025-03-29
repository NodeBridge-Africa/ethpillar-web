import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isConnected: boolean;
  isAuthenticated: boolean;
  wsError: string | null;
  onReconnect: () => void;
  onLogout: () => void;
}

export function Header({
  isConnected,
  isAuthenticated,
  wsError,
  onReconnect,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 overflow-hidden mr-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg"></div>
            <div className="absolute inset-0.5 bg-slate-900 rounded-md flex items-center justify-center font-bold text-white text-sm">
              EP
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-100">
            EthPillar
          </h1>
          <div
            className={`ml-4 px-2 py-1 rounded-full flex items-center gap-1.5 text-xs ${
              isConnected
                ? isAuthenticated
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
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
            <span className="font-medium">
              {isConnected
                ? isAuthenticated
                  ? "Connected"
                  : "Connecting..."
                : wsError
                ? "Connection Error"
                : "Disconnected"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReconnect}
            className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
            Reconnect
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-1 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
