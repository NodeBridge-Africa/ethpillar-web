"use client";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Add particlesJS type definition
declare global {
  interface Window {
    particlesJS: any;
  }
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  const mainRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });

  // Parallax effect values
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const patternOpacity = useTransform(scrollYProgress, [0, 0.2], [0.08, 0.04]);

  useEffect(() => {
    setIsLoaded(true);

    // Load particles.js script
    if (!window.particlesJS && !particlesLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
      script.async = true;

      script.onload = () => {
        setParticlesLoaded(true);
        if (window.particlesJS) {
          window.particlesJS("particles-js", {
            particles: {
              number: {
                value: 30,
                density: { enable: true, value_area: 800 },
              },
              color: { value: "#3b82f6" },
              shape: {
                type: "polygon",
                stroke: { width: 0, color: "#000000" },
                polygon: { nb_sides: 6 },
              },
              opacity: {
                value: 0.3,
                random: true,
                anim: { enable: false },
              },
              size: {
                value: 5,
                random: true,
                anim: { enable: false },
              },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#3b82f6",
                opacity: 0.2,
                width: 1,
              },
              move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true,
              },
              modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 3 },
              },
            },
            retina_detect: true,
          });
        }
      };

      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [particlesLoaded]);

  const pageTransition = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
  };

  return (
    <div
      ref={mainRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Ethereum-inspired particle background */}
      <div id="particles-js" className="fixed inset-0 z-0"></div>

      {/* Gradient mesh background */}
      <motion.div
        className="fixed inset-0 z-0 opacity-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>
      </motion.div>

      {/* Subtle hexagon pattern (ethereum-inspired) */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ opacity: patternOpacity }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDFsMy4xIDUuMiAzLjEgNS4yLTMuMSA1LjItMy4xIDUuMi02LjItMTAuNHoiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] [background-size:20px_20px]"></div>
      </motion.div>

      {/* Content container */}
      <motion.div
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={pageTransition}
        className="relative z-10 transition-all"
      >
        {/* Ethereum diamond floating element */}
        <div className="absolute top-24 right-8 md:right-20 lg:right-36 z-0 opacity-60 animate-float select-none pointer-events-none">
          <svg
            width="40"
            height="64"
            viewBox="0 0 40 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
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

        {/* Main content */}
        <Header />

        <motion.div variants={sectionVariant} className="relative">
          <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <Hero />
        </motion.div>

        <motion.div variants={sectionVariant} className="relative mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 flex justify-center">
              <div className="h-full w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
            </div>

            <div className="relative py-16">
              <div className="absolute -top-px left-1/2 -ml-px h-12 w-px bg-gradient-to-b from-transparent to-blue-500/20"></div>
              <div className="absolute -bottom-px left-1/2 -ml-px h-12 w-px bg-gradient-to-b from-blue-500/20 to-transparent"></div>

              <Features />
            </div>
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} className="relative mt-8">
          <div className="absolute inset-0">
            <div className="h-1/3 bg-gradient-to-b from-transparent to-blue-900/10 dark:to-blue-900/20"></div>
            <div className="h-2/3 bg-blue-900/10 dark:bg-blue-900/20"></div>
          </div>

          <div className="relative py-24">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

            <HowItWorks />
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} className="relative mt-8 py-24">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

          <Testimonials />
        </motion.div>

        <motion.div variants={sectionVariant} className="relative mt-4">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-blue-950/30 to-slate-900/0 dark:from-slate-950/0 dark:via-blue-950/20 dark:to-slate-950/0"></div>

          <div className="relative backdrop-blur-sm py-24">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

            <CTA />
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} className="relative z-10">
          <Footer />
        </motion.div>
      </motion.div>

      {/* Ethereum-inspired accent light */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-1 h-1/3 bg-gradient-to-t from-blue-500/50 to-transparent blur-xl"></div>
    </div>
  );
}
