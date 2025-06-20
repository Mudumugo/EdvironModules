import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { QuizData } from "./types";

interface ParentInfoStepProps {
  quizData: QuizData;
  onUpdateData: (data: Partial<QuizData>) => void;
}

export function ParentInfoStep({ quizData, onUpdateData }: ParentInfoStepProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <User className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Your Information</CardTitle>
        <CardDescription>
          Tell us about yourself as a parent/guardian
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="parentFirstName">Your First Name</Label>
            <Input
              id="parentFirstName"
              value={quizData.firstName || ""}
              onChange={(e) => onUpdateData({ firstName: e.target.value })}
              placeholder="Your first name"
            />
          </div>
          <div>
            <Label htmlFor="parentLastName">Your Last Name</Label>
            <Input
              id="parentLastName"
              value={quizData.lastName || ""}
              onChange={(e) => onUpdateData({ lastName: e.target.value })}
              placeholder="Your last name"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}