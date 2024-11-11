import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles } from 'lucide-react';

const educationalContent = {
  type: {
    title: "The Power of Fragrance Families",
    facts: [
      "Each fragrance family creates distinct emotional responses",
      "Your scent preference is linked to personal memories",
      "Fresh scents can boost energy and mood"
    ]
  },
  season: {
    title: "Why Seasons Matter in Fragrance",
    facts: [
      "Temperature affects how fragrances develop on skin",
      "Lighter scents work better in warm weather",
      "Winter allows for richer, more intense fragrances"
    ]
  },
  occasion: {
    title: "Matching Moments with Scents",
    facts: [
      "Different settings call for different fragrance intensities",
      "Professional environments suit subtle fragrances",
      "Special occasions deserve memorable scents"
    ]
  },
  importance: {
    title: "Understanding Fragrance Characteristics",
    facts: [
      "Sillage determines how far your scent projects",
      "Longevity affects how often you need to reapply",
      "Uniqueness can make your signature scent memorable"
    ]
  },
  notes: {
    title: "The Art of Fragrance Notes",
    facts: [
      "Top notes create first impressions",
      "Heart notes reveal the true character",
      "Base notes provide lasting memory"
    ]
  }
};

const QuizInfoPanel = ({ currentQuestion }) => {
  const content = educationalContent[currentQuestion.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden bg-background-800/30 border border-neutral-800/50"
    >
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-300/70" />
          <h3 className="text-sm font-medium text-neutral-300">{content.title}</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {content.facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2"
            >
              <Lightbulb className="w-3.5 h-3.5 text-accent-300/50 mt-0.5 shrink-0" />
              <p className="text-sm text-neutral-400 leading-relaxed">{fact}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizInfoPanel;