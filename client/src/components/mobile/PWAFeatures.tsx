import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePWAContext } from '@/components/PWAProvider';
import { 
  Download, 
  Wifi, 
  Bell, 
  Smartphone, 
  Zap, 
  Shield,
  BookOpen,
  CloudDownload,
  Sync,
  Battery
} from 'lucide-react';

const PWAFeatures: React.FC = () => {
  const { 
    isInstalled, 
    isInstallable, 
    installApp, 
    requestNotificationPermission,
    cacheBookContent,
    showNotification 
  } = usePWAContext();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    Notification.permission === 'granted'
  );

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      showNotification('Notifications Enabled!', {
        body: 'You\'ll now receive updates about new content and assignments.',
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  const features = [
    {
      icon: <Download className="h-5 w-5" />,
      title: 'App Installation',
      description: 'Install on your device for quick access',
      status: isInstalled ? 'installed' : isInstallable ? 'available' : 'unavailable',
      action: isInstallable && !isInstalled ? installApp : null,
      actionText: 'Install App'
    },
    {
      icon: <Wifi className="h-5 w-5" />,
      title: 'Offline Access',
      description: 'Read downloaded books without internet',
      status: 'available',
      action: null,
      actionText: null
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: 'Push Notifications',
      description: 'Get notified about new content and assignments',
      status: notificationsEnabled ? 'enabled' : 'available',
      action: !notificationsEnabled ? handleEnableNotifications : null,
      actionText: 'Enable Notifications'
    },
    {
      icon: <CloudDownload className="h-5 w-5" />,
      title: 'Content Caching',
      description: 'Automatically save content for offline use',
      status: 'available',
      action: null,
      actionText: null
    },
    {
      icon: <Sync className="h-5 w-5" />,
      title: 'Background Sync',
      description: 'Sync your progress when connection returns',
      status: 'available',
      action: null,
      actionText: null
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Fast Loading',
      description: 'Optimized performance and quick startup',
      status: 'available',
      action: null,
      actionText: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'installed':
      case 'enabled':
      case 'available':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case 'unavailable':
        return <Badge variant="outline">Not Available</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* PWA Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <CardTitle>Mobile App Features</CardTitle>
          </div>
          <CardDescription>
            EdVirons works as a Progressive Web App with native-like features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(feature.status)}
                  {feature.action && (
                    <Button size="sm" onClick={feature.action}>
                      {feature.actionText}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* App Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>App Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Offline Reading</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download books and continue learning without internet
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Battery className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Battery Optimized</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Efficient performance that preserves device battery
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Instant Loading</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cached content loads instantly, even on slow connections
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Sync className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Auto Sync</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Progress syncs automatically when connection is available
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      {!isInstalled && (
        <Card>
          <CardHeader>
            <CardTitle>How to Install</CardTitle>
            <CardDescription>
              Install EdVirons on your device for the best experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Android Chrome
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Tap the menu button (three dots) in Chrome</li>
                  <li>Select "Add to Home screen" or "Install app"</li>
                  <li>Confirm by tapping "Add" or "Install"</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  iOS Safari
                </h4>
                <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Tap the Share button (square with arrow)</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PWAFeatures;