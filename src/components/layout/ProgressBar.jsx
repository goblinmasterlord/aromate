import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40">
      <div className="h-[2px] bg-background-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          className="h-full bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500"
        />
      </div>
      <div className="bg-background-900/80 backdrop-blur-sm border-b border-neutral-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">Question {currentStep} of {totalSteps}</span>
            <div className="h-4 w-[1px] bg-neutral-800" />
            <span className="text-sm font-medium text-accent-300">{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;