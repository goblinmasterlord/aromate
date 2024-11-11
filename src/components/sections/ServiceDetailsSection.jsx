import React from 'react';
import { motion } from 'framer-motion';
import { Clipboard, Settings, Package } from 'lucide-react';

const steps = [
  {
    title: 'Select Preferences',
    description: 'Customize your search based on scent type, occasion, and more.',
    icon: <Clipboard className="text-white w-8 h-8" />
  },
  {
    title: 'Review Options',
    description: 'Explore a curated list of fragrances that match your preferences.',
    icon: <Settings className="text-white w-8 h-8" />
  },
  {
    title: 'Receive Recommendations',
    description: 'Get personalized recommendations delivered to your profile.',
    icon: <Package className="text-white w-8 h-8" />
  }
];

const ServiceDetailsSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-gradient-start to-gradient-end">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">How Our Service Works</h2>
        <p className="text-neutral-200 mb-12">
          Discover your perfect fragrance with our personalized scent-finding process.
        </p>
        <div className="flex flex-wrap justify-center gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-64 p-6 bg-white/10 rounded-lg shadow-custom-light hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl text-accent-300 font-semibold">{step.title}</h3>
              <p className="text-neutral-200 mt-2">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsSection;