import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
  delay: number;
}

const ShootingStars: React.FC = memo(() => {
  const [stars, setStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    const createShootingStar = () => {
      const newStar: ShootingStar = {
        id: Date.now() + Math.random(),
        startX: Math.random() * 100,
        startY: Math.random() * 40,
        angle: -30 - Math.random() * 30,
        duration: 0.8 + Math.random() * 0.8,
        delay: 0,
      };

      setStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setStars((prev) => prev.filter((star) => star.id !== newStar.id));
      }, (newStar.duration + newStar.delay) * 1000 + 50);
    };

    // Increased frequency - 15% chance every 8 seconds (vs 10% before)
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        createShootingStar();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {stars.map((star) => {
          const length = 100 + Math.random() * 100;
          const radians = (star.angle * Math.PI) / 180;
          const endX = star.startX + Math.cos(radians) * length;
          const endY = star.startY + Math.sin(radians) * length;

          return (
            <motion.div
              key={star.id}
              className="absolute"
              style={{
                left: `${star.startX}%`,
                top: `${star.startY}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                times: [0, 0.1, 0.9, 1],
              }}
            >
              <motion.div
                className="relative"
                initial={{
                  x: 0,
                  y: 0,
                }}
                animate={{
                  x: (endX - star.startX) * window.innerWidth / 100,
                  y: (endY - star.startY) * window.innerHeight / 100,
                }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  ease: "easeIn",
                }}
              >
                {/* Main star */}
                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                
                {/* Trail */}
                <div
                  className="absolute top-1/2 right-full h-0.5 bg-gradient-to-r from-transparent via-white to-white"
                  style={{
                    width: '60px',
                    transform: 'translateY(-50%)',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
});

ShootingStars.displayName = 'ShootingStars';
export default ShootingStars;
