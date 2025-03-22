"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { SSHAuthInput, sshAuthSchema } from "@/lib/schemas/auth";

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Loader2,
  Server,
  Key,
  Database,
  User,
} from "lucide-react";

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
      setActiveTab(value as "password" | "privateKey");
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
    <div className="relative">
      {/* Card glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-20"></div>

      <Card className="w-full max-w-md mx-auto border border-slate-700/30 shadow-xl bg-slate-900/80 backdrop-blur-sm relative z-10">
        <CardHeader className="pb-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Server className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Connect to Your Server
          </CardTitle>
          <CardDescription className="text-center text-base text-blue-200">
            Securely access your Ethereum node via SSH
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-blue-100">
                      <Database className="h-4 w-4 text-blue-400" />
                      Server Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 192.168.1.100 or example.com"
                        className="eth-form-input bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-blue-100">
                      <Server className="h-4 w-4 text-blue-400" />
                      SSH Port
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="eth-form-input bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      Usually 22 unless configured otherwise
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-blue-100">
                      <User className="h-4 w-4 text-blue-400" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. root or ubuntu"
                        className="eth-form-input bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authMethod"
                render={() => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2 text-blue-100">
                      <Key className="h-4 w-4 text-blue-400" />
                      Authentication Method
                    </FormLabel>
                    <FormControl>
                      <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 bg-slate-800/60">
                          <TabsTrigger
                            value="password"
                            className="data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white"
                          >
                            Password
                          </TabsTrigger>
                          <TabsTrigger
                            value="privateKey"
                            className="data-[state=active]:bg-blue-600 text-slate-300 data-[state=active]:text-white"
                          >
                            Private Key
                          </TabsTrigger>
                        </TabsList>
                        <div className="mt-4 bg-slate-800/30 p-4 rounded-md border border-slate-700/50">
                          <TabsContent value="password" className="pt-2">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-blue-100">
                                    Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      className="eth-form-input bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-blue-500/50 focus:ring-blue-500/20"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                          <TabsContent value="privateKey" className="pt-2">
                            <FormField
                              control={form.control}
                              name="privateKey"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-blue-100">
                                    Private Key
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Paste your private key here"
                                      className="eth-form-input min-h-[120px] bg-slate-800/50 border-slate-700/50 text-slate-100 focus:border-blue-500/50 focus:ring-blue-500/20"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="text-slate-400">
                                    Your private key is never stored on our
                                    servers
                                  </FormDescription>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                        </div>
                      </Tabs>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {authError && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-md flex items-start gap-2 border border-red-500/20">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{authError}</div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
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
      </Card>
    </div>
  );
}
