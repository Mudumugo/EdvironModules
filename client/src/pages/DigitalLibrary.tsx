import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function DigitalLibrary() {
  return (
    <CollapsibleDashboardLayout title="Digital Library" subtitle="Access educational resources">
      <div className="space-y-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Digital Library</h2>
          <p className="text-gray-600">Educational resources coming soon...</p>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}