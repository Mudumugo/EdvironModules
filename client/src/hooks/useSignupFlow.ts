import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  type AgeVerificationForm,
  type StudentSignupForm,
  type AdultSignupForm,
  type ParentChildSignupForm,
  type SchoolDemoForm,
  type SignupStep,
  type SignupType
} from "@/components/signup/types";

export function useSignupFlow() {
  const [currentStep, setCurrentStep] = useState<SignupStep>("age-check");
  const [userAge, setUserAge] = useState<number | null>(null);
  const [signupType, setSignupType] = useState<SignupType>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [ageData, setAgeData] = useState<AgeVerificationForm | null>(null);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleAgeVerification = (data: AgeVerificationForm) => {
    const age = calculateAge(data.birthDate);
    setUserAge(age);
    setAgeData(data);
    setCurrentStep("signup");
  };

  const handleSignupTypeSelection = (type: SignupType) => {
    setSignupType(type);
  };

  const studentSignupMutation = useMutation({
    mutationFn: async (data: StudentSignupForm) => {
      return await apiRequest("POST", "/api/signup/student", {
        ...data,
        firstName: ageData?.firstName,
        lastName: ageData?.lastName,
        birthDate: ageData?.birthDate,
      });
    },
    onSuccess: () => {
      setVerificationSent(true);
      setCurrentStep("verification");
    },
    onError: (error) => {
      console.error("Student signup error:", error);
    },
  });

  const adultSignupMutation = useMutation({
    mutationFn: async (data: AdultSignupForm) => {
      return await apiRequest("POST", "/api/signup/adult", {
        ...data,
        firstName: ageData?.firstName,
        lastName: ageData?.lastName,
        birthDate: ageData?.birthDate,
      });
    },
    onSuccess: () => {
      setVerificationSent(true);
      setCurrentStep("verification");
    },
    onError: (error) => {
      console.error("Adult signup error:", error);
    },
  });

  const parentChildSignupMutation = useMutation({
    mutationFn: async (data: ParentChildSignupForm) => {
      return await apiRequest("POST", "/api/signup/parent-child", {
        ...data,
        parentFirstName: ageData?.firstName,
        parentLastName: ageData?.lastName,
        parentBirthDate: ageData?.birthDate,
      });
    },
    onSuccess: () => {
      setVerificationSent(true);
      setCurrentStep("verification");
    },
    onError: (error) => {
      console.error("Parent-child signup error:", error);
    },
  });

  const schoolDemoMutation = useMutation({
    mutationFn: async (data: SchoolDemoForm) => {
      return await apiRequest("POST", "/api/signup/school-demo", data);
    },
    onSuccess: () => {
      setCurrentStep("completion");
    },
    onError: (error) => {
      console.error("School demo signup error:", error);
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/signup/resend-verification", {
        email: ageData?.email || "",
      });
    },
    onSuccess: () => {
      console.log("Verification email resent");
    },
    onError: (error) => {
      console.error("Resend verification error:", error);
    },
  });

  return {
    // State
    currentStep,
    userAge,
    signupType,
    verificationSent,
    ageData,
    
    // Mutations
    studentSignupMutation,
    adultSignupMutation,
    parentChildSignupMutation,
    schoolDemoMutation,
    resendVerificationMutation,
    
    // Handlers
    handleAgeVerification,
    handleSignupTypeSelection,
    setCurrentStep,
    calculateAge
  };
}