import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function AppsHub() {
  return (
    <CollapsibleDashboardLayout title="Apps Hub" subtitle="Discover educational apps">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Apps Hub</h2>
          <p className="text-gray-600">Educational apps coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}