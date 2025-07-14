import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import QuizInfoPanel from '../components/quiz/QuizInfoPanel';
import { quizQuestions } from '../data/quizQuestions.jsx';
import QuizOption from '../components/quiz/QuizOption';
import NotesPreferences from '../components/quiz/NotesPreferences';
import { getRecommendations } from '../utils/recommendationEngine';

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = quizQuestions[currentStep];

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && answers[currentQuestion.id]) {
        handleNext();
      } else if (e.key === 'Enter' && answers[currentQuestion.id]) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, answers]);

  // Handle going to previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle going to next question (keyboard navigation)
  const handleNext = async () => {
    if (answers[currentQuestion.id] !== undefined) {
      if (currentStep < quizQuestions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Complete quiz - trigger the full completion flow
        await handleQuizComplete();
      }
    }
  };

  const handleAnswer = async (answer) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answer
    };
    setAnswers(newAnswers);
    
    // Don't auto-advance anymore - user controls navigation
    if (currentStep === quizQuestions.length - 1) {
      try {
        setIsLoading(true);

        // Get recommendations first
        console.log('[Quiz] Getting recommendations with answers:', newAnswers);
        const results = getRecommendations(newAnswers);
        console.log('[Quiz] Recommendations received:', results.length);

        // Show loading screen for minimum duration
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Navigate with both answers and recommendations
        navigate('/results', { 
          state: { 
            recommendations: results,
            answers: newAnswers 
          } 
        });
      } catch (error) {
        console.error('Error completing quiz:', error);
        setIsLoading(false);
      }
    }
  };

  // Handle quiz completion
  const handleQuizComplete = async () => {
    try {
      setIsLoading(true);

      // Get recommendations first
      console.log('[Quiz] Getting recommendations with answers:', answers);
      const results = getRecommendations(answers);
      console.log('[Quiz] Recommendations received:', results.length);

      // Show loading screen for minimum duration
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Navigate with both answers and recommendations
      navigate('/results', { 
        state: { 
          recommendations: results,
          answers: answers 
        } 
      });
    } catch (error) {
      console.error('Error completing quiz:', error);
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingScreen />
        </motion.div>
      ) : (
        <motion.div
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-background-900 pt-20 pb-24 px-4 relative"
        >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentQuestion.title}
              </h1>
              {currentQuestion.description && (
                <p className="text-neutral-400">{currentQuestion.description}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {quizQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-accent-300' 
                    : index < currentStep 
                      ? 'w-8 bg-accent-300/50' 
                      : 'w-8 bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion.type === 'notes-preference' ? (
                <NotesPreferences 
                  onComplete={(notes) => {
                    handleAnswer(notes);
                  }}
                  onChange={(notes) => {
                    // Update answers immediately when notes change
                    setAnswers({
                      ...answers,
                      [currentQuestion.id]: notes
                    });
                  }}
                  initialNotes={answers[currentQuestion.id]}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => (
                    <QuizOption
                      key={option.id}
                      option={option}
                      isSelected={
                        Array.isArray(answers[currentQuestion.id])
                          ? answers[currentQuestion.id]?.includes(option.id)
                          : answers[currentQuestion.id] === option.id
                      }
                      onSelect={() => {
                        if (currentQuestion.type === 'multi-select') {
                          const currentAnswers = answers[currentQuestion.id] || [];
                          const newAnswers = currentAnswers.includes(option.id)
                            ? currentAnswers.filter(id => id !== option.id)
                            : [...currentAnswers, option.id].slice(0, currentQuestion.maxSelections || currentAnswers.length + 1);
                          handleAnswer(newAnswers);
                        } else {
                          handleAnswer(option.id);
                        }
                      }}
                      type={currentQuestion.type}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuizInfoPanel currentQuestion={currentQuestion} />
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Fixed Navigation Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-background-900/95 backdrop-blur-xl border-t border-neutral-800/50"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              whileHover={currentStep !== 0 ? { scale: 1.02 } : {}}
              whileTap={currentStep !== 0 ? { scale: 0.98 } : {}}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                ${currentStep === 0 
                  ? 'bg-neutral-800/30 text-neutral-600 cursor-not-allowed' 
                  : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800/70 hover:text-white'}`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-neutral-500">
                Step {currentStep + 1} of {quizQuestions.length}
              </span>
              <div className="flex gap-1">
                {[...Array(quizQuestions.length)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 transition-all duration-300 ${
                      i === currentStep 
                        ? 'w-6 bg-violet-400' 
                        : i < currentStep 
                          ? 'w-6 bg-violet-400/40' 
                          : 'w-6 bg-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Skip button for notes step */}
              {currentQuestion.type === 'notes-preference' && !answers[currentQuestion.id] && (
                <motion.button
                  onClick={() => {
                    handleAnswer({ liked: [], disliked: [] });
                    setTimeout(() => handleNext(), 100);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-neutral-300 
                           bg-neutral-800/30 hover:bg-neutral-800/50 transition-all duration-200"
                >
                  Skip
                </motion.button>
              )}
              
              <motion.button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                whileHover={answers[currentQuestion.id] ? { scale: 1.02 } : {}}
                whileTap={answers[currentQuestion.id] ? { scale: 0.98 } : {}}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                  ${!answers[currentQuestion.id]
                    ? 'bg-violet-400/10 text-violet-400/40 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-violet-400 to-fuchsia-400 text-white shadow-lg shadow-violet-400/25 hover:shadow-violet-400/40'}`}
              >
                {currentStep === quizQuestions.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Quiz;