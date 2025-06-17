import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  User, 
  Key,
  Check,
  X,
  AlertTriangle
} from "lucide-react";

const paymentSettingsSchema = z.object({
  stripePublishableKey: z.string().min(1, "Publishable key is required").startsWith("pk_", "Must start with pk_"),
  stripeSecretKey: z.string().min(1, "Secret key is required").startsWith("sk_", "Must start with sk_"),
});

const profileSettingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch current settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const { data: paymentStatus, isLoading: paymentStatusLoading } = useQuery({
    queryKey: ["/api/payment-status"],
  });

  // Payment settings form
  const paymentForm = useForm({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      stripePublishableKey: "",
      stripeSecretKey: "",
    },
  });

  // Profile settings form
  const profileForm = useForm({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      firstName: (settings as any)?.firstName || "",
      lastName: (settings as any)?.lastName || "",
      email: (settings as any)?.email || "",
    },
  });

  // Notification settings form
  const notificationForm = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: (settings as any)?.emailNotifications ?? true,
      smsNotifications: (settings as any)?.smsNotifications ?? false,
      pushNotifications: (settings as any)?.pushNotifications ?? true,
    },
  });

  // Update payment settings mutation
  const updatePaymentSettings = useMutation({
    mutationFn: async (data: z.infer<typeof paymentSettingsSchema>) => {
      await apiRequest("POST", "/api/settings/payment", data);
    },
    onSuccess: () => {
      toast({
        title: "Payment Settings Updated",
        description: "Your Stripe keys have been configured successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-status"] });
      paymentForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Payment Settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update profile settings mutation
  const updateProfileSettings = useMutation({
    mutationFn: async (data: z.infer<typeof profileSettingsSchema>) => {
      await apiRequest("PUT", "/api/settings/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update notification settings mutation
  const updateNotificationSettings = useMutation({
    mutationFn: async (data: z.infer<typeof notificationSettingsSchema>) => {
      await apiRequest("PUT", "/api/settings/notifications", data);
    },
    onSuccess: () => {
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Notifications",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onPaymentSubmit = (data: z.infer<typeof paymentSettingsSchema>) => {
    updatePaymentSettings.mutate(data);
  };

  const onProfileSubmit = (data: z.infer<typeof profileSettingsSchema>) => {
    updateProfileSettings.mutate(data);
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationSettingsSchema>) => {
    updateNotificationSettings.mutate(data);
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName")}
                      placeholder="Enter your first name"
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.firstName.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName")}
                      placeholder="Enter your last name"
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.lastName.message as string}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                    placeholder="Enter your email address"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.email.message as string}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={updateProfileSettings.isPending}
                  className="w-full"
                >
                  {updateProfileSettings.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Integration
              </CardTitle>
              <CardDescription>
                Configure your Stripe payment settings to enable billing and subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${(paymentStatus as any)?.configured ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div>
                    <p className="font-medium">Payment Status</p>
                    <p className="text-sm text-muted-foreground">
                      {(paymentStatus as any)?.configured ? 'Stripe is configured and ready' : 'Stripe keys not configured'}
                    </p>
                  </div>
                </div>
                <Badge variant={(paymentStatus as any)?.configured ? 'default' : 'secondary'}>
                  {(paymentStatus as any)?.configured ? (
                    <><Check className="h-3 w-3 mr-1" /> Active</>
                  ) : (
                    <><X className="h-3 w-3 mr-1" /> Inactive</>
                  )}
                </Badge>
              </div>

              <Separator />

              {/* Instructions */}
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>To get your Stripe API keys:</strong>
                  <ol className="mt-2 space-y-1 text-sm">
                    <li>1. Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dashboard.stripe.com/apikeys</a></li>
                    <li>2. Copy your "Publishable key" (starts with pk_)</li>
                    <li>3. Copy your "Secret key" (starts with sk_)</li>
                    <li>4. Paste both keys below and save</li>
                  </ol>
                </AlertDescription>
              </Alert>

              {/* Payment Configuration Form */}
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripePublishableKey">Stripe Publishable Key</Label>
                  <Input
                    id="stripePublishableKey"
                    type="password"
                    {...paymentForm.register("stripePublishableKey")}
                    placeholder="pk_test_..."
                  />
                  {paymentForm.formState.errors.stripePublishableKey && (
                    <p className="text-sm text-destructive">
                      {paymentForm.formState.errors.stripePublishableKey.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This key is safe to be public and allows the website to connect to Stripe
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                  <Input
                    id="stripeSecretKey"
                    type="password"
                    {...paymentForm.register("stripeSecretKey")}
                    placeholder="sk_test_..."
                  />
                  {paymentForm.formState.errors.stripeSecretKey && (
                    <p className="text-sm text-destructive">
                      {paymentForm.formState.errors.stripeSecretKey.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    This key must be kept secret and allows secure payment processing
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={updatePaymentSettings.isPending}
                  className="w-full"
                >
                  {updatePaymentSettings.isPending ? "Saving..." : "Save Payment Settings"}
                </Button>
              </form>

              {paymentStatus?.configured && (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Payment integration is active. Your platform can now process subscriptions and payments.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      {...notificationForm.register("emailNotifications")}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      {...notificationForm.register("smsNotifications")}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      {...notificationForm.register("pushNotifications")}
                      className="h-4 w-4"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateNotificationSettings.isPending}
                  className="w-full"
                >
                  {updateNotificationSettings.isPending ? "Saving..." : "Save Notification Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">API Keys</p>
                    <p className="text-sm text-muted-foreground">
                      Manage API keys for integrations
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  Manage Keys
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Security features are managed through your authentication provider. 
                  Contact support for advanced security configurations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}