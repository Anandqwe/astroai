import React, { Suspense, lazy } from 'react';

// Lazy load expensive 3D components
const StarfieldBackground = lazy(() =>
  import('./StarfieldBackground').then((module) => ({
    default: module.default,
  }))
);

const NebulaClouds = lazy(() =>
  import('./NebulaClouds').then((module) => ({
    default: module.default,
  }))
);

const ShootingStars = lazy(() =>
  import('./ShootingStars').then((module) => ({
    default: module.default,
  }))
);

// Fallback loading component
const BackgroundLoading: React.FC = () => (
  <div className="fixed inset-0 -z-10 bg-gradient-to-br from-dark via-dark-darker to-dark" />
);

interface BackgroundProvidersProps {
  children: React.ReactNode;
}

/**
 * BackgroundProviders - Lazy loads all background effects with Suspense
 * This reduces initial bundle size and improves first contentful paint
 */
export const BackgroundProviders: React.FC<BackgroundProvidersProps> = ({ children }) => {
  return (
    <>
      <Suspense fallback={<BackgroundLoading />}>
        <StarfieldBackground />
      </Suspense>
      <Suspense fallback={null}>
        <NebulaClouds />
      </Suspense>
      <Suspense fallback={null}>
        <ShootingStars />
      </Suspense>
      {children}
    </>
  );
};

export default BackgroundProviders;
