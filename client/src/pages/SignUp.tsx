import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AgeVerificationStep } from "@/components/signup/AgeVerificationStep";
import { SignupTypeSelector } from "@/components/signup/SignupTypeSelector";
import { StudentSignupForm } from "@/components/signup/forms/StudentSignupForm";
import { VerificationStep } from "@/components/signup/VerificationStep";
import { CompletionStep } from "@/components/signup/CompletionStep";
import { 
  type AgeVerificationForm,
  type StudentSignupForm as StudentFormData,
  type AdultSignupForm,
  type ParentChildSignupForm,
  type SchoolDemoForm,
  type SignupStep,
  type SignupType,
  adultSignupSchema,
  parentChildSignupSchema,
  schoolDemoSchema
} from "@/components/signup/types";



export default function SignUp() {
  const [currentStep, setCurrentStep] = useState<SignupStep>("age-check");
  const [userAge, setUserAge] = useState<number | null>(null);
  const [signupType, setSignupType] = useState<SignupType>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [ageData, setAgeData] = useState<AgeVerificationForm | null>(null);

  // Adult signup form (18+)
  const adultForm = useForm<AdultSignupForm>({
    resolver: zodResolver(adultSignupSchema),
  });

  // Parent child signup form
  const parentChildForm = useForm<ParentChildSignupForm>({
    resolver: zodResolver(parentChildSignupSchema),
  });

  // School demo form
  const schoolForm = useForm<SchoolDemoForm>({
    resolver: zodResolver(schoolDemoSchema),
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleAgeVerification = (data: AgeVerificationForm) => {
    const age = calculateAge(data.birthDate);
    setUserAge(age);
    setAgeData(data);
    setCurrentStep("signup");
  };

  const handleSignupTypeSelection = (type: SignupType) => {
    setSignupType(type);
  };

  const studentSignupMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      return await apiRequest("POST", "/api/signup/student", {
        ...data,
        firstName: ageData?.firstName,
        lastName: ageData?.lastName,
        birthDate: ageData?.birthDate,
      });
    },
    onSuccess: () => {
      setVerificationSent(true);
      setCurrentStep("verification");
    },
    onError: (error) => {
      console.error("Student signup error:", error);
    },
  });

  const handleStudentSignup = (data: StudentFormData) => {
    studentSignupMutation.mutate(data);
  };

  const adultSignupMutation = useMutation({
    mutationFn: async (data: AdultSignupForm) => {
      return await apiRequest("POST", "/api/signup/adult", {
        ...data,
        firstName: ageData?.firstName,
        lastName: ageData?.lastName,
        birthDate: ageData?.birthDate,
      });
    },
    onSuccess: () => {
      setVerificationSent(true);
      setCurrentStep("verification");
    },
    onError: (error) => {
      console.error("Adult signup error:", error);
    },
  });

  const handleAdultSignup = (data: AdultSignupForm) => {
    adultSignupMutation.mutate(data);
  };

  const parentChildSignupMutation = useMutation({
    mutationFn: async (data: ParentChildSignupForm) => {
      return await apiRequest("POST", "/api/signup/family", data);
    },
    onSuccess: () => {
      setVerificationSent(true);
      setCurrentStep("verification");
    },
    onError: (error) => {
      console.error("Parent-child signup error:", error);
    },
  });

  const handleParentChildSignup = (data: ParentChildSignupForm) => {
    parentChildSignupMutation.mutate(data);
  };

  const schoolDemoMutation = useMutation({
    mutationFn: async (data: SchoolDemoForm) => {
      return await apiRequest("POST", "/api/signup/school-demo", data);
    },
    onSuccess: () => {
      setCurrentStep("complete");
    },
    onError: (error) => {
      console.error("School demo error:", error);
    },
  });

  const handleSchoolDemo = (data: SchoolDemoForm) => {
    schoolDemoMutation.mutate(data);
  };

  if (currentStep === "age-check") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Edvirons
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Let's get you started with the right account type
            </p>
          </div>

          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual Account</TabsTrigger>
              <TabsTrigger value="school">School Demo</TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Age Verification
                  </CardTitle>
                  <CardDescription>
                    We need to verify your age to create the appropriate account type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={ageForm.handleSubmit(handleAgeVerification)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...ageForm.register("firstName")}
                          placeholder="Enter your first name"
                        />
                        {ageForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">
                            {ageForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...ageForm.register("lastName")}
                          placeholder="Enter your last name"
                        />
                        {ageForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">
                            {ageForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="birthDate">Date of Birth</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...ageForm.register("birthDate")}
                      />
                      {ageForm.formState.errors.birthDate && (
                        <p className="text-sm text-red-600 mt-1">
                          {ageForm.formState.errors.birthDate.message}
                        </p>
                      )}
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Based on your age, we'll guide you through the appropriate signup process:
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Under 13: Parent/Guardian signup required</li>
                          <li>• 13-17: Student account with parent verification</li>
                          <li>• 18+: Full independent account</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <Button type="submit" className="w-full">
                      Continue
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="school">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    School Demonstration Request
                  </CardTitle>
                  <CardDescription>
                    Request a free demonstration and consultation for your educational institution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={schoolForm.handleSubmit(handleSchoolDemo)} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactName">Contact Name *</Label>
                          <Input
                            id="contactName"
                            {...schoolForm.register("contactName")}
                            placeholder="Your full name"
                          />
                          {schoolForm.formState.errors.contactName && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.contactName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="role">Your Role *</Label>
                          <Select onValueChange={(value) => schoolForm.setValue("role", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="principal">Principal</SelectItem>
                              <SelectItem value="vice-principal">Vice Principal</SelectItem>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="it-director">IT Director</SelectItem>
                              <SelectItem value="curriculum-director">Curriculum Director</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {schoolForm.formState.errors.role && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.role.message}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...schoolForm.register("email")}
                            placeholder="your.email@school.edu"
                          />
                          {schoolForm.formState.errors.email && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            {...schoolForm.register("phone")}
                            placeholder="(555) 123-4567"
                          />
                          {schoolForm.formState.errors.phone && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* School Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">School Information</h3>
                      <div>
                        <Label htmlFor="schoolName">School Name *</Label>
                        <Input
                          id="schoolName"
                          {...schoolForm.register("schoolName")}
                          placeholder="Enter your school name"
                        />
                        {schoolForm.formState.errors.schoolName && (
                          <p className="text-sm text-red-600 mt-1">
                            {schoolForm.formState.errors.schoolName.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="schoolType">School Type *</Label>
                          <Select onValueChange={(value) => schoolForm.setValue("schoolType", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select school type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public-elementary">Public Elementary</SelectItem>
                              <SelectItem value="public-middle">Public Middle School</SelectItem>
                              <SelectItem value="public-high">Public High School</SelectItem>
                              <SelectItem value="private-elementary">Private Elementary</SelectItem>
                              <SelectItem value="private-middle">Private Middle School</SelectItem>
                              <SelectItem value="private-high">Private High School</SelectItem>
                              <SelectItem value="charter">Charter School</SelectItem>
                              <SelectItem value="college">College/University</SelectItem>
                              <SelectItem value="district">School District</SelectItem>
                            </SelectContent>
                          </Select>
                          {schoolForm.formState.errors.schoolType && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.schoolType.message}
                            </p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <h4 className="text-sm font-medium mb-2">School Location *</h4>
                          <LocationSelector
                            onLocationChange={(location) => {
                              schoolForm.setValue("county", location.county);
                              schoolForm.setValue("constituency", location.constituency);
                              schoolForm.setValue("ward", location.ward);
                            }}
                            required={true}
                          />
                          {(schoolForm.formState.errors.county || schoolForm.formState.errors.constituency || schoolForm.formState.errors.ward) && (
                            <p className="text-sm text-red-600 mt-1">
                              Please complete all location fields
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="studentPopulation">Student Population *</Label>
                          <Select onValueChange={(value) => schoolForm.setValue("studentPopulation", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select population size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-100">Under 100 students</SelectItem>
                              <SelectItem value="100-300">100-300 students</SelectItem>
                              <SelectItem value="300-500">300-500 students</SelectItem>
                              <SelectItem value="500-1000">500-1,000 students</SelectItem>
                              <SelectItem value="1000-2000">1,000-2,000 students</SelectItem>
                              <SelectItem value="over-2000">Over 2,000 students</SelectItem>
                            </SelectContent>
                          </Select>
                          {schoolForm.formState.errors.studentPopulation && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.studentPopulation.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="gradeRange">Grade Range *</Label>
                          <Select onValueChange={(value) => schoolForm.setValue("gradeRange", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="k-5">K-5</SelectItem>
                              <SelectItem value="6-8">6-8</SelectItem>
                              <SelectItem value="9-12">9-12</SelectItem>
                              <SelectItem value="k-8">K-8</SelectItem>
                              <SelectItem value="k-12">K-12</SelectItem>
                              <SelectItem value="college">College/University</SelectItem>
                            </SelectContent>
                          </Select>
                          {schoolForm.formState.errors.gradeRange && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.gradeRange.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Technology Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Technology Assessment</h3>
                      <div>
                        <Label htmlFor="hasComputerLab">Do you have a computer lab? *</Label>
                        <RadioGroup 
                          onValueChange={(value) => schoolForm.setValue("hasComputerLab", value)}
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes-dedicated" id="yes-dedicated" />
                            <Label htmlFor="yes-dedicated">Yes, dedicated computer lab</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes-mobile" id="yes-mobile" />
                            <Label htmlFor="yes-mobile">Yes, mobile cart/devices</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="limited" id="limited" />
                            <Label htmlFor="limited">Limited devices available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no" />
                            <Label htmlFor="no">No computer lab</Label>
                          </div>
                        </RadioGroup>
                        {schoolForm.formState.errors.hasComputerLab && (
                          <p className="text-sm text-red-600 mt-1">
                            {schoolForm.formState.errors.hasComputerLab.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="currentTechnology">Current Technology Usage *</Label>
                        <Select onValueChange={(value) => schoolForm.setValue("currentTechnology", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Describe your current technology" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">Minimal technology use</SelectItem>
                            <SelectItem value="basic">Basic computers/tablets</SelectItem>
                            <SelectItem value="moderate">Moderate technology integration</SelectItem>
                            <SelectItem value="advanced">Advanced digital classroom</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive tech program</SelectItem>
                          </SelectContent>
                        </Select>
                        {schoolForm.formState.errors.currentTechnology && (
                          <p className="text-sm text-red-600 mt-1">
                            {schoolForm.formState.errors.currentTechnology.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="curriculum">Curriculum Type *</Label>
                        <Select onValueChange={(value) => schoolForm.setValue("curriculum", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select curriculum type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="common-core">Common Core</SelectItem>
                            <SelectItem value="state-standards">State Standards</SelectItem>
                            <SelectItem value="montessori">Montessori</SelectItem>
                            <SelectItem value="waldorf">Waldorf/Steiner</SelectItem>
                            <SelectItem value="ib">International Baccalaureate</SelectItem>
                            <SelectItem value="ap">Advanced Placement Focus</SelectItem>
                            <SelectItem value="stem">STEM-focused</SelectItem>
                            <SelectItem value="arts">Arts Integration</SelectItem>
                            <SelectItem value="religious">Religious Education</SelectItem>
                            <SelectItem value="custom">Custom/Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {schoolForm.formState.errors.curriculum && (
                          <p className="text-sm text-red-600 mt-1">
                            {schoolForm.formState.errors.curriculum.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pain Points and Requirements */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Requirements & Challenges</h3>
                      <div>
                        <Label htmlFor="painPoints">Main Technology Challenges *</Label>
                        <textarea
                          id="painPoints"
                          {...schoolForm.register("painPoints")}
                          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your main technology challenges, goals, and what you hope to achieve..."
                        />
                        {schoolForm.formState.errors.painPoints && (
                          <p className="text-sm text-red-600 mt-1">
                            {schoolForm.formState.errors.painPoints.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="budget">Budget Range *</Label>
                          <Select onValueChange={(value) => schoolForm.setValue("budget", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-500k">Under KSH 500,000</SelectItem>
                              <SelectItem value="500k-1.5m">KSH 500,000 - 1.5M</SelectItem>
                              <SelectItem value="1.5m-3m">KSH 1.5M - 3M</SelectItem>
                              <SelectItem value="3m-5m">KSH 3M - 5M</SelectItem>
                              <SelectItem value="5m-10m">KSH 5M - 10M</SelectItem>
                              <SelectItem value="over-10m">Over KSH 10M</SelectItem>
                              <SelectItem value="tbd">To be determined</SelectItem>
                            </SelectContent>
                          </Select>
                          {schoolForm.formState.errors.budget && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.budget.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="timeline">Implementation Timeline *</Label>
                          <Select onValueChange={(value) => schoolForm.setValue("timeline", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                              <SelectItem value="quarter">This quarter (1-3 months)</SelectItem>
                              <SelectItem value="semester">This semester (3-6 months)</SelectItem>
                              <SelectItem value="year">Within the year</SelectItem>
                              <SelectItem value="next-year">Next academic year</SelectItem>
                              <SelectItem value="exploring">Just exploring options</SelectItem>
                            </SelectContent>
                          </Select>
                          {schoolForm.formState.errors.timeline && (
                            <p className="text-sm text-red-600 mt-1">
                              {schoolForm.formState.errors.timeline.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        After submitting this form, our education specialists will contact you within 1-2 business days to schedule your personalized demonstration.
                      </AlertDescription>
                    </Alert>

                    <Button type="submit" className="w-full">
                      Request Free Demonstration
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "signup" && signupType === "parent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                Parent/Guardian Account Setup
              </CardTitle>
              <CardDescription>
                Since your child is under 13, we'll set up a family account managed by you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Users className="h-4 w-4" />
                <AlertDescription>
                  <strong>Family Package Benefits:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Single account manages multiple children</li>
                    <li>• Individual profiles for each child</li>
                    <li>• Parental controls and progress monitoring</li>
                    <li>• Shared family learning resources</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <form onSubmit={parentChildForm.handleSubmit(handleParentChildSignup)} className="space-y-6">
                {/* Parent Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parentFirstName">Your First Name</Label>
                      <Input
                        id="parentFirstName"
                        {...parentChildForm.register("parentFirstName")}
                        placeholder="Enter your first name"
                      />
                      {parentChildForm.formState.errors.parentFirstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.parentFirstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parentLastName">Your Last Name</Label>
                      <Input
                        id="parentLastName"
                        {...parentChildForm.register("parentLastName")}
                        placeholder="Enter your last name"
                      />
                      {parentChildForm.formState.errors.parentLastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.parentLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Your Location *</h4>
                    <LocationSelector
                      onLocationChange={(location) => {
                        parentChildForm.setValue("county", location.county);
                        parentChildForm.setValue("constituency", location.constituency);
                        parentChildForm.setValue("ward", location.ward);
                      }}
                      required={true}
                    />
                    {(parentChildForm.formState.errors.county || parentChildForm.formState.errors.constituency || parentChildForm.formState.errors.ward) && (
                      <p className="text-sm text-red-600 mt-1">
                        Please complete all location fields
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="parentEmail">Email Address</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      {...parentChildForm.register("parentEmail")}
                      placeholder="your.email@example.com"
                    />
                    {parentChildForm.formState.errors.parentEmail && (
                      <p className="text-sm text-red-600 mt-1">
                        {parentChildForm.formState.errors.parentEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parentPassword">Password</Label>
                      <Input
                        id="parentPassword"
                        type="password"
                        {...parentChildForm.register("parentPassword")}
                        placeholder="Choose a strong password"
                      />
                      {parentChildForm.formState.errors.parentPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.parentPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="parentPhone">Phone Number</Label>
                      <Input
                        id="parentPhone"
                        {...parentChildForm.register("parentPhone")}
                        placeholder="(555) 123-4567"
                      />
                      {parentChildForm.formState.errors.parentPhone && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.parentPhone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Child Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Child Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="childFirstName">Child's First Name</Label>
                      <Input
                        id="childFirstName"
                        {...parentChildForm.register("childFirstName")}
                        placeholder="Enter child's first name"
                      />
                      {parentChildForm.formState.errors.childFirstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.childFirstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="childLastName">Child's Last Name</Label>
                      <Input
                        id="childLastName"
                        {...parentChildForm.register("childLastName")}
                        placeholder="Enter child's last name"
                      />
                      {parentChildForm.formState.errors.childLastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.childLastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="childBirthDate">Child's Birth Date</Label>
                      <Input
                        id="childBirthDate"
                        type="date"
                        {...parentChildForm.register("childBirthDate")}
                      />
                      {parentChildForm.formState.errors.childBirthDate && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.childBirthDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="gradeLevel">Current Grade Level</Label>
                      <Select onValueChange={(value) => parentChildForm.setValue("gradeLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre-k">Pre-K</SelectItem>
                          <SelectItem value="k">Kindergarten</SelectItem>
                          <SelectItem value="1">1st Grade</SelectItem>
                          <SelectItem value="2">2nd Grade</SelectItem>
                          <SelectItem value="3">3rd Grade</SelectItem>
                          <SelectItem value="4">4th Grade</SelectItem>
                          <SelectItem value="5">5th Grade</SelectItem>
                          <SelectItem value="6">6th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                      {parentChildForm.formState.errors.gradeLevel && (
                        <p className="text-sm text-red-600 mt-1">
                          {parentChildForm.formState.errors.gradeLevel.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={parentChildForm.watch("agreeToTerms")}
                    onCheckedChange={(checked) => parentChildForm.setValue("agreeToTerms", !!checked)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {parentChildForm.formState.errors.agreeToTerms && (
                  <p className="text-sm text-red-600">
                    {parentChildForm.formState.errors.agreeToTerms.message}
                  </p>
                )}

                <Button type="submit" className="w-full">
                  Create Family Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "signup" && signupType === "student") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Account Setup
              </CardTitle>
              <CardDescription>
                Since you're between 13-17, we'll need your parent's phone for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Phone className="h-4 w-4" />
                <AlertDescription>
                  We'll send a verification code to your parent's phone to confirm this account setup.
                </AlertDescription>
              </Alert>

              <form onSubmit={studentForm.handleSubmit(handleStudentSignup)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...studentForm.register("email")}
                    placeholder="your.email@example.com"
                  />
                  {studentForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {studentForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...studentForm.register("password")}
                      placeholder="Choose a strong password"
                    />
                    {studentForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {studentForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...studentForm.register("confirmPassword")}
                      placeholder="Confirm your password"
                    />
                    {studentForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {studentForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="gradeLevel">Current Grade Level</Label>
                  <Select onValueChange={(value) => studentForm.setValue("gradeLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6th Grade</SelectItem>
                      <SelectItem value="7">7th Grade</SelectItem>
                      <SelectItem value="8">8th Grade</SelectItem>
                      <SelectItem value="9">9th Grade</SelectItem>
                      <SelectItem value="10">10th Grade</SelectItem>
                      <SelectItem value="11">11th Grade</SelectItem>
                      <SelectItem value="12">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                  {studentForm.formState.errors.gradeLevel && (
                    <p className="text-sm text-red-600 mt-1">
                      {studentForm.formState.errors.gradeLevel.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input
                      id="parentName"
                      {...studentForm.register("parentName")}
                      placeholder="Parent's full name"
                    />
                    {studentForm.formState.errors.parentName && (
                      <p className="text-sm text-red-600 mt-1">
                        {studentForm.formState.errors.parentName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="parentPhone">Parent's Phone Number</Label>
                    <Input
                      id="parentPhone"
                      {...studentForm.register("parentPhone")}
                      placeholder="(555) 123-4567"
                    />
                    {studentForm.formState.errors.parentPhone && (
                      <p className="text-sm text-red-600 mt-1">
                        {studentForm.formState.errors.parentPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={studentForm.watch("agreeToTerms")}
                    onCheckedChange={(checked) => studentForm.setValue("agreeToTerms", !!checked)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {studentForm.formState.errors.agreeToTerms && (
                  <p className="text-sm text-red-600">
                    {studentForm.formState.errors.agreeToTerms.message}
                  </p>
                )}

                <Button type="submit" className="w-full">
                  Create Student Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "signup" && signupType === "adult") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Setup
              </CardTitle>
              <CardDescription>
                Create your independent account with phone verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={adultForm.handleSubmit(handleAdultSignup)} className="space-y-4">
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <RadioGroup 
                    onValueChange={(value) => adultForm.setValue("accountType", value as "student" | "parent" | "tutor")}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Student (College/Adult Learner)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent">Parent (Managing family account)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tutor" id="tutor" />
                      <Label htmlFor="tutor">Private Tutor/Educator</Label>
                    </div>
                  </RadioGroup>
                  {adultForm.formState.errors.accountType && (
                    <p className="text-sm text-red-600 mt-1">
                      {adultForm.formState.errors.accountType.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...adultForm.register("email")}
                    placeholder="your.email@example.com"
                  />
                  {adultForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {adultForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...adultForm.register("password")}
                      placeholder="Choose a strong password"
                    />
                    {adultForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {adultForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...adultForm.register("confirmPassword")}
                      placeholder="Confirm your password"
                    />
                    {adultForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {adultForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...adultForm.register("phone")}
                    placeholder="(555) 123-4567"
                  />
                  {adultForm.formState.errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {adultForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={adultForm.watch("agreeToTerms")}
                    onCheckedChange={(checked) => adultForm.setValue("agreeToTerms", !!checked)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {adultForm.formState.errors.agreeToTerms && (
                  <p className="text-sm text-red-600">
                    {adultForm.formState.errors.agreeToTerms.message}
                  </p>
                )}

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "verification") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Verification Sent</CardTitle>
              <CardDescription>
                {signupType === "student" 
                  ? "We've sent a verification code to your parent's phone"
                  : "We've sent a verification code to your phone"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Please check your {signupType === "student" ? "parent's " : ""}phone for the verification code and follow the instructions to complete your account setup.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Didn't receive the code?{" "}
                  <Button variant="link" className="p-0 h-auto">
                    Resend verification
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Request Submitted Successfully!</CardTitle>
              <CardDescription>
                Thank you for your interest in Edvirons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <School className="h-4 w-4" />
                <AlertDescription>
                  Our education specialists will review your information and contact you within 1-2 business days to schedule your personalized demonstration.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <Link href="/">
                  <Button>Return to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}