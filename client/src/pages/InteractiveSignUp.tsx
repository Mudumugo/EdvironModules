import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { InteractiveQuizFlow } from "@/components/signup/InteractiveQuizFlow";



interface QuizData {
  userType: "student" | "teacher" | "parent" | "school" | null;
  age?: number;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  county?: string;
  city?: string;
  school?: string;
  gradeLevel?: string;
  subject?: string;
  parentEmail?: string;
  parentPhone?: string;
  interests?: string[];
  learningStyle?: string;
  goals?: string[];
  organizationName?: string;
  organizationType?: string;
  numberOfStudents?: number;
  adminEmail?: string;
  adminPhone?: string;
}

export default function InteractiveSignUp() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const createAccountMutation = useMutation({
    mutationFn: async (userData: QuizData) => {
      return await apiRequest("POST", "/api/auth/signup", userData);
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully!",
        description: "Welcome to EdVirons! You can now log in with your new account.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Account creation failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuizComplete = (data: QuizData) => {
    createAccountMutation.mutate(data);
  };

  const handleBackToLogin = () => {
    setLocation("/login");
  };

  return (
    <InteractiveQuizFlow 
      onComplete={handleQuizComplete}
      onBack={handleBackToLogin}
    />
  );
}
