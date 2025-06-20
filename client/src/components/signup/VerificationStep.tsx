import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Shield } from "lucide-react";
import { SignupType } from "./types";

interface VerificationStepProps {
  signupType: SignupType;
}

export function VerificationStep({ signupType }: VerificationStepProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Verification Sent</CardTitle>
            <CardDescription>
              {signupType === "student" 
                ? "We've sent a verification code to your parent's phone"
                : "We've sent a verification code to your phone"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Please check your {signupType === "student" ? "parent's " : ""}phone for the verification code and follow the instructions to complete your account setup.
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Didn't receive the code?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Resend verification
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}