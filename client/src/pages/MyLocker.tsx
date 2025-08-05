import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function MyLocker() {
  console.log('MyLocker component rendering');
  
  return (
    <CollapsibleDashboardLayout title="My Locker" subtitle="Your personal cloud storage">
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Locker</h2>
          <p className="text-gray-600 mb-6">Your personal cloud storage space - organize and access your educational materials.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-blue-600 mb-2">📁</div>
              <h3 className="font-medium">Documents</h3>
              <p className="text-sm text-gray-500">Store your files</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-green-600 mb-2">🖼️</div>
              <h3 className="font-medium">Images</h3>
              <p className="text-sm text-gray-500">Photo gallery</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-purple-600 mb-2">🎵</div>
              <h3 className="font-medium">Media</h3>
              <p className="text-sm text-gray-500">Audio & Video</p>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleDashboardLayout>
  );
}