/**
 * Preload utilities for lazy-loaded routes
 * Prefetches page components on hover for instant navigation
 */

type PreloadFunction = () => Promise<{ default: React.ComponentType<any> }>;

const preloadCache = new Set<string>();

/**
 * Preload a lazy-loaded component
 * @param importFn - The lazy import function
 * @param key - Unique key for the component
 */
export const preloadComponent = (importFn: PreloadFunction, key: string): void => {
  // Only preload once per component
  if (preloadCache.has(key)) return;
  
  preloadCache.add(key);
  
  // Start loading the component
  importFn().catch((err) => {
    console.warn(`Failed to preload ${key}:`, err);
    preloadCache.delete(key); // Allow retry on failure
  });
};

/**
 * Preload page components
 */
export const preloadPages = {
  home: () => preloadComponent(() => import('../pages/Home'), 'home'),
  dashboard: () => preloadComponent(() => import('../pages/Dashboard'), 'dashboard'),
  chat: () => preloadComponent(() => import('../pages/Chat'), 'chat'),
  about: () => preloadComponent(() => import('../pages/About'), 'about'),
  favorites: () => preloadComponent(() => import('../pages/Favorites'), 'favorites'),
  prediction: () => preloadComponent(() => import('../pages/Prediction'), 'prediction'),
};

/**
 * Get preload function for a given path
 */
export const getPreloadForPath = (path: string): (() => void) | null => {
  const pathMap: Record<string, () => void> = {
    '/': preloadPages.home,
    '/dashboard': preloadPages.dashboard,
    '/chat': preloadPages.chat,
    '/about': preloadPages.about,
    '/favorites': preloadPages.favorites,
    '/prediction': preloadPages.prediction,
  };
  
  return pathMap[path] || null;
};

