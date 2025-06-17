import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
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

const navigationItems = [
  {
    section: "Core Modules",
    items: [
      { name: "Dashboard", href: "/", icon: BarChart3 },
      { name: "School Management", href: "/school-management", icon: School },
      { name: "Digital Library", href: "/digital-library", icon: BookOpen },
      { name: "Tutor Hub", href: "/tutor-hub", icon: Presentation },
    ]
  },
  {
    section: "Management",
    items: [
      { name: "Family Controls", href: "/family-controls", icon: Users },
      { name: "Scheduling & Events", href: "/scheduling", icon: Calendar },
      { name: "MDM & Surveillance", href: "/mdm-surveillance", icon: Monitor },
    ]
  },
  {
    section: "Analytics & Tools",
    items: [
      { name: "Analytics & Reporting", href: "/analytics", icon: BarChart3 },
      { name: "Virtual Labs", href: "/virtual-labs", icon: FlaskRound },
      { name: "Certification", href: "/certification", icon: IdCard },
    ]
  },
  {
    section: "System",
    items: [
      { name: "License & Subscriptions", href: "/licensing", icon: CreditCard },
      { name: "Offline Sync", href: "/offline-sync", icon: CloudDownload },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto z-40">
      <div className="p-4">
        {/* Role Badge */}
        <div className="mb-6">
          <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium">
            <Shield className="inline mr-2 h-4 w-4" />
            {user?.role === 'admin' ? 'Administrator Dashboard' : 
             user?.role === 'teacher' ? 'Teacher Dashboard' :
             user?.role === 'tutor' ? 'Tutor Dashboard' :
             user?.role === 'parent' ? 'Parent Dashboard' :
             'Student Dashboard'}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-2">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {section.section}
              </h3>
              
              {section.items.map((item, itemIndex) => {
                const isActive = location === item.href;
                const IconComponent = item.icon;
                
                return (
                  <Link key={itemIndex} href={item.href}>
                    <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <IconComponent className={`mr-3 h-4 w-4 ${
                        isActive ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      {item.name}
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
