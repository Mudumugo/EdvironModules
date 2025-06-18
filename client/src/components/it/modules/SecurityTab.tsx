import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export function SecurityTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Firewall Status</span>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Antivirus Protection</span>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Updated
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SSL Certificates</span>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Expiring Soon
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>VPN Access</span>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Suspicious login attempt blocked</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">2 hours ago</p>
            </div>
            
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Security scan completed</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">4 hours ago</p>
            </div>
            
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Firewall rules updated</span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}