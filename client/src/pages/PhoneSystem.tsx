import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function PhoneSystem() {
  return (
    <CollapsibleDashboardLayout title="Phone System" subtitle="Communication tools">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Phone System</h2>
          <p className="text-gray-600">Communication tools coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}