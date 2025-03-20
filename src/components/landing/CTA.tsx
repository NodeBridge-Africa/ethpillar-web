import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";

export const CTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -right-[30%] w-[80%] h-[80%] bg-blue-600/10 blur-3xl rounded-full opacity-50"></div>
        <div className="absolute -bottom-[30%] -left-[30%] w-[80%] h-[80%] bg-indigo-600/10 blur-3xl rounded-full opacity-50"></div>
      </div>

      {/* Hexagon grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDFsMy4xIDUuMiAzLjEgNS4yLTMuMSA1LjItMy4xIDUuMi02LjItMTAuNHoiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] [background-size:30px_30px]"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl p-1">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-8 md:p-12">
              {/* Ethereum logo in background */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
                <svg
                  width="280"
                  height="400"
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center relative z-10"
              >
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Start staking with as little as 2.4 ETH via Lido CSM
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                  Ready to Simplify Your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Ethereum Staking
                  </span>
                  ?
                </h2>

                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                  Join thousands of validators who are using EthPillar for a
                  better, more reliable staking experience with minimal
                  technical knowledge required.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                  <Link
                    href="/dashboard"
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg text-center transition-all shadow-md hover:shadow-xl hover:shadow-blue-600/20"
                  >
                    Get Started Now
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="https://github.com/coincashew/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-slate-700/50 hover:bg-slate-700 backdrop-blur-sm border border-slate-600 text-white font-medium rounded-lg text-center transition-all"
                  >
                    <Github className="w-5 h-5" />
                    View on GitHub
                  </Link>
                </div>

                {/* Documentation link */}
                <div className="text-slate-400 text-sm">
                  Need more information?{" "}
                  <Link
                    href="https://www.coincashew.com/coins/overview-eth/ethpillar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium underline-offset-2 hover:underline transition-colors"
                  >
                    View the documentation
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
