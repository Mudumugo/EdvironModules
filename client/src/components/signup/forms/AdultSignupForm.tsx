import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { User, ArrowLeft, Loader2, Mail, MapPin, Building } from "lucide-react";
import { AdultSignupForm as AdultFormData } from "../types";

interface AdultSignupFormProps {
  form: UseFormReturn<AdultFormData>;
  onSubmit: (data: AdultFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function AdultSignupForm({ form, onSubmit, onBack, isLoading }: AdultSignupFormProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Join thousands of educators and learners in Kenya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      placeholder="Enter your first name"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      placeholder="Enter your last name"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      className="pl-10"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+254 700 000 000"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium">Location</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="county">County *</Label>
                  <Select onValueChange={(value) => form.setValue("county", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your county" />
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
                    placeholder="Enter your city or town"
                  />
                </div>
              </div>

              {/* Role & Institution */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-4 w-4 text-gray-600" />
                  <h3 className="font-medium">Professional Information</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role *</Label>
                  <Select onValueChange={(value) => form.setValue("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="administrator">School Administrator</SelectItem>
                      <SelectItem value="parent">Parent/Guardian</SelectItem>
                      <SelectItem value="student">Adult Student</SelectItem>
                      <SelectItem value="tutor">Private Tutor</SelectItem>
                      <SelectItem value="other">Other Education Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.role && (
                    <p className="text-sm text-red-600">{form.formState.errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution/School Name</Label>
                  <Input
                    id="institution"
                    {...form.register("institution")}
                    placeholder="Enter your school or institution name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Areas of Interest</Label>
                  <Textarea
                    id="interests"
                    {...form.register("interests")}
                    placeholder="Tell us about your educational interests (optional)"
                    rows={3}
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
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