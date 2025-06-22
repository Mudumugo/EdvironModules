import React from 'react';
import { useAdaptiveScaling } from '@/hooks/useAdaptiveScaling';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableScaling?: boolean;
  minWidth?: number;
  maxWidth?: number;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className = '',
  enableScaling = true,
  minWidth,
  maxWidth
}) => {
  const { adaptiveStyles, deviceInfo, isCompactMode, getScaledValue } = useAdaptiveScaling();

  const containerStyles: React.CSSProperties = {
    ...adaptiveStyles,
    minWidth: minWidth ? getScaledValue(minWidth) : undefined,
    maxWidth: maxWidth ? getScaledValue(maxWidth) : undefined,
    transform: enableScaling ? `scale(${adaptiveStyles['--scale-factor']})` : undefined,
    transformOrigin: 'center top'
  };

  const responsiveClasses = [
    className,
    // Device-specific classes
    deviceInfo.type === 'mobile' ? 'mobile-layout' : '',
    deviceInfo.type === 'tablet' ? 'tablet-layout' : '',
    deviceInfo.type === 'desktop' ? 'desktop-layout' : '',
    // Orientation classes
    deviceInfo.orientation === 'portrait' ? 'portrait-orientation' : 'landscape-orientation',
    // Touch device class
    deviceInfo.isTouchDevice ? 'touch-device' : 'no-touch',
    // Compact mode class
    isCompactMode ? 'compact-mode' : 'expanded-mode'
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={responsiveClasses}
      style={containerStyles}
      data-device-type={deviceInfo.type}
      data-orientation={deviceInfo.orientation}
      data-touch={deviceInfo.isTouchDevice}
    >
      {children}
    </div>
  );
};