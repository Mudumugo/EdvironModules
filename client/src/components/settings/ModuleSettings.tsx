import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Puzzle, Crown, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ModuleConfig } from "./SettingsTypes";

interface ModuleSettingsProps {
  modules: ModuleConfig[];
  premiumModules: string[];
  hasPremium: boolean;
}

export default function ModuleSettings({ modules, premiumModules, hasPremium }: ModuleSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleModule = useMutation({
    mutationFn: async ({ moduleId, enabled }: { moduleId: string; enabled: boolean }) => {
      return await apiRequest("POST", "/api/settings/modules/toggle", { moduleId, enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/modules'] });
      toast({
        title: "Module updated",
        description: "Module status has been changed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update module status.",
        variant: "destructive",
      });
    }
  });

  const handleToggleModule = (moduleId: string, enabled: boolean) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    if (premiumModules.includes(moduleId) && !hasPremium) {
      toast({
        title: "Premium Required",
        description: "This module requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    toggleModule.mutate({ moduleId, enabled });
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, ModuleConfig[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="h-5 w-5" />
          Module Management
        </CardTitle>
        <CardDescription>
          Enable or disable platform modules to customize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedModules).map(([category, categoryModules]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
            <div className="space-y-3">
              {categoryModules.map((module) => {
                const isPremium = premiumModules.includes(module.id);
                const canToggle = !isPremium || hasPremium;
                
                return (
                  <div 
                    key={module.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{module.name}</h4>
                        {isPremium && (
                          <Badge variant={hasPremium ? "default" : "secondary"}>
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {module.enabled ? (
                          <Badge variant="outline" className="text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <X className="h-3 w-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                      {module.dependencies && module.dependencies.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Requires: {module.dependencies.join(", ")}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={(enabled) => handleToggleModule(module.id, enabled)}
                      disabled={!canToggle || toggleModule.isPending}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!hasPremium && premiumModules.length > 0 && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-600" />
              <h4 className="font-medium">Unlock Premium Modules</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Get access to advanced features and premium modules with our subscription.
            </p>
            <Button size="sm">
              Upgrade to Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}