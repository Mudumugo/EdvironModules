import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function SecurityTab() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password & Authentication
          </CardTitle>
          <CardDescription>
            Manage your password and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Require a verification code when signing in
              </p>
            </div>
            <Switch />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Backup Codes</Label>
            <p className="text-sm text-muted-foreground">
              Generate backup codes for when you can't access your authenticator
            </p>
            <Button variant="outline">Generate Backup Codes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">
                  Chrome on Windows • Active now
                </p>
              </div>
              <Badge variant="secondary">Current</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">Mobile Session</p>
                <p className="text-sm text-muted-foreground">
                  Mobile App • Last active 2 hours ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
          </div>
          
          <Button variant="destructive" className="w-full">
            Sign Out All Devices
          </Button>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            Recent security-related activities on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Password Updated</p>
                <p className="text-sm text-muted-foreground">
                  Your password was successfully changed 3 days ago
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium">New Device Login</p>
                <p className="text-sm text-muted-foreground">
                  Login from new device detected 5 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}