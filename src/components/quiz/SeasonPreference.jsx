import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, Leaf, Snowflake } from 'lucide-react';

const SeasonPreference = ({ onAnswer }) => {
  const seasons = [
    {
      id: 'summer',
      icon: <Sun className="w-6 h-6" />,
      label: 'Summer',
      description: 'Light and refreshing scents'
    },
    {
      id: 'spring',
      icon: <Leaf className="w-6 h-6" />,
      label: 'Spring',
      description: 'Fresh and floral fragrances'
    },
    {
      id: 'fall',
      icon: <Cloud className="w-6 h-6" />,
      label: 'Fall',
      description: 'Warm and spicy notes'
    },
    {
      id: 'winter',
      icon: <Snowflake className="w-6 h-6" />,
      label: 'Winter',
      description: 'Rich and intense scents'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {seasons.map((season) => (
        <motion.button
          key={season.id}
          onClick={() => onAnswer([season.id])}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 rounded-xl bg-background-800/50 border border-neutral-800 
                   hover:border-accent-300/50 transition-colors text-left"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-accent-300/10 flex items-center 
                          justify-center text-accent-300">
              {season.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">{season.label}</h3>
              <p className="text-sm text-neutral-400">{season.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default SeasonPreference;