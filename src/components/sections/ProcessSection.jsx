import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Beaker, Sparkles, Heart } from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: "Share Your Preferences",
      description: "Tell us what you love in a fragrance, and let us find the perfect match for you."
    },
    {
      icon: Beaker,
      title: "Expert Analysis",
      description: "Our sophisticated algorithm will select fragrances that align with your preferences."
    },
    {
      icon: Sparkles,
      title: "Discover Matches",
      description: "Explore a curated selection of fragrances uniquely suited to your taste."
    },
    {
      icon: Heart,
      title: "Find Your Favorite",
      description: "Experience the joy of discovering your new signature scent."
    }
  ];

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="aurora-glow w-[1000px] h-[1000px] left-1/2 top-1/2 opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background-900/0 via-background-800/80 to-background" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Your <span className="gradient-text">Fragrance Journey</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            A personalized path to finding your ultimate fragrance.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <ProcessCard key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCard = ({ icon: IconComponent, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-300/0 via-accent-300/20 to-accent-300/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />
      
      <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-neutral-800 via-accent-300/10 to-neutral-800">
        <div className="relative h-full p-6 rounded-xl bg-background-800/90 backdrop-blur-sm overflow-hidden">
          {/* Subtle hover gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-accent-300/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
          />
          
          {/* Icon container with glow */}
          <div className="relative mb-6 w-12 h-12">
            <div className="absolute inset-0 bg-accent-300/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative w-12 h-12 rounded-lg bg-background-900 flex items-center justify-center ring-1 ring-neutral-700/50 group-hover:ring-accent-300/30 transition-all duration-300">
              <IconComponent className="w-5 h-5 text-accent-300" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-300 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
            {description}
          </p>

          {/* Step number */}
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-background-900 flex items-center justify-center text-sm font-medium text-neutral-400 group-hover:text-accent-300 ring-1 ring-neutral-700/50 group-hover:ring-accent-300/30 transition-all duration-300">
            {index + 1}
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessSection;