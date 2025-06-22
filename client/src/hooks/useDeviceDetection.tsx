import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
  screenWidth: number;
  screenHeight: number;
  isTouchDevice: boolean;
  pixelRatio: number;
  isIOS: boolean;
  isAndroid: boolean;
}

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        orientation: 'landscape',
        screenWidth: 1920,
        screenHeight: 1080,
        isTouchDevice: false,
        pixelRatio: 1,
        isIOS: false,
        isAndroid: false
      };
    }

    return getDeviceInfo();
  });

  const getDeviceInfo = (): DeviceInfo => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Device type detection
    let type: DeviceType = 'desktop';
    if (width <= 768) {
      type = 'mobile';
    } else if (width <= 1024) {
      type = 'tablet';
    }

    // Orientation detection
    const orientation: Orientation = width > height ? 'landscape' : 'portrait';

    // Touch device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Platform detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    return {
      type,
      orientation,
      screenWidth: width,
      screenHeight: height,
      isTouchDevice,
      pixelRatio,
      isIOS,
      isAndroid
    };
  };

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    const handleOrientationChange = () => {
      // Delay to get accurate dimensions after orientation change
      setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};