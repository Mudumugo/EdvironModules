import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Settings } from "lucide-react";
import type { Child } from "@/hooks/useFamilyControls";

interface ChildProfileCardProps {
  child: Child;
  onViewDetails?: (childId: string) => void;
  onSettings?: (childId: string) => void;
}

export function ChildProfileCard({ child, onViewDetails, onSettings }: ChildProfileCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{child.avatar}</div>
            <div>
              <CardTitle className="text-lg">{child.firstName} {child.lastName}</CardTitle>
              <p className="text-sm text-muted-foreground">{child.grade} • {child.school}</p>
            </div>
          </div>
          <Badge className={getStatusColor(child.status)}>
            {child.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Weekly Screen Time</span>
            <span>{child.totalScreenTime}h / {child.weeklyGoal}h</span>
          </div>
          <Progress 
            value={(child.totalScreenTime / child.weeklyGoal) * 100} 
            className="h-2"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Subject Progress</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(child.weeklyProgress).map(([subject, progress]) => (
              <div key={subject} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize">{subject}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Last active: {format(parseISO(child.lastActive), "MMM d, HH:mm")}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(child.id)}>
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onSettings?.(child.id)}>
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}