import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionState {
  isTransitioning: boolean;
  direction: 'forward' | 'backward' | 'none';
  previousPath: string;
}

export const usePageTransition = () => {
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<PageTransitionState>({
    isTransitioning: false,
    direction: 'none',
    previousPath: '',
  });

  const startTransition = useCallback((direction: 'forward' | 'backward' = 'forward') => {
    setTransitionState({
      isTransitioning: true,
      direction,
      previousPath: location.pathname,
    });

    // Simula transição suave
    setTimeout(() => {
      setTransitionState(prev => ({
        ...prev,
        isTransitioning: false,
      }));
    }, 300);
  }, [location.pathname]);

  // Detecta mudanças de rota
  useEffect(() => {
    if (transitionState.previousPath && transitionState.previousPath !== location.pathname) {
      startTransition();
    }
  }, [location.pathname, transitionState.previousPath, startTransition]);

  return {
    ...transitionState,
    startTransition,
  };
};

// Hook para animações de entrada
export const useEntranceAnimation = (delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Hook para scroll suave
export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return {
    scrollToElement,
    scrollToTop,
  };
};
