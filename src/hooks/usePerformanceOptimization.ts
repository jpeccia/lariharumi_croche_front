import { useCallback, useRef, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  memoryUsage?: number;
  fps?: number;
}

interface ThrottledCallback<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
}

interface PerformanceOptimizationReturn {
  startRenderMeasurement: () => void;
  endRenderMeasurement: (componentName: string) => void;
  createThrottledCallback: <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ) => ThrottledCallback<T>;
  createDebouncedCallback: <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ) => ThrottledCallback<T>;
  measureAsyncOperation: <T>(operation: () => Promise<T>, operationName: string) => Promise<T>;
  getPerformanceMetrics: () => PerformanceMetrics;
}

export const usePerformanceOptimization = (): PerformanceOptimizationReturn => {
  const renderStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics>({
    renderTime: 0,
    loadTime: 0,
  });

  // Iniciar medição de renderização
  const startRenderMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  // Finalizar medição de renderização
  const endRenderMeasurement = useCallback((componentName: string) => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      metrics.current.renderTime = renderTime;
      
      // Log apenas se for muito lento (> 16ms para 60fps)
      if (renderTime > 16) {
        console.warn(`🐌 Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      renderStartTime.current = 0;
    }
  }, []);

  // Criar callback throttled
  const createThrottledCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): ThrottledCallback<T> => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecuted = 0;

    return ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastExecuted >= delay) {
        callback(...args);
        lastExecuted = now;
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          callback(...args);
          lastExecuted = Date.now();
        }, delay - (now - lastExecuted));
      }
    }) as ThrottledCallback<T>;
  }, []);

  // Criar callback debounced
  const createDebouncedCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): ThrottledCallback<T> => {
    let timeoutId: NodeJS.Timeout | null = null;

    return ((...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as ThrottledCallback<T>;
  }, []);

  // Medir operação assíncrona
  const measureAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      metrics.current.loadTime = duration;
      
      // Log apenas se for muito lento (> 1000ms)
      if (duration > 1000) {
        console.warn(`🐌 Slow async operation ${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`❌ Failed async operation ${operationName} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  // Obter métricas de performance
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    const memoryInfo = (performance as any).memory;
    const fps = getFPS();
    
    return {
      ...metrics.current,
      memoryUsage: memoryInfo ? memoryInfo.usedJSHeapSize : undefined,
      fps,
    };
  }, []);

  // Calcular FPS aproximado
  const getFPS = useCallback((): number => {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
    return fps;
  }, []);

  // Monitorar performance da página
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          metrics.current.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    startRenderMeasurement,
    endRenderMeasurement,
    createThrottledCallback,
    createDebouncedCallback,
    measureAsyncOperation,
    getPerformanceMetrics,
  };
};
