import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EthPillar - Server Authentication",
  description: "Connect to your Ethereum node server securely via SSH",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
