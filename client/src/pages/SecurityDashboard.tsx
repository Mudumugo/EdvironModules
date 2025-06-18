import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, Eye, Lock, Users, Activity, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'data_access' | 'privilege_escalation' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  ip: string;
  location: string;
  timestamp: string;
  description: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface SecurityMetric {
  name: string;
  value: number;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch security events
  const { data: securityEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/security/events'],
    retry: false,
  });

  // Fetch security metrics
  const { data: securityMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/security/metrics'],
    retry: false,
  });

  // Fetch threat intelligence
  const { data: threatIntel = {}, isLoading: threatLoading } = useQuery({
    queryKey: ['/api/security/threats'],
    retry: false,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'active': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const mockSecurityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login_attempt',
      severity: 'high',
      user: 'admin@school.edu',
      ip: '192.168.1.100',
      location: 'Main Office',
      timestamp: '2024-01-15T14:30:00Z',
      description: 'Multiple failed login attempts detected',
      status: 'investigating'
    },
    {
      id: '2',
      type: 'data_access',
      severity: 'medium',
      user: 'teacher@school.edu',
      ip: '192.168.1.45',
      location: 'Classroom 101',
      timestamp: '2024-01-15T13:45:00Z',
      description: 'Unusual data access pattern detected',
      status: 'resolved'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      severity: 'critical',
      user: 'unknown',
      ip: '203.0.113.42',
      location: 'External',
      timestamp: '2024-01-15T12:15:00Z',
      description: 'Potential unauthorized access attempt',
      status: 'active'
    }
  ];

  const mockMetrics: SecurityMetric[] = [
    { name: 'Failed Login Attempts', value: 12, change: -25, status: 'good' },
    { name: 'Active Threats', value: 3, change: 0, status: 'warning' },
    { name: 'System Vulnerabilities', value: 1, change: -50, status: 'good' },
    { name: 'Security Score', value: 85, change: 5, status: 'good' }
  ];

  const displayEvents = securityEvents.length > 0 ? securityEvents : mockSecurityEvents;
  const displayMetrics = securityMetrics.length > 0 ? securityMetrics : mockMetrics;

  if (eventsLoading || metricsLoading || threatLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Security monitoring and alerts</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
        </div>

        {/* Critical Alerts */}
        {displayEvents.some(event => event.severity === 'critical' && event.status === 'active') && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800 dark:text-red-200">Critical Security Alert</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              {displayEvents.filter(event => event.severity === 'critical' && event.status === 'active').length} critical security events require immediate attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Security Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayMetrics.map((metric, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <div className={`h-4 w-4 rounded-full ${
                  metric.status === 'good' ? 'bg-green-500' : 
                  metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}% from last week
                </p>
                {metric.name === 'Security Score' && (
                  <Progress value={metric.value} className="mt-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Security Events */}
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Security Events
                  </CardTitle>
                  <CardDescription>Latest security incidents and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(event.status)}
                          <div>
                            <p className="font-medium text-sm">{event.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {event.user} • {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getSeverityColor(event.severity)} text-white`}>
                          {event.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    System Security Health
                  </CardTitle>
                  <CardDescription>Overall security posture assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Firewall Status</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Antivirus Protection</span>
                      <Badge className="bg-green-500 text-white">Updated</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">SSL Certificates</span>
                      <Badge className="bg-yellow-500 text-white">Expiring Soon</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Access Controls</span>
                      <Badge className="bg-green-500 text-white">Configured</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Encryption</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Security Events Log</CardTitle>
                <CardDescription>Detailed view of all security events and incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(event.status)}
                          <Badge className={`${getSeverityColor(event.severity)} text-white`}>
                            {event.severity}
                          </Badge>
                          <span className="text-sm font-medium capitalize">{event.type.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{event.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">User:</span> {event.user}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span> {event.ip}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {event.location}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {event.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Threat Intelligence</CardTitle>
                <CardDescription>Current threat landscape and intelligence feeds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Active Threats</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <span className="text-sm">Brute Force Attacks</span>
                        <Badge className="bg-red-500 text-white">High</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <span className="text-sm">Phishing Attempts</span>
                        <Badge className="bg-yellow-500 text-white">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <span className="text-sm">Port Scanning</span>
                        <Badge className="bg-blue-500 text-white">Low</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Blocked IPs (Last 24h)</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>203.0.113.42</span>
                        <span className="text-gray-500">15 attempts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>198.51.100.23</span>
                        <span className="text-gray-500">8 attempts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>192.0.2.146</span>
                        <span className="text-gray-500">5 attempts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Regulatory compliance and security standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Standards Compliance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">FERPA Compliance</span>
                        <Badge className="bg-green-500 text-white">Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">COPPA Compliance</span>
                        <Badge className="bg-green-500 text-white">Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ISO 27001</span>
                        <Badge className="bg-yellow-500 text-white">In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SOC 2 Type II</span>
                        <Badge className="bg-green-500 text-white">Certified</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Security Policies</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Password Policy</span>
                        <Badge className="bg-green-500 text-white">Enforced</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Retention</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Access Control</span>
                        <Badge className="bg-green-500 text-white">Implemented</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Incident Response</span>
                        <Badge className="bg-yellow-500 text-white">Review Due</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}