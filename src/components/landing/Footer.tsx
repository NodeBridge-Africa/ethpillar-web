import Link from "next/link";
import {
  Github,
  Twitter,
  MessageSquare,
  Heart,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden bg-slate-950">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-gradient-radial from-blue-900/10 via-transparent to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -left-64 w-1/2 h-1/2 bg-gradient-radial from-indigo-900/10 via-transparent to-transparent rounded-full blur-3xl"></div>

      {/* Ethereum logo watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
        <svg
          width="400"
          height="640"
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

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5"
          >
            <Link
              href="/"
              className="text-white font-bold text-xl flex items-center gap-2.5 mb-5"
            >
              <div className="relative w-10 h-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg"></div>
                <div className="absolute inset-0.5 bg-slate-900 rounded-md flex items-center justify-center font-bold text-white text-lg">
                  EP
                </div>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                EthPillar
              </span>
            </Link>

            <p className="mb-6 text-slate-400 max-w-md">
              Transform your Ethereum staking experience with our intuitive
              interface. EthPillar makes node management simple, secure, and
              accessible for everyone.
            </p>

            <div className="flex space-x-3">
              <a
                href="https://github.com/coincashew/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-800/70 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/coincashew"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-800/70 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://discord.gg/w8Bx8W2HPW"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-800/70 transition-colors"
                aria-label="Discord"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-2"
          >
            <h3 className="font-semibold text-white text-lg mb-4">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="https://www.coincashew.com/coins/overview-eth/ethpillar"
                  className="group text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-2"
          >
            <h3 className="font-semibold text-white text-lg mb-4">Community</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="https://github.com/coincashew/"
                  className="group text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.gg/w8Bx8W2HPW"
                  className="group text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com/coincashew"
                  className="group text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contribute
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter (potential future feature) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="md:col-span-3"
          >
            <h3 className="font-semibold text-white text-lg mb-4">
              Support EthPillar
            </h3>
            <p className="text-slate-400 mb-4">
              EthPillar is an open-source project. Support our work by
              contributing or donating.
            </p>
            <Link
              href="https://explorer.gitcoin.co/#/round/42161/610/32"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600/30 to-blue-700/30 hover:from-blue-600/40 hover:to-blue-700/40 backdrop-blur-sm text-white border border-blue-500/30 font-medium rounded-lg transition-all"
            >
              <Heart className="w-4 h-4 text-red-400" />
              <span>Support on Gitcoin</span>
            </Link>
          </motion.div>
        </div>

        {/* Footer bottom section */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} EthPillar. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              href="#"
              className="text-slate-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-slate-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
