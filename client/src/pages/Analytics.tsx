import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, Filter, Calendar } from "lucide-react";
import { useXapiPageTracking } from "@/lib/xapi/xapiHooks";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";
import LearningPathsAnalysis from "@/components/analytics/LearningPathsAnalysis";
import CompetencyTracking from "@/components/analytics/CompetencyTracking";

export default function Analytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("engagement");
  const [activeTab, setActiveTab] = useState("overview");

  // Track page view with xAPI
  useXapiPageTracking("Learning Analytics Dashboard", "analytics");

  // Fetch learning analytics data
  const { data: analyticsData, isLoading: analyticsLoading, refetch } = useQuery({
    queryKey: ['/api/learning-analytics/dashboard', selectedTimeframe]
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
    enabled: true
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

  const mockAnalyticsData = {
    overview: {
      totalLearners: 1247,
      sessions: 3892,
      avgSessionTime: 24,
      completionRate: 87
    },
    trends: {
      learners: 'up',
      sessions: 'up',
      sessionTime: 'up',
      completion: 'up'
    },
    recentActivity: [],
    topActivities: [],
    learningPaths: [],
    competencyProgress: []
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Learning Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into learning patterns, competency development, and educational outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 hours</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="competencies">Competencies</TabsTrigger>
          <TabsTrigger value="interactions">xAPI Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsOverview 
            data={analyticsData || mockAnalyticsData} 
            timeframe={selectedTimeframe} 
          />
        </TabsContent>

        <TabsContent value="learning-paths">
          <LearningPathsAnalysis data={learningPaths || mockAnalyticsData} />
        </TabsContent>

        <TabsContent value="competencies">
          <CompetencyTracking data={competencies || mockAnalyticsData} />
        </TabsContent>

        <TabsContent value="interactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>xAPI Interaction Tracking</CardTitle>
              <CardDescription>
                Real-time learning interaction data and behavioral analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Array.isArray(xapiStatements) ? xapiStatements.length : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Interactions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">24</div>
                  <div className="text-sm text-muted-foreground">Avg Actions/Session</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Recent Learning Interactions</h3>
                <div className="space-y-2">
                  {Array.isArray(xapiStatements) && xapiStatements.slice(0, 10).map((statement: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {statement.actor?.name || 'Anonymous'} {statement.verb?.display?.['en-US']} {statement.object?.definition?.name?.['en-US']}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {statement.timestamp ? new Date(statement.timestamp).toLocaleString() : 'Recently'}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {statement.context?.platform || 'Edvirons'}
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No interaction data available for the selected timeframe</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Learning Activities</CardTitle>
                <CardDescription>Most accessed educational content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Digital Library Access</span>
                    <span className="text-sm font-medium">247 interactions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Assignment Submissions</span>
                    <span className="text-sm font-medium">189 interactions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Video Content Viewing</span>
                    <span className="text-sm font-medium">156 interactions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quiz Attempts</span>
                    <span className="text-sm font-medium">134 interactions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
                <CardDescription>Behavioral insights from interaction data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Peak Learning Hours</span>
                      <span>2:00 PM - 4:00 PM</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Session Duration</span>
                      <span>28 minutes</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Most Active Day</span>
                      <span>Wednesday</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>87%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}