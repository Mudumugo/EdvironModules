import { useSchoolAdminDashboard } from "@/hooks/useSchoolAdminDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  Settings,
  BarChart3,
  UserPlus,
  MessageSquare,
  Shield,
  X
} from "lucide-react";

export default function SchoolAdminDashboard() {
  const {
    selectedTimeframe,
    setSelectedTimeframe,
    activeTab,
    setActiveTab,
    stats,
    quickActions,
    recentActivities,
    alerts,
    criticalAlerts,
    warningAlerts,
    unreadAlertsCount,
    statsLoading,
    getActionsByCategory,
    markAlertAsRead,
    dismissAlert,
    executeAction,
    selectedAlert,
    setSelectedAlert
  } = useSchoolAdminDashboard();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Administration</h1>
          <p className="text-gray-600">Comprehensive overview and management dashboard</p>
        </div>
        
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Critical Alerts</AlertTitle>
          <AlertDescription className="text-red-700">
            You have {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} requiring immediate attention.
            <Button variant="link" size="sm" className="p-0 ml-2 text-red-600" onClick={() => setActiveTab('alerts')}>
              View all alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Faculty members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClasses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Running courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.systemHealth || 0}%</div>
            <Progress value={stats?.systemHealth || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="activities">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {unreadAlertsCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {unreadAlertsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className="text-sm text-muted-foreground">{stats?.attendanceRate || 0}%</span>
                </div>
                <Progress value={stats?.attendanceRate || 0} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grading Completion</span>
                  <span className="text-sm text-muted-foreground">{stats?.gradingCompletion || 0}%</span>
                </div>
                <Progress value={stats?.gradingCompletion || 0} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Most frequently used admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {getActionsByCategory('users').slice(0, 4).map(action => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center space-y-1"
                      onClick={() => executeAction(action.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="text-xs text-center">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map(action => (
              <Card key={action.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <Badge variant={action.priority === 'high' ? 'destructive' : action.priority === 'medium' ? 'default' : 'secondary'}>
                      {action.priority}
                    </Badge>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => executeAction(action.id)} className="w-full">
                    Execute Action
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">By {activity.userName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {alerts.map(alert => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <div>
                      <AlertTitle>{alert.title}</AlertTitle>
                      <AlertDescription className="mt-1">{alert.message}</AlertDescription>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {alert.createdAt.toLocaleString()}
                        </span>
                        {alert.actionRequired && (
                          <Badge variant="outline" size="sm">Action Required</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.isRead && (
                      <Button size="sm" variant="ghost" onClick={() => markAlertAsRead(alert.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
                <p className="text-gray-500">All systems are running smoothly.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}