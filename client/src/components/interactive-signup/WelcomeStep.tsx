import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-3xl font-bold">Welcome to Edvirons</CardTitle>
        <CardDescription className="text-lg">
          Let's create a personalized learning experience for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Our interactive signup will help us understand your needs and create the perfect educational environment for your journey.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This will only take a few minutes and will help us customize your experience
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" className="px-8">
            Get Started
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}