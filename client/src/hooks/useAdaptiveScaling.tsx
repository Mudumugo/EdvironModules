import { useState, useEffect, useMemo } from 'react';
import { useDeviceDetection, DeviceType } from './useDeviceDetection';

interface ScalingConfig {
  baseScale: number;
  minScale: number;
  maxScale: number;
  fontSize: number;
  lineHeight: number;
  spacing: number;
  contentPadding: number;
  navigationHeight: number;
  touchTargetSize: number;
}

interface AdaptiveScaling {
  config: ScalingConfig;
  scaleFactor: number;
  isCompactMode: boolean;
  getScaledValue: (value: number) => number;
  getResponsiveClass: (baseClass: string) => string;
  adaptiveStyles: React.CSSProperties;
}

const getDefaultConfig = (deviceType: DeviceType, screenWidth: number): ScalingConfig => {
  const baseConfigs = {
    mobile: {
      baseScale: 0.85,
      minScale: 0.7,
      maxScale: 1.1,
      fontSize: 14,
      lineHeight: 1.4,
      spacing: 12,
      contentPadding: 16,
      navigationHeight: 56,
      touchTargetSize: 44
    },
    tablet: {
      baseScale: 1.0,
      minScale: 0.8,
      maxScale: 1.3,
      fontSize: 16,
      lineHeight: 1.5,
      spacing: 16,
      contentPadding: 24,
      navigationHeight: 64,
      touchTargetSize: 48
    },
    desktop: {
      baseScale: 1.0,
      minScale: 0.9,
      maxScale: 1.5,
      fontSize: 16,
      lineHeight: 1.6,
      spacing: 20,
      contentPadding: 32,
      navigationHeight: 72,
      touchTargetSize: 40
    }
  };

  let config = baseConfigs[deviceType];

  // Adjust for very small or very large screens
  if (deviceType === 'mobile') {
    if (screenWidth < 360) {
      config = { ...config, baseScale: 0.75, fontSize: 13 };
    } else if (screenWidth > 480) {
      config = { ...config, baseScale: 0.9, fontSize: 15 };
    }
  }

  if (deviceType === 'desktop' && screenWidth > 1440) {
    config = { ...config, baseScale: 1.1, contentPadding: 40 };
  }

  return config;
};

export const useAdaptiveScaling = (userScalePreference = 1.0) => {
  const deviceInfo = useDeviceDetection();
  const [customScale, setCustomScale] = useState(userScalePreference);

  const config = useMemo(() => 
    getDefaultConfig(deviceInfo.type, deviceInfo.screenWidth), 
    [deviceInfo.type, deviceInfo.screenWidth]
  );

  const scaleFactor = useMemo(() => {
    const baseScale = config.baseScale * customScale;
    return Math.max(config.minScale, Math.min(config.maxScale, baseScale));
  }, [config, customScale]);

  const isCompactMode = useMemo(() => 
    deviceInfo.type === 'mobile' || 
    (deviceInfo.type === 'tablet' && deviceInfo.orientation === 'portrait'),
    [deviceInfo]
  );

  const getScaledValue = (value: number): number => {
    return Math.round(value * scaleFactor);
  };

  const getResponsiveClass = (baseClass: string): string => {
    const devicePrefix = deviceInfo.type === 'mobile' ? 'sm:' : 
                        deviceInfo.type === 'tablet' ? 'md:' : 'lg:';
    return `${baseClass} ${devicePrefix}${baseClass}`;
  };

  const adaptiveStyles: React.CSSProperties = useMemo(() => ({
    fontSize: `${config.fontSize * scaleFactor}px`,
    lineHeight: config.lineHeight,
    '--content-padding': `${getScaledValue(config.contentPadding)}px`,
    '--spacing': `${getScaledValue(config.spacing)}px`,
    '--navigation-height': `${getScaledValue(config.navigationHeight)}px`,
    '--touch-target-size': `${getScaledValue(config.touchTargetSize)}px`,
    '--scale-factor': scaleFactor.toString()
  } as React.CSSProperties), [config, scaleFactor, getScaledValue]);

  useEffect(() => {
    // Apply CSS custom properties to root
    const root = document.documentElement;
    Object.entries(adaptiveStyles).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, value as string);
      }
    });
  }, [adaptiveStyles]);

  return {
    config,
    scaleFactor,
    isCompactMode,
    deviceInfo,
    customScale,
    setCustomScale,
    getScaledValue,
    getResponsiveClass,
    adaptiveStyles
  } as AdaptiveScaling & {
    deviceInfo: typeof deviceInfo;
    customScale: number;
    setCustomScale: (scale: number) => void;
  };
};