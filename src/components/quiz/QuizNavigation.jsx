import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const QuizNavigation = ({ 
  onNext, 
  onBack, 
  canProgress,
  isFirstQuestion,
  isLastQuestion 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background-900/80 backdrop-blur-lg border-t border-neutral-800/50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          disabled={isFirstQuestion}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-colors duration-200
            ${isFirstQuestion 
              ? 'opacity-50 cursor-not-allowed text-neutral-500'
              : 'text-neutral-400 hover:text-white'
            }
          `}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!canProgress}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${canProgress
              ? 'bg-accent-300 text-background-900 hover:bg-accent-400'
              : 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
            }
          `}
        >
          {isLastQuestion ? 'Complete' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuizNavigation;