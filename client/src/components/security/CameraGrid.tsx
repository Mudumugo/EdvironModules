import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Eye, Settings, AlertTriangle } from "lucide-react";

interface CameraGridProps {
  zoneId?: string;
}

export function CameraGrid({ zoneId }: CameraGridProps) {
  const { data: cameras, isLoading } = useQuery({
    queryKey: zoneId ? ["/api/security/cameras", { zoneId }] : ["/api/security/cameras"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras?.map((camera: any) => (
        <Card key={camera.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{camera.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={camera.status === "online" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {camera.status}
                </Badge>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="aspect-video bg-black rounded-lg mb-3 relative overflow-hidden">
              {camera.status === "online" ? (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="h-8 w-8 mx-auto mb-2 opacity-60" />
                    <p className="text-xs opacity-80">Live Feed</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
                  <div className="text-center text-red-300">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs">Offline</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Location: {camera.location}</span>
                <span>Zone: {camera.zoneName}</span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Record
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}