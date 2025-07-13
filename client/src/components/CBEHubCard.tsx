import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Users, 
  ArrowRight,
  Star,
  Clock,
  Target
} from "lucide-react";
import { Link } from "wouter";

export default function CBEHubCard() {
  const cbeFeatures = [
    {
      title: "Competency Tracking",
      description: "Monitor student progress across key competencies",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Assessment Tools",
      description: "Performance-based assessment and evaluation",
      icon: Trophy,
      color: "text-green-600"
    },
    {
      title: "Learning Pathways",
      description: "Personalized competency-based learning paths",
      icon: BookOpen,
      color: "text-purple-600"
    },
    {
      title: "Portfolio Builder",
      description: "Student work and achievement portfolios",
      icon: Star,
      color: "text-orange-600"
    }
  ];

  const quickStats = [
    { label: "Active Competencies", value: "24", trend: "+3 this week" },
    { label: "Assessments Due", value: "8", trend: "2 overdue" },
    { label: "Portfolio Items", value: "156", trend: "+12 this month" }
  ];

  return (
    <Card className="w-full border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
                CBE Hub
              </CardTitle>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Competency-Based Education Center
              </p>
            </div>
          </div>
          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-lg">
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {stat.value}
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                {stat.label}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {cbeFeatures.map((feature, index) => (
            <div 
              key={index}
              className="p-3 bg-white/60 dark:bg-black/20 rounded-lg hover:bg-white/80 dark:hover:bg-black/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <feature.icon className={`h-4 w-4 ${feature.color}`} />
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h4>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href="/cbe-hub" className="flex-1">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              size="sm"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Enter CBE Hub
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
          <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Recent Activity
          </h5>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 dark:text-gray-300">Math Competency #4 completed</span>
              <span className="text-blue-600 dark:text-blue-400">2h ago</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 dark:text-gray-300">Portfolio updated</span>
              <span className="text-blue-600 dark:text-blue-400">1d ago</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 dark:text-gray-300">New assessment available</span>
              <span className="text-blue-600 dark:text-blue-400">2d ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}