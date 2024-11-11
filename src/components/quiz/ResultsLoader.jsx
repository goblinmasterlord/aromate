import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const loadingMessages = [
  { text: "Analyzing your preferences...", icon: "🔍" },
  { text: "Exploring fragrance families...", icon: "🌸" },
  { text: "Matching your perfect scents...", icon: "✨" },
  { text: "Almost there...", icon: "⌛" }
];

const ResultsLoader = ({ answers }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/results', { state: { answers } });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, answers]);

  return (
    <div className="min-h-screen bg-background-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Animated Perfume Bottle */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-32 h-32 mx-auto"
        >
          <div className="relative w-full h-full">
            <motion.div
              className="absolute inset-0 bg-accent-300/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Your perfume bottle SVG here */}
          </div>
        </motion.div>

        {/* Loading Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-2"
          >
            <span className="text-2xl">{loadingMessages[messageIndex].icon}</span>
            <p className="text-lg text-white font-medium">
              {loadingMessages[messageIndex].text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="relative h-2 bg-background-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-300 to-accent-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsLoader; 