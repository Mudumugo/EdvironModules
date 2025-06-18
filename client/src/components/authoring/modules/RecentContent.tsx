import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Video, 
  Gamepad2, 
  FileText, 
  BarChart3,
  CheckCircle,
  Clock,
  Edit,
  AlertCircle,
  Eye,
  Star,
  MoreHorizontal
} from "lucide-react";
import type { ContentItem } from "../types";

interface RecentContentProps {
  recentContent: ContentItem[];
}

export function RecentContent({ recentContent }: RecentContentProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      in_review: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      draft: { variant: "outline" as const, icon: Edit, color: "text-gray-600" },
      rejected: { variant: "destructive" as const, icon: AlertCircle, color: "text-red-600" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getContentTypeIcon = (type: string) => {
    const icons = {
      textbook: BookOpen,
      video: Video,
      interactive: Gamepad2,
      simulation: BarChart3,
      assessment: FileText
    };
    
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentContent.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getContentTypeIcon(item.type)}
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.subject} • {item.grade}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.views}
                    </div>
                    {item.rating && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {item.rating.toFixed(1)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(item.status)}
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {recentContent.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No content created yet. Start by creating your first piece of content.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}