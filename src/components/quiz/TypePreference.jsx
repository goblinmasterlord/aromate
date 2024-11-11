import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, Wind } from 'lucide-react';

const TypePreference = ({ onAnswer }) => {
  const types = [
    {
      id: 'fresh',
      icon: <Wind className="w-6 h-6" />,
      label: 'Fresh',
      description: 'Light, clean, and crisp scents'
    },
    {
      id: 'floral',
      icon: <Sparkles className="w-6 h-6" />,
      label: 'Floral',
      description: 'Romantic and elegant flower-based fragrances'
    },
    {
      id: 'oriental',
      icon: <Droplets className="w-6 h-6" />,
      label: 'Oriental',
      description: 'Rich, warm, and exotic scents'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {types.map((type) => (
        <motion.button
          key={type.id}
          onClick={() => onAnswer([type.id])}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 rounded-xl bg-background-800/50 border border-neutral-800 
                   hover:border-accent-300/50 transition-colors text-left"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-accent-300/10 flex items-center 
                          justify-center text-accent-300">
              {type.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">{type.label}</h3>
              <p className="text-sm text-neutral-400">{type.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default TypePreference;