import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function Assignments() {
  return (
    <CollapsibleDashboardLayout title="Assignments" subtitle="View and submit assignments">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assignments</h2>
          <p className="text-gray-600">Assignment management coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}