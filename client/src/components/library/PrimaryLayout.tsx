import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Download } from "lucide-react";

interface PrimaryLayoutProps {
  resources: any[];
  onResourceClick: (resource: any) => void;
}

export function PrimaryLayout({ resources, onResourceClick }: PrimaryLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resources.map((resource) => (
        <Card 
          key={resource.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onResourceClick(resource)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.subject}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary">{resource.resourceType}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Open
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}