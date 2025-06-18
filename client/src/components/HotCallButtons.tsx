import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  PhoneCall, 
  Users, 
  Shield, 
  Building, 
  Clock, 
  PhoneIncoming,
  PhoneOutgoing,
  UserCheck,
  AlertCircle
} from "lucide-react";

interface Extension {
  id: number;
  extension: string;
  name: string;
  department: string;
  status: 'available' | 'busy' | 'offline' | 'dnd';
  location: string;
  type: 'user' | 'department' | 'emergency' | 'external';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

const statusColors = {
  available: 'bg-green-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-500',
  dnd: 'bg-yellow-500'
};

const statusLabels = {
  available: 'Available',
  busy: 'Busy',
  offline: 'Offline',
  dnd: 'Do Not Disturb'
};

const typeIcons = {
  user: UserCheck,
  department: Building,
  emergency: AlertCircle,
  external: PhoneOutgoing
};

export default function HotCallButtons() {
  const [isDialing, setIsDialing] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: extensionsData, isLoading } = useQuery({
    queryKey: ['/api/pbx/extensions'],
  });

  const extensions: Extension[] = extensionsData?.extensions || [];

  // Filter and organize extensions by priority and type
  const emergencyExtensions = extensions.filter(ext => ext.type === 'emergency');
  const departmentExtensions = extensions.filter(ext => ext.type === 'department');
  const userExtensions = extensions.filter(ext => ext.type === 'user' && ext.priority === 'high');
  const externalExtensions = extensions.filter(ext => ext.type === 'external');

  const handleCall = async (extension: string, name: string) => {
    setIsDialing(extension);
    
    try {
      // Simulate call initiation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Call Initiated",
        description: `Calling ${name} at extension ${extension}`,
      });
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDialing(null);
    }
  };

  const ExtensionButton = ({ extension }: { extension: Extension }) => {
    const Icon = typeIcons[extension.type];
    const isCurrentlyDialing = isDialing === extension.extension;

    return (
      <Button
        variant="outline"
        className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted/50 transition-all"
        onClick={() => handleCall(extension.extension, extension.name)}
        disabled={isCurrentlyDialing || extension.status === 'offline'}
      >
        <div className="flex items-center space-x-2 w-full">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <div className={`w-2 h-2 rounded-full ${statusColors[extension.status]}`} />
          </div>
          <Badge variant="secondary" className="text-xs">
            {extension.extension}
          </Badge>
        </div>
        
        <div className="text-center">
          <div className="font-medium text-sm">{extension.name}</div>
          <div className="text-xs text-muted-foreground">{extension.department}</div>
          {extension.location && (
            <div className="text-xs text-muted-foreground">{extension.location}</div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {isCurrentlyDialing ? (
            <PhoneCall className="h-4 w-4 animate-pulse text-green-500" />
          ) : (
            <Phone className="h-4 w-4" />
          )}
          <span className="text-xs">{statusLabels[extension.status]}</span>
        </div>
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Extensions */}
      {emergencyExtensions.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>Emergency Extensions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {emergencyExtensions.map(extension => (
                <ExtensionButton key={extension.id} extension={extension} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Department Extensions */}
      {departmentExtensions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Department Extensions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {departmentExtensions.map(extension => (
                <ExtensionButton key={extension.id} extension={extension} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Personnel */}
      {userExtensions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Key Personnel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {userExtensions.map(extension => (
                <ExtensionButton key={extension.id} extension={extension} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* External Numbers */}
      {externalExtensions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <PhoneOutgoing className="h-5 w-5" />
              <span>External Numbers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {externalExtensions.map(extension => (
                <ExtensionButton key={extension.id} extension={extension} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <PhoneIncoming className="h-5 w-5" />
              <span className="text-sm">Directory</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <Phone className="h-5 w-5" />
              <span className="text-sm">Dial Pad</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <Users className="h-5 w-5" />
              <span className="text-sm">Conference</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Call History</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-muted/20">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Busy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Do Not Disturb</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Offline</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}