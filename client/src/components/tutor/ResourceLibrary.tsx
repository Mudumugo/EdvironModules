import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Download, Eye, Upload } from "lucide-react";

interface ResourceLibraryProps {
  resources: any[];
  filteredResources: any[];
  onEditResource?: (resourceId: number) => void;
  onDeleteResource?: (resourceId: number) => void;
}

export function ResourceLibrary({
  resources,
  filteredResources,
  onEditResource,
  onDeleteResource
}: ResourceLibraryProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "Video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "Worksheet":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "Presentation":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "Quiz":
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PDF": return "bg-red-100 text-red-800";
      case "Video": return "bg-blue-100 text-blue-800";
      case "Worksheet": return "bg-green-100 text-green-800";
      case "Presentation": return "bg-orange-100 text-orange-800";
      case "Quiz": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Learning Resources</h3>
        <span className="text-sm text-muted-foreground">
          {filteredResources.length} of {resources.length} resources
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getResourceIcon(resource.type)}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight">
                      {resource.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(resource.type)} variant="secondary">
                        {resource.type}
                      </Badge>
                      <Badge variant="outline">{resource.subject}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {resource.downloads} downloads
                  </span>
                  <span>Created: {resource.created}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredResources.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No resources found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}