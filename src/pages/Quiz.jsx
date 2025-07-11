import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleAnswer = async (answer) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answer
    };
    setAnswers(newAnswers);
    
    if (currentStep < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    } else {
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background-900 pt-20 pb-12 px-4"
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
                <NotesPreferences onComplete={handleAnswer} />
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
    </motion.div>
  );
};

export default Quiz;