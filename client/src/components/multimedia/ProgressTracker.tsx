import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  CheckCircle, 
  Target, 
  Bookmark, 
  Activity,
  TrendingUp,
  Award
} from "lucide-react";
import { ViewerProgress, ViewerBookmark, ViewerInteraction } from "./types";

interface ProgressTrackerProps {
  progress: ViewerProgress;
  onAddBookmark: (timestamp: number, title: string, note?: string) => void;
  onJumpToBookmark: (timestamp: number) => void;
  onJumpToTime: (timestamp: number) => void;
}

export function ProgressTracker({ 
  progress, 
  onAddBookmark, 
  onJumpToBookmark,
  onJumpToTime 
}: ProgressTrackerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInteractionCounts = () => {
    const counts = progress.interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return counts;
  };

  const getRecentInteractions = () => {
    return progress.interactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const interactionCounts = getInteractionCounts();
  const recentInteractions = getRecentInteractions();

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Viewing Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress.percentageWatched)}%</span>
            </div>
            <Progress value={progress.percentageWatched} className="h-2" />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Current: {formatTime(progress.currentTime)}</span>
              <span>Total: {formatTime(progress.totalDuration)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {progress.completed ? '✓' : Math.round(progress.percentageWatched) + '%'}
              </div>
              <div className="text-xs text-gray-600">
                {progress.completed ? 'Completed' : 'In Progress'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {formatDate(progress.lastWatched)}
              </div>
              <div className="text-xs text-gray-600">Last Watched</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Bookmarks ({progress.bookmarks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress.bookmarks.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No bookmarks yet</p>
              <p className="text-xs">Add bookmarks to save important moments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.bookmarks
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onJumpToBookmark(bookmark.timestamp)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{bookmark.title}</div>
                      <div className="text-xs text-gray-600">
                        {formatTime(bookmark.timestamp)}
                      </div>
                      {bookmark.note && (
                        <div className="text-xs text-gray-500 mt-1">
                          {bookmark.note}
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(bookmark.createdAt)}
                    </Badge>
                  </div>
                ))
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interaction Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(interactionCounts).length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No interactions recorded</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(interactionCounts).map(([type, count]) => (
                  <div key={type} className="text-center p-2 border rounded">
                    <div className="text-lg font-bold text-blue-600">{count}</div>
                    <div className="text-xs text-gray-600 capitalize">
                      {type.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {recentInteractions.map((interaction) => (
                    <div key={interaction.id} className="flex items-center justify-between text-xs">
                      <span className="capitalize">{interaction.type.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <span>{formatTime(interaction.timestamp)}</span>
                        <span className="text-gray-500">
                          {formatDate(interaction.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onJumpToTime(0)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Start from Beginning
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onAddBookmark(
              progress.currentTime, 
              `Bookmark at ${formatTime(progress.currentTime)}`
            )}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Add Bookmark Here
          </Button>

          {progress.percentageWatched > 0 && !progress.completed && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onJumpToTime(progress.currentTime)}
            >
              <Target className="h-4 w-4 mr-2" />
              Resume Watching
            </Button>
          )}

          {progress.completed && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-green-700">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Content Completed!</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}