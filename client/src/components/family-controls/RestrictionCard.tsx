import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Lock, Trash2 } from "lucide-react";
import type { Restriction, Child } from "@/hooks/useFamilyControls";

interface RestrictionCardProps {
  restriction: Restriction;
  child?: Child;
  onToggle?: (id: string, isActive: boolean) => void;
  onDelete?: (id: string) => void;
}

export function RestrictionCard({ restriction, child, onToggle, onDelete }: RestrictionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">{restriction.category}</CardTitle>
              <p className="text-sm text-muted-foreground">
                For {child?.firstName} {child?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={restriction.isActive ? "default" : "secondary"}>
              {restriction.isActive ? "Active" : "Inactive"}
            </Badge>
            <Switch 
              checked={restriction.isActive} 
              onCheckedChange={(checked) => onToggle?.(restriction.id, checked)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Type:</span>
            <span className="text-sm capitalize">{restriction.type.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Value:</span>
            <span className="text-sm">{restriction.value}</span>
          </div>
          {restriction.description && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">{restriction.description}</p>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete?.(restriction.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}