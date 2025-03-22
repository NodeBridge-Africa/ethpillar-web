import { SSHAuthForm } from "@/components/auth/SSHAuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EthPillar - Server Authentication",
  description: "Connect to your Ethereum node server securely via SSH",
};

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-12 h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">EthPillar</h1>
          <p className="text-gray-500">Connect to your Ethereum node server</p>
        </div>
        <SSHAuthForm />
      </div>
    </div>
  );
}
