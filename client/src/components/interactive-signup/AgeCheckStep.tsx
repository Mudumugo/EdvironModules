import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { QuizData } from "./types";

interface AgeCheckStepProps {
  quizData: QuizData;
  onUpdateData: (data: Partial<QuizData>) => void;
  calculateAge: (birthDate: string) => number;
}

export function AgeCheckStep({ quizData, onUpdateData, calculateAge }: AgeCheckStepProps) {
  const handleBirthDateChange = (birthDate: string) => {
    const age = calculateAge(birthDate);
    onUpdateData({ birthDate, age });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Calendar className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">What's your birth date?</CardTitle>
        <CardDescription>
          {quizData.userType === "parent" 
            ? "We need this to verify you can create accounts for children"
            : "This helps us provide age-appropriate content and features"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm mx-auto">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={quizData.birthDate || ""}
            onChange={(e) => handleBirthDateChange(e.target.value)}
            className="text-center"
          />
          {quizData.age && (
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
              Age: {quizData.age} years old
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}