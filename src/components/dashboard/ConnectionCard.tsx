import React from "react";
import { Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConnectionInfo {
  host: string;
  port: number;
  username: string;
  authMethod: string;
}

interface ConnectionCardProps {
  userInfo: ConnectionInfo | null;
  isConnected: boolean;
  isAuthenticated: boolean;
}

export function ConnectionCard({
  userInfo,
  isConnected,
  isAuthenticated,
}: ConnectionCardProps) {
  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 bg-slate-800/40 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
          <Server className="h-5 w-5 text-blue-400" /> Connection Information
        </CardTitle>
        {isConnected && isAuthenticated && (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-400 border-green-500/20"
          >
            Active Connection
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {userInfo ? (
          <div className="rounded-md border border-slate-800 bg-slate-800/20 p-4">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col space-y-1 px-2 py-3">
                <dt className="text-sm font-medium text-slate-400">Host</dt>
                <dd className="flex items-center text-sm font-medium text-slate-200">
                  <svg
                    className="mr-2 h-4 w-4 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="8"
                      rx="2"
                      ry="2"
                    ></rect>
                    <rect
                      x="2"
                      y="14"
                      width="20"
                      height="8"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                  {userInfo.host}
                </dd>
              </div>
              <div className="flex flex-col space-y-1 px-2 py-3">
                <dt className="text-sm font-medium text-slate-400">Port</dt>
                <dd className="flex items-center text-sm font-medium text-slate-200">
                  <svg
                    className="mr-2 h-4 w-4 text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                  </svg>
                  {userInfo.port}
                </dd>
              </div>
              <div className="flex flex-col space-y-1 px-2 py-3">
                <dt className="text-sm font-medium text-slate-400">Username</dt>
                <dd className="flex items-center text-sm font-medium text-slate-200">
                  <svg
                    className="mr-2 h-4 w-4 text-emerald-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {userInfo.username}
                </dd>
              </div>
              <div className="flex flex-col space-y-1 px-2 py-3">
                <dt className="text-sm font-medium text-slate-400">
                  Authentication Method
                </dt>
                <dd className="flex items-center text-sm font-medium text-slate-200">
                  <svg
                    className="mr-2 h-4 w-4 text-amber-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                  </svg>
                  <span className="capitalize">{userInfo.authMethod}</span>
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 rounded-md border border-dashed border-slate-700 bg-slate-800/20">
            <p className="text-sm text-slate-400">
              No connection information available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
