import { Link, useLocation } from "wouter";
import { iconMap } from "./iconMap";

interface Module {
  id: string;
  name: string;
  path: string;
  icon: string;
}

interface SidebarModuleSectionProps {
  title: string;
  modules: Module[];
  sectionIcon?: any;
  onClose?: () => void;
}

export function SidebarModuleSection({ 
  title, 
  modules, 
  sectionIcon, 
  onClose 
}: SidebarModuleSectionProps) {
  const [location] = useLocation();
  
  if (modules.length === 0) return null;
  
  const SectionIcon = sectionIcon;
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {SectionIcon && <SectionIcon className="h-4 w-4" />}
        {title}
      </div>
      <nav className="space-y-1">
        {modules.map((module) => {
          const Icon = iconMap[module.icon];
          const isActive = location === module.path;
          
          return (
            <Link
              key={module.id}
              href={module.path}
              onClick={onClose}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group
                ${isActive 
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0" />}
              <span className="truncate">{module.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}