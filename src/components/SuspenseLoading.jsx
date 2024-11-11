import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const SuspenseLoading = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background-900 flex items-center justify-center z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Loader className="w-8 h-8 text-accent-300" />
      </motion.div>
    </motion.div>
  );
};

export default SuspenseLoading;