import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { SystemAlert } from "../types";

interface AlertsSectionProps {
  alerts: SystemAlert[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`border-l-4 ${alert.urgent ? 'border-l-red-500' : 'border-l-blue-500'}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.urgent ? 'text-red-500' : 'text-blue-500'}`} />
                <div>
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                </div>
              </div>
              {alert.urgent && (
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}