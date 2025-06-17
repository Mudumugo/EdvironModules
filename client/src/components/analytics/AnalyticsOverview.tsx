import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, BookOpen, Clock, Award, Target, Activity } from "lucide-react";

interface AnalyticsOverviewProps {
  data: any;
  timeframe: string;
}

export default function AnalyticsOverview({ data, timeframe }: AnalyticsOverviewProps) {
  const overview = data?.overview || {};
  const trends = data?.trends || {};

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  const metrics = [
    {
      title: "Total Learners",
      value: overview.totalLearners || 0,
      icon: Users,
      trend: trends.learners || 'up',
      change: "+12%",
      description: "Active learning participants"
    },
    {
      title: "Learning Sessions",
      value: overview.sessions || 0,
      icon: BookOpen,
      trend: trends.sessions || 'up',
      change: "+8%",
      description: "Completed learning activities"
    },
    {
      title: "Avg Session Time",
      value: `${overview.avgSessionTime || 0}min`,
      icon: Clock,
      trend: trends.sessionTime || 'up',
      change: "+15%",
      description: "Time spent learning"
    },
    {
      title: "Completion Rate",
      value: `${overview.completionRate || 0}%`,
      icon: Award,
      trend: trends.completion || 'up',
      change: "+5%",
      description: "Course completion percentage"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <TrendIcon className={`h-3 w-3 ${getTrendColor(metric.trend)}`} />
                  <span className={getTrendColor(metric.trend)}>{metric.change}</span>
                  <span>from last {timeframe}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Engagement</CardTitle>
            <CardDescription>Student interaction levels across modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Digital Library</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Teacher Dashboard</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Device Management</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analytics</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
            <CardDescription>Progress toward competency goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Mathematics Proficiency</span>
                </div>
                <Badge variant="secondary">78%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Science Understanding</span>
                </div>
                <Badge variant="secondary">85%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Critical Thinking</span>
                </div>
                <Badge variant="secondary">72%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Digital Literacy</span>
                </div>
                <Badge variant="secondary">91%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}