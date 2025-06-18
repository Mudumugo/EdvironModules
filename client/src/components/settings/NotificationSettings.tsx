import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { notificationSettingsSchema, NotificationSettings as NotificationSettingsType } from "./SettingsTypes";

interface NotificationSettingsProps {
  currentSettings?: NotificationSettingsType;
}

export default function NotificationSettings({ currentSettings }: NotificationSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<NotificationSettingsType>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: currentSettings || {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  });

  const saveSettings = useMutation({
    mutationFn: async (data: NotificationSettingsType) => {
      return await apiRequest("POST", "/api/settings/notifications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/notifications'] });
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: NotificationSettingsType) => {
    saveSettings.mutate(data);
  };

  const notificationTypes = [
    {
      id: "emailNotifications",
      label: "Email Notifications",
      description: "Receive notifications via email",
      icon: Mail,
    },
    {
      id: "smsNotifications", 
      label: "SMS Notifications",
      description: "Receive notifications via text message",
      icon: MessageSquare,
    },
    {
      id: "pushNotifications",
      label: "Push Notifications",
      description: "Receive push notifications in your browser",
      icon: Smartphone,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {notificationTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <div key={type.id}>
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <Label htmlFor={type.id} className="text-sm font-medium">
                        {type.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={type.id}
                    {...form.register(type.id as keyof NotificationSettingsType)}
                    checked={form.watch(type.id as keyof NotificationSettingsType)}
                    onCheckedChange={(checked) => {
                      form.setValue(type.id as keyof NotificationSettingsType, checked);
                    }}
                  />
                </div>
                {index < notificationTypes.length - 1 && <Separator />}
              </div>
            );
          })}

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={saveSettings.isPending}
              className="w-full"
            >
              {saveSettings.isPending ? "Saving..." : "Save Notification Settings"}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Notification Categories</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Assignment reminders and due dates</p>
            <p>• Grade updates and feedback</p>
            <p>• Class announcements and schedule changes</p>
            <p>• System updates and maintenance notices</p>
            <p>• Security alerts and login notifications</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}