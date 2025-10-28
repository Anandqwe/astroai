import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative w-14 h-8 rounded-full transition-colors duration-300
          ${isChecked 
            ? 'bg-gradient-to-r from-primary to-secondary' 
            : 'bg-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        animate={{
          backgroundColor: isChecked ? '#7c3aed' : '#4b5563',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
          animate={{
            x: isChecked ? 24 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 17,
          }}
        />
        
        {/* Inner glow effect when active */}
        {isChecked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      {label && (
        <label className="text-gray-300 font-rajdhani cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;
