import { ProfileTab } from "./ProfileTab";
import { AcademicTab } from "./AcademicTab";
import { SettingsTab } from "./SettingsTab";
import { SecurityTab } from "./SecurityTab";
import { useUserProfile } from "./useUserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { isStudent } from "@/lib/roleUtils";

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
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information, settings, and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isStudent(user.role) && <TabsTrigger value="academic">Academic</TabsTrigger>}
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileTab />
        </TabsContent>

        {isStudent(user.role) && (
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