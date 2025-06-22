import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, Loader2, Mail, User, Calendar, GraduationCap } from "lucide-react";
import { ParentChildSignupForm as ParentChildFormData } from "../types";

interface ParentChildSignupFormProps {
  form: UseFormReturn<ParentChildFormData>;
  onSubmit: (data: ParentChildFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function ParentChildSignupForm({ form, onSubmit, onBack, isLoading }: ParentChildSignupFormProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-2xl">Family Account Setup</CardTitle>
            <CardDescription>
              Create accounts for both parent and child
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Parent Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium text-lg">Parent/Guardian Information</h3>
                  <Badge variant="secondary" className="ml-auto">Required</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentFirstName">First Name *</Label>
                    <Input
                      id="parentFirstName"
                      {...form.register("parentFirstName")}
                      placeholder="Parent's first name"
                    />
                    {form.formState.errors.parentFirstName && (
                      <p className="text-sm text-red-600">{form.formState.errors.parentFirstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentLastName">Last Name *</Label>
                    <Input
                      id="parentLastName"
                      {...form.register("parentLastName")}
                      placeholder="Parent's last name"
                    />
                    {form.formState.errors.parentLastName && (
                      <p className="text-sm text-red-600">{form.formState.errors.parentLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="parentEmail"
                      type="email"
                      {...form.register("parentEmail")}
                      className="pl-10"
                      placeholder="parent@example.com"
                    />
                  </div>
                  {form.formState.errors.parentEmail && (
                    <p className="text-sm text-red-600">{form.formState.errors.parentEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <Input
                    id="parentPhone"
                    {...form.register("parentPhone")}
                    placeholder="+254 700 000 000"
                  />
                  {form.formState.errors.parentPhone && (
                    <p className="text-sm text-red-600">{form.formState.errors.parentPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentCounty">County *</Label>
                  <Select onValueChange={(value) => form.setValue("parentCounty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kiambu">Kiambu</SelectItem>
                      <SelectItem value="nakuru">Nakuru</SelectItem>
                      <SelectItem value="machakos">Machakos</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                      <SelectItem value="uasin-gishu">Uasin Gishu</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.parentCounty && (
                    <p className="text-sm text-red-600">{form.formState.errors.parentCounty.message}</p>
                  )}
                </div>
              </div>

              {/* Child Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium text-lg">Child Information</h3>
                  <Badge variant="secondary" className="ml-auto">Required</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childFirstName">Child's First Name *</Label>
                    <Input
                      id="childFirstName"
                      {...form.register("childFirstName")}
                      placeholder="Child's first name"
                    />
                    {form.formState.errors.childFirstName && (
                      <p className="text-sm text-red-600">{form.formState.errors.childFirstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="childLastName">Child's Last Name *</Label>
                    <Input
                      id="childLastName"
                      {...form.register("childLastName")}
                      placeholder="Child's last name"
                    />
                    {form.formState.errors.childLastName && (
                      <p className="text-sm text-red-600">{form.formState.errors.childLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childBirthDate">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="childBirthDate"
                      type="date"
                      {...form.register("childBirthDate")}
                      className="pl-10"
                    />
                  </div>
                  {form.formState.errors.childBirthDate && (
                    <p className="text-sm text-red-600">{form.formState.errors.childBirthDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childGrade">Current Grade Level *</Label>
                  <Select onValueChange={(value) => form.setValue("childGrade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pp1">Pre-Primary 1</SelectItem>
                      <SelectItem value="pp2">Pre-Primary 2</SelectItem>
                      <SelectItem value="grade1">Grade 1</SelectItem>
                      <SelectItem value="grade2">Grade 2</SelectItem>
                      <SelectItem value="grade3">Grade 3</SelectItem>
                      <SelectItem value="grade4">Grade 4</SelectItem>
                      <SelectItem value="grade5">Grade 5</SelectItem>
                      <SelectItem value="grade6">Grade 6</SelectItem>
                      <SelectItem value="grade7">Grade 7</SelectItem>
                      <SelectItem value="grade8">Grade 8</SelectItem>
                      <SelectItem value="form1">Form 1</SelectItem>
                      <SelectItem value="form2">Form 2</SelectItem>
                      <SelectItem value="form3">Form 3</SelectItem>
                      <SelectItem value="form4">Form 4</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.childGrade && (
                    <p className="text-sm text-red-600">{form.formState.errors.childGrade.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childSchool">School Name</Label>
                  <Input
                    id="childSchool"
                    {...form.register("childSchool")}
                    placeholder="Enter child's school name"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="termsAccepted"
                    {...form.register("termsAccepted")}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="termsAccepted" className="text-sm">
                      I agree to the{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                    {form.formState.errors.termsAccepted && (
                      <p className="text-sm text-red-600">{form.formState.errors.termsAccepted.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="parentalConsent"
                    {...form.register("parentalConsent")}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="parentalConsent" className="text-sm">
                      I give consent for my child to use EdVirons and confirm I am their parent/legal guardian
                    </Label>
                    {form.formState.errors.parentalConsent && (
                      <p className="text-sm text-red-600">{form.formState.errors.parentalConsent.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="marketingEmails"
                    {...form.register("marketingEmails")}
                  />
                  <Label htmlFor="marketingEmails" className="text-sm">
                    I would like to receive educational updates and newsletters
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Accounts...
                    </>
                  ) : (
                    "Create Family Accounts"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}