import React, { memo } from 'react';
import { motion } from 'framer-motion';

const NebulaClouds: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {/* Purple nebula cloud */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-xl opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Blue nebula cloud */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-xl opacity-8"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          top: '50%',
          right: '15%',
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pink nebula cloud - Added back */}
      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full blur-xl opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
          bottom: '20%',
          left: '25%',
        }}
        animate={{
          x: [0, 35, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 70,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
});

NebulaClouds.displayName = 'NebulaClouds';
export default NebulaClouds;
