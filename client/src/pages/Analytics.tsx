import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function Analytics() {
  return (
    <CollapsibleDashboardLayout title="Analytics" subtitle="Track your progress">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics</h2>
          <p className="text-gray-600">Progress tracking coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}