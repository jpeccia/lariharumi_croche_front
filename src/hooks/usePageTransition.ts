import { useEffect, useState } from 'react';

interface UsePageTransitionOptions {
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function usePageTransition(options: UsePageTransitionOptions = {}) {
  const { delay = 0, duration = 600, stagger = 100 } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getStaggerDelay = (index: number) => {
    return `${delay + (index * stagger)}ms`;
  };

  const getTransitionStyle = (index: number = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: getStaggerDelay(index),
  });

  return {
    isVisible,
    getStaggerDelay,
    getTransitionStyle,
  };
}

// Hook específico para animações de entrada
export function useEntranceAnimation(delay: number = 0) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return visible;
}

// Hook para animações de scroll
export function useScrollAnimation(threshold: number = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isInView] as const;
}