import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Clock, Wind, Droplets, 
  Sun, Heart, Compass, Gem, 
  ArrowDownCircle, TestTubes, Package, Beaker, 
  Calendar, 
  Flower2, Leaf, Briefcase, Flame, CloudSun, Palette
} from 'lucide-react';
import PerfumeCard from '../components/results/PerfumeCard';
import { preferenceDetails as educationalPreferenceDetails } from "../data/preferenceDetails";
import PreferenceTooltip from '../components/results/PreferenceTooltip';


const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recommendations = location.state?.recommendations || [];
  const answers = location.state?.answers || {};

  // Debug log to see what data we're receiving
  console.log('Answers received:', answers);

  // If no recommendations are found, redirect to quiz
  React.useEffect(() => {
    if (!location.state?.recommendations) {
      navigate('/quiz');
    }
  }, [location.state, navigate]);

  // Enhanced preference details with more specific info
  const preferenceDetails = {
    type: {
      icon: <Palette className="w-4 h-4" />,
      title: "Fragrance Type",
      description: "Your preferred fragrance family"
    },
    season: {
      icon: <CloudSun className="w-4 h-4" />,
      title: "Season",
      description: "When to wear"
    },
    occasion: {
      icon: <Calendar className="w-4 h-4" />,
      title: "Occasion",
      description: "Perfect moments"
    },
    notes: {
      icon: <Flower2 className="w-4 h-4" />,
      title: "Notes",
      description: "Your signature scents",
      // Special handling for notes
      formatValue: (notes) => ({
        liked: notes.liked || [],
        disliked: notes.disliked || []
      })
    }
  };

  const PreferenceChip = ({ detail, value, onClick }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative px-4 py-2 rounded-xl bg-background-800/50 
                 border border-violet-400/10 hover:border-violet-400/20 
                 transition-colors duration-300"
    >
      <div className="flex items-center gap-2">
        <span className="text-violet-400 group-hover:text-violet-300 transition-colors">
          {detail.icon}
        </span>
        <span className="text-sm font-medium text-white">
          {Array.isArray(value) ? value.join(', ') : value}
        </span>
      </div>
    </motion.button>
  );

  const [activeStep, setActiveStep] = useState(null);

  const preferenceSteps = [
    {
      key: 'type',
      icon: <Palette className="w-4 h-4" />,
      title: "Fragrance Type",
      color: "from-violet-400 to-fuchsia-400",
      insight: "Your foundation: elegant and sophisticated",
      getValue: (answers) => answers.type || 'Not specified'
    },
    {
      key: 'season',
      icon: <CloudSun className="w-4 h-4" />,
      title: "Perfect Season",
      color: "from-fuchsia-400 to-amber-400",
      insight: "When your fragrance shines brightest",
      getValue: (answers) => answers.season || 'Not specified'
    },
    {
      key: 'occasion',
      icon: <Calendar className="w-4 h-4" />,
      title: "Ideal Moments",
      color: "from-amber-400 to-violet-400",
      insight: "Crafted for your special times",
      getValue: (answers) => Array.isArray(answers.occasion) ? 
        answers.occasion.join(', ') : 
        (answers.occasion || 'Not specified')
    },
    {
      key: 'notes',
      icon: <Flower2 className="w-4 h-4" />,
      title: "Signature Notes",
      color: "from-violet-400 to-fuchsia-400",
      insight: "The essence of your unique taste",
      getValue: (answers) => {
        const notes = answers.notes || { liked: [], disliked: [] };
        return `${notes.liked?.length || 0} liked · ${notes.disliked?.length || 0} disliked`;
      }
    }
  ];

  // Filter steps based on available answers
  const availableSteps = preferenceSteps.filter(step => 
    answers[step.key] !== undefined && answers[step.key] !== null
  );

  const getEducationalContent = (step, value) => {
    if (step.key === 'notes') {
      return "Your unique combination of liked and disliked notes creates a personalized scent profile that's truly yours";
    }
    return preferenceDetails[step.key]?.educational[value] || 
           "Discover how this preference shapes your perfect fragrance";
  };

  const renderStepContent = (step, answers) => {
    if (step.key === 'notes' && answers.notes) {
      return (
        <div className="space-y-4">
          {answers.notes.liked?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-violet-400 mb-2">Liked Notes</h4>
              <div className="flex flex-wrap gap-2">
                {answers.notes.liked.map(note => (
                  <motion.span
                    key={note}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 text-xs rounded-full 
                             bg-violet-400/10 text-violet-300"
                  >
                    {note}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
          {answers.notes.disliked?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-neutral-400 mb-2">Disliked Notes</h4>
              <div className="flex flex-wrap gap-2">
                {answers.notes.disliked.map(note => (
                  <motion.span
                    key={note}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 text-xs rounded-full 
                             bg-neutral-400/10 text-neutral-300"
                  >
                    {note}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // For other steps, show educational content
    return (
      <div className="space-y-3">
        <p className="text-sm text-neutral-300">
          {getEducationalContent(step, answers[step.key])}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-px flex-grow bg-gradient-to-r from-violet-400/20 to-transparent" />
          <span className="text-xs text-violet-400">Did you know?</span>
          <div className="h-px flex-grow bg-gradient-to-l from-violet-400/20 to-transparent" />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background-900 pt-20 pb-12 px-4"
    >
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-white via-white to-neutral-400 
                             bg-clip-text text-transparent">
                Your Perfect Matches
              </span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Based on your unique preferences, we've curated a selection of fragrances 
              that align perfectly with your taste profile.
            </p>
          </motion.div>
        </div>

        {/* Recommendations Grid - Now first */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((perfume, index) => (
            <PerfumeCard 
              key={perfume.id} 
              perfume={perfume} 
              index={index}
              userPreferences={answers}
            />
          ))}
        </div>

        {/* Journey Section - Now after matches */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          {/* Section Header */}
          <div className="text-center space-y-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                        bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 
                        border border-violet-400/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 
                             bg-clip-text text-transparent">
                Your Journey
              </span>
            </motion.div>
            
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 
                             bg-clip-text text-transparent">
                Your Fragrance Story
              </span>
            </h2>
            
            <p className="text-neutral-400 max-w-2xl mx-auto">
              We've crafted your perfect fragrance journey based on these carefully selected preferences
            </p>
          </div>

          {/* Connection Line */}
          <div className="absolute left-1/2 top-32 bottom-0 w-px bg-gradient-to-b from-violet-400/20 via-fuchsia-400/20 to-violet-400/20" />

          {/* Journey Steps - existing code but update notes rendering */}
          <div className="relative flex flex-col items-center gap-3">
            {availableSteps.map((step, index) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative w-full max-w-lg"
              >
                <motion.div
                  className="group relative w-full"
                  onHoverStart={() => setActiveStep(step.key)}
                  onHoverEnd={() => setActiveStep(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Step Card */}
                  <div className="relative flex items-center gap-4 p-3 rounded-xl 
                                bg-background-800/50 backdrop-blur-sm border border-violet-400/10
                                hover:border-violet-400/20 transition-all duration-300">
                    {/* Connection Point */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                                  w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                    
                    {/* Icon Container */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg 
                                  bg-gradient-to-r ${step.color} bg-opacity-10 
                                  flex items-center justify-center`}>
                      <div className="text-white">{step.icon}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-400">
                          {step.title}
                        </span>
                        <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 
                                       bg-clip-text text-transparent">
                          {step.getValue(answers)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tooltip */}
                  <PreferenceTooltip 
                    isVisible={activeStep === step.key}
                    content={educationalPreferenceDetails[step.key]?.educational?.[answers[step.key]] || 
                            "Discover how this preference shapes your perfect fragrance"}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Improved Coming Soon Section */}
        <div id="coming-soon-section" className="relative">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 via-fuchsia-400/5 to-background-900" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute w-full h-full">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
            </div>
          </div>

          <div className="relative px-8 py-20 rounded-3xl border border-violet-400/10">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              {/* Header */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 
                            border border-violet-400/20 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 
                                 bg-clip-text text-transparent">
                    Coming Soon
                  </span>
                </motion.div>
                
                <h2 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 
                                 bg-clip-text text-transparent">
                    Experience Your Matches
                  </span>
                </h2>
                
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                  Soon you'll be able to try your perfectly matched fragrances with our curated sample kits, 
                  delivered right to your door.
                </p>
              </div>

              {/* Feature Cards - Fixed layout shift */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: TestTubes,
                    title: "Curated Samples",
                    description: "Receive your top matches in elegant sample vials"
                  },
                  {
                    icon: Package,
                    title: "Premium Kit",
                    description: "Beautifully packaged in a collector's box"
                  },
                  {
                    icon: Beaker,
                    title: "Try Before You Buy",
                    description: "Experience each fragrance before committing"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Pre-allocate space for hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 to-fuchsia-400/10 
                                  rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-8 rounded-xl border border-violet-400/10 
                                  bg-background-800/50 backdrop-blur-sm
                                  hover:border-violet-400/20 transition-colors duration-300
                                  transform-gpu group-hover:scale-[1.02] group-hover:-translate-y-1
                                  will-change-transform"
                  >
                    <feature.icon className="w-8 h-8 text-violet-400 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                    <p className="text-neutral-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Results;