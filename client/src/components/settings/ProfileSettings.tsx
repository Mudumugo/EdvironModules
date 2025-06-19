import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { profileSettingsSchema, ProfileSettings as ProfileSettingsType } from "./SettingsTypes";

interface ProfileSettingsProps {
  currentSettings?: ProfileSettingsType;
  profileImageUrl?: string;
}

export default function ProfileSettings({ currentSettings, profileImageUrl }: ProfileSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ProfileSettingsType>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: currentSettings || {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const saveProfile = useMutation({
    mutationFn: async (data: ProfileSettingsType) => {
      return await apiRequest("POST", "/api/settings/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return await apiRequest("POST", "/api/settings/avatar", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update avatar.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ProfileSettingsType) => {
    saveProfile.mutate(data);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback>
              <User className="h-6 w-6 sm:h-8 sm:w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Avatar
                </span>
              </Button>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                {...form.register("firstName")}
                className="h-10"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                {...form.register("lastName")}
                className="h-10"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...form.register("email")}
              className="h-10"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={saveProfile.isPending}
            className="w-full h-10 mt-6"
          >
            {saveProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}