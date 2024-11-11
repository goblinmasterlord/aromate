import React from 'react';
import { motion } from 'framer-motion';

const QuizOption = ({ option, isSelected, onSelect, type }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        w-full p-4 rounded-xl border transition-all duration-200
        ${isSelected 
          ? 'border-accent-300 bg-accent-300/10' 
          : 'border-neutral-800 hover:border-neutral-700 bg-background-800/50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{option.icon}</span>
        <div className="text-left">
          <h3 className={`font-medium ${isSelected ? 'text-accent-300' : 'text-white'}`}>
            {option.label}
          </h3>
          {option.description && (
            <p className="text-sm text-neutral-400 mt-0.5">{option.description}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default QuizOption;