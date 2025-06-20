import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, School, Baby, User } from "lucide-react";
import { SignupType } from "./types";

interface SignupTypeSelectorProps {
  userAge: number;
  onSelectType: (type: SignupType) => void;
}

export function SignupTypeSelector({ userAge, onSelectType }: SignupTypeSelectorProps) {
  const getRecommendedType = () => {
    if (userAge < 13) return "parent";
    if (userAge >= 13 && userAge < 18) return "student";
    return "adult";
  };

  const signupOptions = [
    {
      type: "student" as const,
      title: "Student Account",
      description: "For students aged 13-17 with parental consent",
      icon: User,
      available: userAge >= 13 && userAge < 18,
      recommended: getRecommendedType() === "student"
    },
    {
      type: "parent" as const,
      title: "Parent Account",
      description: "Create an account for your child under 13",
      icon: Baby,
      available: userAge < 13 || userAge >= 18,
      recommended: getRecommendedType() === "parent"
    },
    {
      type: "adult" as const,
      title: "Individual Account",
      description: "For adults, tutors, or independent learners",
      icon: User,
      available: userAge >= 18,
      recommended: getRecommendedType() === "adult"
    },
    {
      type: "school" as const,
      title: "School Demo Request",
      description: "Request a demonstration for your educational institution",
      icon: School,
      available: userAge >= 18,
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Account Type</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Based on your age ({userAge} years old), here are your available options
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {signupOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.type}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  option.available 
                    ? "hover:border-blue-500" 
                    : "opacity-50 cursor-not-allowed"
                } ${
                  option.recommended 
                    ? "ring-2 ring-blue-500 border-blue-500" 
                    : ""
                }`}
                onClick={() => option.available && onSelectType(option.type)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        option.available ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          option.available ? "text-blue-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {option.title}
                        </CardTitle>
                      </div>
                    </div>
                    {option.recommended && (
                      <Badge className="bg-green-100 text-green-800">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!option.available && (
                    <p className="text-sm text-red-500">
                      Not available for your age group
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}