import { useEffect, useRef, useCallback, useState } from 'react';

// Hook para gerenciar foco
export function useFocusManagement() {
  const focusableElements = useRef<HTMLElement[]>([]);
  const currentIndex = useRef(0);

  const updateFocusableElements = useCallback((container: HTMLElement) => {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    focusableElements.current = Array.from(focusable);
  }, []);

  const focusNext = useCallback(() => {
    if (focusableElements.current.length === 0) return;
    
    currentIndex.current = (currentIndex.current + 1) % focusableElements.current.length;
    focusableElements.current[currentIndex.current]?.focus();
  }, []);

  const focusPrevious = useCallback(() => {
    if (focusableElements.current.length === 0) return;
    
    currentIndex.current = currentIndex.current === 0 
      ? focusableElements.current.length - 1 
      : currentIndex.current - 1;
    focusableElements.current[currentIndex.current]?.focus();
  }, []);

  const focusFirst = useCallback(() => {
    if (focusableElements.current.length > 0) {
      currentIndex.current = 0;
      focusableElements.current[0]?.focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (focusableElements.current.length > 0) {
      currentIndex.current = focusableElements.current.length - 1;
      focusableElements.current[currentIndex.current]?.focus();
    }
  }, []);

  return {
    updateFocusableElements,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  };
}

// Hook para detectar preferências de movimento reduzido
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Hook para gerenciar ARIA live regions
export function useAriaLive() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;
    
    document.body.appendChild(liveRegion);
    
    // Remove após um tempo para evitar acúmulo
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, []);

  return { announce };
}

// Hook para detectar teclas de navegação
export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((event: KeyboardEvent, callbacks: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
    onTab?: () => void;
  }) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        callbacks.onEnter?.();
        break;
      case 'Escape':
        event.preventDefault();
        callbacks.onEscape?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        callbacks.onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        callbacks.onArrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        callbacks.onArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        callbacks.onArrowRight?.();
        break;
      case 'Home':
        event.preventDefault();
        callbacks.onHome?.();
        break;
      case 'End':
        event.preventDefault();
        callbacks.onEnd?.();
        break;
      case 'Tab':
        callbacks.onTab?.();
        break;
    }
  }, []);

  return { handleKeyDown };
}

// Hook para gerenciar skip links
export function useSkipLinks() {
  const createSkipLink = useCallback((targetId: string, text: string) => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50';
    
    return skipLink;
  }, []);

  return { createSkipLink };
}

// Hook para detectar contraste de cores
export function useColorContrast() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return highContrast;
}

// Hook para gerenciar landmarks ARIA
export function useAriaLandmarks() {
  const addLandmark = useCallback((element: HTMLElement, role: string, label?: string) => {
    element.setAttribute('role', role);
    if (label) {
      element.setAttribute('aria-label', label);
    }
  }, []);

  return { addLandmark };
}
