import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const PreferenceTooltip = ({ isVisible, content }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ 
            height: {
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1]
            },
            opacity: {
              duration: 0.2,
              delay: 0.1
            }
          }}
          className="w-full overflow-hidden"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-2 p-4 rounded-xl bg-background-800/95 backdrop-blur-sm 
                     border border-violet-400/20 shadow-lg shadow-violet-400/10"
          >
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </span>
              <div className="space-y-2">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {content}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <div className="h-px flex-grow bg-gradient-to-r from-violet-400/20 to-transparent" />
                  <span className="text-xs text-violet-400">Did you know?</span>
                  <div className="h-px flex-grow bg-gradient-to-l from-violet-400/20 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreferenceTooltip;