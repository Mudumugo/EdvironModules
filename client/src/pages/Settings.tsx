import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function Settings() {
  return (
    <CollapsibleDashboardLayout title="Settings" subtitle="Manage your preferences">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Settings</h2>
          <p className="text-gray-600">User settings coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}