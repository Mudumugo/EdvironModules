import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Shield, Smartphone, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { securitySettingsSchema, SecuritySettings as SecuritySettingsType } from "./SettingsTypes";

interface SecuritySettingsProps {
  currentSettings?: SecuritySettingsType;
}

export default function SecuritySettings({ currentSettings }: SecuritySettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<SecuritySettingsType>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: currentSettings || {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 60,
    },
  });

  const saveSettings = useMutation({
    mutationFn: async (data: SecuritySettingsType) => {
      return await apiRequest("POST", "/api/settings/security", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/security'] });
      toast({
        title: "Security settings saved",
        description: "Your security preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save security settings.",
        variant: "destructive",
      });
    }
  });

  const enable2FA = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/settings/security/2fa/enable");
    },
    onSuccess: () => {
      toast({
        title: "2FA Setup",
        description: "Two-factor authentication setup initiated. Check your email for instructions.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to enable two-factor authentication.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: SecuritySettingsType) => {
    saveSettings.mutate(data);
  };

  const handleEnable2FA = () => {
    enable2FA.mutate();
  };

  const sessionTimeoutOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 240, label: "4 hours" },
    { value: 480, label: "8 hours" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account security and privacy preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            These settings help protect your account. We recommend enabling two-factor authentication for maximum security.
          </AlertDescription>
        </Alert>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Two-Factor Authentication */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-2">
              <div className="flex items-start sm:items-center space-x-3">
                <Smartphone className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="twoFactorEnabled" className="text-sm font-medium">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-auto sm:ml-0">
                <Switch
                  id="twoFactorEnabled"
                  checked={form.watch("twoFactorEnabled")}
                  onCheckedChange={(checked) => {
                    form.setValue("twoFactorEnabled", checked);
                    if (checked && !currentSettings?.twoFactorEnabled) {
                      handleEnable2FA();
                    }
                  }}
                />
                {!form.watch("twoFactorEnabled") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEnable2FA}
                    disabled={enable2FA.isPending}
                    className="text-xs sm:text-sm"
                  >
                    Setup 2FA
                  </Button>
                )}
              </div>
            </div>
            <Separator />
          </div>

          {/* Login Alerts */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-2">
              <div className="flex items-start sm:items-center space-x-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="loginAlerts" className="text-sm font-medium">
                    Login Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone logs into your account
                  </p>
                </div>
              </div>
              <Switch
                id="loginAlerts"
                checked={form.watch("loginAlerts")}
                onCheckedChange={(checked) => {
                  form.setValue("loginAlerts", checked);
                }}
                className="ml-auto sm:ml-0"
              />
            </div>
            <Separator />
          </div>

          {/* Session Timeout */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-2">
              <div className="flex items-start sm:items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="sessionTimeout" className="text-sm font-medium">
                    Session Timeout
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
              </div>
              <Select
                value={form.watch("sessionTimeout").toString()}
                onValueChange={(value) => {
                  form.setValue("sessionTimeout", parseInt(value));
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionTimeoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={saveSettings.isPending}
              className="w-full h-10"
            >
              {saveSettings.isPending ? "Saving..." : "Save Security Settings"}
            </Button>
          </div>
        </form>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Security Best Practices</h4>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
            <p>• Use a strong, unique password for your account</p>
            <p>• Enable two-factor authentication for added security</p>
            <p>• Regularly review your login activity</p>
            <p>• Keep your browser and devices updated</p>
            <p>• Never share your login credentials with others</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}