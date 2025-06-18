import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MonitorSpeaker,
  Play,
  Square,
  Pause,
  Users,
  Settings
} from "lucide-react";
import { ScreenSharingData } from "./LiveSessionTypes";

interface ScreenSharingPanelProps {
  screenSharing: ScreenSharingData;
  onStartScreenShare: () => void;
  onStopScreenShare: () => void;
  onQualityChange: (quality: string) => void;
}

export const ScreenSharingPanel: React.FC<ScreenSharingPanelProps> = ({
  screenSharing,
  onStartScreenShare,
  onStopScreenShare,
  onQualityChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MonitorSpeaker className="h-5 w-5" />
          Screen Sharing
        </CardTitle>
        <CardDescription>
          Share your screen with participants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={screenSharing.isActive ? "default" : "secondary"}>
              {screenSharing.isActive ? "Active" : "Inactive"}
            </Badge>
            {screenSharing.isActive && screenSharing.viewers && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{screenSharing.viewers.length} viewers</span>
              </div>
            )}
          </div>
          
          {screenSharing.isActive ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={onStopScreenShare}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Sharing
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onStartScreenShare}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Sharing
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quality Settings</label>
          <Select
            value={screenSharing.quality || "auto"}
            onValueChange={onQualityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (Recommended)</SelectItem>
              <SelectItem value="high">High Quality (1080p)</SelectItem>
              <SelectItem value="medium">Medium Quality (720p)</SelectItem>
              <SelectItem value="low">Low Quality (480p)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {screenSharing.isActive && (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <MonitorSpeaker className="h-4 w-4" />
                <span className="text-sm font-medium">Screen sharing is active</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Your screen is being shared with all participants
              </p>
            </div>

            {screenSharing.viewers && screenSharing.viewers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Current Viewers</h4>
                <div className="space-y-1">
                  {screenSharing.viewers.map((viewer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <Users className="h-3 w-3" />
                      <span>{viewer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};