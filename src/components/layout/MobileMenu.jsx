// MobileMenu.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  Home,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/',
      description: 'Return to the homepage'
    },
    { 
      icon: Search, 
      label: 'Find Your Perfume', 
      path: '/quiz',
      description: 'Take our quiz to get personalized recommendations'
    }
  ];

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        onClick={onClose}
        className={`group flex items-start gap-4 p-4 rounded-xl 
                   transition-all duration-200 ${
          isActive 
            ? 'bg-accent-300/10 border border-accent-300/20'
            : 'hover:bg-background-800/60 border border-transparent'
        }`}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                      ${isActive 
                        ? 'bg-accent-300/10 text-accent-300'
                        : 'bg-background-800/50 text-neutral-400 group-hover:text-white'
                      }`}>
          <item.icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${
              isActive ? 'text-accent-300' : 'text-white'
            }`}>
              {item.label}
            </span>
            <ArrowRight className={`w-4 h-4 opacity-0 -translate-x-2
                                transition-all duration-200
                                group-hover:opacity-100 group-hover:translate-x-0
                                ${isActive ? 'text-accent-300' : 'text-neutral-400'}`} />
          </div>
          <p className="text-sm text-neutral-400 mt-0.5">{item.description}</p>
        </div>
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background-900/80 backdrop-blur-md z-40"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300
            }}
            className="fixed inset-y-0 left-0 w-full sm:w-80 z-50 
                     bg-background-900/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-300/20 blur-lg" />
                    <Sparkles className="w-6 h-6 text-accent-300 relative z-10" />
                  </div>
                  <span className="font-semibold text-white">Aromate</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-neutral-400 
                           hover:text-white hover:bg-neutral-800/50
                           transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item) => (
                <MenuItem key={item.path} item={item} />
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex flex-col items-center text-center p-4 rounded-xl 
                           bg-background-800/50 border border-neutral-800/50">
                <div className="w-10 h-10 rounded-full bg-accent-300/10 
                            flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-accent-300" />
                </div>
                <p className="text-sm text-neutral-400">
                  Find your signature scent with our personalized fragrance quiz
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;