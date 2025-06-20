import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Shield } from "lucide-react";
import { studentSignupSchema, type StudentSignupForm as StudentFormData } from "../types";

interface StudentSignupFormProps {
  onSubmit: (data: StudentFormData) => void;
  isLoading?: boolean;
}

export function StudentSignupForm({ onSubmit, isLoading }: StudentSignupFormProps) {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSignupSchema),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Student Account Setup</CardTitle>
            <CardDescription>
              Create your student account with parental consent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Since you're under 18, we'll need to verify your account with a parent or guardian.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className={form.formState.errors.email ? "border-red-500" : ""}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className={form.formState.errors.password ? "border-red-500" : ""}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...form.register("confirmPassword")}
                  className={form.formState.errors.confirmPassword ? "border-red-500" : ""}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentName">Parent/Guardian Name</Label>
                <Input
                  id="parentName"
                  type="text"
                  {...form.register("parentName")}
                  className={form.formState.errors.parentName ? "border-red-500" : ""}
                />
                {form.formState.errors.parentName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.parentName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  {...form.register("parentPhone")}
                  className={form.formState.errors.parentPhone ? "border-red-500" : ""}
                />
                {form.formState.errors.parentPhone && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.parentPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select onValueChange={(value) => form.setValue("gradeLevel", value)}>
                  <SelectTrigger className={form.formState.errors.gradeLevel ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your grade level" />
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
                {form.formState.errors.gradeLevel && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.gradeLevel.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={form.watch("agreeToTerms")}
                  onCheckedChange={(checked) => form.setValue("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              {form.formState.errors.agreeToTerms && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.agreeToTerms.message}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}