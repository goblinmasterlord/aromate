import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ANIMATION_DURATION = 3000;

const VaporAnimation = () => {
  // Create multiple vapor streams for layered effect
  const vaporStreams = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    delay: i * 0.2,
    scale: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Vapor streams */}
      {vaporStreams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute left-1/2 top-1/2"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.2, stream.scale, 0.8],
            y: [-20, -40],
            x: [0, Math.sin(stream.id) * 20],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: stream.delay,
            ease: "easeInOut",
          }}
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-t from-accent-300/5 to-accent-400/20 
                        blur-2xl backdrop-blur-sm transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      ))}

      {/* Central glow effect */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          {/* Multiple layered glows for depth */}
          <div className="absolute inset-0 w-16 h-16 bg-accent-300/20 rounded-full blur-xl" />
          <div className="absolute inset-0 w-16 h-16 bg-accent-400/10 rounded-full blur-2xl" />
          <div className="absolute inset-0 w-16 h-16 bg-accent-300/5 rounded-full blur-3xl" />
          
          {/* Central icon */}
          <motion.div
            className="relative z-10"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Sparkles className="w-8 h-8 text-accent-300" />
          </motion.div>
        </div>
      </motion.div>

      {/* Rising particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 bottom-0"
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [-20, -60],
            x: [Math.sin(i) * 20, Math.sin(i + 2) * 30],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        >
          <div className="w-1 h-1 bg-accent-300/30 rounded-full blur-sm" />
        </motion.div>
      ))}
    </div>
  );
};

const LoadingScreen = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const loadingTexts = [
    "Finding your perfect fragrance match...",
    "Crafting personalized recommendations..."
  ];

  useEffect(() => {
    const startTime = Date.now();
    
    const textInterval = setInterval(() => {
      setCurrentTextIndex(prev => (prev + 1) % loadingTexts.length);
    }, ANIMATION_DURATION / 2);

    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = (elapsedTime / ANIMATION_DURATION) * 100;
      
      if (calculatedProgress >= 100) {
        setProgress(100);
        clearInterval(progressInterval);
      } else {
        setProgress(calculatedProgress);
      }
    }, 50);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background-900 flex items-center justify-center z-50"
    >
      {/* Ambient background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -inset-20 bg-accent-300/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative text-center space-y-12 px-4 max-w-md mx-auto">
        <VaporAnimation />

        <div className="space-y-8">
          <div className="h-6 relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="absolute inset-x-0 text-neutral-400"
              >
                {loadingTexts[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="relative h-1 bg-background-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-300 to-accent-400"
              style={{ width: `${progress}%` }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;