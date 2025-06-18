import AppCard from "./AppCard";
import type { AppGridProps } from "./AppTypes";

export default function AppGrid({ apps, viewMode, isLoading }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No apps found</h3>
        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} variant="regular" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} variant="regular" />
      ))}
    </div>
  );
}