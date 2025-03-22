"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved connection info
    const savedConnectionInfo = localStorage.getItem("connectionInfo");
    if (savedConnectionInfo) {
      try {
        setConnectionInfo(JSON.parse(savedConnectionInfo));
      } catch (err) {
        console.error("Failed to parse connection info:", err);
      }
    }
    setIsLoading(false);
  }, []);

  const handleDisconnect = async () => {
    try {
      // Call the disconnect API
      await fetch("/api/ssh/disconnect", {
        method: "POST",
      });

      // Clear localStorage
      localStorage.removeItem("connectionInfo");

      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect from the server.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SSH Connection Settings</CardTitle>
          <CardDescription>
            View and manage your SSH connection settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {connectionInfo ? (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      value={connectionInfo.host || ""}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      value={connectionInfo.port || 22}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={connectionInfo.username || ""}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authMethod">Authentication Method</Label>
                  <Input
                    id="authMethod"
                    value={connectionInfo.authMethod || ""}
                    readOnly
                    className="capitalize"
                  />
                </div>
                <div className="pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/auth")}
                  >
                    Connect to Different Server
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Note: To change connection settings, disconnect and reconnect
                  with new settings.
                </p>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground mb-4">
                No active SSH connection
              </p>
              <Button onClick={() => router.push("/auth")}>
                Connect to Server
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
