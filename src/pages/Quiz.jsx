import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import QuizInfoPanel from '../components/quiz/QuizInfoPanel';
import { quizQuestions } from '../data/quizQuestions.jsx';
import QuizOption from '../components/quiz/QuizOption';
import NotesPreferences from '../components/quiz/NotesPreferences';
import { getRecommendations } from '../utils/recommendationEngine';

const EMPTY_NOTES = { liked: [], disliked: [] };

// The notes step is optional (skippable), so it never blocks Next.
const isAnswered = (question, answers) => {
  const value = answers[question.id];
  if (question.type === 'notes-preference') return true;
  if (question.type === 'multi-select') return Array.isArray(value) && value.length > 0;
  return value !== undefined && value !== null;
};

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [limitWarning, setLimitWarning] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const canAdvance = isAnswered(currentQuestion, answers);
  const isLastStep = currentStep === quizQuestions.length - 1;

  const completeQuiz = async (finalAnswers) => {
    if (isLoading) return;
    try {
      setIsLoading(true);

      console.log('[Quiz] Getting recommendations with answers:', finalAnswers);
      const results = getRecommendations(finalAnswers);
      console.log('[Quiz] Recommendations received:', results.length);

      // Show loading screen for minimum duration
      await new Promise(resolve => setTimeout(resolve, 3000));

      navigate('/results', {
        state: {
          recommendations: results,
          answers: finalAnswers
        }
      });
    } catch (error) {
      console.error('Error completing quiz:', error);
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (!canAdvance || isLoading) return;
    if (isLastStep) {
      completeQuiz({ notes: EMPTY_NOTES, ...answers });
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  // Stable identity matters: NotesPreferences calls this from an effect that
  // depends on it — an inline arrow here caused an infinite update loop.
  const handleNotesChange = React.useCallback((notes) => {
    setAnswers(prev => ({ ...prev, notes }));
  }, []);

  const handleMultiSelect = (optionId) => {
    const current = answers[currentQuestion.id] || [];
    if (current.includes(optionId)) {
      handleAnswer(current.filter(id => id !== optionId));
    } else if (currentQuestion.maxSelections && current.length >= currentQuestion.maxSelections) {
      setLimitWarning(true);
      setTimeout(() => setLimitWarning(false), 3000);
    } else {
      handleAnswer([...current, optionId]);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (isLoading) return;
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && canAdvance) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

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
        {/* One animated container per step keeps transitions atomic */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentQuestion.title}
              </h1>
              {currentQuestion.description && (
                <p className="text-neutral-400">{currentQuestion.description}</p>
              )}

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
              {currentQuestion.type === 'notes-preference' ? (
                <NotesPreferences
                  onChange={handleNotesChange}
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
                          handleMultiSelect(option.id);
                        } else {
                          handleAnswer(option.id);
                        }
                      }}
                      type={currentQuestion.type}
                    />
                  ))}
                </div>
              )}

              <AnimatePresence>
                {limitWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-center"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-sm">
                      <Info className="w-4 h-4" />
                      You can select up to {currentQuestion.maxSelections} occasions — remove one first
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <QuizInfoPanel currentQuestion={currentQuestion} />
            </div>
          </motion.div>
        </AnimatePresence>
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

            <motion.button
              onClick={handleNext}
              disabled={!canAdvance}
              whileHover={canAdvance ? { scale: 1.02 } : {}}
              whileTap={canAdvance ? { scale: 0.98 } : {}}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                ${!canAdvance
                  ? 'bg-violet-400/10 text-violet-400/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-400 to-fuchsia-400 text-white shadow-lg shadow-violet-400/25 hover:shadow-violet-400/40'}`}
            >
              {isLastStep ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Quiz;
