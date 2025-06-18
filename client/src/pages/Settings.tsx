import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  PaymentSettings,
  ProfileSettings,
  NotificationSettings,
  ModuleSettings,
  SecuritySettings,
  ModuleConfig
} from "@/components/settings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();

  // Fetch settings data
  const { data: profileSettings } = useQuery({
    queryKey: ["/api/settings/profile"],
  });

  const { data: paymentSettings } = useQuery({
    queryKey: ["/api/settings/payment"],
  });

  const { data: notificationSettings } = useQuery({
    queryKey: ["/api/settings/notifications"],
  });

  const { data: securitySettings } = useQuery({
    queryKey: ["/api/settings/security"],
  });

  const { data: modules = [] } = useQuery<ModuleConfig[]>({
    queryKey: ["/api/settings/modules"],
  });

  const { data: premiumStatus } = useQuery({
    queryKey: ["/api/premium-status"],
  });

  // Mock data for premium modules - in real app this would come from API
  const premiumModules = [
    "advanced-analytics",
    "ai-tutoring",
    "premium-content",
    "video-conferencing"
  ];

  const hasPremium = premiumStatus?.isPremium || false;

  return (
    <div className="container mx-auto max-w-4xl py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings 
            currentSettings={profileSettings}
            profileImageUrl={user?.profileImageUrl}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings currentSettings={notificationSettings} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings currentSettings={securitySettings} />
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <ModuleSettings 
            modules={modules}
            premiumModules={premiumModules}
            hasPremium={hasPremium}
          />
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <PaymentSettings currentSettings={paymentSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}