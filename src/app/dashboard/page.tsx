"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Server } from "lucide-react";
import Loading from "@/components/ui/loading";

export default function DashboardPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        // With the new API, we don't need to check cookies on the client side
        // as the middleware handles authentication

        // Get connection info from localStorage
        const connectionInfoStr = localStorage.getItem("connectionInfo");
        if (connectionInfoStr) {
          try {
            const connectionInfo = JSON.parse(connectionInfoStr);
            setUserInfo(connectionInfo);
          } catch (err) {
            console.error("Failed to parse connection info:", err);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Authentication check error:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call the disconnect API
      await fetch("/api/ssh/disconnect", {
        method: "POST",
      });

      // Clear localStorage items
      localStorage.removeItem("connectionInfo");

      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Connection Information
          </CardTitle>
          <CardDescription>Your current SSH connection details</CardDescription>
        </CardHeader>
        <CardContent>
          {userInfo ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Host
                </p>
                <p>{userInfo.host}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Port
                </p>
                <p>{userInfo.port}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Username
                </p>
                <p>{userInfo.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Authentication Method
                </p>
                <p className="capitalize">{userInfo.authMethod}</p>
              </div>
            </div>
          ) : (
            <p>No connection information available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
