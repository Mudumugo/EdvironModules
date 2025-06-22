import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";
import { AgeVerificationStep } from "./AgeVerificationStep";
import { SignupTypeSelector } from "./SignupTypeSelector";
import { StudentSignupForm } from "./forms/StudentSignupForm";
import { AdultSignupForm } from "./forms/AdultSignupForm";
import { ParentChildSignupForm } from "./forms/ParentChildSignupForm";
import { SchoolDemoForm } from "./forms/SchoolDemoForm";
import { VerificationStep } from "./VerificationStep";
import { CompletionStep } from "./CompletionStep";
import { 
  type AgeVerificationForm,
  type StudentSignupForm as StudentFormData,
  type AdultSignupForm as AdultFormData,
  type ParentChildSignupForm as ParentChildFormData,
  type SchoolDemoForm as SchoolFormData,
  type SignupStep,
  type SignupType
} from "./types";

interface SignupStepRendererProps {
  currentStep: SignupStep;
  userAge: number | null;
  signupType: SignupType;
  verificationSent: boolean;
  ageData: AgeVerificationForm | null;
  adultForm: UseFormReturn<AdultFormData>;
  parentChildForm: UseFormReturn<ParentChildFormData>;
  schoolForm: UseFormReturn<SchoolFormData>;
  studentSignupMutation: UseMutationResult<any, Error, StudentFormData>;
  adultSignupMutation: UseMutationResult<any, Error, AdultFormData>;
  parentChildSignupMutation: UseMutationResult<any, Error, ParentChildFormData>;
  schoolDemoMutation: UseMutationResult<any, Error, SchoolFormData>;
  onAgeVerified: (data: AgeVerificationForm) => void;
  onSignupTypeSelect: (type: SignupType) => void;
  onStudentSignup: (data: StudentFormData) => void;
  onAdultSignup: (data: AdultFormData) => void;
  onParentChildSignup: (data: ParentChildFormData) => void;
  onSchoolDemo: (data: SchoolFormData) => void;
  onStepBack: () => void;
}

export function SignupStepRenderer({
  currentStep,
  userAge,
  signupType,
  verificationSent,
  ageData,
  adultForm,
  parentChildForm,
  schoolForm,
  studentSignupMutation,
  adultSignupMutation,
  parentChildSignupMutation,
  schoolDemoMutation,
  onAgeVerified,
  onSignupTypeSelect,
  onStudentSignup,
  onAdultSignup,
  onParentChildSignup,
  onSchoolDemo,
  onStepBack
}: SignupStepRendererProps) {
  if (currentStep === "age-check") {
    return (
      <AgeVerificationStep 
        onAgeVerified={onAgeVerified}
      />
    );
  }

  if (currentStep === "signup-type") {
    return (
      <SignupTypeSelector 
        userAge={userAge}
        onSignupTypeSelect={onSignupTypeSelect}
        onBack={onStepBack}
      />
    );
  }

  if (currentStep === "student-signup") {
    return (
      <StudentSignupForm 
        ageData={ageData}
        onSubmit={onStudentSignup}
        onBack={onStepBack}
        isLoading={studentSignupMutation.isPending}
      />
    );
  }

  if (currentStep === "adult-signup") {
    return (
      <AdultSignupForm 
        form={adultForm}
        onSubmit={onAdultSignup}
        onBack={onStepBack}
        isLoading={adultSignupMutation.isPending}
      />
    );
  }

  if (currentStep === "parent-child-signup") {
    return (
      <ParentChildSignupForm 
        form={parentChildForm}
        onSubmit={onParentChildSignup}
        onBack={onStepBack}
        isLoading={parentChildSignupMutation.isPending}
      />
    );
  }

  if (currentStep === "school-demo") {
    return (
      <SchoolDemoForm 
        form={schoolForm}
        onSubmit={onSchoolDemo}
        onBack={onStepBack}
        isLoading={schoolDemoMutation.isPending}
      />
    );
  }

  if (currentStep === "verification") {
    return (
      <VerificationStep 
        signupType={signupType}
        verificationSent={verificationSent}
      />
    );
  }

  if (currentStep === "complete") {
    return <CompletionStep />;
  }

  return null;
}