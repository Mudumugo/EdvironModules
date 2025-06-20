import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Baby } from "lucide-react";
import { QuizData } from "./types";

interface ChildInfoStepProps {
  quizData: QuizData;
  onUpdateData: (data: Partial<QuizData>) => void;
}

export function ChildInfoStep({ quizData, onUpdateData }: ChildInfoStepProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
          <Baby className="h-6 w-6 text-pink-600" />
        </div>
        <CardTitle className="text-2xl font-bold">About Your Child</CardTitle>
        <CardDescription>
          Tell us about your child's learning needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="childFirstName">Child's First Name</Label>
            <Input
              id="childFirstName"
              value={quizData.childFirstName || ""}
              onChange={(e) => onUpdateData({ childFirstName: e.target.value })}
              placeholder="Child's first name"
            />
          </div>
          <div>
            <Label htmlFor="childLastName">Child's Last Name</Label>
            <Input
              id="childLastName"
              value={quizData.childLastName || ""}
              onChange={(e) => onUpdateData({ childLastName: e.target.value })}
              placeholder="Child's last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="childBirthDate">Child's Birth Date</Label>
            <Input
              id="childBirthDate"
              type="date"
              value={quizData.childBirthDate || ""}
              onChange={(e) => onUpdateData({ childBirthDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Child's Current Grade</Label>
            <Select
              value={quizData.childGrade || ""}
              onValueChange={(value) => onUpdateData({ childGrade: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre-k">Pre-K</SelectItem>
                <SelectItem value="kindergarten">Kindergarten</SelectItem>
                <SelectItem value="grade-1">Grade 1</SelectItem>
                <SelectItem value="grade-2">Grade 2</SelectItem>
                <SelectItem value="grade-3">Grade 3</SelectItem>
                <SelectItem value="grade-4">Grade 4</SelectItem>
                <SelectItem value="grade-5">Grade 5</SelectItem>
                <SelectItem value="grade-6">Grade 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}