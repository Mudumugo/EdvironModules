import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function MyProfile() {
  return (
    <CollapsibleDashboardLayout title="My Profile" subtitle="Manage your profile">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Profile</h2>
          <p className="text-gray-600">Profile management coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}