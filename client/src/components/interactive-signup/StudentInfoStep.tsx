import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";
import { QuizData, subjects } from "./types";

interface StudentInfoStepProps {
  quizData: QuizData;
  onUpdateData: (data: Partial<QuizData>) => void;
}

export function StudentInfoStep({ quizData, onUpdateData }: StudentInfoStepProps) {
  const handleSubjectToggle = (subject: string, checked: boolean) => {
    const currentSubjects = quizData.subjects || [];
    const newSubjects = checked 
      ? [...currentSubjects, subject]
      : currentSubjects.filter(s => s !== subject);
    onUpdateData({ subjects: newSubjects });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Student Information</CardTitle>
        <CardDescription>
          Tell us about your academic interests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={quizData.firstName || ""}
              onChange={(e) => onUpdateData({ firstName: e.target.value })}
              placeholder="Your first name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={quizData.lastName || ""}
              onChange={(e) => onUpdateData({ lastName: e.target.value })}
              placeholder="Your last name"
            />
          </div>
        </div>

        <div>
          <Label>Current Grade Level</Label>
          <Select
            value={quizData.gradeLevel || ""}
            onValueChange={(value) => onUpdateData({ gradeLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade-7">Grade 7</SelectItem>
              <SelectItem value="grade-8">Grade 8</SelectItem>
              <SelectItem value="grade-9">Grade 9</SelectItem>
              <SelectItem value="grade-10">Grade 10</SelectItem>
              <SelectItem value="grade-11">Grade 11</SelectItem>
              <SelectItem value="grade-12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium">Favorite Subjects</Label>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Select the subjects you're most interested in
          </p>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={(quizData.subjects || []).includes(subject)}
                  onCheckedChange={(checked) => handleSubjectToggle(subject, checked as boolean)}
                />
                <Label htmlFor={subject} className="text-sm">
                  {subject}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}