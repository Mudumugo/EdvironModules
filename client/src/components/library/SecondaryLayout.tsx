import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Download, ExternalLink } from "lucide-react";

interface SecondaryLayoutProps {
  resources: any[];
  onResourceClick: (resource: any) => void;
}

export function SecondaryLayout({ resources, onResourceClick }: SecondaryLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <Card 
          key={resource.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onResourceClick(resource)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <Badge variant="secondary" className="text-xs">
                  {resource.resourceType}
                </Badge>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-base line-clamp-2">{resource.title}</CardTitle>
            <CardDescription className="text-sm">{resource.subject}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <Button size="sm" variant="outline">
                  <Play className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">{resource.gradeLevel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}