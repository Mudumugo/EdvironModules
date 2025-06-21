import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface GlobalSettingsProps {
  settings: any;
  loading: boolean;
  updating: boolean;
  onUpdateSettings: (settings: any) => void;
}

export function GlobalSettings({ settings, loading, updating, onUpdateSettings }: GlobalSettingsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Call Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Call Settings</CardTitle>
          <CardDescription>
            Configure default call behavior and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-answer">Auto Answer</Label>
              <div className="text-sm text-gray-500">
                Automatically answer incoming calls after a delay
              </div>
            </div>
            <Switch
              id="auto-answer"
              checked={settings?.autoAnswer || false}
              onCheckedChange={(checked) => 
                onUpdateSettings({ ...settings, autoAnswer: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auto-answer-delay">Auto Answer Delay (seconds)</Label>
            <Slider
              id="auto-answer-delay"
              min={1}
              max={10}
              step={1}
              value={[settings?.autoAnswerDelay || 3]}
              onValueChange={(value) => 
                onUpdateSettings({ ...settings, autoAnswerDelay: value[0] })
              }
              className="w-full"
            />
            <div className="text-sm text-gray-500">
              Current delay: {settings?.autoAnswerDelay || 3} seconds
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-ringtone">Default Ringtone</Label>
            <Select 
              value={settings?.defaultRingtone || 'classic'}
              onValueChange={(value) => 
                onUpdateSettings({ ...settings, defaultRingtone: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ringtone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic Ring</SelectItem>
                <SelectItem value="modern">Modern Tone</SelectItem>
                <SelectItem value="nature">Nature Sounds</SelectItem>
                <SelectItem value="music">Music Box</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="call-volume">Call Volume</Label>
            <Slider
              id="call-volume"
              min={0}
              max={100}
              step={5}
              value={[settings?.callVolume || 80]}
              onValueChange={(value) => 
                onUpdateSettings({ ...settings, callVolume: value[0] })
              }
              className="w-full"
            />
            <div className="text-sm text-gray-500">
              Volume: {settings?.callVolume || 80}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>
            Customize the appearance and layout of your extension interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={settings?.theme || 'auto'}
              onValueChange={(value) => 
                onUpdateSettings({ ...settings, theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="layout">Layout Style</Label>
            <Select 
              value={settings?.layout || 'compact'}
              onValueChange={(value) => 
                onUpdateSettings({ ...settings, layout: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-avatars">Show Contact Avatars</Label>
              <div className="text-sm text-gray-500">
                Display profile pictures in call interface
              </div>
            </div>
            <Switch
              id="show-avatars"
              checked={settings?.showAvatars || true}
              onCheckedChange={(checked) => 
                onUpdateSettings({ ...settings, showAvatars: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
          <CardDescription>
            Configure security preferences and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-auth">Require Authentication</Label>
              <div className="text-sm text-gray-500">
                Require password for accessing settings
              </div>
            </div>
            <Switch
              id="require-auth"
              checked={settings?.requireAuth || false}
              onCheckedChange={(checked) => 
                onUpdateSettings({ ...settings, requireAuth: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="call-recording">Enable Call Recording</Label>
              <div className="text-sm text-gray-500">
                Automatically record all calls (where legally permitted)
              </div>
            </div>
            <Switch
              id="call-recording"
              checked={settings?.callRecording || false}
              onCheckedChange={(checked) => 
                onUpdateSettings({ ...settings, callRecording: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input
              id="session-timeout"
              type="number"
              min="5"
              max="480"
              value={settings?.sessionTimeout || 60}
              onChange={(e) => 
                onUpdateSettings({ 
                  ...settings, 
                  sessionTimeout: parseInt(e.target.value) || 60 
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={() => onUpdateSettings(settings)}
          disabled={updating}
        >
          {updating ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}