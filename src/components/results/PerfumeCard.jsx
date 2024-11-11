// PerfumeCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Droplets, Clock, Wind, ChevronDown } from 'lucide-react';

const PerfumeCard = ({ perfume, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = window.innerWidth < 768;

  if (!perfume) return null;

  const characteristics = [
    {
      icon: <Star className="w-4 h-4" />,
      label: 'Intensity',
      value: perfume.characteristics?.intensity || 0,
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Longevity',
      value: perfume.characteristics?.longevity || 0,
    },
    {
      icon: <Wind className="w-4 h-4" />,
      label: 'Sillage',
      value: perfume.characteristics?.sillage || 0,
    },
  ];

  // Enhanced visual score calculation
  const visualScore = {
    raw: perfume.score,
    display: Math.min(100, Math.round(perfume.score * 1.2)),
    // Gradient based on score and ranking
    gradient: index === 0 
      ? 'from-violet-400 via-fuchsia-400 to-amber-400'
      : perfume.score >= 80 
        ? 'from-emerald-400 via-teal-400 to-emerald-400'
        : 'from-accent-300 via-accent-400 to-accent-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      className="relative group w-full"
    >
      {/* Special treatment for #1 match - Only shows on its own hover */}
      {index === 0 && isHovered && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-400/20 via-fuchsia-400/20 to-amber-400/20 
                      rounded-2xl blur-xl opacity-50 transition-opacity duration-300" />
      )}

      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
          rotateY: isHovered ? 5 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={`relative bg-background-800/80 backdrop-blur-sm rounded-2xl 
                   border border-neutral-800/50 overflow-hidden
                   ${index === 0 ? 'border-l-2 border-l-violet-400/50' : ''}`}
      >
        {/* Integrated Top Match Indicator */}
        {index === 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-400 via-fuchsia-400 to-amber-400">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-violet-400/20 via-fuchsia-400/10 to-transparent blur-xl" />
          </div>
        )}

        <div className="p-6">
          {/* Score Display */}
          <div className="absolute top-4 right-4 w-32">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <motion.span
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-amber-400 text-xs"
                    >
                      ✨
                    </motion.span>
                    <span className="text-xs bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 
                                   bg-clip-text text-transparent font-medium">
                      Best Match
                    </span>
                  </motion.div>
                )}
                <span className={`text-sm font-medium bg-gradient-to-r ${visualScore.gradient} 
                               bg-clip-text text-transparent ml-auto`}>
                  {visualScore.display}%
                </span>
              </div>
              <div className="h-1.5 bg-neutral-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${visualScore.display}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full rounded-full relative bg-gradient-to-r ${visualScore.gradient}`}
                >
                  <div className="absolute inset-0">
                    <motion.div
                      animate={{
                        x: ["0%", "100%"],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Header with enhanced styling for #1 match */}
          <div className="space-y-4">
            <div>
              <h3 className={`text-xl font-semibold transition-colors
                ${index === 0 
                  ? 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent'
                  : 'text-white group-hover:text-accent-300'}`}>
                {perfume.name}
              </h3>
              <p className="text-sm text-neutral-400">{perfume.brand}</p>
            </div>

            <p className="text-sm text-neutral-300">
              A sophisticated fragrance featuring {perfume.notes.top.slice(0, 2).join(', ')} 
              top notes with {perfume.notes.base.slice(0, 2).join(', ')} base notes.
            </p>

            {/* Characteristics */}
            <div className="grid grid-cols-3 gap-4">
              {characteristics.map((char, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    {char.icon}
                    <span className="text-xs">{char.label}</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(char.value / 10) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                      className="h-full bg-accent-300/50 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-300/0 via-accent-300/30 to-accent-300/0 animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Expand Button */}
        {isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 flex items-center justify-center gap-2 
                     border-t border-neutral-800/50 text-neutral-400 
                     hover:text-white transition-colors"
          >
            <span className="text-sm">{isExpanded ? 'Show less' : 'Show more'}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        )}

        {/* Match Reasons - Desktop (Hover) / Mobile (Expand) */}
        <AnimatePresence>
          {((isHovered && !isMobile) || (isExpanded && isMobile)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-neutral-800/50"
            >
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <h4 className={`text-sm font-medium ${
                    index === 0 
                      ? 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent'
                      : 'text-accent-300'
                  }`}>
                    Match Highlights
                  </h4>
                  <ul className="space-y-2">
                    {perfume.matchReasons?.map((reason, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-sm text-neutral-400 flex items-start gap-2"
                      >
                        <div className={`shrink-0 mt-0.5 ${
                          index === 0 
                            ? 'text-fuchsia-400'
                            : 'text-accent-300/50'
                        }`}>
                          <Droplets className="w-4 h-4" />
                        </div>
                        <span>{reason}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced hover effect - Different for top match */}
        <div className={`absolute inset-0 border-2 border-transparent rounded-2xl 
          transition-colors duration-500 ${
            index === 0 
              ? 'group-hover:border-violet-400/30'
              : 'group-hover:border-accent-300/20'
          }`} 
        />
      </motion.div>
    </motion.div>
  );
};

export default PerfumeCard;