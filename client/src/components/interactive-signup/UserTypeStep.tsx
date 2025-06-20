import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, School, Baby } from "lucide-react";
import { QuizData } from "./types";

interface UserTypeStepProps {
  quizData: QuizData;
  onUpdateData: (data: Partial<QuizData>) => void;
  onNext: () => void;
}

export function UserTypeStep({ quizData, onUpdateData, onNext }: UserTypeStepProps) {
  const userTypes = [
    {
      id: "student" as const,
      title: "Student",
      description: "I'm a student looking to enhance my learning",
      icon: Users,
      color: "blue"
    },
    {
      id: "parent" as const,
      title: "Parent",
      description: "I'm a parent looking to support my child's education",
      icon: Baby,
      color: "green"
    },
    {
      id: "school" as const,
      title: "School",
      description: "I represent an educational institution",
      icon: School,
      color: "purple"
    }
  ];

  const handleSelectUserType = (userType: "student" | "parent" | "school") => {
    onUpdateData({ userType });
    setTimeout(onNext, 300);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Who are you?</CardTitle>
        <CardDescription>
          This helps us tailor the experience to your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = quizData.userType === type.id;
          
          return (
            <Button
              key={type.id}
              variant={isSelected ? "default" : "outline"}
              className={`w-full h-auto p-6 flex items-center justify-start space-x-4 ${
                isSelected ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleSelectUserType(type.id)}
            >
              <div className={`p-3 rounded-lg ${
                isSelected 
                  ? "bg-white/20" 
                  : type.color === "blue" 
                    ? "bg-blue-100" 
                    : type.color === "green" 
                      ? "bg-green-100" 
                      : "bg-purple-100"
              }`}>
                <Icon className={`h-6 w-6 ${
                  isSelected 
                    ? "text-white" 
                    : type.color === "blue" 
                      ? "text-blue-600" 
                      : type.color === "green" 
                        ? "text-green-600" 
                        : "text-purple-600"
                }`} />
              </div>
              <div className="text-left">
                <div className="font-semibold">{type.title}</div>
                <div className={`text-sm ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                  {type.description}
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}