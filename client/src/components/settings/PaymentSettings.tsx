import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { paymentSettingsSchema, PaymentSettings as PaymentSettingsType } from "./SettingsTypes";

interface PaymentSettingsProps {
  currentSettings?: PaymentSettingsType;
}

export default function PaymentSettings({ currentSettings }: PaymentSettingsProps) {
  const { toast } = useToast();
  
  const form = useForm<PaymentSettingsType>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: currentSettings || {
      stripePublishableKey: "",
      stripeSecretKey: "",
    },
  });

  const saveSettings = useMutation({
    mutationFn: async (data: PaymentSettingsType) => {
      return await apiRequest("POST", "/api/settings/payment", data);
    },
    onSuccess: () => {
      toast({
        title: "Payment settings saved",
        description: "Your payment configuration has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save payment settings.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: PaymentSettingsType) => {
    saveSettings.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Settings
        </CardTitle>
        <CardDescription>
          Configure your Stripe payment processing settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            These keys will be stored securely and used for payment processing. Never share your secret key.
          </AlertDescription>
        </Alert>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripePublishableKey" className="text-sm">Stripe Publishable Key</Label>
            <Input
              id="stripePublishableKey"
              placeholder="pk_test_..."
              {...form.register("stripePublishableKey")}
              className="h-10"
            />
            {form.formState.errors.stripePublishableKey && (
              <p className="text-sm text-red-600">
                {form.formState.errors.stripePublishableKey.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeSecretKey" className="text-sm">Stripe Secret Key</Label>
            <Input
              id="stripeSecretKey"
              type="password"
              placeholder="sk_test_..."
              {...form.register("stripeSecretKey")}
              className="h-10"
            />
            {form.formState.errors.stripeSecretKey && (
              <p className="text-sm text-red-600">
                {form.formState.errors.stripeSecretKey.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={saveSettings.isPending}
            className="w-full h-10 mt-6"
          >
            {saveSettings.isPending ? "Saving..." : "Save Payment Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}