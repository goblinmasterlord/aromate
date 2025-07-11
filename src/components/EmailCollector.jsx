import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader, Check, X } from 'lucide-react';

const EmailCollector = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [isFocused, setIsFocused] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (!email) {
      setStatus('error');
      setValidationMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setStatus('error');
      setValidationMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="w-5 h-5 text-violet-400 animate-spin" />;
      case 'success':
        return <Check className="w-5 h-5 text-violet-400" />;
      case 'error':
        return <X className="w-5 h-5 text-violet-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form 
        onSubmit={handleSubmit} 
        className="relative group"
        noValidate // This prevents browser validation
      >
        {/* Gradient border effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-violet-400/50 via-fuchsia-400/50 to-violet-400/50 rounded-xl opacity-0 
                        group-hover:opacity-100 blur transition duration-500 ${isFocused ? 'opacity-100' : ''}`} />
        
        {/* Main container */}
        <div className="relative flex items-center gap-2 p-1.5 rounded-xl bg-background-800/80 backdrop-blur-sm">
          <div className="relative flex-1 flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setValidationMessage('');
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your email"
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-transparent px-4 py-3 text-white placeholder-neutral-500
                       focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {/* Status icon - Centered and with proper spacing */}
            <AnimatePresence mode="wait">
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-4 flex items-center justify-center"
                >
                  {getStatusIcon()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-3 rounded-lg font-medium flex items-center gap-2
                      bg-violet-400 hover:bg-violet-300 text-background-900 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300"
          >
            <Mail className="w-4 h-4" />
            {status === 'success' ? 'Notified' : 'Notify Me'}
          </motion.button>
        </div>

        {/* Custom Validation Message */}
        <AnimatePresence mode="wait">
          {status === 'error' && validationMessage && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-0 right-0 mt-2"
            >
              <div className="flex items-center gap-2 px-1">
                <X className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400">
                  {validationMessage}
                </span>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-0 right-0 mt-2"
            >
              <div className="flex items-center gap-2 px-1">
                <Check className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400">
                  We'll notify you when samples are available
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default EmailCollector;