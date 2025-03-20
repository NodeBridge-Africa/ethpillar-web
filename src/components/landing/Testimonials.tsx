import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
  {
    content:
      "EthPillar made setting up my Ethereum node incredibly simple. What used to take hours of terminal commands now takes minutes with a few clicks.",
    author: "Alex Thompson",
    role: "Independent Validator",
    avatar: "/avatars/user1.png",
    rating: 5,
  },
  {
    content:
      "The real-time monitoring is a game-changer. I can see exactly what's happening with my node without having to SSH in and check logs manually.",
    author: "Samantha Wright",
    role: "DeFi Developer",
    avatar: "/avatars/user2.png",
    rating: 5,
  },
  {
    content:
      "As someone who manages multiple nodes, EthPillar's interface saves me countless hours. The client selection wizard is particularly helpful.",
    author: "Michael Chen",
    role: "Staking Pool Operator",
    avatar: "/avatars/user3.png",
    rating: 5,
  },
];

export const Testimonials = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      <div className="absolute right-0 bottom-32 w-1/3 h-1/2 bg-gradient-radial from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl -z-10 opacity-80"></div>
      <div className="absolute left-0 top-32 w-1/3 h-1/2 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent rounded-full blur-3xl -z-10 opacity-80"></div>

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
              Testimonials
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            What Our Users Say
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join the growing community of validators who have simplified their
            Ethereum staking experience with EthPillar.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <div className="h-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1 shadow-xl relative overflow-hidden group">
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                <div className="relative h-full bg-slate-900 rounded-xl p-8 flex flex-col">
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 opacity-20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>
                  </div>

                  {/* Rating stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>

                  {/* Testimonial content */}
                  <p className="text-slate-300 mb-6 flex-grow leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-auto pt-4 border-t border-slate-800 flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-slate-700 flex items-center justify-center border-2 border-slate-700 shadow-inner">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.author}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Extra social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 mb-6">
            Trusted by validators around the world
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="text-slate-400 font-bold text-xl">EthStaker</div>
            <div className="text-slate-400 font-bold text-xl">CoinCashew</div>
            <div className="text-slate-400 font-bold text-xl">Lido</div>
            <div className="text-slate-400 font-bold text-xl">Rocket Pool</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
