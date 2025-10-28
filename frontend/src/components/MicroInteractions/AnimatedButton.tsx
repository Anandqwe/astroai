import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/50',
    secondary: 'bg-gradient-to-r from-secondary to-accent text-white hover:shadow-lg hover:shadow-secondary/50',
    accent: 'bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg hover:shadow-accent/50',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/30',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      className={`
        relative font-rajdhani font-semibold rounded-lg transition-all duration-300 cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={false}
        animate={{
          boxShadow: [
            'inset 0 0 0px rgba(124, 58, 237, 0)',
            'inset 0 0 20px rgba(124, 58, 237, 0.3)',
          ],
        }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
};

export default AnimatedButton;
