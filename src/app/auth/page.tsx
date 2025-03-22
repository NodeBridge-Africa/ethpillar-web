"use client";

import { Suspense } from "react";
import { SSHAuthForm } from "@/components/auth/SSHAuthForm";

export default function AuthPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background with Ethereum SVGs */}
      <div className="absolute inset-0 z-0">
        {/* Hexagon pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDFsMy4xIDUuMiAzLjEgNS4yLTMuMSA1LjItMy4xIDUuMi02LjItMTAuNHoiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] [background-size:20px_20px] opacity-[0.08]"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-blue-500/10 via-transparent to-transparent rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent rounded-full"></div>
        </div>

        {/* Floating Ethereum Diamonds */}
        <div className="absolute top-1/4 left-[15%] animate-float-slow">
          <svg
            width="40"
            height="64"
            viewBox="0 0 40 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-20"
          >
            <path
              d="M19.9976 0L19.6367 1.16991V43.0591L19.9976 43.314L39.9953 31.728L19.9976 0Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 0L0 31.728L19.9975 43.314V23.1919V0Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9975 46.9784L19.7956 47.1927V61.8281L19.9975 62.4L40.0047 35.3976L19.9975 46.9784Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 62.4V46.9784L0 35.3976L19.9975 62.4Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9976 43.3139L39.9953 31.7279L19.9976 23.1918V43.3139Z"
              fill="#1D4ED8"
            />
            <path
              d="M0 31.7279L19.9975 43.3139V23.1918L0 31.7279Z"
              fill="#2563EB"
            />
          </svg>
        </div>

        <div className="absolute top-3/4 right-[20%] animate-float">
          <svg
            width="30"
            height="48"
            viewBox="0 0 40 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-15"
          >
            <path
              d="M19.9976 0L19.6367 1.16991V43.0591L19.9976 43.314L39.9953 31.728L19.9976 0Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 0L0 31.728L19.9975 43.314V23.1919V0Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9975 46.9784L19.7956 47.1927V61.8281L19.9975 62.4L40.0047 35.3976L19.9975 46.9784Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 62.4V46.9784L0 35.3976L19.9975 62.4Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9976 43.3139L39.9953 31.7279L19.9976 23.1918V43.3139Z"
              fill="#1D4ED8"
            />
            <path
              d="M0 31.7279L19.9975 43.3139V23.1918L0 31.7279Z"
              fill="#2563EB"
            />
          </svg>
        </div>

        <div className="absolute top-1/3 right-[10%] animate-float-medium">
          <svg
            width="24"
            height="36"
            viewBox="0 0 40 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-10"
          >
            <path
              d="M19.9976 0L19.6367 1.16991V43.0591L19.9976 43.314L39.9953 31.728L19.9976 0Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 0L0 31.728L19.9975 43.314V23.1919V0Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9975 46.9784L19.7956 47.1927V61.8281L19.9975 62.4L40.0047 35.3976L19.9975 46.9784Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 62.4V46.9784L0 35.3976L19.9975 62.4Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9976 43.3139L39.9953 31.7279L19.9976 23.1918V43.3139Z"
              fill="#1D4ED8"
            />
            <path
              d="M0 31.7279L19.9975 43.3139V23.1918L0 31.7279Z"
              fill="#2563EB"
            />
          </svg>
        </div>

        <div className="absolute bottom-1/4 left-[30%] animate-float-medium">
          <svg
            width="20"
            height="32"
            viewBox="0 0 40 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-25"
          >
            <path
              d="M19.9976 0L19.6367 1.16991V43.0591L19.9976 43.314L39.9953 31.728L19.9976 0Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 0L0 31.728L19.9975 43.314V23.1919V0Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9975 46.9784L19.7956 47.1927V61.8281L19.9975 62.4L40.0047 35.3976L19.9975 46.9784Z"
              fill="#3B82F6"
            />
            <path
              d="M19.9975 62.4V46.9784L0 35.3976L19.9975 62.4Z"
              fill="#60A5FA"
            />
            <path
              d="M19.9976 43.3139L39.9953 31.7279L19.9976 23.1918V43.3139Z"
              fill="#1D4ED8"
            />
            <path
              d="M0 31.7279L19.9975 43.3139V23.1918L0 31.7279Z"
              fill="#2563EB"
            />
          </svg>
        </div>

        {/* Staking Machine SVG */}
        <div className="absolute bottom-[15%] right-[25%] animate-pulse opacity-10">
          <svg
            width="160"
            height="140"
            viewBox="0 0 160 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="20"
              y="40"
              width="120"
              height="80"
              rx="4"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            <rect
              x="30"
              y="50"
              width="100"
              height="30"
              rx="2"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            <circle cx="45" cy="100" r="10" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="115" cy="100" r="10" stroke="#60A5FA" strokeWidth="2" />
            <rect
              x="70"
              y="90"
              width="20"
              height="20"
              rx="2"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            <path d="M80 20V40" stroke="#60A5FA" strokeWidth="2" />
            <path d="M65 25L80 10L95 25" stroke="#60A5FA" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 h-screen flex flex-col items-center justify-center relative z-10">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
              EthPillar
            </h1>
            <p className="text-blue-300">
              Connect to your Ethereum node server
            </p>
          </div>
          <Suspense
            fallback={
              <div className="text-center text-blue-300">
                Loading authentication form...
              </div>
            }
          >
            <SSHAuthForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
