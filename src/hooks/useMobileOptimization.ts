import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  connectionType: 'slow' | 'fast' | 'unknown';
}

interface AnimationConfig {
  enableAnimations: boolean;
  animationDuration: number;
  reducedMotion: boolean;
}

export function useMobileOptimization() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
    screenHeight: 768,
    orientation: 'landscape',
    touchSupport: false,
    connectionType: 'unknown'
  });

  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
    enableAnimations: true,
    animationDuration: 300,
    reducedMotion: false
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      const orientation = width > height ? 'landscape' : 'portrait';
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detectar tipo de conexão (se disponível)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      let connectionType: 'slow' | 'fast' | 'unknown' = 'unknown';
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          connectionType = 'slow';
        } else if (effectiveType === '3g' || effectiveType === '4g') {
          connectionType = 'fast';
        }
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation,
        touchSupport,
        connectionType
      });
    };

    // Detectar preferência de movimento reduzido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = mediaQuery.matches;
    
    setAnimationConfig({
      enableAnimations: !reducedMotion,
      animationDuration: reducedMotion ? 0 : 300,
      reducedMotion
    });

    // Listener para mudanças na preferência de movimento
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setAnimationConfig(prev => ({
        ...prev,
        enableAnimations: !e.matches,
        animationDuration: e.matches ? 0 : 300,
        reducedMotion: e.matches
      }));
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    
    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const getAnimationConfig = () => animationConfig;
  
  const getResponsiveConfig = () => {
    const { isMobile, isTablet, connectionType } = deviceInfo;
    
    return {
      // Configurações de grid responsivo
      gridCols: isMobile ? 1 : isTablet ? 2 : 3,
      
      // Configurações de paginação
      itemsPerPage: isMobile ? 6 : isTablet ? 9 : 12,
      
      // Configurações de imagem
      imageQuality: connectionType === 'slow' ? 'low' : 'high',
      lazyLoadThreshold: isMobile ? 100 : 200,
      
      // Configurações de animação
      enableHoverEffects: !isMobile,
      enableParallax: !isMobile && connectionType !== 'slow',
      
      // Configurações de touch
      touchTargetSize: isMobile ? 44 : 32, // Tamanho mínimo para touch targets
      
      // Configurações de performance
      enableVirtualization: isMobile && connectionType === 'slow',
      debounceDelay: isMobile ? 300 : 150
    };
  };

  const optimizeForMobile = () => {
    const { isMobile, connectionType } = deviceInfo;
    
    if (isMobile) {
      // Otimizações específicas para mobile
      document.body.classList.add('mobile-optimized');
      
      // Reduzir qualidade de imagens em conexões lentas
      if (connectionType === 'slow') {
        document.body.classList.add('slow-connection');
      }
    } else {
      document.body.classList.remove('mobile-optimized', 'slow-connection');
    }
  };

  useEffect(() => {
    optimizeForMobile();
  }, [deviceInfo]);

  return {
    deviceInfo,
    animationConfig,
    getAnimationConfig,
    getResponsiveConfig,
    optimizeForMobile
  };
}
