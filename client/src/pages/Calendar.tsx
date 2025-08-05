import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function Calendar() {
  return (
    <CollapsibleDashboardLayout title="Calendar" subtitle="Manage your schedule">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Calendar</h2>
          <p className="text-gray-600">Schedule management coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}