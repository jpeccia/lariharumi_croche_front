import { useEffect, useState } from 'react';

interface MobileOptimizationConfig {
  reduceAnimations: boolean;
  optimizeImages: boolean;
  enableHapticFeedback: boolean;
  enableReducedMotion: boolean;
}

export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Verificar preferência de movimento reduzido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('resize', checkDevice);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const getAnimationConfig = () => ({
    enableAnimations: !prefersReducedMotion && !isMobile,
    reduceAnimations: prefersReducedMotion || isMobile,
    animationDuration: prefersReducedMotion ? 0 : (isMobile ? 200 : 300),
  });

  const getOptimizationConfig = (): MobileOptimizationConfig => ({
    reduceAnimations: prefersReducedMotion || isMobile,
    optimizeImages: isMobile || isTablet,
    enableHapticFeedback: isMobile,
    enableReducedMotion: prefersReducedMotion,
  });

  const getResponsiveClasses = (mobile: string, tablet?: string, desktop?: string) => {
    let classes = mobile;
    if (tablet) classes += ` md:${tablet}`;
    if (desktop) classes += ` lg:${desktop}`;
    return classes;
  };

  const getImageSize = (baseSize: number) => {
    if (isMobile) return Math.round(baseSize * 0.8);
    if (isTablet) return Math.round(baseSize * 0.9);
    return baseSize;
  };

  const getGridCols = (mobile: number, tablet?: number, desktop?: number) => {
    const cols = {
      mobile: `grid-cols-${mobile}`,
      tablet: tablet ? `md:grid-cols-${tablet}` : '',
      desktop: desktop ? `lg:grid-cols-${desktop}` : '',
    };
    
    return [cols.mobile, cols.tablet, cols.desktop]
      .filter(Boolean)
      .join(' ');
  };

  const getSpacing = (mobile: string, tablet?: string, desktop?: string) => {
    let spacing = mobile;
    if (tablet) spacing += ` md:${tablet}`;
    if (desktop) spacing += ` lg:${desktop}`;
    return spacing;
  };

  const getFontSize = (mobile: string, tablet?: string, desktop?: string) => {
    let fontSize = mobile;
    if (tablet) fontSize += ` md:${tablet}`;
    if (desktop) fontSize += ` lg:${desktop}`;
    return fontSize;
  };

  const optimizeForDevice = (config: {
    mobile?: any;
    tablet?: any;
    desktop?: any;
  }) => {
    if (isMobile) return config.mobile;
    if (isTablet) return config.tablet;
    return config.desktop;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    prefersReducedMotion,
    getAnimationConfig,
    getOptimizationConfig,
    getResponsiveClasses,
    getImageSize,
    getGridCols,
    getSpacing,
    getFontSize,
    optimizeForDevice,
  };
}