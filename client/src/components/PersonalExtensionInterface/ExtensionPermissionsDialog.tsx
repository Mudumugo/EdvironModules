import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  Mic,
  Volume2, 
  User,
  Settings,
  Shield,
  AlertTriangle
} from "lucide-react";

interface ExtensionPermissionsDialogProps {
  extension: any;
  show: boolean;
  onClose: () => void;
}

export function ExtensionPermissionsDialog({ extension, show, onClose }: ExtensionPermissionsDialogProps) {
  if (!extension) return null;

  const getPermissionIcon = (permission: string) => {
    switch (permission.toLowerCase()) {
      case 'make_calls':
      case 'call_management':
        return PhoneCall;
      case 'access_contacts':
      case 'contact_management':
        return User;
      case 'record_audio':
      case 'microphone_access':
        return Mic;
      case 'play_audio':
      case 'speaker_access':
        return Volume2;
      case 'modify_settings':
      case 'system_settings':
        return Settings;
      case 'network_access':
      case 'internet_access':
        return Phone;
      default:
        return Shield;
    }
  };

  const getPermissionLevel = (permission: string) => {
    const highRiskPermissions = ['make_calls', 'record_audio', 'modify_settings', 'system_settings'];
    return highRiskPermissions.some(p => permission.toLowerCase().includes(p)) ? 'high' : 'normal';
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Extension Permissions</span>
          </DialogTitle>
          <DialogDescription>
            {extension.name} requests the following permissions to function properly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Extension Details</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div>Name: {extension.name}</div>
              <div>Version: {extension.version}</div>
              <div>Developer: {extension.developer || 'Unknown'}</div>
              <div>Category: {extension.category}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-3">Required Permissions</h4>
            <div className="space-y-2">
              {extension.permissions?.map((permission: string, index: number) => {
                const Icon = getPermissionIcon(permission);
                const level = getPermissionLevel(permission);
                
                return (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded border">
                    <Icon className={`h-4 w-4 ${level === 'high' ? 'text-red-500' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {level === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            High Risk
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {extension.description && (
            <div>
              <h4 className="font-medium text-sm mb-2">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {extension.description}
              </p>
            </div>
          )}

          {extension.privacyPolicy && (
            <div className="text-xs text-gray-500">
              <a 
                href={extension.privacyPolicy} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Privacy Policy
              </a>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}