import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function InfrastructureTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Network Infrastructure</CardTitle>
          <CardDescription>Current network status and connected devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Main Router</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>WiFi Access Points</span>
              <Badge variant="default">8/8 Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Network Switches</span>
              <Badge variant="default">12/12 Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Firewall</span>
              <Badge variant="default">Protected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Server Infrastructure</CardTitle>
          <CardDescription>Physical and virtual server status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Web Servers</span>
              <Badge variant="default">4/4 Running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Database Servers</span>
              <Badge variant="default">2/2 Running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Application Servers</span>
              <Badge variant="default">6/6 Running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Backup Servers</span>
              <Badge variant="secondary">1/2 Running</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}