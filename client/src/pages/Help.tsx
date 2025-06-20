import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { InteractiveGuide } from "@/components/help/InteractiveGuide";
import { RoleOnboarding } from "@/components/help/RoleOnboarding";
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Phone, 
  Mail, 
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  Users,
  Video,
  FileText,
  Lightbulb,
  PlayCircle,
  CheckCircle,
  ArrowRight,
  User,
  GraduationCap,
  Shield,
  Settings,
  Zap,
  Target,
  Globe,
  Award
} from "lucide-react";

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'New to Edvirons? Start here',
    icon: '🚀',
    color: 'bg-blue-500',
    articles: 12
  },
  {
    id: 'digital-library',
    title: 'Digital Library',
    description: 'Find and access resources',
    icon: '📚',
    color: 'bg-green-500',
    articles: 8
  },
  {
    id: 'my-locker',
    title: 'My Locker',
    description: 'Organize your content',
    icon: '🗂️',
    color: 'bg-purple-500',
    articles: 6
  },
  {
    id: 'apps-hub',
    title: 'Apps Hub',
    description: 'Use educational apps',
    icon: '🎯',
    color: 'bg-orange-500',
    articles: 10
  },
  {
    id: 'tech-support',
    title: 'Technical Issues',
    description: 'Solve technical problems',
    icon: '🔧',
    color: 'bg-red-500',
    articles: 15
  },
  {
    id: 'account',
    title: 'Account & Settings',
    description: 'Manage your account',
    icon: '⚙️',
    color: 'bg-gray-500',
    articles: 7
  }
];

const popularArticles = [
  {
    id: 1,
    title: 'How to access the Digital Library',
    category: 'Digital Library',
    views: 1250,
    helpful: 95,
    timeToRead: '3 min'
  },
  {
    id: 2,
    title: 'Creating and organizing notebooks in My Locker',
    category: 'My Locker',
    views: 980,
    helpful: 92,
    timeToRead: '5 min'
  },
  {
    id: 3,
    title: 'Getting started with Edvirons Portal',
    category: 'Getting Started',
    views: 2100,
    helpful: 98,
    timeToRead: '7 min'
  },
  {
    id: 4,
    title: 'Using educational apps in Apps Hub',
    category: 'Apps Hub',
    views: 750,
    helpful: 89,
    timeToRead: '4 min'
  }
];

const contactOptions = [
  {
    type: 'chat',
    title: 'Live Chat',
    description: 'Chat with our support team',
    availability: 'Available 24/7',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    type: 'email',
    title: 'Email Support',
    description: 'Send us an email',
    availability: 'Response within 24 hours',
    icon: Mail,
    color: 'bg-green-500'
  },
  {
    type: 'phone',
    title: 'Phone Support',
    description: 'Call our helpline',
    availability: 'Mon-Fri 9AM-5PM',
    icon: Phone,
    color: 'bg-purple-500'
  },
  {
    type: 'video',
    title: 'Video Call',
    description: 'Schedule a video session',
    availability: 'By appointment',
    icon: Video,
    color: 'bg-orange-500'
  }
];

// Role-based content structure
const roleBasedContent = {
  student: {
    title: "Student Guide",
    description: "Learn how to make the most of your learning experience",
    color: "bg-blue-500",
    icon: "🎓",
    quickStart: [
      { id: 1, title: "Access Digital Library", description: "Find books and resources", duration: "3 min", completed: false },
      { id: 2, title: "Organize Your Locker", description: "Save favorites and notes", duration: "5 min", completed: false },
      { id: 3, title: "Explore Apps Hub", description: "Discover learning games", duration: "4 min", completed: false },
      { id: 4, title: "Get Tech Help", description: "Learn digital skills", duration: "6 min", completed: false }
    ],
    tutorials: [
      { category: "Getting Started", title: "Your First Day on Edvirons", views: 2150, rating: 4.8 },
      { category: "Digital Library", title: "Finding the Right Resources", views: 1890, rating: 4.7 },
      { category: "My Locker", title: "Organizing Your Learning Materials", views: 1456, rating: 4.6 },
      { category: "Study Tips", title: "Effective Online Learning Strategies", views: 1203, rating: 4.9 }
    ]
  },
  teacher: {
    title: "Teacher Guide",
    description: "Master the tools for effective digital teaching",
    color: "bg-green-500",
    icon: "👨‍🏫",
    quickStart: [
      { id: 1, title: "Setup Your Dashboard", description: "Customize your teaching space", duration: "8 min", completed: false },
      { id: 2, title: "Create Digital Content", description: "Use authoring tools", duration: "12 min", completed: false },
      { id: 3, title: "Manage Student Progress", description: "Track and assess learning", duration: "10 min", completed: false },
      { id: 4, title: "Collaborate with Peers", description: "Share resources and ideas", duration: "6 min", completed: false }
    ],
    tutorials: [
      { category: "Classroom Management", title: "Setting Up Your Digital Classroom", views: 3240, rating: 4.9 },
      { category: "Content Creation", title: "Building Interactive Lessons", views: 2890, rating: 4.8 },
      { category: "Assessment", title: "Creating and Managing Assessments", views: 2456, rating: 4.7 },
      { category: "Collaboration", title: "Working with Other Teachers", views: 1876, rating: 4.6 }
    ]
  },
  school_admin: {
    title: "Administrator Guide",
    description: "Manage your institution effectively with Edvirons",
    color: "bg-purple-500",
    icon: "⚙️",
    quickStart: [
      { id: 1, title: "Configure Institution Settings", description: "Set up your school profile", duration: "15 min", completed: false },
      { id: 2, title: "Manage Users and Roles", description: "Add teachers and students", duration: "20 min", completed: false },
      { id: 3, title: "Monitor System Analytics", description: "Track usage and performance", duration: "10 min", completed: false },
      { id: 4, title: "Setup Security Policies", description: "Configure access controls", duration: "18 min", completed: false }
    ],
    tutorials: [
      { category: "System Setup", title: "Initial Institution Configuration", views: 1890, rating: 4.8 },
      { category: "User Management", title: "Managing Teachers and Students", views: 2340, rating: 4.9 },
      { category: "Analytics", title: "Understanding Usage Reports", views: 1567, rating: 4.7 },
      { category: "Security", title: "Implementing Best Practices", views: 1234, rating: 4.8 }
    ]
  }
};

const interactiveFeatures = [
  {
    id: "guided-tour",
    title: "Interactive Platform Tour",
    description: "Step-by-step walkthrough of all features",
    icon: Globe,
    color: "bg-blue-500",
    duration: "15-20 min"
  },
  {
    id: "role-simulation",
    title: "Role-Based Simulation",
    description: "Practice common tasks in a safe environment",
    icon: Target,
    color: "bg-green-500",
    duration: "30 min"
  },
  {
    id: "quick-wins",
    title: "Quick Win Challenges",
    description: "Complete small tasks to build confidence",
    icon: Zap,
    color: "bg-yellow-500",
    duration: "5-10 min each"
  },
  {
    id: "certification",
    title: "Platform Certification",
    description: "Earn badges for mastering different modules",
    icon: Award,
    color: "bg-purple-500",
    duration: "1-2 hours"
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const { user } = useAuth();
  
  // Get role-specific content
  const userRole = user?.role?.includes('student') ? 'student' : 
                  user?.role === 'teacher' ? 'teacher' : 
                  user?.role === 'school_admin' ? 'school_admin' : 'student';
  
  const roleContent = roleBasedContent[userRole];
  
  const toggleTaskCompletion = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const completionProgress = (completedTasks.length / roleContent.quickStart.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`w-20 h-20 ${roleContent.color} rounded-full flex items-center justify-center text-4xl`}>
              {roleContent.icon}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interactive Help Center</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Welcome, {user?.firstName}! {roleContent.description}
            </p>
            <Badge variant="secondary" className="mt-2">
              {roleContent.title}
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Card */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Welcome to Edvirons!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You're just getting started. Let's help you become proficient with the platform.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Quick Start Progress</span>
                        <span>{Math.round(completionProgress)}% Complete</span>
                      </div>
                      <Progress value={completionProgress} className="h-2" />
                    </div>
                  </div>
                  <PlayCircle className="h-12 w-12 text-blue-500 ml-4" />
                </div>
              </CardContent>
            </Card>

            {/* Interactive Features */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Interactive Learning Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interactiveFeatures.map((feature) => (
                  <Card key={feature.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {feature.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{feature.duration}</span>
                          </div>
                          <Button size="sm" className="mt-3">
                            Start Now
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <RoleOnboarding 
              role={userRole} 
              onTaskComplete={(taskId) => console.log('Task completed:', taskId)}
            />
          </TabsContent>

          <TabsContent value="quick-start" className="space-y-6">
            <InteractiveGuide 
              role={userRole}
              onComplete={() => console.log('Interactive guide completed')}
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {roleContent.title} Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roleContent.quickStart.map((task, index) => (
                    <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          completedTasks.includes(task.id)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {completedTasks.includes(task.id) && <CheckCircle className="h-4 w-4" />}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-medium ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{task.duration}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {roleContent.title} Tutorials
              </h2>
              <div className="space-y-4">
                {roleContent.tutorials.map((tutorial, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Video className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {tutorial.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <Badge variant="outline" className="text-xs">
                                {tutorial.category}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {tutorial.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {tutorial.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search for help articles, guides, and FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 text-lg"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-sm text-gray-500">Popular searches:</span>
                  {['login issues', 'digital library', 'my locker', 'apps hub'].map((term) => (
                    <Button key={term} variant="outline" size="sm" className="text-xs">
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Support */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactOptions.map((option) => (
                  <Card key={option.type} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <option.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {option.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {option.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {option.availability}
                          </p>
                          <Button className="mt-4 w-full" variant="outline">
                            {option.title}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>


      </div>
    </div>
  );
}