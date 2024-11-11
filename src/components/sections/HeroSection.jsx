import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-900 to-background-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.05),transparent_80%)]" />
      </div>
      
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent-300/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 4}s infinite ${Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-accent-300 text-sm font-medium tracking-wider uppercase">
              Discover Your Unique Fragrance
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-8"
          >
            Explore the Perfect Scent <br />
            <span className="gradient-text">Tailored for You</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-400 mb-12 max-w-2xl"
          >
            Begin your journey to discover a fragrance that captures your essence and elevates every moment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/quiz"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-300 hover:bg-accent-400 text-background-900 font-medium transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-lg bg-accent-300/20 blur-lg group-hover:blur-xl transition-all duration-300 -z-10" />
            </Link>
            
            <button
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-700 hover:border-neutral-600 text-white font-medium transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              Learn More
              <div className="absolute inset-0 rounded-lg bg-neutral-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;