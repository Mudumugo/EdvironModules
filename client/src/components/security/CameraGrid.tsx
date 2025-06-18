import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Video, VolumeX, Volume2, Wifi, WifiOff, Settings } from "lucide-react";

interface Camera {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  ipAddress: string;
  streamUrl: string;
  isOnline: boolean;
  isRecording: boolean;
  resolution: string;
  orientation: string;
  hasAudio: boolean;
  lastPing: string;
}

interface CameraGridProps {
  cameras: Camera[];
  onCameraSelect?: (camera: Camera) => void;
  onToggleRecording?: (cameraId: string) => void;
}

export default function CameraGrid({ cameras, onCameraSelect, onToggleRecording }: CameraGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <Card key={camera.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{camera.name}</CardTitle>
              <div className="flex items-center space-x-1">
                {camera.isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                {camera.hasAudio ? (
                  <Volume2 className="h-4 w-4 text-blue-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{camera.zoneName}</span>
              <Badge variant={camera.isOnline ? "default" : "destructive"} className="text-xs">
                {camera.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Camera Preview/Stream */}
            <div 
              className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => onCameraSelect?.(camera)}
            >
              {camera.isOnline ? (
                <div className="flex items-center justify-center h-full">
                  <Camera className="h-12 w-12 text-gray-400" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                    Live Feed
                  </div>
                  {camera.isRecording && (
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span>REC</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-800">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Camera Offline</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Resolution:</span>
                <Badge variant="outline" className="text-xs">{camera.resolution}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">IP Address:</span>
                <span className="font-mono">{camera.ipAddress}</span>
              </div>
              {camera.isOnline && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Last Ping:</span>
                  <span>{new Date(camera.lastPing).toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={camera.isRecording ? "destructive" : "default"}
                className="flex-1"
                disabled={!camera.isOnline}
                onClick={() => onToggleRecording?.(camera.id)}
              >
                <Video className="h-3 w-3 mr-1" />
                {camera.isRecording ? "Stop" : "Record"}
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}