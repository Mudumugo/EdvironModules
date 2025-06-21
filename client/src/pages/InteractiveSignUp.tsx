import { PersonalInfoStep } from "@/components/signup/interactive/PersonalInfoStep";
import { ContactInfoStep } from "@/components/signup/interactive/ContactInfoStep";
import { RoleSelectionStep } from "@/components/signup/interactive/RoleSelectionStep";
import { useInteractiveSignup } from "@/hooks/useInteractiveSignup";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, School } from "lucide-react";

export default function InteractiveSignUp() {
  const {
    currentStep,
    signupData,
    isSubmitting,
    error,
    isSuccess,
    updateSignupData,
    nextStep,
    prevStep,
    submitSignup,
    validateStep
  } = useInteractiveSignup();

  const getStepProgress = () => {
    return (currentStep / 6) * 100;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Welcome to EdVirons!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Check your email for verification instructions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of 6
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getStepProgress())}% Complete
            </span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              {error.message || "An error occurred during signup"}
            </p>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 1 && (
          <PersonalInfoStep
            initialData={signupData}
            onNext={(data) => {
              updateSignupData(data);
              nextStep();
            }}
          />
        )}

        {currentStep === 2 && (
          <ContactInfoStep
            initialData={signupData}
            onNext={(data) => {
              updateSignupData(data);
              nextStep();
            }}
            onPrev={prevStep}
          />
        )}

        {currentStep === 3 && (
          <RoleSelectionStep
            initialData={signupData}
            onNext={(data) => {
              updateSignupData(data);
              nextStep();
            }}
            onPrev={prevStep}
          />
        )}

        {/* Additional steps would be implemented similarly */}
      </div>
    </div>
  );
}