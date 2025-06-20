import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, School } from "lucide-react";
import { Link } from "wouter";

export function CompletionStep() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Request Submitted Successfully!</CardTitle>
            <CardDescription>
              Thank you for your interest in Edvirons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <School className="h-4 w-4" />
              <AlertDescription>
                Our education specialists will review your information and contact you within 1-2 business days to schedule your personalized demonstration.
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}