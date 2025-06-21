import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  institution?: string;
  gradeLevel?: string;
  parentEmail?: string;
  parentPhone?: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

export function useInteractiveSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState<Partial<SignupData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      return await apiRequest("POST", "/api/signup/interactive", data);
    },
    onSuccess: () => {
      setCurrentStep(6); // Success step
    },
    onError: (error) => {
      console.error("Interactive signup error:", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitSignup = () => {
    setIsSubmitting(true);
    signupMutation.mutate(signupData as SignupData);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(signupData.firstName && signupData.lastName);
      case 2:
        return !!(signupData.email && signupData.phone);
      case 3:
        return !!(signupData.role);
      case 4:
        if (signupData.role === "student" && parseInt(signupData.gradeLevel || "0") < 13) {
          return !!(signupData.parentEmail && signupData.parentPhone);
        }
        return true;
      case 5:
        return !!(
          signupData.password && 
          signupData.confirmPassword && 
          signupData.password === signupData.confirmPassword &&
          signupData.agreeToTerms
        );
      default:
        return true;
    }
  };

  return {
    currentStep,
    signupData,
    isSubmitting,
    error: signupMutation.error,
    isSuccess: signupMutation.isSuccess,
    updateSignupData,
    nextStep,
    prevStep,
    submitSignup,
    validateStep,
    setCurrentStep
  };
}