import { useRoleOnboarding } from "@/hooks/useRoleOnboarding";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  BookOpen,
  Users,
  Settings,
  Target
} from "lucide-react";

export default function RoleOnboarding() {
  const {
    onboardingData,
    currentStepIndex,
    isLoading,
    showOnboarding,
    currentStep,
    progress,
    setShowOnboarding,
    completeStep,
    skipStep,
    goToStep,
    dismissOnboarding
  } = useRoleOnboarding();

  if (isLoading || !onboardingData || !showOnboarding) {
    return null;
  }

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.component) {
      case "WelcomeStep":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Welcome to the Platform!</h3>
            <p className="text-gray-600">
              We're excited to have you here. This quick setup will help you get the most out of your experience.
            </p>
          </div>
        );

      case "ProfileSetupStep":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Complete Your Profile</h3>
            <p className="text-gray-600">
              Add your profile information to personalize your experience and help others connect with you.
            </p>
            <Button onClick={() => completeStep(currentStep.id)}>
              Complete Profile Setup
            </Button>
          </div>
        );

      case "ClassroomSetupStep":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Set Up Your Classroom</h3>
            <p className="text-gray-600">
              Configure your virtual classroom settings, add class schedules, and prepare for your students.
            </p>
            <Button onClick={() => completeStep(currentStep.id)}>
              Set Up Classroom
            </Button>
          </div>
        );

      case "CourseEnrollmentStep":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold">Enroll in Your Courses</h3>
            <p className="text-gray-600">
              Join your assigned courses to access lessons, assignments, and communicate with your teachers.
            </p>
            <Button onClick={() => completeStep(currentStep.id)}>
              View Available Courses
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">{currentStep.title}</h3>
            <p className="text-gray-600">{currentStep.description}</p>
            <Button onClick={() => completeStep(currentStep.id)}>
              Complete Step
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Getting Started</DialogTitle>
            <Button variant="ghost" size="sm" onClick={dismissOnboarding}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Step {currentStepIndex + 1} of {onboardingData.steps.length}</span>
              <span>{progress}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step navigation */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {onboardingData.steps.map((step, index) => (
              <Button
                key={step.id}
                variant={index === currentStepIndex ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-2 min-w-fit"
                onClick={() => goToStep(index)}
              >
                {onboardingData.completedSteps.includes(step.id) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
              </Button>
            ))}
          </div>

          {/* Current step content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentStep?.title}</CardTitle>
                  <CardDescription>{currentStep?.description}</CardDescription>
                </div>
                {currentStep?.isRequired && (
                  <Badge variant="secondary">Required</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => goToStep(currentStepIndex - 1)}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-2">
              {!currentStep?.isRequired && (
                <Button
                  variant="ghost"
                  onClick={() => skipStep(currentStep?.id || '')}
                >
                  Skip
                </Button>
              )}
              
              <Button
                onClick={() => goToStep(currentStepIndex + 1)}
                disabled={currentStepIndex === onboardingData.steps.length - 1}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}