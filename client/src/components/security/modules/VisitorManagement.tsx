import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";

interface VisitorManagementProps {
  securityVisitors: any[];
  getStatusColor: (status: string) => string;
}

export function VisitorManagement({ securityVisitors, getStatusColor }: VisitorManagementProps) {
  return (
    <div className="space-y-4">
      {securityVisitors?.map((visitor: any) => (
        <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{visitor.name}</p>
              <p className="text-sm text-muted-foreground">
                {visitor.purpose} • {visitor.hostName}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Check-in: {new Date(visitor.checkInTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(visitor.status)}>
              {visitor.status}
            </Badge>
            {visitor.status === "checked_in" && (
              <Button size="sm" variant="outline">
                Check Out
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}