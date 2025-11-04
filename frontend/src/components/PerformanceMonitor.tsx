import { useEffect } from 'react';

/**
 * Performance monitoring component
 * Logs performance metrics in development mode
 */
const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor page load performance
    if (window.performance && window.performance.timing) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      console.group('🚀 Performance Metrics');
      console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
      console.log(`🔌 Server Connect Time: ${connectTime}ms`);
      console.log(`🎨 DOM Render Time: ${renderTime}ms`);
      console.groupEnd();
    }

    // Monitor memory usage (Chrome only)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.group('💾 Memory Usage');
      console.log(`Used: ${(memoryInfo.usedJSHeapSize / 1048576).toFixed(2)} MB`);
      console.log(`Total: ${(memoryInfo.totalJSHeapSize / 1048576).toFixed(2)} MB`);
      console.log(`Limit: ${(memoryInfo.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
      console.groupEnd();
    }

    // Monitor bundle sizes with lazy loading
    if ('getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.endsWith('.js'));
      
      if (jsResources.length > 0) {
        console.group('📦 JavaScript Bundles');
        jsResources.forEach(resource => {
          const size = resource.transferSize ? (resource.transferSize / 1024).toFixed(2) : 'cached';
          const duration = resource.duration.toFixed(2);
          const fileName = resource.name.split('/').pop();
          console.log(`${fileName}: ${size} KB (${duration}ms)`);
        });
        console.groupEnd();
      }
    }
  }, []);

  return null;
};

export default PerformanceMonitor;

