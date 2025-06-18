import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Database, Wifi, Settings } from "lucide-react";

export function QuickActionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common IT management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex-col gap-2 p-4">
            <Monitor className="h-6 w-6" />
            <span className="text-sm">Device Manager</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-4">
            <Database className="h-6 w-6" />
            <span className="text-sm">Database Admin</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-4">
            <Wifi className="h-6 w-6" />
            <span className="text-sm">Network Config</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 p-4">
            <Settings className="h-6 w-6" />
            <span className="text-sm">System Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}