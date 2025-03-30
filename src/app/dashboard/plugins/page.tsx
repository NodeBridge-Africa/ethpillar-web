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
  Puzzle,
  Plus,
  Download,
  RefreshCw,
  ArrowUpDown,
  Layers,
  Package,
  FileCode,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function PluginsPage() {
  const handlePluginAction = () => {
    toast({
      title: "Coming Soon",
      description:
        "Plugin management functionality will be available in a future update.",
    });
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-100">
        EthPillar Plugins
      </h1>

      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
        <CardHeader className="border-b border-slate-800 bg-slate-800/40">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
            <Info className="h-5 w-5 text-blue-400" /> Plugins Information
          </CardTitle>
          <CardDescription className="text-slate-400">
            Extend EthPillar's functionality with plugins.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border border-slate-800 bg-slate-800/20 p-6">
            <h3 className="text-lg font-medium text-slate-100 mb-2">
              Plugin System
            </h3>
            <p className="text-slate-300 mb-4">
              The EthPillar plugin system allows you to extend the functionality
              of your Ethereum node with additional tools, monitoring solutions,
              and integrations.
            </p>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-center">
                <FileCode className="h-4 w-4 mr-2" /> Install and manage plugins
                from the official repository
              </p>
              <p className="flex items-center">
                <Package className="h-4 w-4 mr-2" /> Create custom plugins using
                the EthPillar API
              </p>
              <p className="flex items-center">
                <Layers className="h-4 w-4 mr-2" /> Seamless integration with
                your existing node setup
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
          <CardHeader className="border-b border-slate-800 bg-slate-800/40">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
              <Puzzle className="h-5 w-5 text-indigo-400" /> Available Plugins
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={handlePluginAction}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh Plugin List
                </Button>
                <Button onClick={handlePluginAction}>
                  <Plus className="mr-2 h-4 w-4" /> Install Plugin
                </Button>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-800/20 p-4 text-center">
                <p className="text-slate-400">
                  Plugin management will be available in a future update.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-800 bg-slate-900/50 rounded-lg shadow-lg">
          <CardHeader className="border-b border-slate-800 bg-slate-800/40">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-100">
              <ArrowUpDown className="h-5 w-5 text-green-400" /> Plugin Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  className="bg-slate-700/60 hover:bg-slate-700 text-slate-200"
                  onClick={handlePluginAction}
                >
                  <Download className="mr-2 h-4 w-4" /> Update All Plugins
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={handlePluginAction}
                >
                  Create Plugin
                </Button>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-800/20 p-4 text-center">
                <p className="text-slate-400">
                  This functionality is coming soon! Stay tuned for updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
