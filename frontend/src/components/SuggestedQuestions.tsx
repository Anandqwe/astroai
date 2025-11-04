import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaGlobe, FaMoon, FaMeteor, FaSatellite } from 'react-icons/fa';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const suggestedQuestions = [
  {
    question: "What is a black hole?",
    icon: <FaMoon />,
    category: "Cosmology"
  },
  {
    question: "Tell me about Mars rovers",
    icon: <FaRocket />,
    category: "Mars"
  },
  {
    question: "How far is the nearest star?",
    icon: <FaGlobe />,
    category: "Stars"
  },
  {
    question: "Explain asteroid impacts",
    icon: <FaMeteor />,
    category: "Asteroids"
  },
  {
    question: "What is the James Webb telescope?",
    icon: <FaSatellite />,
    category: "Telescopes"
  },
  {
    question: "How do planets form?",
    icon: <FaGlobe />,
    category: "Planets"
  }
];

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionClick }) => {
  return (
    <div className="mb-6">
      <motion.p
        className="text-sm text-gray-400 mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Try asking:
      </motion.p>
      <div className="flex flex-wrap gap-3 justify-center">
        {suggestedQuestions.map((item, index) => (
          <motion.button
            key={index}
            className="group px-4 py-2.5 bg-dark-card/60 hover:bg-dark-card border border-primary/20 hover:border-primary/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
            onClick={() => onQuestionClick(item.question)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10"
              transition={{ duration: 0.3 }}
            />
            
            {/* Icon */}
            <span className="text-primary relative z-10">
              {item.icon}
            </span>
            
            {/* Question text */}
            <span className="relative z-10 font-medium">
              {item.question}
            </span>
            
            {/* Hover effect */}
            <motion.span
              className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;

