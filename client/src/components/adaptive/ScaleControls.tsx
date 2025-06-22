import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, RotateCcw, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useAdaptiveScaling } from '@/hooks/useAdaptiveScaling';

interface ScaleControlsProps {
  showAdvanced?: boolean;
  onClose?: () => void;
}

export const ScaleControls: React.FC<ScaleControlsProps> = ({ 
  showAdvanced = false,
  onClose 
}) => {
  const { 
    customScale, 
    setCustomScale, 
    config, 
    deviceInfo,
    isCompactMode 
  } = useAdaptiveScaling();

  const scaleOptions = [
    { label: 'Very Small', value: 0.75 },
    { label: 'Small', value: 0.85 },
    { label: 'Normal', value: 1.0 },
    { label: 'Large', value: 1.15 },
    { label: 'Very Large', value: 1.3 }
  ];

  const deviceIcons = {
    mobile: <Smartphone className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
    desktop: <Monitor className="h-4 w-4" />
  };

  const resetScale = () => setCustomScale(1.0);
  const zoomIn = () => setCustomScale(Math.min(config.maxScale, customScale + 0.1));
  const zoomOut = () => setCustomScale(Math.max(config.minScale, customScale - 0.1));

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>Display Settings</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              {deviceIcons[deviceInfo.type]}
              <span className="capitalize">{deviceInfo.type}</span>
            </Badge>
            {isCompactMode && (
              <Badge variant="secondary">Compact</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Scale Controls */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Content Scale</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={customScale <= config.minScale}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded min-w-16 text-center">
              {Math.round(customScale * 100)}%
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={customScale >= config.maxScale}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScale}
              title="Reset to default"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scale Slider */}
        <div className="space-y-2">
          <Slider
            value={[customScale]}
            onValueChange={([value]) => setCustomScale(value)}
            min={config.minScale}
            max={config.maxScale}
            step={0.05}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round(config.minScale * 100)}%</span>
            <span>{Math.round(config.maxScale * 100)}%</span>
          </div>
        </div>

        {/* Preset Scale Options */}
        <div className="grid grid-cols-3 gap-2">
          {scaleOptions
            .filter(option => option.value >= config.minScale && option.value <= config.maxScale)
            .map((option) => (
            <Button
              key={option.value}
              variant={Math.abs(customScale - option.value) < 0.01 ? "default" : "outline"}
              size="sm"
              onClick={() => setCustomScale(option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {showAdvanced && (
          <>
            {/* Device Information */}
            <div className="border-t pt-4 space-y-2">
              <h4 className="text-sm font-medium">Device Information</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Screen:</span>
                  <span>{deviceInfo.screenWidth}×{deviceInfo.screenHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pixel Ratio:</span>
                  <span>{deviceInfo.pixelRatio}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Touch:</span>
                  <span>{deviceInfo.isTouchDevice ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span>
                    {deviceInfo.isIOS ? 'iOS' : 
                     deviceInfo.isAndroid ? 'Android' : 'Web'}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Configuration */}
            <div className="border-t pt-4 space-y-2">
              <h4 className="text-sm font-medium">Current Settings</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Font:</span>
                  <span>{Math.round(config.fontSize * customScale)}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spacing:</span>
                  <span>{Math.round(config.spacing * customScale)}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Padding:</span>
                  <span>{Math.round(config.contentPadding * customScale)}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Touch Target:</span>
                  <span>{Math.round(config.touchTargetSize * customScale)}px</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Close Button */}
        {onClose && (
          <div className="border-t pt-4">
            <Button variant="outline" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};