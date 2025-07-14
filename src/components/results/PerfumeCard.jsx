// PerfumeCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Wind, ChevronDown, Sparkles, Heart } from 'lucide-react';

const PerfumeCard = ({ perfume, index, userPreferences }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!perfume) return null;

  // Get top 3 match reasons in a more user-friendly way
  const getMatchHighlights = () => {
    if (!perfume.matchReasons || perfume.matchReasons.length === 0) return [];
    
    // Simplify and make reasons more conversational
    return perfume.matchReasons.slice(0, 3).map(reason => {
      // Transform technical reasons into user-friendly language
      if (reason.includes('Perfect match for')) {
        return reason.replace('Perfect match for', 'Matches your');
      }
      if (reason.includes('Contains notes similar to')) {
        return reason.replace('Contains notes similar to your preferences:', 'Features your favorite notes:');
      }
      return reason;
    });
  };

  const matchHighlights = getMatchHighlights();

  // Format notes in a more elegant way - limit to 2 for space
  const formatNotes = (notes) => {
    return notes.slice(0, 2).map(note => 
      note.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative w-full"
    >
      <div className={`relative bg-background-800/30 backdrop-blur-sm rounded-2xl 
                     border border-neutral-800/30 overflow-hidden
                     hover:border-neutral-700/40 transition-all duration-300
                     ${index === 0 ? 'ring-1 ring-violet-400/20' : ''}`}>
        
        {/* Clean Header Section */}
        <div className="p-6 space-y-4">
          {/* Title & Score */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-medium text-white">
                {perfume.name}
              </h3>
              <p className="text-sm text-neutral-500">{perfume.brand}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light text-white">{perfume.score}</span>
                <span className="text-sm text-neutral-500">%</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {index === 0 && (
                  <>
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span className="text-xs text-violet-400">Best Match</span>
                  </>
                )}
                {index !== 0 && (
                  <span className="text-xs text-neutral-500">match</span>
                )}
              </div>
            </div>
          </div>

          {/* Primary Match Reason - Simplified */}
          {matchHighlights.length > 0 && (
            <div className="py-3 px-4 rounded-lg bg-neutral-800/30 border border-neutral-700/30">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-sm text-neutral-200">
                  {matchHighlights[0]}
                </p>
                {matchHighlights.length > 1 && (
                  <span className="text-xs text-neutral-500 ml-auto">
                    +{matchHighlights.length - 1} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Modern Notes Display - Compact */}
          <div className="space-y-2">
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 mb-1.5">Top</p>
                <p className="text-sm text-neutral-300 truncate">
                  {formatNotes(perfume.notes.top).join(', ')}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 mb-1.5">Base</p>
                <p className="text-sm text-neutral-300 truncate">
                  {formatNotes(perfume.notes.base).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Simplified Characteristics - More Compact */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-neutral-500" />
              <span className="text-xs text-neutral-400">Intensity</span>
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-2.5 rounded-full ${
                      i < Math.round(perfume.characteristics.intensity / 2.5)
                        ? 'bg-violet-400/60'
                        : 'bg-neutral-700/40'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-neutral-500" />
              <span className="text-xs text-neutral-400">Longevity</span>
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-2.5 rounded-full ${
                      i < Math.round(perfume.characteristics.longevity / 2.5)
                        ? 'bg-violet-400/60'
                        : 'bg-neutral-700/40'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Wind className="w-3 h-3 text-neutral-500" />
              <span className="text-xs text-neutral-400">Sillage</span>
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-2.5 rounded-full ${
                      i < Math.round(perfume.characteristics.sillage / 2.5)
                        ? 'bg-violet-400/60'
                        : 'bg-neutral-700/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clean Expand Button */}
        {(matchHighlights.length > 1 || perfume.notes.middle.length > 0) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-3 flex items-center justify-center
                     text-neutral-500 hover:text-neutral-400 
                     transition-all duration-200"
          >
            <span className="text-xs">
              {isExpanded ? 'Less' : 'More details'}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        )}

        {/* Expanded Details - Clean & Educational */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6 border-t border-neutral-800/30">
                {/* Why It Matches */}
                {matchHighlights.length > 1 && (
                  <div className="space-y-3 pt-6">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Why it matches
                    </h4>
                    <div className="space-y-2">
                      {matchHighlights.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                          <p className="text-sm text-neutral-300">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Composition */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Full composition
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-neutral-600">Top</p>
                      <div className="space-y-1">
                        {perfume.notes.top.map((note, i) => (
                          <p key={i} className="text-sm text-neutral-300 capitalize">
                            {note}
                          </p>
                        ))}
                      </div>
                    </div>
                    {perfume.notes.middle.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-neutral-600">Heart</p>
                        <div className="space-y-1">
                          {perfume.notes.middle.map((note, i) => (
                            <p key={i} className="text-sm text-neutral-300 capitalize">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-xs text-neutral-600">Base</p>
                      <div className="space-y-1">
                        {perfume.notes.base.map((note, i) => (
                          <p key={i} className="text-sm text-neutral-300 capitalize">
                            {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PerfumeCard;