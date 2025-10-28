import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <motion.label
          className="text-gray-300 font-rajdhani text-sm font-semibold"
          animate={{
            color: isFocused ? '#7c3aed' : '#d1d5db',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <InputComponent
          type={type === 'textarea' ? undefined : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg font-rajdhani text-white
            bg-dark-darker/50 backdrop-blur-sm
            border-2 transition-all duration-300
            ${error 
              ? 'border-red-500 focus:border-red-400' 
              : isFocused
              ? 'border-primary shadow-lg shadow-primary/20'
              : 'border-gray-600 hover:border-gray-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
            ${type === 'textarea' ? 'resize-none h-12 focus:h-20 transition-all' : ''}
            focus:outline-none
          `}
        />

        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: isFocused
              ? 'inset 0 0 20px rgba(124, 58, 237, 0.2)'
              : 'inset 0 0 0px rgba(124, 58, 237, 0)',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.p
          className="text-red-400 text-sm font-rajdhani"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedInput;
