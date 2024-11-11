import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Clock, Wind, Droplets, 
  Sun, Heart, Compass, Gem, 
  ArrowDownCircle, TestTubes, Package, Beaker, 
  Calendar, 
  Target, 
  Fingerprint, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowRight 
} from 'lucide-react';
import PerfumeCard from '../components/results/PerfumeCard';


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

  const renderJourneyStep = (title, icon, content, colorClass = "violet") => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Timeline Icon */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`w-14 h-14 rounded-full bg-background-800 
                        border-2 border-${colorClass}-400/30 p-0.5`}>
            <div className={`w-full h-full rounded-full bg-${colorClass}-400/10 
                          flex items-center justify-center backdrop-blur-sm`}>
              {icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-r from-${colorClass}-400/10 
                        via-${colorClass}-400/5 to-${colorClass}-400/10 
                        rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                        transition-opacity duration-500`} />
          <div className={`relative p-8 rounded-2xl bg-background-800/50 
                        border border-${colorClass}-400/20 backdrop-blur-sm
                        hover:border-${colorClass}-400/40 transition-all duration-300`}>
            <h3 className="text-lg font-medium mb-6">
              <span className={`bg-gradient-to-r from-${colorClass}-400 
                            to-${colorClass}-300 bg-clip-text text-transparent`}>
                {title}
              </span>
            </h3>
            {content}
          </div>
        </div>
      </motion.div>
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

        {/* Recommendations Grid */}
        <div>
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
          
          {/* Enhanced Scroll Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center space-x-4"
          >
            {/* Existing Sample Kits Button */}
            <motion.button
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full
                       bg-gradient-to-r from-violet-400/10 via-fuchsia-400/10 to-amber-400/10
                       border border-violet-400/20 hover:border-violet-400/40
                       transition-all duration-300"
              onClick={() => document.getElementById('coming-soon-section').scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 
                             bg-clip-text text-transparent">
                Learn More About Sample Kits
              </span>
              <ArrowDownCircle className="w-4 h-4 text-violet-400 group-hover:translate-y-1 transition-transform" />
            </motion.button>

            {/* New Journey Button */}
            <motion.button
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full
                       bg-gradient-to-r from-accent-300/5 via-accent-400/5 to-accent-300/5
                       border border-accent-300/20 hover:border-accent-300/40
                       transition-all duration-300"
              onClick={() => document.getElementById('journey-section').scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm font-medium bg-gradient-to-r from-accent-300 to-accent-400 
                             bg-clip-text text-transparent">
                See Your Fragrance Journey
              </span>
              <Compass className="w-4 h-4 text-accent-300 group-hover:rotate-45 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>

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