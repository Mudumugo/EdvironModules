import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, BookOpen, Clock, Award, Target, Activity, Calendar, Download, Filter, RefreshCw, Brain, Zap, Eye, CheckCircle } from "lucide-react";
import { useXapiPageTracking } from "@/lib/xapiTracker";

export default function Analytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("engagement");

  // Track page view with xAPI
  useXapiPageTracking("Learning Analytics Dashboard", "analytics");

  // Fetch learning analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/learning-analytics/dashboard', selectedTimeframe],
    queryParams: { timeframe: selectedTimeframe }
  });

  // Fetch competency data
  const { data: competencies, isLoading: competenciesLoading } = useQuery({
    queryKey: ['/api/learning-analytics/competencies']
  });

  // Fetch learning paths data
  const { data: learningPaths, isLoading: pathsLoading } = useQuery({
    queryKey: ['/api/learning-analytics/paths']
  });

  // Fetch xAPI statements for interaction analysis
  const { data: xapiStatements, isLoading: statementsLoading } = useQuery({
    queryKey: ['/api/xapi/statements'],
    queryParams: { limit: 100 }
  });

  if (analyticsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const overview = analyticsData?.overview || {};
  const recentActivity = analyticsData?.recentActivity || [];
  const topActivities = analyticsData?.topActivities || [];
  const learningPathsData = analyticsData?.learningPaths || [];
  const competencyProgress = analyticsData?.competencyProgress || [];

  // Process xAPI data for interaction insights
  const processXapiData = () => {
    if (!xapiStatements?.statements) return { verbDistribution: [], activityTypes: [] };

    const verbCounts = {};
    const activityTypes = {};

    xapiStatements.statements.forEach(statement => {
      const verb = statement.verb.display['en-US'];
      const activityType = statement.object.definition.type.split('/').pop();
      
      verbCounts[verb] = (verbCounts[verb] || 0) + 1;
      activityTypes[activityType] = (activityTypes[activityType] || 0) + 1;
    });

    return {
      verbDistribution: Object.entries(verbCounts).map(([verb, count]) => ({ verb, count })),
      activityTypes: Object.entries(activityTypes).map(([type, count]) => ({ type, count }))
    };
  };

  const xapiInsights = processXapiData();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Learning Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights powered by xAPI learning analytics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{Math.round((overview.totalLearningTime || 0) / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              {overview.totalLearningTime || 0} minutes total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{overview.activitiesCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completed activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{overview.averageScore || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Performance average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{overview.streakDays || 0}</div>
            <p className="text-xs text-muted-foreground">
              Days active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competencies</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{overview.competenciesAchieved || 0}</div>
            <p className="text-xs text-muted-foreground">
              Skills mastered
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="xapi">xAPI Insights</TabsTrigger>
          <TabsTrigger value="competencies">Competencies</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Learning Activity</CardTitle>
                <CardDescription>Recent learning engagement trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={recentActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="activitiesCompleted" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="learningTime" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Daily average scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={recentActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="averageScore" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Learning Activities</CardTitle>
              <CardDescription>Most popular activities and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{activity.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.completions} completions • {Math.round(activity.averageDuration / 60)} min avg
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{activity.type}</Badge>
                      <Badge variant="outline">{activity.averageScore}% avg</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="xapi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Interactions</CardTitle>
                <CardDescription>xAPI verb distribution showing learning behaviors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={xapiInsights.verbDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="verb" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Types</CardTitle>
                <CardDescription>Distribution of learning content types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={xapiInsights.activityTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {xapiInsights.activityTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Learning Statements</CardTitle>
              <CardDescription>Latest xAPI tracked interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {xapiStatements?.statements?.slice(0, 5).map((statement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {statement.verb.display['en-US'] === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {statement.verb.display['en-US'] === 'watched' && <Eye className="h-5 w-5 text-blue-500" />}
                      {statement.verb.display['en-US'] === 'experienced' && <Brain className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {statement.actor.name} {statement.verb.display['en-US']} "{statement.object.definition.name['en-US']}"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(statement.timestamp).toLocaleString()}
                        {statement.result?.score && ` • Score: ${statement.result.score.raw}/${statement.result.score.max}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competencies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencyProgress.map((competency, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{competency.name}</CardTitle>
                    {competency.isAchieved && (
                      <Badge variant="default" className="bg-green-500">
                        <Award className="h-3 w-3 mr-1" />
                        Mastered
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mastery Level</span>
                        <span>{competency.masteryLevel}%</span>
                      </div>
                      <Progress value={competency.masteryLevel} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {competency.relatedActivities} related activities
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {learningPathsData.map((path, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{path.name}</CardTitle>
                      <CardDescription>
                        {path.completedActivities} of {path.totalActivities} activities completed
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{Math.round(path.progress)}%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={path.progress} className="h-3" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Progress</div>
                        <div className="text-muted-foreground">{Math.round(path.progress)}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Activities</div>
                        <div className="text-muted-foreground">{path.completedActivities}/{path.totalActivities}</div>
                      </div>
                      <div>
                        <div className="font-medium">Estimated</div>
                        <div className="text-muted-foreground">{path.estimatedCompletion}</div>
                      </div>
                      <div>
                        <div className="font-medium">Status</div>
                        <div className="text-muted-foreground">
                          {path.progress === 100 ? "Complete" : "In Progress"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Score ranges across all activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { range: "90-100%", count: 45, color: "#22c55e" },
                    { range: "80-89%", count: 38, color: "#3b82f6" },
                    { range: "70-79%", count: 22, color: "#f59e0b" },
                    { range: "60-69%", count: 12, color: "#ef4444" },
                    { range: "<60%", count: 5, color: "#dc2626" }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Efficiency</CardTitle>
                <CardDescription>Time vs performance correlation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Session Quality</span>
                    <span>87.3%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Efficiency</span>
                    <span>92.1%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retention Rate</span>
                    <span>78.5%</span>
                  </div>
                  <Progress value={79} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Score</span>
                    <span>94.2%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}