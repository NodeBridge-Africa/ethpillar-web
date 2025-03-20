import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect Your Server",
    description:
      "Enter your server details with SSH credentials for a secure connection to your staking node.",
    image: "/connect-server.png",
    features: [
      "Secure SSH Connection",
      "Automatic System Check",
      "Network Configuration",
    ],
  },
  {
    number: "02",
    title: "Choose Your Clients",
    description:
      "Select from multiple client combinations with our wizard that helps you pick the optimal setup.",
    image: "/client-selection.png",
    features: [
      "Diversity-Optimized Pairings",
      "Client Feature Comparison",
      "One-Click Installation",
    ],
  },
  {
    number: "03",
    title: "Monitor & Manage",
    description:
      "Access a comprehensive dashboard with real-time metrics and easy management tools.",
    image: "/node-monitoring.png",
    features: [
      "Real-time Performance Metrics",
      "Alert Notifications",
      "Simple Maintenance Tools",
    ],
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24">
      {/* Connecting line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent hidden md:block"></div>

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
              Simple Process
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            How EthPillar Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Setting up your Ethereum validator has never been easier. Follow
            these simple steps to get started with EthPillar.
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex flex-col ${
                index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-8 md:gap-16`}
            >
              {/* Image column */}
              <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-800/30 p-2 md:p-3 rounded-xl border border-slate-700/50 shadow-2xl">
                  <div className="bg-slate-900 rounded-lg overflow-hidden">
                    {/* Step number (circle) */}
                    <div className="absolute -top-5 -left-5 md:-left-5 md:-top-5 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center z-10 border-2 border-slate-900 shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {step.number}
                      </span>
                    </div>

                    {/* Flow line indicator */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute hidden md:block h-24 w-px bg-gradient-to-b from-blue-500/50 to-transparent bottom-0 ${
                          index % 2 !== 0
                            ? "left-1/2 -translate-x-1/2 -translate-y-full"
                            : "left-1/2 -translate-x-1/2 translate-y-full"
                        }`}
                      ></div>
                    )}

                    <div className="relative overflow-hidden group">
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={600}
                        height={400}
                        className="object-cover w-full transition-transform group-hover:scale-105 duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex items-end">
                        <div className="p-6">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-bold text-xs rounded-full">
                            Step {step.number}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content column */}
              <div className="md:w-1/2">
                <div className="max-w-lg">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-400 mb-6">
                    {step.description}
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-3 mb-8">
                    {step.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Arrow indicator */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block">
                      <ArrowRight
                        className={`w-8 h-8 text-blue-500 opacity-70 ${
                          index % 2 !== 0 ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
