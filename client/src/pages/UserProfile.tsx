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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className={`grid w-full ${user.role && isStudent(user.role as UserRole) ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'} gap-1 sm:gap-0`}>
          <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">Profile</TabsTrigger>
          {user.role && isStudent(user.role as UserRole) && <TabsTrigger value="academic" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">Academic</TabsTrigger>}
          <TabsTrigger value="settings" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">Settings</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">Security</TabsTrigger>
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