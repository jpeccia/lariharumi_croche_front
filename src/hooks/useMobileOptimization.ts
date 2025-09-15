import { useState, useEffect, useCallback } from 'react';

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

interface MobileOptimizationReturn {
  deviceInfo: DeviceInfo;
  getAnimationConfig: () => AnimationConfig;
  isLowEndDevice: boolean;
  shouldReduceAnimations: boolean;
  getOptimalImageSize: (baseSize: number) => number;
  getOptimalGridColumns: (baseColumns: number) => number;
}

export const useMobileOptimization = (): MobileOptimizationReturn => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
    screenHeight: 768,
    orientation: 'landscape',
    touchSupport: false,
    connectionType: 'unknown',
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  // Detectar informações do dispositivo
  const detectDeviceInfo = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    const orientation = width > height ? 'landscape' : 'portrait';
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Detectar tipo de conexão
    let connectionType: 'slow' | 'fast' | 'unknown' = 'unknown';
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType) {
        connectionType = ['slow-2g', '2g', '3g'].includes(connection.effectiveType) ? 'slow' : 'fast';
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
      connectionType,
    });
  }, []);

  // Detectar preferência de movimento reduzido
  const detectReducedMotion = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
  }, []);

  // Detectar se é dispositivo de baixo desempenho
  const isLowEndDevice = useCallback(() => {
    // Critérios para dispositivos de baixo desempenho
    const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    const slowConnection = deviceInfo.connectionType === 'slow';
    const smallScreen = deviceInfo.screenWidth < 480;
    
    return lowMemory || slowConnection || smallScreen;
  }, [deviceInfo]);

  // Configuração de animações
  const getAnimationConfig = useCallback((): AnimationConfig => {
    const shouldReduce = reducedMotion || isLowEndDevice() || deviceInfo.connectionType === 'slow';
    
    return {
      enableAnimations: !shouldReduce,
      animationDuration: shouldReduce ? 0 : 300,
      reducedMotion: shouldReduce,
    };
  }, [reducedMotion, isLowEndDevice, deviceInfo]);

  // Tamanho otimizado de imagem
  const getOptimalImageSize = useCallback((baseSize: number): number => {
    if (deviceInfo.isMobile) {
      return Math.min(baseSize, deviceInfo.screenWidth * 0.8);
    }
    if (deviceInfo.isTablet) {
      return Math.min(baseSize, deviceInfo.screenWidth * 0.6);
    }
    return baseSize;
  }, [deviceInfo]);

  // Número otimizado de colunas no grid
  const getOptimalGridColumns = useCallback((baseColumns: number): number => {
    if (deviceInfo.isMobile) {
      return Math.min(baseColumns, 2);
    }
    if (deviceInfo.isTablet) {
      return Math.min(baseColumns, 3);
    }
    return baseColumns;
  }, [deviceInfo]);

  // Listener para mudanças de orientação e tamanho
  useEffect(() => {
    detectDeviceInfo();
    detectReducedMotion();

    const handleResize = () => {
      detectDeviceInfo();
    };

    const handleOrientationChange = () => {
      setTimeout(detectDeviceInfo, 100); // Delay para aguardar mudança de orientação
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      detectReducedMotion();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [detectDeviceInfo, detectReducedMotion]);

  return {
    deviceInfo,
    getAnimationConfig,
    isLowEndDevice: isLowEndDevice(),
    shouldReduceAnimations: reducedMotion || isLowEndDevice(),
    getOptimalImageSize,
    getOptimalGridColumns,
  };
};
