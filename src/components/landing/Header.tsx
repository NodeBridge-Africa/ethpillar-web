import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavigationItem = {
  name: string;
  href: string;
  target?: string;
  dropdown?: boolean;
  items?: {
    name: string;
    href: string;
    external: boolean;
  }[];
};

const navigation: NavigationItem[] = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
  {
    name: "Resources",
    href: "#",
    dropdown: true,
    items: [
      {
        name: "Documentation",
        href: "https://www.coincashew.com/coins/overview-eth/ethpillar",
        external: true,
      },
      {
        name: "GitHub",
        href: "https://github.com/coincashew/",
        external: true,
      },
      {
        name: "Discord Community",
        href: "https://discord.gg/w8Bx8W2HPW",
        external: true,
      },
    ],
  },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = (state: boolean) => {
    setMobileMenuOpen(state);
    if (state) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const toggleDropdown = (index: number | null) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-white font-bold text-xl flex items-center gap-2.5"
          >
            <div className="relative w-10 h-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg"></div>
              <div className="absolute inset-0.5 bg-slate-900 rounded-md flex items-center justify-center font-bold text-white text-lg">
                EP
              </div>
              <div className="absolute inset-0 bg-blue-500/20 animate-pulse rounded-lg"></div>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              EthPillar
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item, index) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-md hover:bg-slate-800/50"
                  >
                    {item.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    target={item.target}
                    rel={item.target ? "noopener noreferrer" : undefined}
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-md hover:bg-slate-800/50"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown */}
                {item.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 p-1 w-48 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl z-50"
                      >
                        {item.items?.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={
                              subItem.external
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="block px-4 py-2 text-sm text-slate-300 hover:text-white rounded-md hover:bg-slate-700/50 transition-colors"
                            onClick={() => toggleDropdown(null)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            <Link
              href="/auth"
              className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all rounded-lg text-white font-medium shadow-md hover:shadow-lg hover:shadow-blue-500/20"
            >
              Connect
            </Link>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-white p-2 rounded-lg bg-slate-800/80"
            onClick={() => toggleMobileMenu(true)}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md md:hidden"
          >
            <div className="container px-4 mx-auto py-5">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="text-white font-bold text-xl flex items-center gap-2"
                  onClick={() => toggleMobileMenu(false)}
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

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="text-white p-2 rounded-lg bg-slate-800/80"
                  onClick={() => toggleMobileMenu(false)}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <motion.nav
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-2 mt-10"
              >
                {navigation.map((item, index) => (
                  <div key={index} className="py-1">
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="flex items-center justify-between w-full px-4 py-3 text-slate-200 hover:text-white transition-colors rounded-lg hover:bg-slate-800/70"
                        >
                          <span className="text-lg">{item.name}</span>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              activeDropdown === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden ml-4 mt-1 border-l border-slate-700/50 pl-4"
                            >
                              {item.items?.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  target={
                                    subItem.external ? "_blank" : undefined
                                  }
                                  rel={
                                    subItem.external
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="block py-2.5 text-slate-300 hover:text-white transition-colors"
                                  onClick={() => toggleMobileMenu(false)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        target={item.target}
                        rel={item.target ? "noopener noreferrer" : undefined}
                        className="block px-4 py-3 text-lg text-slate-200 hover:text-white transition-colors rounded-lg hover:bg-slate-800/70"
                        onClick={() => toggleMobileMenu(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <Link
                    href="/dashboard"
                    className="block w-full px-4 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all rounded-lg text-white font-medium text-center shadow-md"
                    onClick={() => toggleMobileMenu(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
