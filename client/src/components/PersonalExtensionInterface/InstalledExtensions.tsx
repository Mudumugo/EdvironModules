import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Settings, Info } from "lucide-react";

interface InstalledExtensionsProps {
  extensions: any[];
  loading: boolean;
  uninstalling: boolean;
  toggling: boolean;
  onUninstall: (extension: any) => void;
  onToggle: (extension: any) => void;
  onShowPermissions: (show: boolean) => void;
  setSelectedExtension: (extension: any) => void;
}

export function InstalledExtensions({
  extensions,
  loading,
  uninstalling,
  toggling,
  onUninstall,
  onToggle,
  onShowPermissions,
  setSelectedExtension
}: InstalledExtensionsProps) {
  const handleShowPermissions = (extension: any) => {
    setSelectedExtension(extension);
    onShowPermissions(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (extensions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Extensions Installed</h3>
            <p>Browse the extension library to find and install extensions for your phone system.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {extensions.map((extension) => (
        <Card key={extension.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium">{extension.name}</h3>
                  <Badge 
                    variant={extension.isEnabled ? 'default' : 'secondary'}
                  >
                    {extension.isEnabled ? 'Active' : 'Disabled'}
                  </Badge>
                  {extension.category === 'premium' && (
                    <Badge variant="outline">Premium</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {extension.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Version {extension.version}</span>
                  <span>Installed {extension.installedDate}</span>
                  {extension.lastUsed && (
                    <span>Last used {extension.lastUsed}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={extension.isEnabled}
                  onCheckedChange={() => onToggle(extension)}
                  disabled={toggling}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShowPermissions(extension)}
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUninstall(extension)}
                  disabled={uninstalling}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {extension.features && extension.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {extension.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}