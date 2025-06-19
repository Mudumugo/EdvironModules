import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getRoleDisplayName, getInitials } from "@/lib/roleUtils";
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Upload, Save } from "lucide-react";

export function ProfileTab() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-sm">
            Manage your personal information and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback className="text-base sm:text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-center sm:text-left">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Upload className="h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm">First Name</Label>
              <Input id="firstName" defaultValue={user.firstName || ""} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm">Last Name</Label>
              <Input id="lastName" defaultValue={user.lastName || ""} className="h-10" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" defaultValue={user.email || ""} className="h-10" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="role" className="text-sm">Role</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {getRoleDisplayName(user?.role || '')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us about yourself..." 
              className="min-h-[80px] sm:min-h-[100px] resize-none"
            />
          </div>

          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}