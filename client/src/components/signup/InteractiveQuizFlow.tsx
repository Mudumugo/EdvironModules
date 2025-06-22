import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  User, 
  Heart, 
  School,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  GraduationCap
} from "lucide-react";

type QuizStep = 
  | "welcome"
  | "user-type"
  | "age-verification"
  | "personal-info"
  | "location"
  | "academic-info"
  | "parent-info"
  | "preferences"
  | "completion";

interface QuizData {
  userType: "student" | "teacher" | "parent" | "school" | null;
  age?: number;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  county?: string;
  city?: string;
  school?: string;
  gradeLevel?: string;
  subject?: string;
  parentEmail?: string;
  parentPhone?: string;
  interests?: string[];
  learningStyle?: string;
  goals?: string[];
  organizationName?: string;
  organizationType?: string;
  numberOfStudents?: number;
  adminEmail?: string;
  adminPhone?: string;
}

interface InteractiveQuizFlowProps {
  onComplete: (data: QuizData) => void;
  onBack?: () => void;
}

export function InteractiveQuizFlow({ onComplete, onBack }: InteractiveQuizFlowProps) {
  const [currentStep, setCurrentStep] = useState<QuizStep>("welcome");
  const [quizData, setQuizData] = useState<QuizData>({ userType: null });
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...data }));
  };

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

  const nextStep = () => {
    const stepOrder: QuizStep[] = [
      "welcome",
      "user-type", 
      "age-verification",
      "personal-info",
      "location",
      "academic-info",
      "parent-info",
      "preferences", 
      "completion"
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    let nextIndex = currentIndex + 1;
    
    // Skip steps based on user type and age
    if (quizData.userType === "teacher" && stepOrder[nextIndex] === "age-verification") {
      nextIndex++; // Skip age verification for teachers
    }
    if (quizData.userType === "school" && (stepOrder[nextIndex] === "age-verification" || stepOrder[nextIndex] === "parent-info")) {
      nextIndex++; // Skip age verification and parent info for schools
    }
    if (quizData.userType !== "student" && stepOrder[nextIndex] === "parent-info") {
      nextIndex++; // Skip parent info for non-students
    }
    if (quizData.age && quizData.age >= 18 && stepOrder[nextIndex] === "parent-info") {
      nextIndex++; // Skip parent info for adults
    }
    
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
      setProgress((nextIndex / (stepOrder.length - 1)) * 100);
    }
  };

  const prevStep = () => {
    const stepOrder: QuizStep[] = [
      "welcome",
      "user-type",
      "age-verification", 
      "personal-info",
      "location",
      "academic-info",
      "parent-info",
      "preferences",
      "completion"
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    let prevIndex = currentIndex - 1;
    
    // Skip steps going backwards too
    if (quizData.userType === "teacher" && stepOrder[prevIndex] === "age-verification") {
      prevIndex--; // Skip age verification for teachers
    }
    if (quizData.userType === "school" && (stepOrder[prevIndex] === "age-verification" || stepOrder[prevIndex] === "parent-info")) {
      prevIndex--; // Skip age verification and parent info for schools
    }
    if (quizData.userType !== "student" && stepOrder[prevIndex] === "parent-info") {
      prevIndex--; // Skip parent info for non-students
    }
    if (quizData.age && quizData.age >= 18 && stepOrder[prevIndex] === "parent-info") {
      prevIndex--; // Skip parent info for adults
    }
    
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
      setProgress((prevIndex / (stepOrder.length - 1)) * 100);
    }
  };

  const handleComplete = () => {
    onComplete(quizData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">EdVirons Setup</CardTitle>
          <CardDescription>
            Let's personalize your learning experience
          </CardDescription>
          {currentStep !== "welcome" && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === "welcome" && (
            <WelcomeStep onNext={() => setCurrentStep("user-type")} onBack={onBack} />
          )}
          
          {currentStep === "user-type" && (
            <UserTypeStep 
              quizData={quizData}
              updateQuizData={updateQuizData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === "age-verification" && (
            <AgeVerificationStep
              quizData={quizData}
              updateQuizData={updateQuizData}
              onNext={nextStep}
              onBack={prevStep}
              calculateAge={calculateAge}
            />
          )}

          {currentStep === "personal-info" && (
            <PersonalInfoStep
              quizData={quizData}
              updateQuizData={updateQuizData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === "location" && (
            <LocationStep
              quizData={quizData}
              updateQuizData={updateQuizData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === "academic-info" && (
            <AcademicInfoStep
              quizData={quizData}
              updateQuizData={updateQuizData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === "parent-info" && (
            <ParentInfoStep
              quizData={quizData}
              updateQuizData={updateQuizData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === "preferences" && (
            <PreferencesStep
              quizData={quizData}
              updateQuizData={updateQuizData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === "completion" && (
            <CompletionStep
              quizData={quizData}
              onComplete={handleComplete}
              onBack={prevStep}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Individual step components
function WelcomeStep({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Welcome to EdVirons!</h3>
        <p className="text-gray-600">
          We're excited to help you get started with our educational platform. 
          This quick setup will personalize your experience and ensure you have 
          access to the right tools and content for your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
            <User className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Personal Profile</span>
            <span className="text-gray-500">Set up your account</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
            <BookOpen className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">Learning Preferences</span>
            <span className="text-gray-500">Customize your experience</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium">Ready to Learn</span>
            <span className="text-gray-500">Start your journey</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        )}
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Get Started
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function UserTypeStep({ 
  quizData, 
  updateQuizData, 
  onNext, 
  onBack 
}: { 
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What brings you to EdVirons?</h3>
        <p className="text-gray-600">Select the option that best describes you</p>
      </div>

      <RadioGroup 
        value={quizData.userType || ""} 
        onValueChange={(value) => updateQuizData({ userType: value as QuizData["userType"] })}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="student" id="student" />
          <div className="flex items-center space-x-3 flex-1">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <Label htmlFor="student" className="font-medium cursor-pointer">I'm a Student</Label>
              <p className="text-sm text-gray-500">Access courses, assignments, and learning materials</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="teacher" id="teacher" />
          <div className="flex items-center space-x-3 flex-1">
            <User className="h-8 w-8 text-green-600" />
            <div>
              <Label htmlFor="teacher" className="font-medium cursor-pointer">I'm a Teacher</Label>
              <p className="text-sm text-gray-500">Create content, manage classes, and track student progress</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="parent" id="parent" />
          <div className="flex items-center space-x-3 flex-1">
            <Heart className="h-8 w-8 text-pink-600" />
            <div>
              <Label htmlFor="parent" className="font-medium cursor-pointer">I'm a Parent</Label>
              <p className="text-sm text-gray-500">Monitor my child's progress and support their learning</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="school" id="school" />
          <div className="flex items-center space-x-3 flex-1">
            <School className="h-8 w-8 text-purple-600" />
            <div>
              <Label htmlFor="school" className="font-medium cursor-pointer">I represent a School/Organization</Label>
              <p className="text-sm text-gray-500">Manage institutional accounts and oversee educational programs</p>
            </div>
          </div>
        </div>
      </RadioGroup>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!quizData.userType}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function AgeVerificationStep({ 
  quizData, 
  updateQuizData, 
  onNext, 
  onBack,
  calculateAge 
}: { 
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
  calculateAge: (birthDate: string) => number;
}) {
  const handleBirthDateChange = (birthDate: string) => {
    const age = calculateAge(birthDate);
    updateQuizData({ birthDate, age });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What's your date of birth?</h3>
        <p className="text-gray-600">This helps us customize age-appropriate content and features</p>
      </div>

      <div className="max-w-md mx-auto">
        <Label htmlFor="birthDate" className="block mb-2">Date of Birth</Label>
        <Input
          id="birthDate"
          type="date"
          value={quizData.birthDate || ""}
          onChange={(e) => handleBirthDateChange(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />
        {quizData.age && (
          <p className="text-sm text-gray-500 mt-2">
            Age: {quizData.age} years old
          </p>
        )}
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!quizData.birthDate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function PersonalInfoStep({ 
  quizData, 
  updateQuizData, 
  onNext, 
  onBack 
}: { 
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = quizData.firstName && quizData.lastName && quizData.email;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Tell us about yourself</h3>
        <p className="text-gray-600">We'll use this information to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="block mb-2">First Name *</Label>
          <Input
            id="firstName"
            value={quizData.firstName || ""}
            onChange={(e) => updateQuizData({ firstName: e.target.value })}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="block mb-2">Last Name *</Label>
          <Input
            id="lastName"
            value={quizData.lastName || ""}
            onChange={(e) => updateQuizData({ lastName: e.target.value })}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="block mb-2">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={quizData.email || ""}
          onChange={(e) => updateQuizData({ email: e.target.value })}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone" className="block mb-2">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={quizData.phone || ""}
          onChange={(e) => updateQuizData({ phone: e.target.value })}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canContinue}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function LocationStep({ 
  quizData, 
  updateQuizData, 
  onNext, 
  onBack 
}: { 
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const kenyanCounties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale",
    "Garissa", "Kakamega", "Machakos", "Meru", "Nyeri", "Kericho", "Kilifi", "Lamu",
    "Embu", "Isiolo", "Marsabit", "Wajir", "Mandera", "Turkana", "West Pokot", "Samburu",
    "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia",
    "Bomet", "Kajiado", "Kiambu", "Murang'a", "Nyandarua", "Kirinyaga", "Tharaka-Nithi",
    "Mwingi", "Kitui", "Makueni", "Taita-Taveta", "Kwale", "Tana River", "Homa Bay",
    "Migori", "Kisii", "Nyamira", "Siaya"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Where are you located?</h3>
        <p className="text-gray-600">This helps us provide location-specific content and services</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="county" className="block mb-2">County *</Label>
          <Select 
            value={quizData.county || ""} 
            onValueChange={(value) => updateQuizData({ county: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your county" />
            </SelectTrigger>
            <SelectContent>
              {kenyanCounties.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="city" className="block mb-2">City/Town (Optional)</Label>
          <Input
            id="city"
            value={quizData.city || ""}
            onChange={(e) => updateQuizData({ city: e.target.value })}
            placeholder="Enter your city or town"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!quizData.county}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function AcademicInfoStep({ 
  quizData, 
  updateQuizData, 
  onNext, 
  onBack 
}: { 
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const gradeOptions = [
    "Pre-K", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Form 1", "Form 2", "Form 3", "Form 4",
    "University Year 1", "University Year 2", "University Year 3", "University Year 4", "Graduate"
  ];

  const subjectOptions = [
    "Mathematics", "English", "Kiswahili", "Science", "Social Studies", "Religious Studies",
    "Arts & Crafts", "Physical Education", "Music", "Agriculture", "Business Studies",
    "Geography", "History", "Biology", "Chemistry", "Physics", "Computer Studies",
    "French", "German", "Arabic", "Life Skills", "Home Science", "Woodwork", "Metalwork"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Academic Information</h3>
        <p className="text-gray-600">
          {quizData.userType === "student" 
            ? "Tell us about your current education level"
            : quizData.userType === "teacher"
            ? "What subjects do you teach?"
            : "What's your educational background?"
          }
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="school" className="block mb-2">
            {quizData.userType === "school" ? "Organization Name" : "School/Institution"}
          </Label>
          <Input
            id="school"
            value={quizData.school || ""}
            onChange={(e) => updateQuizData({ school: e.target.value })}
            placeholder={
              quizData.userType === "school" 
                ? "Enter your organization name"
                : "Enter your school or institution name"
            }
          />
        </div>

        {quizData.userType !== "school" && (
          <div>
            <Label htmlFor="gradeLevel" className="block mb-2">
              {quizData.userType === "student" ? "Current Grade/Level" : "Teaching Level"}
            </Label>
            <Select 
              value={quizData.gradeLevel || ""} 
              onValueChange={(value) => updateQuizData({ gradeLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {quizData.userType === "teacher" && (
          <div>
            <Label htmlFor="subject" className="block mb-2">Primary Subject</Label>
            <Select 
              value={quizData.subject || ""} 
              onValueChange={(value) => updateQuizData({ subject: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your primary subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {quizData.userType === "school" && (
          <>
            <div>
              <Label htmlFor="organizationType" className="block mb-2">Organization Type</Label>
              <Select 
                value={quizData.organizationType || ""} 
                onValueChange={(value) => updateQuizData({ organizationType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="university">University/College</SelectItem>
                  <SelectItem value="training">Training Institute</SelectItem>
                  <SelectItem value="district">School District</SelectItem>
                  <SelectItem value="ministry">Ministry of Education</SelectItem>
                  <SelectItem value="ngo">Educational NGO</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="numberOfStudents" className="block mb-2">Approximate Number of Students</Label>
              <Select 
                value={quizData.numberOfStudents?.toString() || ""} 
                onValueChange={(value) => updateQuizData({ numberOfStudents: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student count range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">1-50 students</SelectItem>
                  <SelectItem value="200">51-200 students</SelectItem>
                  <SelectItem value="500">201-500 students</SelectItem>
                  <SelectItem value="1000">501-1000 students</SelectItem>
                  <SelectItem value="2000">1001-2000 students</SelectItem>
                  <SelectItem value="5000">2000+ students</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ParentInfoStep({ 
  quizData, 
  updateQuizData, 
  onNext, 
  onBack 
}: { 
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Parent/Guardian Information</h3>
        <p className="text-gray-600">This information helps us keep your parents informed about your progress</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="parentEmail" className="block mb-2">Parent/Guardian Email</Label>
          <Input
            id="parentEmail"
            type="email"
            value={quizData.parentEmail || ""}
            onChange={(e) => updateQuizData({ parentEmail: e.target.value })}
            placeholder="Enter parent or guardian email"
          />
        </div>

        <div>
          <Label htmlFor="parentPhone" className="block mb-2">Parent/Guardian Phone Number</Label>
          <Input
            id="parentPhone"
            type="tel"
            value={quizData.parentPhone || ""}
            onChange={(e) => updateQuizData({ parentPhone: e.target.value })}
            placeholder="Enter parent or guardian phone number"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Privacy Note:</strong> This information will only be used to send important updates about 
          your academic progress and school activities. Your parents will not have access to your personal 
          messages or detailed activity logs.
        </p>
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function PreferencesStep({ 
  quizData, 
  updateQuizData, 
  onNext, 
  onBack 
}: { 
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const interests = [
    "Science & Technology", "Mathematics", "Literature & Writing", "Arts & Creativity", 
    "Sports & Fitness", "Music & Performing Arts", "History & Social Studies", 
    "Languages", "Environmental Studies", "Business & Entrepreneurship"
  ];

  const learningStyles = [
    { value: "visual", label: "Visual", description: "I learn best with images, diagrams, and videos" },
    { value: "auditory", label: "Auditory", description: "I prefer listening to explanations and discussions" },
    { value: "kinesthetic", label: "Hands-on", description: "I learn by doing and practicing" },
    { value: "reading", label: "Reading/Writing", description: "I prefer text-based learning and note-taking" }
  ];

  const goals = [
    "Improve my grades", "Prepare for exams", "Learn new skills", "Get homework help",
    "Explore career options", "Build confidence", "Make learning fun", "Stay organized"
  ];

  const toggleInterest = (interest: string) => {
    const currentInterests = quizData.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updateQuizData({ interests: newInterests });
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = quizData.goals || [];
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    updateQuizData({ goals: newGoals });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Learning Preferences</h3>
        <p className="text-gray-600">Help us personalize your learning experience</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">What are you interested in? (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`p-3 text-sm border rounded-lg text-left transition-colors ${
                  (quizData.interests || []).includes(interest)
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">How do you prefer to learn?</Label>
          <RadioGroup 
            value={quizData.learningStyle || ""} 
            onValueChange={(value) => updateQuizData({ learningStyle: value })}
          >
            {learningStyles.map((style) => (
              <div key={style.value} className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value={style.value} id={style.value} className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor={style.value} className="font-medium cursor-pointer">
                    {style.label}
                  </Label>
                  <p className="text-sm text-gray-500">{style.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">What are your learning goals? (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2">
            {goals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`p-3 text-sm border rounded-lg text-left transition-colors ${
                  (quizData.goals || []).includes(goal)
                    ? "bg-green-100 border-green-300 text-green-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function CompletionStep({ 
  quizData, 
  onComplete, 
  onBack 
}: { 
  quizData: QuizData;
  onComplete: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold">Setup Complete!</h3>
        <p className="text-gray-600">
          Great! We've collected all the information we need to personalize your EdVirons experience.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
        <h4 className="font-medium">Setup Summary:</h4>
        <div className="text-sm space-y-1">
          <p><strong>Account Type:</strong> {quizData.userType}</p>
          <p><strong>Name:</strong> {quizData.firstName} {quizData.lastName}</p>
          <p><strong>Email:</strong> {quizData.email}</p>
          <p><strong>Location:</strong> {quizData.county}, Kenya</p>
          {quizData.school && <p><strong>Institution:</strong> {quizData.school}</p>}
          {quizData.interests && quizData.interests.length > 0 && (
            <p><strong>Interests:</strong> {quizData.interests.slice(0, 3).join(", ")}
              {quizData.interests.length > 3 && ` +${quizData.interests.length - 3} more`}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">What's Next?</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600 mb-2 mx-auto" />
            <p className="font-medium">Explore Content</p>
            <p className="text-gray-600">Browse our library of educational materials</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <Users className="h-6 w-6 text-green-600 mb-2 mx-auto" />
            <p className="font-medium">Join Classes</p>
            <p className="text-gray-600">Connect with teachers and classmates</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <GraduationCap className="h-6 w-6 text-purple-600 mb-2 mx-auto" />
            <p className="font-medium">Start Learning</p>
            <p className="text-gray-600">Begin your educational journey</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onComplete}
          className="bg-green-600 hover:bg-green-700"
        >
          Complete Setup
          <CheckCircle className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}