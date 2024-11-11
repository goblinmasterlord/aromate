import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Wind } from 'lucide-react';

const ImportancePreference = ({ onAnswer }) => {
  const handleSelection = (value) => {
    onAnswer([value]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-background-800/50 border border-neutral-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-300/10 flex items-center 
                          justify-center text-accent-300">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-white">Longevity</h3>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="10"
              defaultValue="5"
              onChange={(e) => handleSelection(parseInt(e.target.value))}
              className="w-full accent-accent-300"
            />
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Less important</span>
              <span>Very important</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-background-800/50 border border-neutral-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-300/10 flex items-center 
                          justify-center text-accent-300">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-white">Projection</h3>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="10"
              defaultValue="5"
              onChange={(e) => handleSelection(parseInt(e.target.value))}
              className="w-full accent-accent-300"
            />
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Less important</span>
              <span>Very important</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportancePreference;