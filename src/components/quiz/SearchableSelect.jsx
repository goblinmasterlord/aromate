import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { fragranceNotes } from '../../data/fragranceNotes';

const SearchableSelect = ({ selectedNotes, onChange, maxSelections }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const filteredNotes = searchTerm ? 
    Object.entries(fragranceNotes).reduce((acc, [category, notes]) => {
      const filtered = notes.filter(note => 
        note.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length) acc[category] = filtered;
      return acc;
    }, {}) 
    : fragranceNotes;

  const handleNoteSelect = (note) => {
    if (selectedNotes.includes(note)) {
      onChange(selectedNotes.filter(n => n !== note));
    } else if (selectedNotes.length < maxSelections) {
      onChange([...selectedNotes, note]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearching(true);
          }}
          placeholder="Search notes..."
          className="w-full px-4 py-3 pl-10 bg-background-800/50 border border-neutral-800/50 
                     rounded-lg text-white placeholder-neutral-500 focus:outline-none 
                     focus:border-accent-300/50 transition-colors"
        />
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-neutral-500" />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsSearching(false);
              searchInputRef.current?.focus();
            }}
            className="absolute right-3 top-3.5 p-0.5 rounded-full 
                       hover:bg-neutral-700/30 transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        )}
      </div>

      {/* Selected Notes */}
      {selectedNotes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedNotes.map(note => (
            <motion.span
              key={note}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                         bg-accent-300/10 border border-accent-300/20 text-sm text-accent-300"
            >
              {note}
              <button
                onClick={() => handleNoteSelect(note)}
                className="p-0.5 rounded-full hover:bg-accent-300/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* Notes Categories */}
      <div className="space-y-4">
        {Object.entries(filteredNotes).map(([category, notes]) => (
          <motion.div
            key={category}
            initial={false}
            animate={{ height: 'auto' }}
            className="space-y-2"
          >
            <button
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-neutral-800/30 
                         transition-colors flex items-center justify-between"
            >
              <span className="text-sm font-medium text-white">{category}</span>
              <span className="text-xs text-neutral-500">{notes.length} notes</span>
            </button>

            <AnimatePresence>
              {(activeCategory === category || isSearching) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2"
                >
                  {notes.map(note => (
                    <motion.button
                      key={note}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNoteSelect(note)}
                      className={`
                        px-3 py-2 rounded-lg text-sm text-left transition-all
                        flex items-center justify-between gap-2
                        ${selectedNotes.includes(note)
                          ? 'bg-accent-300/10 text-accent-300 border border-accent-300/20'
                          : 'bg-background-800/30 text-neutral-300 border border-neutral-800/50 hover:border-neutral-700'
                        }
                        ${selectedNotes.length >= maxSelections && !selectedNotes.includes(note)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                        }
                      `}
                      disabled={selectedNotes.length >= maxSelections && !selectedNotes.includes(note)}
                    >
                      <span>{note}</span>
                      {selectedNotes.includes(note) && (
                        <Check className="w-4 h-4 shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchableSelect;
