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
    <div className="container mx-auto max-w-4xl p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1">
          <TabsTrigger value="profile" className="text-xs sm:text-sm py-2">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm py-2">Security</TabsTrigger>
          <TabsTrigger value="modules" className="text-xs sm:text-sm py-2">Modules</TabsTrigger>
          <TabsTrigger value="payment" className="text-xs sm:text-sm py-2 col-span-2 sm:col-span-1">Payment</TabsTrigger>
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