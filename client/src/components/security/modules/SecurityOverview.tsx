import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import SecurityEventsList from "@/components/security/SecurityEventsList";

interface SecurityOverviewProps {
  securityEvents: any[];
  eventsLoading: boolean;
  zones: any[];
}

export function SecurityOverview({ securityEvents, eventsLoading, zones }: SecurityOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Latest incidents and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityEventsList 
            events={securityEvents?.slice(0, 5) || []} 
            isLoading={eventsLoading}
          />
        </CardContent>
      </Card>

      {/* Zone Status */}
      <Card>
        <CardHeader>
          <CardTitle>Security Zones</CardTitle>
          <CardDescription>Zone monitoring status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {zones?.map((zone: any) => (
            <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-sm text-muted-foreground">{zone.description}</p>
                </div>
              </div>
              <Badge variant={zone.status === "active" ? "default" : "secondary"}>
                {zone.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}