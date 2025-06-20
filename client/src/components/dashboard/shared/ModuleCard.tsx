import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, LucideIcon } from "lucide-react";

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category?: string;
  features?: string[];
  moreCount?: number;
  tag?: string;
  bgColor?: string;
  iconColor?: string;
}

interface ModuleCardProps {
  module: Module;
  viewMode?: "grid" | "list";
  onClick?: () => void;
  variant?: "primary" | "junior" | "senior" | "teacher";
}

const getIconColor = (colorClass: string): string => {
  if (colorClass.includes('blue')) return 'text-blue-600';
  if (colorClass.includes('green')) return 'text-green-600';
  if (colorClass.includes('purple')) return 'text-purple-600';
  if (colorClass.includes('indigo')) return 'text-indigo-600';
  if (colorClass.includes('cyan')) return 'text-cyan-600';
  if (colorClass.includes('pink')) return 'text-pink-600';
  if (colorClass.includes('orange')) return 'text-orange-600';
  return 'text-gray-600';
};

export function ModuleCard({ module, viewMode = "grid", onClick, variant = "junior" }: ModuleCardProps) {
  const Icon = module.icon;
  const iconColor = module.iconColor || getIconColor(module.color);

  // Primary dashboard style (simple, colorful)
  if (module.bgColor) {
    return (
      <Card 
        className={`hover:scale-105 transition-all duration-300 cursor-pointer group ${module.color} border-l-4 ${module.bgColor}`}
        onClick={onClick}
      >
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white mb-2 sm:mb-3 md:mb-4 shadow-sm">
              <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor}`} />
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {module.title}
            </h3>
            
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
              {module.description}
            </p>
            
            <div className="flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Teacher/Junior/Senior dashboard style (advanced)
  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${module.color} border-l-4 bg-white ${
        viewMode === "list" ? "flex items-center p-3 sm:p-4" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className={viewMode === "grid" ? "p-4 sm:p-6" : "flex items-center gap-3 sm:gap-4 p-0 flex-1"}>
        <div className={`${viewMode === "grid" ? "mb-3 sm:mb-4" : ""} flex-shrink-0`}>
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors truncate">
            {module.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {module.description}
          </p>
          
          {module.features && viewMode === "grid" && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              {module.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {module.moreCount && module.moreCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{module.moreCount} more
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            {module.tag && (
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                {module.tag}
              </Badge>
            )}
            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}