import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  PlayCircle, 
  Lightbulb,
  Target,
  MousePointer,
  Eye,
  Hand
} from "lucide-react";

interface GuideStep {
  id: number;
  title: string;
  description: string;
  instruction: string;
  targetElement?: string;
  action: 'click' | 'navigate' | 'observe' | 'input';
  completed: boolean;
}

interface InteractiveGuideProps {
  role: 'student' | 'teacher' | 'school_admin';
  onComplete?: () => void;
}

const guideSteps = {
  student: [
    {
      id: 1,
      title: "Welcome to Your Dashboard",
      description: "This is your personal learning hub where you can access all modules",
      instruction: "Take a moment to observe the main navigation and module cards",
      action: 'observe' as const,
      completed: false
    },
    {
      id: 2,
      title: "Access Digital Library",
      description: "Click on the Digital Library card to explore available resources",
      instruction: "Click the 'Digital Library' module card",
      targetElement: "[data-module='digital-library']",
      action: 'click' as const,
      completed: false
    },
    {
      id: 3,
      title: "Search for Resources",
      description: "Use the search functionality to find specific books or materials",
      instruction: "Try searching for a topic you're interested in",
      action: 'input' as const,
      completed: false
    },
    {
      id: 4,
      title: "Organize in My Locker",
      description: "Save your favorite resources to My Locker for easy access",
      instruction: "Navigate to My Locker and explore the organization features",
      action: 'navigate' as const,
      completed: false
    },
    {
      id: 5,
      title: "Explore Apps Hub",
      description: "Discover educational games and interactive learning tools",
      instruction: "Visit Apps Hub and try an educational application",
      action: 'navigate' as const,
      completed: false
    }
  ],
  teacher: [
    {
      id: 1,
      title: "Teacher Dashboard Overview",
      description: "Your command center for managing classes and student progress",
      instruction: "Familiarize yourself with the teacher-specific modules",
      action: 'observe' as const,
      completed: false
    },
    {
      id: 2,
      title: "Create Digital Content",
      description: "Use the authoring tools to create interactive lessons",
      instruction: "Click on 'Authoring Tool' to start creating content",
      action: 'click' as const,
      completed: false
    },
    {
      id: 3,
      title: "Manage Student Progress",
      description: "Monitor how your students are performing",
      instruction: "Access the student analytics section",
      action: 'navigate' as const,
      completed: false
    },
    {
      id: 4,
      title: "Schedule and Plan",
      description: "Organize your lessons and assignments",
      instruction: "Explore the calendar and scheduling features",
      action: 'navigate' as const,
      completed: false
    }
  ],
  school_admin: [
    {
      id: 1,
      title: "Administrator Dashboard",
      description: "Your central hub for managing the entire institution",
      instruction: "Review the administrative modules and system overview",
      action: 'observe' as const,
      completed: false
    },
    {
      id: 2,
      title: "User Management",
      description: "Add and manage teachers, students, and staff",
      instruction: "Access the user management section",
      action: 'click' as const,
      completed: false
    },
    {
      id: 3,
      title: "System Analytics",
      description: "Monitor platform usage and performance metrics",
      instruction: "Review the analytics dashboard",
      action: 'navigate' as const,
      completed: false
    },
    {
      id: 4,
      title: "Configure Settings",
      description: "Customize the platform for your institution",
      instruction: "Explore institution settings and preferences",
      action: 'navigate' as const,
      completed: false
    }
  ]
};

export function InteractiveGuide({ role, onComplete }: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<GuideStep[]>(guideSteps[role]);
  const [isActive, setIsActive] = useState(false);

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

  const handleStepComplete = () => {
    const updatedSteps = [...steps];
    updatedSteps[currentStep].completed = true;
    setSteps(updatedSteps);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Guide completed
      setIsActive(false);
      onComplete?.();
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'click': return <MousePointer className="h-4 w-4" />;
      case 'navigate': return <ArrowRight className="h-4 w-4" />;
      case 'observe': return <Eye className="h-4 w-4" />;
      case 'input': return <Hand className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'click': return 'bg-blue-500';
      case 'navigate': return 'bg-green-500';
      case 'observe': return 'bg-purple-500';
      case 'input': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isActive) {
    return (
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <PlayCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Interactive Platform Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Take a guided tour to learn how to use Edvirons effectively
              </p>
            </div>
            <Button onClick={() => setIsActive(true)} className="w-full">
              Start Interactive Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Interactive Guide
            </CardTitle>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Step */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${getActionColor(currentStepData.action)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                {getActionIcon(currentStepData.action)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-l-blue-500">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>What to do:</strong> {currentStepData.instruction}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Your Progress</h4>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500 text-white' :
                    index === currentStep ? 'bg-blue-500 text-white' :
                    'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    step.completed ? 'text-green-600 dark:text-green-400' :
                    index === currentStep ? 'text-blue-600 dark:text-blue-400 font-medium' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-3">
            <Button 
              variant="outline" 
              onClick={handleStepBack}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={handleStepComplete}
              className="flex-1"
            >
              {currentStep === steps.length - 1 ? 'Complete Guide' : 'Mark as Done'}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <button 
              onClick={() => setIsActive(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Exit guide
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}