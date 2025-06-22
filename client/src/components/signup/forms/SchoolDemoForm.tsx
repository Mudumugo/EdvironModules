import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { School, ArrowLeft, Loader2, Mail, User, Building, Users, GraduationCap } from "lucide-react";
import { SchoolDemoForm as SchoolFormData } from "../types";

interface SchoolDemoFormProps {
  form: UseFormReturn<SchoolFormData>;
  onSubmit: (data: SchoolFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function SchoolDemoForm({ form, onSubmit, onBack, isLoading }: SchoolDemoFormProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <School className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Request School Demo</CardTitle>
            <CardDescription>
              Schedule a personalized demonstration for your educational institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Person Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium">Contact Person</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactFirstName">First Name *</Label>
                    <Input
                      id="contactFirstName"
                      {...form.register("contactFirstName")}
                      placeholder="Your first name"
                    />
                    {form.formState.errors.contactFirstName && (
                      <p className="text-sm text-red-600">{form.formState.errors.contactFirstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactLastName">Last Name *</Label>
                    <Input
                      id="contactLastName"
                      {...form.register("contactLastName")}
                      placeholder="Your last name"
                    />
                    {form.formState.errors.contactLastName && (
                      <p className="text-sm text-red-600">{form.formState.errors.contactLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="contactEmail"
                      type="email"
                      {...form.register("contactEmail")}
                      className="pl-10"
                      placeholder="your.email@school.edu"
                    />
                  </div>
                  {form.formState.errors.contactEmail && (
                    <p className="text-sm text-red-600">{form.formState.errors.contactEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    {...form.register("contactPhone")}
                    placeholder="+254 700 000 000"
                  />
                  {form.formState.errors.contactPhone && (
                    <p className="text-sm text-red-600">{form.formState.errors.contactPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Your Position *</Label>
                  <Select onValueChange={(value) => form.setValue("position", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="headteacher">Head Teacher</SelectItem>
                      <SelectItem value="deputy">Deputy Head</SelectItem>
                      <SelectItem value="academic-director">Academic Director</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="teacher">Senior Teacher</SelectItem>
                      <SelectItem value="it-coordinator">IT Coordinator</SelectItem>
                      <SelectItem value="board-member">Board Member</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.position && (
                    <p className="text-sm text-red-600">{form.formState.errors.position.message}</p>
                  )}
                </div>
              </div>

              {/* School Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium">School Information</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    {...form.register("schoolName")}
                    placeholder="Enter your school's full name"
                  />
                  {form.formState.errors.schoolName && (
                    <p className="text-sm text-red-600">{form.formState.errors.schoolName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolType">School Type *</Label>
                  <Select onValueChange={(value) => form.setValue("schoolType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public-primary">Public Primary School</SelectItem>
                      <SelectItem value="private-primary">Private Primary School</SelectItem>
                      <SelectItem value="public-secondary">Public Secondary School</SelectItem>
                      <SelectItem value="private-secondary">Private Secondary School</SelectItem>
                      <SelectItem value="international">International School</SelectItem>
                      <SelectItem value="special-needs">Special Needs School</SelectItem>
                      <SelectItem value="technical">Technical/Vocational Institution</SelectItem>
                      <SelectItem value="university">University/College</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.schoolType && (
                    <p className="text-sm text-red-600">{form.formState.errors.schoolType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentCount">Number of Students *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Select onValueChange={(value) => form.setValue("studentCount", value)}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1 - 50 students</SelectItem>
                          <SelectItem value="51-100">51 - 100 students</SelectItem>
                          <SelectItem value="101-250">101 - 250 students</SelectItem>
                          <SelectItem value="251-500">251 - 500 students</SelectItem>
                          <SelectItem value="501-1000">501 - 1,000 students</SelectItem>
                          <SelectItem value="1001+">1,000+ students</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {form.formState.errors.studentCount && (
                      <p className="text-sm text-red-600">{form.formState.errors.studentCount.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacherCount">Number of Teachers</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Select onValueChange={(value) => form.setValue("teacherCount", value)}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1 - 10 teachers</SelectItem>
                          <SelectItem value="11-25">11 - 25 teachers</SelectItem>
                          <SelectItem value="26-50">26 - 50 teachers</SelectItem>
                          <SelectItem value="51-100">51 - 100 teachers</SelectItem>
                          <SelectItem value="100+">100+ teachers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="county">County *</Label>
                  <Select onValueChange={(value) => form.setValue("county", value)}>
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
                  {form.formState.errors.county && (
                    <p className="text-sm text-red-600">{form.formState.errors.county.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City/Town</Label>
                  <Input
                    id="city"
                    {...form.register("city")}
                    placeholder="Enter city or town"
                  />
                </div>
              </div>

              {/* Requirements & Interests */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentChallenges">Current Educational Challenges</Label>
                  <Textarea
                    id="currentChallenges"
                    {...form.register("currentChallenges")}
                    placeholder="Tell us about the educational challenges your school faces (optional)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="areasOfInterest">Areas of Interest</Label>
                  <Textarea
                    id="areasOfInterest"
                    {...form.register("areasOfInterest")}
                    placeholder="Which EdVirons features are you most interested in? (e.g., digital library, student management, analytics)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Implementation Timeframe</Label>
                  <Select onValueChange={(value) => form.setValue("timeframe", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When would you like to implement?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="1-3-months">Within 1-3 months</SelectItem>
                      <SelectItem value="3-6-months">Within 3-6 months</SelectItem>
                      <SelectItem value="6-12-months">Within 6-12 months</SelectItem>
                      <SelectItem value="exploring">Just exploring options</SelectItem>
                    </SelectContent>
                  </Select>
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
                      I agree to be contacted by EdVirons regarding this demo request and accept the{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>
                    </Label>
                    {form.formState.errors.termsAccepted && (
                      <p className="text-sm text-red-600">{form.formState.errors.termsAccepted.message}</p>
                    )}
                  </div>
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
                      Submitting Request...
                    </>
                  ) : (
                    "Request Demo"
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