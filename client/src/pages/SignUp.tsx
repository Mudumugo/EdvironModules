import { AgeVerificationStep } from "@/components/signup/AgeVerificationStep";
import { SignupTypeSelector } from "@/components/signup/SignupTypeSelector";
import { StudentSignupForm } from "@/components/signup/forms/StudentSignupForm";
import { AdultSignupForm } from "@/components/signup/forms/AdultSignupForm";
import { ParentChildSignupForm } from "@/components/signup/forms/ParentChildSignupForm";
import { SchoolDemoForm } from "@/components/signup/forms/SchoolDemoForm";
import { VerificationStep } from "@/components/signup/VerificationStep";
import { CompletionStep } from "@/components/signup/CompletionStep";
import { useSignupFlow } from "@/hooks/useSignupFlow";

export default function SignUp() {
  const {
    currentStep,
    userAge,
    signupType,
    verificationSent,
    ageData,
    studentSignupMutation,
    adultSignupMutation,
    parentChildSignupMutation,
    schoolDemoMutation,
    resendVerificationMutation,
    handleAgeVerification,
    handleSignupTypeSelection,
    setCurrentStep
  } = useSignupFlow();

  if (currentStep === "age-check") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <AgeVerificationStep onAgeVerification={handleAgeVerification} />
      </div>
    );
  }

  if (currentStep === "signup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        {!signupType ? (
          <SignupTypeSelector
            userAge={userAge!}
            onTypeSelection={handleSignupTypeSelection}
          />
        ) : signupType === "student" ? (
          <StudentSignupForm
            onSubmit={(data) => studentSignupMutation.mutate(data)}
            isLoading={studentSignupMutation.isPending}
            userAge={userAge!}
            ageData={ageData}
          />
        ) : signupType === "adult" ? (
          <AdultSignupForm
            onSubmit={(data) => adultSignupMutation.mutate(data)}
            isLoading={adultSignupMutation.isPending}
            userAge={userAge!}
            ageData={ageData}
          />
        ) : signupType === "parent-child" ? (
          <ParentChildSignupForm
            onSubmit={(data) => parentChildSignupMutation.mutate(data)}
            isLoading={parentChildSignupMutation.isPending}
            userAge={userAge!}
            ageData={ageData}
          />
        ) : signupType === "school-demo" ? (
          <SchoolDemoForm
            onSubmit={(data) => schoolDemoMutation.mutate(data)}
            isLoading={schoolDemoMutation.isPending}
          />
        ) : null}
      </div>
    );
  }

  if (currentStep === "verification") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <VerificationStep
          email={ageData?.email || ""}
          onResendVerification={() => resendVerificationMutation.mutate()}
          isResending={resendVerificationMutation.isPending}
          onBackToSignup={() => setCurrentStep("signup")}
        />
      </div>
    );
  }

  if (currentStep === "completion") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <CompletionStep signupType={signupType} />
      </div>
    );
  }

  return null;
}