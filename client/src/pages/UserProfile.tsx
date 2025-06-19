import { ProfileTab } from "./UserProfile/ProfileTab";
import { AcademicTab } from "./UserProfile/AcademicTab";
import { SettingsTab } from "./UserProfile/SettingsTab";
import { SecurityTab } from "./UserProfile/SecurityTab";
import { useUserProfile } from "./UserProfile/useUserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { isStudent } from "@shared/roleUtils";
import type { UserRole } from "@shared/schema";

export default function UserProfile() {
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useUserProfile();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-3 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your profile information, settings, and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
          {user.role && isStudent(user.role as UserRole) && <TabsTrigger value="academic" className="text-xs sm:text-sm">Academic</TabsTrigger>}
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileTab />
        </TabsContent>

        {user.role && isStudent(user.role as UserRole) && (
          <TabsContent value="academic" className="space-y-4">
            <AcademicTab />
          </TabsContent>
        )}

        <TabsContent value="settings" className="space-y-4">
          <SettingsTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}