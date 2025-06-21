import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  isRequired: boolean;
  order: number;
}

export interface RoleOnboardingData {
  role: string;
  steps: OnboardingStep[];
  completedSteps: string[];
  currentStep: number;
  isComplete: boolean;
}

export function useRoleOnboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [onboardingData, setOnboardingData] = useState<RoleOnboardingData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load onboarding data based on user role
  useEffect(() => {
    if (!user) return;

    const loadOnboardingData = async () => {
      setIsLoading(true);
      
      try {
        // Generate role-specific onboarding steps
        const steps = generateOnboardingSteps(user.role);
        const completedSteps = getCompletedSteps(user.id);
        
        const onboarding: RoleOnboardingData = {
          role: user.role,
          steps,
          completedSteps,
          currentStep: findCurrentStep(steps, completedSteps),
          isComplete: steps.filter(s => s.isRequired).every(s => completedSteps.includes(s.id))
        };
        
        setOnboardingData(onboarding);
        setCurrentStepIndex(onboarding.currentStep);
        
        // Show onboarding if not complete
        if (!onboarding.isComplete) {
          setShowOnboarding(true);
        }
        
      } catch (error) {
        console.error("Failed to load onboarding data:", error);
        toast({
          title: "Error",
          description: "Failed to load onboarding information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingData();
  }, [user, toast]);

  const completeStep = (stepId: string) => {
    if (!onboardingData || !user) return;

    const updatedCompletedSteps = [...onboardingData.completedSteps, stepId];
    saveCompletedSteps(user.id, updatedCompletedSteps);
    
    const updatedOnboarding = {
      ...onboardingData,
      completedSteps: updatedCompletedSteps,
      currentStep: findCurrentStep(onboardingData.steps, updatedCompletedSteps),
      isComplete: onboardingData.steps.filter(s => s.isRequired).every(s => updatedCompletedSteps.includes(s.id))
    };
    
    setOnboardingData(updatedOnboarding);
    
    toast({
      title: "Step completed",
      description: "You've successfully completed this onboarding step.",
    });
    
    // Auto-advance to next step
    if (currentStepIndex < onboardingData.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
    
    // Close onboarding if complete
    if (updatedOnboarding.isComplete) {
      setShowOnboarding(false);
      toast({
        title: "Onboarding complete",
        description: "Welcome! You're all set up and ready to get started.",
      });
    }
  };

  const skipStep = (stepId: string) => {
    if (!onboardingData) return;
    
    const step = onboardingData.steps.find(s => s.id === stepId);
    if (step?.isRequired) {
      toast({
        title: "Cannot skip",
        description: "This step is required and cannot be skipped.",
        variant: "destructive",
      });
      return;
    }
    
    // Move to next step without marking as completed
    if (currentStepIndex < onboardingData.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (!onboardingData) return;
    
    if (stepIndex >= 0 && stepIndex < onboardingData.steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const dismissOnboarding = () => {
    if (!onboardingData || !user) return;
    
    const requiredSteps = onboardingData.steps.filter(s => s.isRequired);
    const completedRequired = requiredSteps.filter(s => onboardingData.completedSteps.includes(s.id));
    
    if (completedRequired.length < requiredSteps.length) {
      toast({
        title: "Cannot dismiss",
        description: "Please complete all required steps before dismissing onboarding.",
        variant: "destructive",
      });
      return;
    }
    
    setShowOnboarding(false);
    saveOnboardingDismissed(user.id);
  };

  const reopenOnboarding = () => {
    setShowOnboarding(true);
    setCurrentStepIndex(0);
  };

  return {
    // State
    onboardingData,
    currentStepIndex,
    isLoading,
    showOnboarding,
    
    // Current step data
    currentStep: onboardingData?.steps[currentStepIndex] || null,
    progress: onboardingData ? Math.round((onboardingData.completedSteps.length / onboardingData.steps.length) * 100) : 0,
    
    // Actions
    setShowOnboarding,
    completeStep,
    skipStep,
    goToStep,
    dismissOnboarding,
    reopenOnboarding,
  };
}

// Helper functions
function generateOnboardingSteps(role: string): OnboardingStep[] {
  const baseSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome",
      description: "Welcome to the platform! Let's get you started.",
      component: "WelcomeStep",
      isCompleted: false,
      isRequired: true,
      order: 1
    },
    {
      id: "profile-setup",
      title: "Complete Profile",
      description: "Fill in your profile information",
      component: "ProfileSetupStep",
      isCompleted: false,
      isRequired: true,
      order: 2
    }
  ];
  
  // Role-specific steps
  const roleSteps: Record<string, OnboardingStep[]> = {
    teacher: [
      {
        id: "classroom-setup",
        title: "Set Up Classroom",
        description: "Configure your virtual classroom",
        component: "ClassroomSetupStep",
        isCompleted: false,
        isRequired: true,
        order: 3
      },
      {
        id: "first-lesson",
        title: "Create First Lesson",
        description: "Create your first lesson plan",
        component: "FirstLessonStep",
        isCompleted: false,
        isRequired: false,
        order: 4
      }
    ],
    student: [
      {
        id: "course-enrollment",
        title: "Enroll in Courses",
        description: "Join your assigned courses",
        component: "CourseEnrollmentStep",
        isCompleted: false,
        isRequired: true,
        order: 3
      },
      {
        id: "learning-goals",
        title: "Set Learning Goals",
        description: "Define your academic objectives",
        component: "LearningGoalsStep",
        isCompleted: false,
        isRequired: false,
        order: 4
      }
    ],
    school_admin: [
      {
        id: "school-setup",
        title: "School Configuration",
        description: "Configure school settings and policies",
        component: "SchoolSetupStep",
        isCompleted: false,
        isRequired: true,
        order: 3
      },
      {
        id: "user-management",
        title: "User Management",
        description: "Learn how to manage users and permissions",
        component: "UserManagementStep",
        isCompleted: false,
        isRequired: false,
        order: 4
      }
    ],
    parent: [
      {
        id: "child-connection",
        title: "Connect with Children",
        description: "Link your account to your children's profiles",
        component: "ChildConnectionStep",
        isCompleted: false,
        isRequired: true,
        order: 3
      },
      {
        id: "monitoring-setup",
        title: "Monitoring Preferences",
        description: "Configure monitoring and notification settings",
        component: "MonitoringSetupStep",
        isCompleted: false,
        isRequired: false,
        order: 4
      }
    ]
  };
  
  return [...baseSteps, ...(roleSteps[role] || [])].sort((a, b) => a.order - b.order);
}

function getCompletedSteps(userId: string): string[] {
  const saved = localStorage.getItem(`onboarding_completed_${userId}`);
  return saved ? JSON.parse(saved) : [];
}

function saveCompletedSteps(userId: string, steps: string[]) {
  localStorage.setItem(`onboarding_completed_${userId}`, JSON.stringify(steps));
}

function saveOnboardingDismissed(userId: string) {
  localStorage.setItem(`onboarding_dismissed_${userId}`, 'true');
}

function findCurrentStep(steps: OnboardingStep[], completedSteps: string[]): number {
  const incompleteIndex = steps.findIndex(step => !completedSteps.includes(step.id));
  return incompleteIndex === -1 ? steps.length - 1 : incompleteIndex;
}