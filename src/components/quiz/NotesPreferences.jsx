// NotesPreference.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  ChevronRight, 
  Info,
  Star, 
  Flower, 
  Trees, 
  Moon, 
  Flame, 
  Apple, 
  Leaf, 
  Cookie, 
  Droplets, 
  Mountain, 
  Sparkles 
} from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { noteIcons } from '../../data/noteIcons';
import { fragranceNotes } from '../../data/fragranceNotes';

const NoteIcon = ({ noteId }) => {
  const iconData = noteIcons[noteId];
  if (!iconData) return null;
  
  const Icon = iconData.icon;
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-background-900/50 ${iconData.color}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
};

// Define note conflicts based on fragrance expertise
// These are notes that typically clash or create unpleasant combinations
const noteConflicts = {
  'Vanilla': ['Marine Notes', 'Green Tea', 'Cucumber'],
  'Leather': ['Fresh', 'Baby Powder', 'Cotton'],
  'Oud': ['Light Citrus', 'Green Apple', 'Melon'],
  'Tobacco': ['Fruity', 'Raspberry', 'Peach'],
  'Marine Notes': ['Vanilla', 'Chocolate', 'Caramel'],
  'Chocolate': ['Marine Notes', 'Grass', 'Green Tea'],
  'Patchouli': ['Light Florals', 'Baby Powder'],
  'Musk': ['Fresh Citrus', 'Cucumber'],
  'Incense': ['Fruity', 'Sweet Florals']
};

const NotesPreference = ({ onComplete, onChange, initialNotes }) => {
  const [likedNotes, setLikedNotes] = useState(initialNotes?.liked || []);
  const [dislikedNotes, setDislikedNotes] = useState(initialNotes?.disliked || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const resultsRef = useRef(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [conflictWarning, setConflictWarning] = useState('');

  // Call onChange whenever notes change
  useEffect(() => {
    if (onChange) {
      onChange({ liked: likedNotes, disliked: dislikedNotes });
    }
  }, [likedNotes, dislikedNotes, onChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInSearch = searchContainerRef.current?.contains(event.target);
      const isClickInResults = resultsRef.current?.contains(event.target);
      const isClickInButton = event.target.closest('button'); // Check if click is on any button
      
      // Only close search if clicking outside search area AND results
      // AND not clicking on a like/dislike button
      if (!isClickInSearch && !isClickInResults && !isClickInButton) {
        setShowSearch(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
    searchRef.current?.focus();
  };

  const checkForConflicts = (note, currentLikedNotes) => {
    const conflicts = [];
    
    // Check if this note conflicts with already selected notes
    currentLikedNotes.forEach(likedNote => {
      if (noteConflicts[likedNote]?.includes(note)) {
        conflicts.push(`${note} conflicts with ${likedNote}`);
      }
      if (noteConflicts[note]?.includes(likedNote)) {
        conflicts.push(`${note} conflicts with ${likedNote}`);
      }
    });
    
    return conflicts;
  };

  const handleNoteSelect = (note) => {
    if (likedNotes.includes(note)) {
      setLikedNotes(likedNotes.filter(n => n !== note));
      setShowLimitWarning(false);
    } else if (dislikedNotes.includes(note)) {
      setDislikedNotes(dislikedNotes.filter(n => n !== note));
    } else {
      // Check 3-note limit
      if (likedNotes.length >= 3) {
        setShowLimitWarning(true);
        setTimeout(() => setShowLimitWarning(false), 3000);
        return;
      }
      
      // Check for conflicts
      const conflicts = checkForConflicts(note, likedNotes);
      if (conflicts.length > 0) {
        setConflictWarning(`${note} doesn't pair well with your selected notes`);
        setTimeout(() => setConflictWarning(''), 3000);
        return;
      }
      
      setLikedNotes([...likedNotes, note]);
      setShowLimitWarning(false);
    }
  };

  const handleNoteDislike = (note) => {
    if (dislikedNotes.includes(note)) {
      setDislikedNotes(dislikedNotes.filter(n => n !== note));
    } else if (likedNotes.includes(note)) {
      setLikedNotes(likedNotes.filter(n => n !== note));
    } else {
      setDislikedNotes([...dislikedNotes, note]);
    }
  };

  const handleSkip = () => {
    onComplete({ liked: [], disliked: [] });
  };

  // Filter notes based on search
  const filteredNotes = searchTerm 
    ? Object.entries(fragranceNotes).reduce((acc, [category, notes]) => {
        const filtered = notes.filter(note => 
          note.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length) acc[category] = filtered;
        return acc;
      }, {})
    : { [activeCategory]: fragranceNotes[activeCategory] };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-24">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-display font-bold text-white">
          Fragrance Notes
        </h2>
        <p className="text-neutral-400 max-w-lg mx-auto text-lg">
          Select up to <span className="text-violet-400 font-medium">3 notes</span> you love and any you'd rather avoid.
        </p>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < likedNotes.length 
                    ? 'bg-violet-400' 
                    : 'bg-neutral-700'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-neutral-500 ml-2">
            {likedNotes.length}/3 selected
          </span>
        </div>

        {/* Warnings */}
        <AnimatePresence mode="wait">
          {showLimitWarning && (
            <motion.div
              key="limit"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-sm"
            >
              <Info className="w-4 h-4" />
              You can select up to 3 favorite notes
            </motion.div>
          )}
          {conflictWarning && (
            <motion.div
              key="conflict"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-400/10 text-rose-400 text-sm"
            >
              <Info className="w-4 h-4" />
              {conflictWarning}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories Bar with Search Toggle */}
      <div className="sticky top-0 z-10 bg-background-900/95 backdrop-blur-md py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
            {Object.entries(fragranceNotes).map(([category]) => (
              <CategoryButton
                key={category}
                category={category}
                isActive={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              />
            ))}
          </div>
          
          {/* Improved Search Button & Input with better design */}
          <div className="relative flex items-center" ref={searchContainerRef}>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden mr-2"
                >
                  <div className="relative group">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search notes..."
                      className="w-full h-10 pl-10 pr-12
                               bg-background-800/40 
                               border-0 rounded-xl
                               text-white placeholder-neutral-500
                               focus:outline-none focus:ring-0
                               transition-all duration-200
                               backdrop-blur-sm"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    
                    {/* Clear button with animation */}
                    <AnimatePresence>
                      {searchTerm && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          onClick={handleClearSearch}
                          className="absolute right-3 top-1/2 -translate-y-1/2
                                   p-1 rounded-full
                                   text-neutral-500 hover:text-neutral-300
                                   hover:bg-neutral-800/50
                                   transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2.5 rounded-xl transition-all duration-300 ease-out
                ${showSearch 
                  ? 'bg-violet-400/10 text-violet-400 hover:bg-violet-400/20' 
                  : 'hover:bg-background-800/40 text-neutral-400 hover:text-white'
                }`}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div ref={resultsRef} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(filteredNotes).map(([category, notes]) => (
          <React.Fragment key={category}>
            {notes.map(note => (
              <motion.div
                key={note}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group relative"
              >
                <div className={`p-4 rounded-xl border transition-all duration-200
                  ${likedNotes.includes(note)
                    ? 'bg-violet-400/10 border-violet-400/20'
                    : dislikedNotes.includes(note)
                    ? 'bg-neutral-500/10 border-neutral-500/20'
                    : 'bg-background-800/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-medium
                      ${likedNotes.includes(note)
                        ? 'text-violet-400'
                        : dislikedNotes.includes(note)
                        ? 'text-neutral-500'
                        : 'text-white'
                      }`}
                    >
                      {note}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleNoteSelect(note)}
                        className={`p-2 rounded-lg transition-colors
                          ${likedNotes.includes(note)
                            ? 'text-violet-400 bg-violet-400/10'
                            : 'text-neutral-400 hover:text-violet-400 hover:bg-violet-400/10'
                          }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleNoteDislike(note)}
                        className={`p-2 rounded-lg transition-colors
                          ${dislikedNotes.includes(note)
                            ? 'text-neutral-500 bg-neutral-500/10'
                            : 'text-neutral-400 hover:text-neutral-500 hover:bg-neutral-500/10'
                          }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Removed navigation buttons - handled by Quiz.jsx sticky nav */}

      {/* Selected Notes Summary (replaces info box) */}
      <AnimatePresence>
        {(likedNotes.length > 0 || dislikedNotes.length > 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 p-4 rounded-xl bg-background-800/40 backdrop-blur-sm border border-neutral-800/50"
          >
            <div className="flex gap-8">
              {/* Liked Notes */}
              {likedNotes.length > 0 && (
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsUp className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-medium text-violet-400">
                      Liked Notes ({likedNotes.length}/3)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {likedNotes.map(note => (
                      <motion.span
                        key={note}
                        layout
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                 bg-violet-400/10 border border-violet-400/20 
                                 text-sm text-violet-400"
                      >
                        {note}
                        <button
                          onClick={() => handleNoteSelect(note)}
                          className="hover:text-violet-500 p-0.5 rounded-full hover:bg-violet-400/10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Disliked Notes */}
              {dislikedNotes.length > 0 && (
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsDown className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-500">
                      Disliked Notes ({dislikedNotes.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dislikedNotes.map(note => (
                      <motion.span
                        key={note}
                        layout
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                 bg-neutral-500/10 border border-neutral-500/20 
                                 text-sm text-neutral-400"
                      >
                        {note}
                        <button
                          onClick={() => handleNoteDislike(note)}
                          className="hover:text-neutral-300 p-0.5 rounded-full hover:bg-neutral-500/10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// CategoryButton component
const CategoryButton = ({ category, isActive, onClick }) => {
  let icon;
  switch(category) {
    case 'Popular':
      icon = <Star className="w-4 h-4" />;
      break;
    case 'Citrus':
      icon = <Leaf className="w-4 h-4" />;
      break;
    case 'Floral':
      icon = <Flower className="w-4 h-4" />;
      break;
    case 'Woody':
      icon = <Trees className="w-4 h-4" />;
      break;
    case 'Oriental':
      icon = <Moon className="w-4 h-4" />;
      break;
    case 'Spicy':
      icon = <Flame className="w-4 h-4" />;
      break;
    case 'Fruity':
      icon = <Apple className="w-4 h-4" />;
      break;
    case 'Green':
      icon = <Leaf className="w-4 h-4" />;
      break;
    case 'Gourmand':
      icon = <Cookie className="w-4 h-4" />;
      break;
    case 'Marine':
      icon = <Droplets className="w-4 h-4" />;
      break;
    case 'Earthy':
      icon = <Mountain className="w-4 h-4" />;
      break;
    default:
      icon = <Sparkles className="w-4 h-4" />;
  }
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                 transition-all duration-300 ease-out flex items-center gap-2`}
    >
      {/* Background layer with smooth transition */}
      <motion.div
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="absolute inset-0 rounded-lg bg-violet-400/10 border border-violet-400/20"
      />
      
      {/* Content layer */}
      <span className={`relative z-10 transition-colors duration-300 ${
        isActive ? 'text-violet-400' : 'text-neutral-400 group-hover:text-neutral-300'
      }`}>
        {icon}
      </span>
      <span className={`relative z-10 transition-colors duration-300 ${
        isActive ? 'text-violet-400' : 'text-neutral-400 group-hover:text-neutral-300'
      }`}>
        {category}
      </span>
    </motion.button>
  );
};

export default NotesPreference;