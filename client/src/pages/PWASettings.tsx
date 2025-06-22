import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import PWAFeatures from '@/components/mobile/PWAFeatures';

const PWASettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mobile App Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure your progressive web app experience
            </p>
          </div>
          
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            PWA Ready
          </Badge>
        </div>

        {/* PWA Features Component */}
        <PWAFeatures />

        {/* Additional Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Progressive Web Apps</CardTitle>
            <CardDescription>
              Understanding the technology behind EdVirons mobile experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                EdVirons uses Progressive Web App (PWA) technology to provide a native app-like 
                experience directly in your web browser. This means you get the convenience of 
                an app without needing to download it from an app store.
              </p>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  PWA Benefits:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Works offline with cached content</li>
                  <li>• Installs like a native app</li>
                  <li>• Receives push notifications</li>
                  <li>• Loads instantly</li>
                  <li>• Updates automatically</li>
                  <li>• Uses less device storage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PWASettings;