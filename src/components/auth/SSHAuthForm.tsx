"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { SSHAuthInput, sshAuthSchema } from "@/lib/schemas/auth";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

export function SSHAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"password" | "privateKey">(
    "password"
  );

  const form = useForm<SSHAuthInput>({
    resolver: zodResolver(sshAuthSchema),
    defaultValues: {
      host: "",
      port: 22,
      username: "",
      authMethod: "password",
      password: "",
      privateKey: "",
    },
  });

  // Update the authMethod field when changing tabs
  const handleTabChange = (value: string) => {
    if (value === "password" || value === "privateKey") {
      setActiveTab(value);
      form.setValue("authMethod", value);
    }
  };

  // Handle form submission
  const onSubmit = async (data: SSHAuthInput) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Call the API to authenticate with SSH
      const response = await fetch("/api/ssh/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setAuthError(result.message || "Authentication failed");
        return;
      }

      // The SSH session cookie is now set automatically by the API
      // We only need to store additional info in localStorage
      localStorage.setItem(
        "connectionInfo",
        JSON.stringify({
          host: data.host,
          port: data.port,
          username: data.username,
          authMethod: data.authMethod,
        })
      );

      // Redirect to dashboard or the original route the user was trying to access
      router.push(redirectPath);
    } catch (err) {
      console.error("Authentication error:", err);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Connect to Your Server</CardTitle>
        <CardDescription>
          Enter your SSH server details to establish a connection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server IP / Hostname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 192.168.1.100 or example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSH Port</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Usually 22 unless configured otherwise
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. root or ubuntu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Authentication Method</FormLabel>
                  <FormControl>
                    <Tabs
                      defaultValue="password"
                      value={activeTab}
                      onValueChange={handleTabChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="privateKey">
                          Private Key
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="password" className="pt-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent value="privateKey" className="pt-4">
                        <FormField
                          control={form.control}
                          name="privateKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Private Key</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="font-mono text-xs h-32"
                                  placeholder="Paste your private key here (e.g. contents of id_rsa)"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Paste the content of your private key file (e.g.
                                ~/.ssh/id_rsa)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {authError && (
              <div
                className={`border px-4 py-3 rounded flex items-start gap-3 ${
                  isLoading
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <span>{authError}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        <p>
          Your credentials are only used to establish a connection and are never
          stored on our servers.
        </p>
      </CardFooter>
    </Card>
  );
}
