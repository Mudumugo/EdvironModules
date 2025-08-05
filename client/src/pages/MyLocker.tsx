import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function MyLocker() {
  return (
    <CollapsibleDashboardLayout title="My Locker" subtitle="Your personal cloud storage">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Locker</h2>
          <p className="text-gray-600">Your personal storage space coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}