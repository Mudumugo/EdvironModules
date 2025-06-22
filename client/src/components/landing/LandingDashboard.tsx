import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FolderOpen,
  FileText,
  BarChart3,
  Grid3X3,
  ChevronRight
} from "lucide-react";

interface Module {
  title: string;
  description: string;
  icon: any;
  color: string;
  iconColor: string;
  badge: string;
  features: string[];
  moreCount: number;
}

interface LandingDashboardProps {
  activeTab: string;
  modules: Module[];
}

export function LandingDashboard({ activeTab, modules }: LandingDashboardProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {activeTab || "Educational Modules Dashboard"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our integrated platform provides everything you need to manage, teach, and learn effectively 
            in the modern educational environment.
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {modules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${module.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 ${module.iconColor}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {module.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {module.description}
                  </p>
                  
                  <div className="space-y-3">
                    {module.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                    {module.moreCount > 0 && (
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        +{module.moreCount} more features
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Message */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            All Modules Work Together Seamlessly
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Data flows automatically between modules, creating a unified educational ecosystem 
            that saves time and improves outcomes for students, teachers, and administrators.
          </p>
        </div>
      </div>
    </section>
  );
}