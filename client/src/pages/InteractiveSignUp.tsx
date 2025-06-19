import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Users, School, Baby, User, ArrowRight, ArrowLeft, 
  CheckCircle, BookOpen, Calendar, MapPin, Phone, 
  Mail, GraduationCap, Building, Heart
} from "lucide-react";
import { LocationSelector } from "@/components/forms/LocationSelector";

// Quiz step types
type QuizStep = 
  | "welcome"
  | "user-type"
  | "age-check"
  | "student-info"
  | "parent-info"
  | "child-info"
  | "school-info"
  | "location"
  | "contact"
  | "interests"
  | "review"
  | "complete";

interface QuizData {
  userType: "student" | "parent" | "school" | null;
  age?: number;
  birthDate?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  county?: string;
  constituency?: string;
  ward?: string;
  interests?: string[];
  // Student specific
  gradeLevel?: string;
  subjects?: string[];
  // Parent specific
  childFirstName?: string;
  childLastName?: string;
  childBirthDate?: string;
  childGrade?: string;
  // School specific
  schoolName?: string;
  contactName?: string;
  role?: string;
  schoolType?: string;
  studentPopulation?: string;
  gradeRange?: string;
  hasComputerLab?: string;
  currentTechnology?: string;
  curriculum?: string;
  painPoints?: string;
  budget?: string;
  timeline?: string;
}

const interests = [
  "Mathematics", "Science", "Literature", "History", "Geography",
  "Computer Science", "Art", "Music", "Sports", "Languages"
];

const subjects = [
  "Mathematics", "English", "Kiswahili", "Science", "Social Studies",
  "Christian Religious Education", "Islamic Religious Education",
  "Hindu Religious Education", "Life Skills", "Creative Arts"
];

export default function InteractiveSignUp() {
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

  const getStepProgress = (step: QuizStep): number => {
    const stepOrder: QuizStep[] = [
      "welcome", "user-type", "age-check", "student-info", "parent-info", 
      "child-info", "school-info", "location", "contact", "interests", "review", "complete"
    ];
    return (stepOrder.indexOf(step) / (stepOrder.length - 1)) * 100;
  };

  const nextStep = () => {
    const currentProgress = getStepProgress(currentStep);
    setProgress(currentProgress);

    switch (currentStep) {
      case "welcome":
        setCurrentStep("user-type");
        break;
      case "user-type":
        if (quizData.userType === "student") {
          setCurrentStep("age-check");
        } else if (quizData.userType === "parent") {
          setCurrentStep("parent-info");
        } else if (quizData.userType === "school") {
          setCurrentStep("school-info");
        }
        break;
      case "age-check":
        setCurrentStep("student-info");
        break;
      case "student-info":
        setCurrentStep("location");
        break;
      case "parent-info":
        setCurrentStep("child-info");
        break;
      case "child-info":
        setCurrentStep("location");
        break;
      case "school-info":
        setCurrentStep("location");
        break;
      case "location":
        setCurrentStep("contact");
        break;
      case "contact":
        if (quizData.userType === "school") {
          setCurrentStep("review");
        } else {
          setCurrentStep("interests");
        }
        break;
      case "interests":
        setCurrentStep("review");
        break;
      case "review":
        handleSubmit();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "user-type":
        setCurrentStep("welcome");
        break;
      case "age-check":
        setCurrentStep("user-type");
        break;
      case "student-info":
        setCurrentStep("age-check");
        break;
      case "parent-info":
        setCurrentStep("user-type");
        break;
      case "child-info":
        setCurrentStep("parent-info");
        break;
      case "school-info":
        setCurrentStep("user-type");
        break;
      case "location":
        if (quizData.userType === "student") {
          setCurrentStep("student-info");
        } else if (quizData.userType === "parent") {
          setCurrentStep("child-info");
        } else {
          setCurrentStep("school-info");
        }
        break;
      case "contact":
        setCurrentStep("location");
        break;
      case "interests":
        setCurrentStep("contact");
        break;
      case "review":
        if (quizData.userType === "school") {
          setCurrentStep("contact");
        } else {
          setCurrentStep("interests");
        }
        break;
    }
    const newProgress = getStepProgress(currentStep);
    setProgress(newProgress);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: QuizData) => {
      const endpoint = data.userType === "school" ? "/api/school-demo" : "/api/signup";
      await apiRequest("POST", endpoint, data);
    },
    onSuccess: () => {
      setCurrentStep("complete");
      setProgress(100);
      toast({
        title: "Success!",
        description: "Your registration has been completed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    signupMutation.mutate(quizData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Welcome to Edvirons!
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Kenya's premier educational platform designed for every learner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  Let's create your personalized learning experience through a quick interactive setup.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div 
                    className="text-center p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors duration-200 border-2 border-transparent hover:border-green-200"
                    onClick={() => {
                      updateQuizData({ userType: "student" });
                      setCurrentStep("user-type");
                    }}
                  >
                    <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800">Students</h3>
                    <p className="text-sm text-green-600">Interactive learning content</p>
                  </div>
                  <div 
                    className="text-center p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors duration-200 border-2 border-transparent hover:border-purple-200"
                    onClick={() => {
                      updateQuizData({ userType: "parent" });
                      setCurrentStep("user-type");
                    }}
                  >
                    <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-800">Parents</h3>
                    <p className="text-sm text-purple-600">Family learning packages</p>
                  </div>
                  <div 
                    className="text-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors duration-200 border-2 border-transparent hover:border-orange-200"
                    onClick={() => {
                      updateQuizData({ userType: "school" });
                      setCurrentStep("user-type");
                    }}
                  >
                    <School className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-orange-800">Schools</h3>
                    <p className="text-sm text-orange-600">Institutional solutions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "user-type":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Who are you?</CardTitle>
              <CardDescription>
                Choose the option that best describes you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={quizData.userType || ""}
                onValueChange={(value) => updateQuizData({ userType: value as any })}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="student" id="student" />
                  <div className="flex items-center space-x-3 flex-1">
                    <User className="h-6 w-6 text-blue-600" />
                    <div>
                      <Label htmlFor="student" className="text-lg font-medium cursor-pointer">
                        I'm a Student
                      </Label>
                      <p className="text-sm text-gray-600">
                        Looking for interactive learning content and resources
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="parent" id="parent" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Users className="h-6 w-6 text-purple-600" />
                    <div>
                      <Label htmlFor="parent" className="text-lg font-medium cursor-pointer">
                        I'm a Parent
                      </Label>
                      <p className="text-sm text-gray-600">
                        Setting up learning for my child or family
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="school" id="school" />
                  <div className="flex items-center space-x-3 flex-1">
                    <School className="h-6 w-6 text-orange-600" />
                    <div>
                      <Label htmlFor="school" className="text-lg font-medium cursor-pointer">
                        I represent a School
                      </Label>
                      <p className="text-sm text-gray-600">
                        Interested in institutional educational solutions
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case "age-check":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">When were you born?</CardTitle>
              <CardDescription>
                This helps us customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthDate" className="text-lg">Your Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={quizData.birthDate || ""}
                    onChange={(e) => {
                      const birthDate = e.target.value;
                      const age = calculateAge(birthDate);
                      updateQuizData({ birthDate, age });
                    }}
                    className="mt-2"
                  />
                  {quizData.age && (
                    <p className="text-sm text-gray-600 mt-2">
                      You are {quizData.age} years old
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "student-info":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Tell us about yourself!</CardTitle>
              <CardDescription>
                Let's personalize your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={quizData.firstName || ""}
                    onChange={(e) => updateQuizData({ firstName: e.target.value })}
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={quizData.lastName || ""}
                    onChange={(e) => updateQuizData({ lastName: e.target.value })}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <Label>What grade are you in?</Label>
                <Select
                  value={quizData.gradeLevel || ""}
                  onValueChange={(value) => updateQuizData({ gradeLevel: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade-1">Grade 1</SelectItem>
                    <SelectItem value="grade-2">Grade 2</SelectItem>
                    <SelectItem value="grade-3">Grade 3</SelectItem>
                    <SelectItem value="grade-4">Grade 4</SelectItem>
                    <SelectItem value="grade-5">Grade 5</SelectItem>
                    <SelectItem value="grade-6">Grade 6</SelectItem>
                    <SelectItem value="grade-7">Grade 7</SelectItem>
                    <SelectItem value="grade-8">Grade 8</SelectItem>
                    <SelectItem value="form-1">Form 1</SelectItem>
                    <SelectItem value="form-2">Form 2</SelectItem>
                    <SelectItem value="form-3">Form 3</SelectItem>
                    <SelectItem value="form-4">Form 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Which subjects interest you most?</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={quizData.subjects?.includes(subject) || false}
                        onCheckedChange={(checked) => {
                          const currentSubjects = quizData.subjects || [];
                          if (checked) {
                            updateQuizData({ subjects: [...currentSubjects, subject] });
                          } else {
                            updateQuizData({ subjects: currentSubjects.filter(s => s !== subject) });
                          }
                        }}
                      />
                      <Label htmlFor={subject} className="text-sm cursor-pointer">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "parent-info":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Parent Information</CardTitle>
              <CardDescription>
                Tell us about yourself as a parent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentFirstName">Your First Name</Label>
                  <Input
                    id="parentFirstName"
                    value={quizData.firstName || ""}
                    onChange={(e) => updateQuizData({ firstName: e.target.value })}
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="parentLastName">Your Last Name</Label>
                  <Input
                    id="parentLastName"
                    value={quizData.lastName || ""}
                    onChange={(e) => updateQuizData({ lastName: e.target.value })}
                    placeholder="Your last name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "child-info":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
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
                    onChange={(e) => updateQuizData({ childFirstName: e.target.value })}
                    placeholder="Child's first name"
                  />
                </div>
                <div>
                  <Label htmlFor="childLastName">Child's Last Name</Label>
                  <Input
                    id="childLastName"
                    value={quizData.childLastName || ""}
                    onChange={(e) => updateQuizData({ childLastName: e.target.value })}
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
                    onChange={(e) => updateQuizData({ childBirthDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Child's Current Grade</Label>
                  <Select
                    value={quizData.childGrade || ""}
                    onValueChange={(value) => updateQuizData({ childGrade: value })}
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

      case "school-info":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">School Information</CardTitle>
              <CardDescription>
                Tell us about your educational institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={quizData.schoolName || ""}
                  onChange={(e) => updateQuizData({ schoolName: e.target.value })}
                  placeholder="Your school's name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Your Name</Label>
                  <Input
                    id="contactName"
                    value={quizData.contactName || ""}
                    onChange={(e) => updateQuizData({ contactName: e.target.value })}
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <Label>Your Role</Label>
                  <Select
                    value={quizData.role || ""}
                    onValueChange={(value) => updateQuizData({ role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="deputy-principal">Deputy Principal</SelectItem>
                      <SelectItem value="head-teacher">Head Teacher</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="it-coordinator">IT Coordinator</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>School Type</Label>
                  <Select
                    value={quizData.schoolType || ""}
                    onValueChange={(value) => updateQuizData({ schoolType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public-primary">Public Primary</SelectItem>
                      <SelectItem value="private-primary">Private Primary</SelectItem>
                      <SelectItem value="public-secondary">Public Secondary</SelectItem>
                      <SelectItem value="private-secondary">Private Secondary</SelectItem>
                      <SelectItem value="international">International School</SelectItem>
                      <SelectItem value="special-needs">Special Needs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Student Population</Label>
                  <Select
                    value={quizData.studentPopulation || ""}
                    onValueChange={(value) => updateQuizData({ studentPopulation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Number of students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-100">Under 100</SelectItem>
                      <SelectItem value="100-300">100-300</SelectItem>
                      <SelectItem value="300-500">300-500</SelectItem>
                      <SelectItem value="500-1000">500-1000</SelectItem>
                      <SelectItem value="over-1000">Over 1000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "location":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Where are you located?</CardTitle>
              <CardDescription>
                Help us connect you with local educational resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-medium">Your Location in Kenya</h3>
              </div>
              <LocationSelector
                onLocationChange={(location) => {
                  updateQuizData({
                    county: location.county,
                    constituency: location.constituency,
                    ward: location.ward
                  });
                }}
                required={true}
              />
            </CardContent>
          </Card>
        );

      case "contact":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
              <CardDescription>
                How can we reach you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="email">Email Address</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={quizData.email || ""}
                  onChange={(e) => updateQuizData({ email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="phone">Phone Number</Label>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={quizData.phone || ""}
                  onChange={(e) => updateQuizData({ phone: e.target.value })}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            </CardContent>
          </Card>
        );

      case "interests":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">What interests you?</CardTitle>
              <CardDescription>
                Select topics you'd like to explore (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <div
                    key={interest}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      quizData.interests?.includes(interest)
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      const currentInterests = quizData.interests || [];
                      if (currentInterests.includes(interest)) {
                        updateQuizData({
                          interests: currentInterests.filter(i => i !== interest)
                        });
                      } else {
                        updateQuizData({
                          interests: [...currentInterests, interest]
                        });
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border-2 ${
                        quizData.interests?.includes(interest)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}>
                        {quizData.interests?.includes(interest) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{interest}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "review":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Review Your Information</CardTitle>
              <CardDescription>
                Please confirm your details before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Type
                  </h3>
                  <Badge variant="outline" className="capitalize">
                    {quizData.userType}
                  </Badge>
                </div>

                {(quizData.firstName || quizData.lastName) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <p>{quizData.firstName} {quizData.lastName}</p>
                    {quizData.age && <p>Age: {quizData.age} years</p>}
                  </div>
                )}

                {(quizData.county || quizData.email || quizData.phone) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Contact & Location</h3>
                    {quizData.email && <p>Email: {quizData.email}</p>}
                    {quizData.phone && <p>Phone: {quizData.phone}</p>}
                    {quizData.county && (
                      <p>Location: {quizData.ward}, {quizData.constituency}, {quizData.county}</p>
                    )}
                  </div>
                )}

                {quizData.interests && quizData.interests.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {quizData.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
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
            </CardContent>
          </Card>
        );

      case "complete":
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-800">
                Welcome to Edvirons!
              </CardTitle>
              <CardDescription className="text-lg">
                Your account has been created successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700">
                We're excited to have you join our learning community. 
                {quizData.userType === "student" && " Start exploring interactive content tailored to your interests!"}
                {quizData.userType === "parent" && " Your family learning package is being prepared."}
                {quizData.userType === "school" && " Our team will contact you soon to discuss your institutional needs."}
              </p>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    Return to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "welcome":
        return true;
      case "user-type":
        return !!quizData.userType;
      case "age-check":
        return !!quizData.birthDate;
      case "student-info":
        return !!(quizData.firstName && quizData.lastName && quizData.gradeLevel);
      case "parent-info":
        return !!(quizData.firstName && quizData.lastName);
      case "child-info":
        return !!(quizData.childFirstName && quizData.childLastName && quizData.childBirthDate);
      case "school-info":
        return !!(quizData.schoolName && quizData.contactName && quizData.role);
      case "location":
        return !!(quizData.county && quizData.constituency && quizData.ward);
      case "contact":
        return !!(quizData.email && quizData.phone);
      case "interests":
        return true; // Optional step
      case "review":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700">Setup Progress</h2>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <div className="flex justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed() || signupMutation.isPending}
              className="flex items-center space-x-2"
            >
              {signupMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === "review" ? "Create Account" : "Continue"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Welcome Screen Button */}
        {currentStep === "welcome" && (
          <div className="text-center max-w-2xl mx-auto">
            <Button
              onClick={nextStep}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Let's Get Started!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}