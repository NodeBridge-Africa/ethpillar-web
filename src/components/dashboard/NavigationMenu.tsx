"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  Database,
  ShieldCheck,
  Zap,
  Settings,
  Wrench,
  Puzzle,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNodeStatus } from "@/hooks/useNodeStatus";
import { getStatusColor } from "./utils"; // Import the utility

// Define navigation item structure
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  serviceName?: string; // Link to service status
  requiredStatus?: string[]; // Statuses required to show this item (e.g., ['active', 'inactive'])
  hideIfStatus?: string[]; // Hide if service has this status (e.g., ['not_installed'])
}

export function NavigationMenu() {
  const pathname = usePathname();
  const { statuses, isLoading: statusLoading } = useNodeStatus(); // Get statuses

  // Filter navigation items based on service status
  const availableNavItems = useMemo(() => {
    const allItems: NavItem[] = [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Execution Client",
        href: "/dashboard/execution",
        icon: Server,
        serviceName: "execution",
        hideIfStatus: ["not_installed"],
      },
      {
        label: "Consensus Client",
        href: "/dashboard/consensus",
        icon: Database,
        serviceName: "consensus",
        hideIfStatus: ["not_installed"],
      },
      {
        label: "Validator Client",
        href: "/dashboard/validator",
        icon: ShieldCheck,
        serviceName: "validator",
        hideIfStatus: ["not_installed"],
      },
      {
        label: "MEV-Boost",
        href: "/dashboard/mevboost",
        icon: Zap,
        serviceName: "mevboost",
        hideIfStatus: ["not_installed"],
      },
      { label: "Logs", href: "/dashboard/logs", icon: Terminal }, // Always show Logs link
      { label: "Plugins", href: "/dashboard/plugins", icon: Puzzle }, // Consider conditional logic later
      { label: "Toolbox", href: "/dashboard/toolbox", icon: Wrench },
      { label: "System", href: "/dashboard/system", icon: Settings },
    ];

    if (statusLoading) {
      // Optionally show loading state or a subset of items
      return allItems.filter((item) => !item.serviceName); // Show non-service items while loading
    }

    return allItems.filter((item) => {
      if (!item.serviceName) return true; // Always show non-service items
      const status = statuses[item.serviceName];
      if (!status) return false; // Hide if status unknown (unless loading)
      if (item.hideIfStatus && item.hideIfStatus.includes(status)) return false;
      if (item.requiredStatus && !item.requiredStatus.includes(status))
        return false;
      return true;
    });
  }, [statuses, statusLoading]);

  return (
    <div className="flex flex-col h-full w-fit sm:w-fit md:w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 shadow-lg">
      {/* Logo/Header */}
      <div className="p-5 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg"></div>
            <div className="absolute inset-0.5 bg-slate-900 rounded-md flex items-center justify-center font-bold text-white text-sm">
              EP
            </div>
          </div>
          <span className="text-xl hidden sm:block font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            EthPillar
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
        {availableNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const status = item.serviceName
            ? statuses[item.serviceName]
            : undefined;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 ease-in-out relative overflow-hidden",
                isActive
                  ? "bg-blue-600/20 text-white shadow-inner shadow-blue-500/10 border border-blue-500/30"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              )}
            >
              {/* Active indicator */}
              <span
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-full transition-transform duration-300 ease-out",
                  isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                )}
              ></span>

              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="hidden sm:block">{item.label}</span>

              {/* Status Dot */}
              {item.serviceName && status && status !== "not_installed" && (
                <span className="ml-auto flex items-center">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full border border-slate-900",
                      getStatusColor(status, true) // Use the utility function
                    )}
                  ></span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings Link */}
      <div className="mt-auto p-3 border-t border-slate-800">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 ease-in-out",
            pathname === "/settings"
              ? "bg-slate-700/50 text-white"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
          )}
        >
          <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:block">Settings</span>
        </Link>
      </div>
    </div>
  );
}
