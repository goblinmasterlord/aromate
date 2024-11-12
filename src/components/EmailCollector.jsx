import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader, Check, X } from 'lucide-react';

const EmailCollector = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Gradient border effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 rounded-xl opacity-0 
                        group-hover:opacity-100 blur transition duration-500 ${isFocused ? 'opacity-100' : ''}`} />
        
        {/* Main container */}
        <div className="relative flex items-center p-1 rounded-xl bg-background-800/80 backdrop-blur-sm">
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your email"
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-transparent px-4 py-3 text-white placeholder-neutral-500
                         focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {/* Status icon */}
            <AnimatePresence mode="wait">
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {status === 'loading' && (
                    <Loader className="w-5 h-5 text-violet-400 animate-spin" />
                  )}
                  {status === 'success' && (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                  {status === 'error' && (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading' || status === 'success'}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2
                      transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                      ${status === 'success' 
                        ? 'bg-green-400 text-background-900' 
                        : 'bg-violet-400 text-background-900 hover:bg-violet-300'}`}
          >
            {status === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                Notified
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Notify Me
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Status message */}
      <AnimatePresence mode="wait">
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-400 mt-2 ml-1"
          >
            Please enter a valid email address
          </motion.p>
        )}
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-green-400 mt-2 ml-1"
          >
            Thanks! We'll notify you when samples are available.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailCollector;