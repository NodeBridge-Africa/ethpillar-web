import { Server, Shield, Zap, Settings, Layers, Plug } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Server className="w-10 h-10 text-blue-400" />,
    title: "SSH Authentication",
    description:
      "Securely connect to your server with SSH credentials, no terminal required.",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: <Layers className="w-10 h-10 text-indigo-400" />,
    title: "Interactive Dashboard",
    description:
      "Manage your Ethereum node with an intuitive web interface instead of command lines.",
    color: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    icon: <Settings className="w-10 h-10 text-purple-400" />,
    title: "Client Selection",
    description:
      "Choose from various execution & consensus clients with an easy step-by-step wizard.",
    color: "from-purple-500/20 to-purple-600/5",
  },
  {
    icon: <Zap className="w-10 h-10 text-amber-400" />,
    title: "Real-time Updates",
    description:
      "Monitor logs and node status with WebSocket-powered real-time feedback.",
    color: "from-amber-500/20 to-amber-600/5",
  },
  {
    icon: <Shield className="w-10 h-10 text-emerald-400" />,
    title: "System Administration",
    description:
      "Manage firewall settings, updates, and maintenance operations with simple clicks.",
    color: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: <Plug className="w-10 h-10 text-cyan-400" />,
    title: "Plugin Management",
    description:
      "Install monitoring tools and custom alerts to enhance your staking experience.",
    color: "from-cyan-500/20 to-cyan-600/5",
  },
];

export const Features = () => {
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
            <span className="mx-3 text-blue-400 font-medium text-sm uppercase tracking-wider">
              Features
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Powerful Tools, Simplified Interface
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            EthPillar combines advanced staking functionality with an intuitive
            interface designed for both new and experienced validators.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item} className="relative">
              <div className="group h-full p-8 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all shadow-lg hover:shadow-xl overflow-hidden">
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Hexagon pattern background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDFsMy4xIDUuMiAzLjEgNS4yLTMuMSA1LjItMy4xIDUuMi02LjItMTAuNHoiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                {/* Icon with shining effect */}
                <div className="relative mb-6 bg-slate-900/50 p-4 inline-flex items-center justify-center rounded-lg group-hover:scale-110 transform transition-transform duration-300">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
                  <div className="relative z-10">{feature.icon}</div>
                </div>

                <h3 className="relative text-xl font-semibold mb-3 text-white group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-slate-400 group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
