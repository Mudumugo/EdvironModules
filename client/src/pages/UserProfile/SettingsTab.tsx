import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "./useUserProfile";
import { Bell, Lock, Palette, Globe, Save } from "lucide-react";

interface UserSettingsType {
  notifications: {
    email: boolean;
    push: boolean;
    assignments: boolean;
    grades: boolean;
    announcements: boolean;
  };
  privacy: {
    profileVisible: boolean;
    contactVisible: boolean;
    shareProgress: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: string;
    notifications: boolean;
  };
}

export function SettingsTab() {
  const { userSettings, settingsLoading, updateSettingsMutation } = useUserProfile();

  if (settingsLoading) {
    return <div>Loading settings...</div>;
  }

  const defaultSettings: UserSettingsType = {
    notifications: {
      email: true,
      push: true,
      assignments: true,
      grades: true,
      announcements: true,
    },
    privacy: {
      profileVisible: true,
      contactVisible: false,
      shareProgress: true,
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      theme: 'light',
      notifications: true,
    }
  };

  const settings = (userSettings as UserSettingsType) || defaultSettings;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-sm">
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5 flex-1 min-w-0">
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch 
              checked={settings.notifications.email}
              onCheckedChange={(checked) => {
                // Handle notification change
              }}
            />
          </div>
          <Separator />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5 flex-1 min-w-0">
              <Label className="text-sm font-medium">Push Notifications</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Receive push notifications in browser
              </p>
            </div>
            <Switch 
              checked={settings.notifications.push}
              onCheckedChange={(checked) => {
                // Handle notification change
              }}
            />
          </div>
          <Separator />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5 flex-1 min-w-0">
              <Label className="text-sm font-medium">Assignment Notifications</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get notified about new assignments
              </p>
            </div>
            <Switch 
              checked={settings.notifications.assignments}
              onCheckedChange={(checked) => {
                // Handle notification change
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            Privacy
          </CardTitle>
          <CardDescription className="text-sm">
            Control your privacy and visibility settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Profile Visibility</Label>
            <Select defaultValue="public">
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="school">School Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5 flex-1 min-w-0">
              <Label className="text-sm font-medium">Show Email Address</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Make your email visible to others
              </p>
            </div>
            <Switch 
              checked={settings.privacy.contactVisible}
              onCheckedChange={(checked) => {
                // Handle privacy change
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
            Preferences
          </CardTitle>
          <CardDescription className="text-sm">
            Customize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Theme</Label>
              <Select defaultValue={settings.preferences.theme}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Language</Label>
              <Select defaultValue={settings.preferences.language}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}