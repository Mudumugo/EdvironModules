import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GraduationCap, User, School } from "lucide-react";

interface RoleSelectionStepProps {
  initialData: { role?: string; gradeLevel?: string; institution?: string };
  onNext: (data: { role: string; gradeLevel?: string; institution?: string }) => void;
  onPrev: () => void;
}

export function RoleSelectionStep({ initialData, onNext, onPrev }: RoleSelectionStepProps) {
  const [role, setRole] = useState(initialData.role || "");
  const [gradeLevel, setGradeLevel] = useState(initialData.gradeLevel || "");
  const [institution, setInstitution] = useState(initialData.institution || "");

  const handleContinue = () => {
    if (!role) return;
    
    const data: { role: string; gradeLevel?: string; institution?: string } = { role };
    
    if (role === "student" && gradeLevel) {
      data.gradeLevel = gradeLevel;
    }
    
    if ((role === "teacher" || role === "admin") && institution) {
      data.institution = institution;
    }
    
    onNext(data);
  };

  const isValid = role && (
    (role === "student" ? gradeLevel : true) &&
    ((role === "teacher" || role === "admin") ? institution : true)
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <GraduationCap className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Your Role</CardTitle>
        <CardDescription>
          Help us customize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="role">I am a...</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="parent">Parent/Guardian</SelectItem>
              <SelectItem value="admin">School Administrator</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === "student" && (
          <div className="space-y-2">
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pp1">PP1 (Pre-Primary 1)</SelectItem>
                <SelectItem value="pp2">PP2 (Pre-Primary 2)</SelectItem>
                <SelectItem value="grade1">Grade 1</SelectItem>
                <SelectItem value="grade2">Grade 2</SelectItem>
                <SelectItem value="grade3">Grade 3</SelectItem>
                <SelectItem value="grade4">Grade 4</SelectItem>
                <SelectItem value="grade5">Grade 5</SelectItem>
                <SelectItem value="grade6">Grade 6</SelectItem>
                <SelectItem value="grade7">Grade 7</SelectItem>
                <SelectItem value="grade8">Grade 8</SelectItem>
                <SelectItem value="grade9">Grade 9</SelectItem>
                <SelectItem value="grade10">Grade 10</SelectItem>
                <SelectItem value="grade11">Grade 11</SelectItem>
                <SelectItem value="grade12">Grade 12</SelectItem>
                <SelectItem value="college">College/University</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {(role === "teacher" || role === "admin") && (
          <div className="space-y-2">
            <Label htmlFor="institution">Institution/School</Label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your school or institution name"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button 
            type="button" 
            onClick={handleContinue}
            disabled={!isValid}
            className="px-8"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}