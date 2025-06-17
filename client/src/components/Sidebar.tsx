import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getNavigationStructure } from "@/config/modules";
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
  FlaskRound
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
  FlaskRound
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Get navigation structure based on user role and enabled modules
  const userRole = (user as any)?.role || 'student';
  const navigationItems = getNavigationStructure(userRole);

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto z-40">
      <div className="p-4">
        {/* Role Badge */}
        <div className="mb-6">
          <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium">
            <Shield className="inline mr-2 h-4 w-4" />
            {userRole === 'admin' ? 'Administrator Dashboard' : 
             userRole === 'teacher' ? 'Teacher Dashboard' :
             userRole === 'tutor' ? 'Tutor Dashboard' :
             userRole === 'parent' ? 'Parent Dashboard' :
             'Student Dashboard'}
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <div className="space-y-2">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {section.section}
              </h3>
              
              {section.items.map((item, itemIndex) => {
                const isActive = location === item.route;
                const IconComponent = iconMap[item.icon] || Settings;
                
                return (
                  <Link key={itemIndex} href={item.route}>
                    <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <IconComponent className={`mr-3 h-4 w-4 ${
                        isActive ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      {item.name}
                      {item.isPremium && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Pro
                        </Badge>
                      )}
                    </a>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
