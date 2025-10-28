import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if user prefers reduced motion
 * Used for accessibility - respects OS/browser motion preferences
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

/**
 * Get animation duration based on accessibility preference
 * Returns 0 if user prefers reduced motion, otherwise returns specified duration
 */
export const getAnimationDuration = (
  duration: number,
  prefersReducedMotion: boolean
): number => {
  return prefersReducedMotion ? 0 : duration;
};

/**
 * Get animation variants for reduced motion accessibility
 * Returns instant animations if user prefers reduced motion
 */
export const getReducedMotionVariants = (
  variants: Record<string, any>,
  prefersReducedMotion: boolean
) => {
  if (!prefersReducedMotion) return variants;

  // Return instant variants
  return Object.keys(variants).reduce((acc, key) => {
    acc[key] = {
      ...variants[key],
      transition: { duration: 0 },
    };
    return acc;
  }, {} as Record<string, any>);
};

export default usePrefersReducedMotion;
