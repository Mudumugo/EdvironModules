import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getModulesByCategory, getRoleDisplayName } from "@/config/rolePermissions";
import { UserRole } from "@shared/schema";
import { 
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  GraduationCap,
  Monitor,
  School,
  Settings,
  Shield,
  Users,
  Presentation,
  CloudDownload,
  IdCard,
  FlaskRound,
  Phone
} from "lucide-react";

// Icon mapping for dynamic module loading
const iconMap: Record<string, any> = {
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  GraduationCap,
  Monitor,
  School,
  Settings,
  Shield,
  Users,
  Presentation,
  CloudDownload,
  IdCard,
  FlaskRound,
  Phone
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  if (!user || !user.role) return null;
  
  const userRole = user.role as UserRole;
  const modulesByCategory = getModulesByCategory(userRole);
  
  const renderModuleSection = (title: string, modules: any[], sectionIcon?: any) => {
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
  };

  return (
    <nav className={`w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto z-50 transition-transform duration-200 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="p-4">
        {/* Role Badge */}
        <div className="mb-6">
          <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium">
            <Shield className="inline mr-2 h-4 w-4" />
            {getRoleDisplayName(userRole)} Portal
          </div>
        </div>

        {/* Core Modules */}
        {renderModuleSection("ESSENTIALS", modulesByCategory.core, BookOpen)}
        
        {/* Educational Modules */}
        {renderModuleSection("TEACHING", modulesByCategory.educational, Presentation)}
        
        {/* Administrative Modules */}
        {renderModuleSection("ADMINISTRATION", modulesByCategory.administrative, School)}
        
        {/* Technical Modules */}
        {renderModuleSection("TECHNICAL", modulesByCategory.technical, Monitor)}
        
        {/* Security Modules */}
        {renderModuleSection("SECURITY", modulesByCategory.security, Shield)}

        {/* User Info Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="truncate">{user.email}</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              {getRoleDisplayName(userRole)}
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}