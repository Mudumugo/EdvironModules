import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Shield } from "lucide-react";
import { ageVerificationSchema, type AgeVerificationForm } from "./types";

interface AgeVerificationStepProps {
  onSubmit: (data: AgeVerificationForm) => void;
}

export function AgeVerificationStep({ onSubmit }: AgeVerificationStepProps) {
  const form = useForm<AgeVerificationForm>({
    resolver: zodResolver(ageVerificationSchema),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Age Verification</CardTitle>
            <CardDescription>
              Please verify your age to continue with the appropriate signup process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  We use this information to ensure we provide the appropriate signup experience and comply with privacy regulations.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  {...form.register("firstName")}
                  className={form.formState.errors.firstName ? "border-red-500" : ""}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...form.register("lastName")}
                  className={form.formState.errors.lastName ? "border-red-500" : ""}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...form.register("birthDate")}
                  className={form.formState.errors.birthDate ? "border-red-500" : ""}
                />
                {form.formState.errors.birthDate && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.birthDate.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}