import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity, 
  Lock, 
  Unlock,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface SecurityStatus {
  timestamp: string;
  rateLimiting: {
    enabled: boolean;
    authLimit: number;
    apiLimit: number;
    uploadLimit: number;
  };
  contentSecurity: {
    helmet: boolean;
    inputSanitization: boolean;
    fileValidation: boolean;
    sensitiveDataScanning: boolean;
  };
  sessionSecurity: {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
  };
  accessControl: {
    roleBasedAccess: boolean;
    permissionValidation: boolean;
    sessionValidation: boolean;
  };
}

interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  userId?: string;
  ip: string;
  userAgent?: string;
  success?: boolean;
  resource?: string;
  reason?: string;
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [incidentForm, setIncidentForm] = useState({
    type: "",
    description: "",
    severity: "medium",
    affectedUsers: ""
  });

  // Fetch security status
  const { data: securityStatus, isLoading: statusLoading } = useQuery<SecurityStatus>({
    queryKey: ["/api/security/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch audit logs
  const { data: auditData, isLoading: logsLoading } = useQuery<{logs: AuditLog[], total: number}>({
    queryKey: ["/api/security/audit-logs"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Account lock/unlock mutation
  const accountActionMutation = useMutation({
    mutationFn: async ({ userId, action, reason }: { userId: string; action: string; reason: string }) => {
      return apiRequest(`/api/security/account/${userId}/${action}`, {
        method: "POST",
        body: { reason }
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Success",
        description: `Account ${variables.action} successful`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/security/audit-logs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to perform account action`,
        variant: "destructive"
      });
    }
  });

  // Force password reset mutation
  const passwordResetMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      return apiRequest(`/api/security/force-password-reset/${userId}`, {
        method: "POST",
        body: { reason }
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset initiated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/security/audit-logs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate password reset",
        variant: "destructive"
      });
    }
  });

  // Security incident reporting mutation
  const incidentMutation = useMutation({
    mutationFn: async (incident: typeof incidentForm) => {
      return apiRequest("/api/security/incident", {
        method: "POST",
        body: incident
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Security incident reported successfully"
      });
      setIncidentForm({
        type: "",
        description: "",
        severity: "medium",
        affectedUsers: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to report incident",
        variant: "destructive"
      });
    }
  });

  const handleAccountAction = (action: string, reason: string) => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive"
      });
      return;
    }
    
    accountActionMutation.mutate({ userId: selectedUserId, action, reason });
  };

  const handlePasswordReset = (reason: string) => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive"
      });
      return;
    }
    
    passwordResetMutation.mutate({ userId: selectedUserId, reason });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getEventBadgeColor = (event: string, success?: boolean) => {
    if (success === false) return "destructive";
    switch (event) {
      case "login_attempt": return "default";
      case "permission_denied": return "destructive";
      case "account_locked": return "destructive";
      case "password_reset": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Monitor and manage security across the platform</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Status Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rate Limiting</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityStatus?.rateLimiting.enabled ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Auth: {securityStatus?.rateLimiting.authLimit}/15min
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Security</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityStatus?.contentSecurity.helmet ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Helmet + Validation Active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session Security</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityStatus?.sessionSecurity.httpOnly ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  HttpOnly + Secure Cookies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Access Control</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityStatus?.accessControl.roleBasedAccess ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  RBAC + Permissions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Security Status */}
          {securityStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration Details</CardTitle>
                <CardDescription>
                  Last updated: {new Date(securityStatus.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Rate Limiting</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Authentication:</span>
                        <span>{securityStatus.rateLimiting.authLimit} attempts/15min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Requests:</span>
                        <span>{securityStatus.rateLimiting.apiLimit} requests/15min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>File Uploads:</span>
                        <span>{securityStatus.rateLimiting.uploadLimit} uploads/hour</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Security Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Input Sanitization:</span>
                        <Badge variant={securityStatus.contentSecurity.inputSanitization ? "default" : "destructive"}>
                          {securityStatus.contentSecurity.inputSanitization ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>File Validation:</span>
                        <Badge variant={securityStatus.contentSecurity.fileValidation ? "default" : "destructive"}>
                          {securityStatus.contentSecurity.fileValidation ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Scanning:</span>
                        <Badge variant={securityStatus.contentSecurity.sensitiveDataScanning ? "default" : "destructive"}>
                          {securityStatus.contentSecurity.sensitiveDataScanning ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Security Audit Logs</CardTitle>
                <CardDescription>Real-time security events and authentication attempts</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/security/audit-logs"] })}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {auditData?.logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={getEventBadgeColor(log.event, log.success)}>
                          {log.event.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">
                            {log.event === 'login_attempt' && `Login attempt ${log.success ? 'successful' : 'failed'}`}
                            {log.event === 'permission_denied' && `Access denied to ${log.resource}`}
                            {log.event === 'account_locked' && 'Account locked'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            IP: {log.ip} • {log.userId ? `User: ${log.userId}` : 'Unknown user'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Lock, unlock, or reset user accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="Enter user ID"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Button
                    onClick={() => handleAccountAction("lock", "Administrative action")}
                    variant="destructive"
                    className="w-full"
                    disabled={accountActionMutation.isPending}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Lock Account
                  </Button>
                  
                  <Button
                    onClick={() => handleAccountAction("unlock", "Administrative action")}
                    variant="outline"
                    className="w-full"
                    disabled={accountActionMutation.isPending}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Unlock Account
                  </Button>
                  
                  <Button
                    onClick={() => handlePasswordReset("Administrative password reset")}
                    variant="outline"
                    className="w-full"
                    disabled={passwordResetMutation.isPending}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Password Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Permissions</CardTitle>
                <CardDescription>Check user permissions and access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="permissionUserId">User ID</Label>
                    <Input
                      id="permissionUserId"
                      placeholder="Enter user ID to check permissions"
                    />
                  </div>
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Check Permissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Security Incident</CardTitle>
              <CardDescription>Document and track security incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="incidentType">Incident Type</Label>
                  <Input
                    id="incidentType"
                    placeholder="e.g., Unauthorized access, Data breach, Suspicious activity"
                    value={incidentForm.type}
                    onChange={(e) => setIncidentForm({...incidentForm, type: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select value={incidentForm.severity} onValueChange={(value) => setIncidentForm({...incidentForm, severity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the security incident..."
                    value={incidentForm.description}
                    onChange={(e) => setIncidentForm({...incidentForm, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="affectedUsers">Affected Users (comma-separated IDs)</Label>
                  <Input
                    id="affectedUsers"
                    placeholder="user1, user2, user3"
                    value={incidentForm.affectedUsers}
                    onChange={(e) => setIncidentForm({...incidentForm, affectedUsers: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={() => incidentMutation.mutate(incidentForm)}
                  className="w-full"
                  disabled={incidentMutation.isPending}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Incident
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}