import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, RefreshCw, Power, Eye, Settings, Shield, Clock, Play, Square } from "lucide-react";

interface DeviceActionsProps {
  selectedDevices: string[];
  onAction: (action: string, options?: any) => void;
}

export function DeviceActions({ selectedDevices, onAction }: DeviceActionsProps) {
  const [examLockDuration, setExamLockDuration] = useState(180);
  const [selectedPolicy, setSelectedPolicy] = useState('');

  const hasSelection = selectedDevices.length > 0;

  const quickActions = [
    {
      id: 'lock',
      label: 'Lock Devices',
      icon: Lock,
      variant: 'default' as const,
      description: 'Lock selected devices immediately'
    },
    {
      id: 'unlock',
      label: 'Unlock Devices',
      icon: Unlock,
      variant: 'outline' as const,
      description: 'Unlock selected devices'
    },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: RefreshCw,
      variant: 'outline' as const,
      description: 'Refresh screen on selected devices'
    },
    {
      id: 'restart',
      label: 'Restart',
      icon: Power,
      variant: 'outline' as const,
      description: 'Restart selected devices'
    },
    {
      id: 'screenshot',
      label: 'Screenshot',
      icon: Eye,
      variant: 'outline' as const,
      description: 'Take screenshots of selected devices'
    }
  ];

  const specialActions = [
    {
      id: 'exam_mode',
      label: 'Enable Exam Mode',
      icon: Shield,
      description: 'Lock devices with exam restrictions'
    },
    {
      id: 'break_mode',
      label: 'Break Mode',
      icon: Clock,
      description: 'Allow limited access during breaks'
    },
    {
      id: 'presentation_mode',
      label: 'Presentation Mode',
      icon: Play,
      description: 'Optimize for presentations'
    },
    {
      id: 'focus_mode',
      label: 'Focus Mode',
      icon: Square,
      description: 'Block distracting applications'
    }
  ];

  const policies = [
    { id: 'strict', label: 'Strict Mode', description: 'Block all non-educational content' },
    { id: 'moderate', label: 'Moderate Mode', description: 'Allow some social applications' },
    { id: 'open', label: 'Open Mode', description: 'Minimal restrictions' },
    { id: 'custom', label: 'Custom Policy', description: 'Apply custom restrictions' }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Device Actions
            {hasSelection && (
              <Badge variant="secondary">
                {selectedDevices.length} selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasSelection && (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select devices to enable actions</p>
            </div>
          )}

          {hasSelection && (
            <>
              {/* Quick Actions */}
              <div>
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.id}
                        variant={action.variant}
                        onClick={() => onAction(action.id)}
                        className="h-auto p-3 flex flex-col items-center gap-2"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs text-center">{action.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Special Modes */}
              <div>
                <h4 className="font-medium mb-3">Special Modes</h4>
                <div className="space-y-2">
                  {specialActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <div
                        key={action.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <div className="font-medium">{action.label}</div>
                            <div className="text-sm text-gray-600">{action.description}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAction(action.id)}
                        >
                          Apply
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exam Mode Settings */}
              <div>
                <h4 className="font-medium mb-3">Exam Mode Settings</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={examLockDuration}
                      onChange={(e) => setExamLockDuration(parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <Button
                    onClick={() => onAction('exam_lock', { duration: examLockDuration })}
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Start Exam Mode ({examLockDuration} min)
                  </Button>
                </div>
              </div>

              {/* Policy Management */}
              <div>
                <h4 className="font-medium mb-3">Apply Policy</h4>
                <div className="space-y-3">
                  <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a policy to apply" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id}>
                          <div>
                            <div className="font-medium">{policy.label}</div>
                            <div className="text-sm text-gray-600">{policy.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedPolicy && (
                    <Button
                      onClick={() => onAction('apply_policy', { policyId: selectedPolicy })}
                      className="w-full"
                    >
                      Apply {policies.find(p => p.id === selectedPolicy)?.label}
                    </Button>
                  )}
                </div>
              </div>

              {/* Bulk Operations */}
              <div>
                <h4 className="font-medium mb-3">Bulk Operations</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onAction('bulk_lock')}
                    className="justify-center"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Lock All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onAction('bulk_unlock')}
                    className="justify-center"
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Unlock All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onAction('bulk_refresh')}
                    className="justify-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onAction('bulk_screenshot')}
                    className="justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Screenshot All
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}