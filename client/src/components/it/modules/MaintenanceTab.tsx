import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MaintenanceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Maintenance & Tasks</CardTitle>
        <CardDescription>Upcoming maintenance windows and system updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Security Updates</h4>
                <p className="text-sm text-muted-foreground">Critical system patches pending</p>
              </div>
              <Badge variant="destructive">High Priority</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Scheduled: Tonight, 2:00 AM</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Database Optimization</h4>
                <p className="text-sm text-muted-foreground">Performance tuning and cleanup</p>
              </div>
              <Badge variant="secondary">Medium Priority</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Scheduled: Weekend, 6:00 PM</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Backup Verification</h4>
                <p className="text-sm text-muted-foreground">Monthly backup integrity check</p>
              </div>
              <Badge variant="outline">Routine</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Scheduled: Monthly, 1st Sunday</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}