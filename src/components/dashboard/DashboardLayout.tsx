import React from "react";
import { NavigationMenu } from "./NavigationMenu";
import { Header } from "./Header";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isConnected, isAuthenticated, lastError, reconnect } = useWebSocket();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/ssh/disconnect", { method: "POST" });
      localStorage.removeItem("connectionInfo");
      localStorage.removeItem("ssh_session_token");
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally show a toast error
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <NavigationMenu />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Dashboard Header */}
        <Header
          isConnected={isConnected}
          isAuthenticated={isAuthenticated}
          wsError={lastError}
          onReconnect={reconnect}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {/* Render the specific page content here */}
          {children}

          {/* Optional: Add a subtle background element */}
          <div className="fixed bottom-0 right-0 opacity-[0.02] pointer-events-none z-[-1]">
            {/* Re-use or adapt an SVG background if desired */}
          </div>
        </main>
      </div>
    </div>
  );
}
