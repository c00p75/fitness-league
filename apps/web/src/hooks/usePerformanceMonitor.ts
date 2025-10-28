import { useEffect, useRef, useState } from 'react';

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      }
      
      // In production, send slow renders to analytics
      if (process.env.NODE_ENV === 'production' && renderTime > 100) {
        // TODO: Send to performance monitoring service
        console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}

// Hook for monitoring component mount/unmount times
export function useMountTime(componentName: string) {
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      const totalTime = performance.now() - mountTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} total lifecycle: ${totalTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

// Hook for monitoring network requests
export function useNetworkMonitor() {
  const [requests, setRequests] = useState<Array<{
    url: string;
    method: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    status?: number;
  }>>([]);

  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const url = typeof resource === 'string' ? resource : resource.url;
      const method = config?.method || 'GET';
      const startTime = performance.now();
      
      const request = {
        url,
        method,
        startTime,
      };
      
      setRequests(prev => [...prev, request]);
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        setRequests(prev => 
          prev.map(req => 
            req === request 
              ? { ...req, endTime, duration, status: response.status }
              : req
          )
        );
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Network request: ${method} ${url} - ${duration.toFixed(2)}ms - ${response.status}`);
        }
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        setRequests(prev => 
          prev.map(req => 
            req === request 
              ? { ...req, endTime, duration, status: 0 }
              : req
          )
        );
        
        if (process.env.NODE_ENV === 'development') {
          console.error(`Network error: ${method} ${url} - ${duration.toFixed(2)}ms`);
        }
        
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return requests;
}

// Hook for monitoring memory usage
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Hook for monitoring scroll performance
export function useScrollPerformance() {
  const [scrollMetrics, setScrollMetrics] = useState<{
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    scrollWidth: number;
    clientHeight: number;
    clientWidth: number;
  }>({
    scrollTop: 0,
    scrollLeft: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollMetrics({
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset,
        scrollHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientHeight: window.innerHeight,
        clientWidth: window.innerWidth,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollMetrics;
}

// Hook for monitoring user interactions
export function useInteractionMonitor() {
  const [interactions, setInteractions] = useState<Array<{
    type: string;
    timestamp: number;
    target: string;
  }>>([]);

  useEffect(() => {
    const handleInteraction = (event: Event) => {
      const interaction = {
        type: event.type,
        timestamp: performance.now(),
        target: (event.target as Element)?.tagName || 'unknown',
      };
      
      setInteractions(prev => [...prev.slice(-99), interaction]); // Keep last 100
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`User interaction: ${interaction.type} on ${interaction.target}`);
      }
    };

    const events = ['click', 'keydown', 'scroll', 'resize'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  return interactions;
}

// Performance dashboard component for development
export function PerformanceDashboard() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Performance Monitor</h3>
      
      <div className="mb-2">
        <div>Development mode only</div>
      </div>
      
      <div className="mb-2">
        <div>Monitor active</div>
      </div>
      
      <div>
        <div>Performance tracking enabled</div>
      </div>
    </div>
  );
}
