import { useCallback, useRef, useEffect } from 'react';

interface PerformanceMetrics {
  renderStart: number;
  renderEnd: number;
  renderDuration: number;
}

export function usePerformanceOptimization() {
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const renderStartRef = useRef<number>(0);

  // Medir início da renderização
  const startRenderMeasurement = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // Medir fim da renderização
  const endRenderMeasurement = useCallback((componentName: string) => {
    const renderEnd = performance.now();
    const renderDuration = renderEnd - renderStartRef.current;
    
    const metric: PerformanceMetrics = {
      renderStart: renderStartRef.current,
      renderEnd,
      renderDuration
    };
    
    metricsRef.current.push(metric);
    
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${renderDuration.toFixed(2)}ms`);
    }
    
    // Manter apenas os últimos 10 registros
    if (metricsRef.current.length > 10) {
      metricsRef.current = metricsRef.current.slice(-10);
    }
  }, []);

  // Criar callback throttled para otimizar eventos frequentes
  const createThrottledCallback = useCallback(
    <T extends (...args: any[]) => void>(
      callback: T,
      delay: number = 300
    ): T => {
      let timeoutId: NodeJS.Timeout | null = null;
      let lastExecTime = 0;

      return ((...args: Parameters<T>) => {
        const now = Date.now();
        
        if (now - lastExecTime >= delay) {
          callback(...args);
          lastExecTime = now;
        } else {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          timeoutId = setTimeout(() => {
            callback(...args);
            lastExecTime = Date.now();
          }, delay - (now - lastExecTime));
        }
      }) as T;
    },
    []
  );

  // Criar callback debounced para otimizar buscas
  const createDebouncedCallback = useCallback(
    <T extends (...args: any[]) => void>(
      callback: T,
      delay: number = 300
    ): T => {
      let timeoutId: NodeJS.Timeout | null = null;

      return ((...args: Parameters<T>) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          callback(...args);
        }, delay);
      }) as T;
    },
    []
  );

  // Memoizar cálculos pesados
  const memoizeCalculation = useCallback(
    <T extends (...args: any[]) => any>(
      calculation: T,
      dependencies: React.DependencyList
    ): T => {
      const cache = useRef<Map<string, ReturnType<T>>>(new Map());
      
      return ((...args: Parameters<T>) => {
        const key = JSON.stringify(args);
        
        if (cache.current.has(key)) {
          return cache.current.get(key);
        }
        
        const result = calculation(...args);
        cache.current.set(key, result);
        
        return result;
      }) as T;
    },
    []
  );

  // Otimizar scroll events
  const useOptimizedScroll = useCallback(
    (callback: (scrollY: number) => void, delay: number = 16) => {
      const throttledCallback = createThrottledCallback(callback, delay);
      
      useEffect(() => {
        const handleScroll = () => {
          throttledCallback(window.scrollY);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [throttledCallback]);
    },
    [createThrottledCallback]
  );

  // Otimizar resize events
  const useOptimizedResize = useCallback(
    (callback: (width: number, height: number) => void, delay: number = 250) => {
      const throttledCallback = createThrottledCallback(callback, delay);
      
      useEffect(() => {
        const handleResize = () => {
          throttledCallback(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [throttledCallback]);
    },
    [createThrottledCallback]
  );

  // Obter métricas de performance
  const getPerformanceMetrics = useCallback(() => {
    return {
      metrics: metricsRef.current,
      averageRenderTime: metricsRef.current.length > 0 
        ? metricsRef.current.reduce((sum, metric) => sum + metric.renderDuration, 0) / metricsRef.current.length
        : 0,
      totalRenders: metricsRef.current.length
    };
  }, []);

  // Limpar métricas
  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
  }, []);

  return {
    startRenderMeasurement,
    endRenderMeasurement,
    createThrottledCallback,
    createDebouncedCallback,
    memoizeCalculation,
    useOptimizedScroll,
    useOptimizedResize,
    getPerformanceMetrics,
    clearMetrics
  };
}
