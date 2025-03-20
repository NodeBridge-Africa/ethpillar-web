import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Shield } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-gradient-radial from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-12 md:mb-0"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <span className="animate-pulse relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now supporting Ethereum 2.0
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ethereum Staking{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Simplified
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
              EthPillar transforms node management from complex terminal
              commands to intuitive clickable options. Set up and manage your
              Ethereum node with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#features"
                className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 backdrop-blur-sm text-white border border-slate-700 font-medium rounded-lg text-center transition-all"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm">Secure Setup</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700"></div>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Open Source</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow effects */}
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

              {/* Ethereum logo watermark */}
              <div className="absolute right-12 top-12 opacity-10 transform rotate-12">
                <svg
                  width="60"
                  height="90"
                  viewBox="0 0 40 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.9976 0L19.6367 1.16991V43.0591L19.9976 43.314L39.9953 31.728L19.9976 0Z"
                    fill="white"
                  />
                  <path
                    d="M19.9975 0L0 31.728L19.9975 43.314V23.1919V0Z"
                    fill="white"
                  />
                  <path
                    d="M19.9975 46.9784L19.7956 47.1927V61.8281L19.9975 62.4L40.0047 35.3976L19.9975 46.9784Z"
                    fill="white"
                  />
                  <path
                    d="M19.9975 62.4V46.9784L0 35.3976L19.9975 62.4Z"
                    fill="white"
                  />
                  <path
                    d="M19.9976 43.3139L39.9953 31.7279L19.9976 23.1918V43.3139Z"
                    fill="white"
                  />
                  <path
                    d="M0 31.7279L19.9975 43.3139V23.1918L0 31.7279Z"
                    fill="white"
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="relative rounded-lg overflow-hidden bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-2xl">
                  {/* Terminal-like header */}
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-700/50 flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-400 mx-auto">
                      EthPillar Dashboard
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-[600px] h-[400px] "></div>

                    {/* Animated highlight glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/5 to-purple-500/10 animate-pulse"></div>

                    {/* Code overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/70 flex items-end">
                      <div className="w-full p-6 font-mono text-xs text-blue-300/80 overflow-hidden">
                        <div className="typing-animation">
                          <span className="text-green-400">$</span> ethpillar
                          status
                          <br />
                          <span className="text-blue-400">✓</span> Node active
                          and synced
                          <br />
                          <span className="text-blue-400">✓</span> Execution
                          client (Nethermind): Running
                          <br />
                          <span className="text-blue-400">✓</span> Consensus
                          client (Teku): Running
                          <br />
                          <span className="text-blue-400">✓</span> MEV-Boost:
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700/50 rounded-full py-1 px-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      System online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
