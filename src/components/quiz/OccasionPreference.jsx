import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, Moon, Heart } from 'lucide-react';

const OccasionPreference = ({ onAnswer }) => {
  const occasions = [
    {
      id: 'daily',
      icon: <Calendar className="w-6 h-6" />,
      label: 'Daily Wear',
      description: 'For everyday occasions'
    },
    {
      id: 'work',
      icon: <Briefcase className="w-6 h-6" />,
      label: 'Work',
      description: 'Professional and subtle'
    },
    {
      id: 'evening',
      icon: <Moon className="w-6 h-6" />,
      label: 'Evening',
      description: 'Sophisticated and lasting'
    },
    {
      id: 'special',
      icon: <Heart className="w-6 h-6" />,
      label: 'Special Occasions',
      description: 'Memorable and unique'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {occasions.map((occasion) => (
        <motion.button
          key={occasion.id}
          onClick={() => onAnswer([occasion.id])}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 rounded-xl bg-background-800/50 border border-neutral-800 
                   hover:border-accent-300/50 transition-colors text-left"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-accent-300/10 flex items-center 
                          justify-center text-accent-300">
              {occasion.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">{occasion.label}</h3>
              <p className="text-sm text-neutral-400">{occasion.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default OccasionPreference;