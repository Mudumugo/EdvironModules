import { ModuleCard, Module } from "./ModuleCard";
import { Search } from "lucide-react";

interface ModuleGridProps {
  modules: Module[];
  viewMode?: "grid" | "list";
  onModuleClick?: (moduleId: string) => void;
}

export function ModuleGrid({ modules, viewMode = "grid", onModuleClick }: ModuleGridProps) {
  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Search className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
    }>
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          viewMode={viewMode}
          onClick={() => onModuleClick?.(module.id)}
        />
      ))}
    </div>
  );
}