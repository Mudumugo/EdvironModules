import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  ArrowRight,
  Star,
  Clock,
  Target,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";

export default function CBEHubCard() {
  const quickStats = [
    { label: "Active Competencies", value: "24", change: "+3 this week" },
    { label: "Assessments Due", value: "8", change: "2 overdue" },
    { label: "Portfolio Items", value: "156", change: "+12 this month" }
  ];

  const recentActivities = [
    { action: "Math Competency #4 completed", time: "2h ago", type: "success" },
    { action: "Portfolio updated", time: "1d ago", type: "info" },
    { action: "New assessment available", time: "2d ago", type: "warning" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            CBE Hub
          </div>
          <Badge variant="secondary">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {quickStats.map((stat, index) => (
            <div key={index}>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Activity</h4>
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-gray-700 dark:text-gray-300">{activity.action}</span>
              </div>
              <span className="text-muted-foreground text-xs">{activity.time}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link href="/cbe-hub">
          <Button variant="outline" className="w-full">
            <GraduationCap className="h-4 w-4 mr-2" />
            Enter CBE Hub
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}