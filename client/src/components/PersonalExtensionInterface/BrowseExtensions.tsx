import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Star, Info } from "lucide-react";

interface BrowseExtensionsProps {
  extensions: any[];
  loading: boolean;
  installing: boolean;
  onInstall: (extension: any) => void;
  onShowPermissions: (show: boolean) => void;
  setSelectedExtension: (extension: any) => void;
}

export function BrowseExtensions({ 
  extensions, 
  loading, 
  installing, 
  onInstall, 
  onShowPermissions, 
  setSelectedExtension 
}: BrowseExtensionsProps) {
  const handleShowPermissions = (extension: any) => {
    setSelectedExtension(extension);
    onShowPermissions(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {extensions.map((extension) => (
        <Card key={extension.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{extension.name}</CardTitle>
                <CardDescription className="mt-1">
                  {extension.shortDescription}
                </CardDescription>
              </div>
              <Badge 
                variant={extension.category === 'premium' ? 'default' : 'secondary'}
                className="ml-2"
              >
                {extension.category}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {extension.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{extension.rating}</span>
              </div>
              <div>
                {extension.downloads} downloads
              </div>
              <div>
                v{extension.version}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => onInstall(extension)}
                disabled={installing}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                {installing ? 'Installing...' : 'Install'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShowPermissions(extension)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {extension.features && extension.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {extension.features.slice(0, 3).map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {extension.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{extension.features.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}