import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  GraduationCap, 
  Settings, 
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Users,
  BarChart3,
  Shield,
  Lightbulb,
  Target,
  Award
} from "lucide-react";

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  prerequisites?: string[];
}

interface RoleOnboardingProps {
  role: 'student' | 'teacher' | 'school_admin';
  onTaskComplete?: (taskId: string) => void;
}

const onboardingTasks = {
  student: [
    {
      id: 'profile-setup',
      title: 'Complete Your Profile',
      description: 'Add your personal information and learning preferences',
      estimatedTime: '5 min',
      priority: 'high' as const,
      category: 'Setup',
      completed: false
    },
    {
      id: 'explore-dashboard',
      title: 'Explore Your Dashboard',
      description: 'Familiarize yourself with the student portal layout',
      estimatedTime: '10 min',
      priority: 'high' as const,
      category: 'Navigation',
      completed: false
    },
    {
      id: 'digital-library-tour',
      title: 'Take Digital Library Tour',
      description: 'Learn how to find and access educational resources',
      estimatedTime: '15 min',
      priority: 'high' as const,
      category: 'Learning',
      completed: false,
      prerequisites: ['explore-dashboard']
    },
    {
      id: 'setup-locker',
      title: 'Organize Your Locker',
      description: 'Create folders and save your first resources',
      estimatedTime: '10 min',
      priority: 'medium' as const,
      category: 'Organization',
      completed: false,
      prerequisites: ['digital-library-tour']
    },
    {
      id: 'try-apps',
      title: 'Try Educational Apps',
      description: 'Explore the Apps Hub and try interactive learning tools',
      estimatedTime: '20 min',
      priority: 'medium' as const,
      category: 'Learning',
      completed: false
    },
    {
      id: 'tech-skills',
      title: 'Learn Basic Tech Skills',
      description: 'Complete a Tech Tutor module on digital literacy',
      estimatedTime: '25 min',
      priority: 'low' as const,
      category: 'Skills',
      completed: false
    }
  ],
  teacher: [
    {
      id: 'teacher-profile',
      title: 'Set Up Teacher Profile',
      description: 'Complete your professional profile and teaching preferences',
      estimatedTime: '10 min',
      priority: 'high' as const,
      category: 'Setup',
      completed: false
    },
    {
      id: 'dashboard-orientation',
      title: 'Teacher Dashboard Orientation',
      description: 'Learn about teacher-specific tools and features',
      estimatedTime: '15 min',
      priority: 'high' as const,
      category: 'Navigation',
      completed: false
    },
    {
      id: 'create-first-content',
      title: 'Create Your First Content',
      description: 'Use authoring tools to create a simple lesson',
      estimatedTime: '30 min',
      priority: 'high' as const,
      category: 'Content Creation',
      completed: false,
      prerequisites: ['dashboard-orientation']
    },
    {
      id: 'student-management',
      title: 'Learn Student Management',
      description: 'Understand how to monitor student progress',
      estimatedTime: '20 min',
      priority: 'medium' as const,
      category: 'Management',
      completed: false
    },
    {
      id: 'collaboration-setup',
      title: 'Set Up Collaboration',
      description: 'Connect with other teachers and share resources',
      estimatedTime: '15 min',
      priority: 'medium' as const,
      category: 'Collaboration',
      completed: false
    },
    {
      id: 'assessment-tools',
      title: 'Explore Assessment Tools',
      description: 'Learn how to create and manage assessments',
      estimatedTime: '25 min',
      priority: 'low' as const,
      category: 'Assessment',
      completed: false,
      prerequisites: ['create-first-content']
    }
  ],
  school_admin: [
    {
      id: 'admin-profile',
      title: 'Configure Administrator Profile',
      description: 'Set up your administrative profile and permissions',
      estimatedTime: '10 min',
      priority: 'high' as const,
      category: 'Setup',
      completed: false
    },
    {
      id: 'institution-setup',
      title: 'Institution Configuration',
      description: 'Configure basic institution settings and branding',
      estimatedTime: '25 min',
      priority: 'high' as const,
      category: 'Configuration',
      completed: false
    },
    {
      id: 'user-management-setup',
      title: 'Set Up User Management',
      description: 'Learn to add and manage teachers and students',
      estimatedTime: '20 min',
      priority: 'high' as const,
      category: 'User Management',
      completed: false,
      prerequisites: ['institution-setup']
    },
    {
      id: 'security-configuration',
      title: 'Configure Security Settings',
      description: 'Set up access controls and security policies',
      estimatedTime: '30 min',
      priority: 'medium' as const,
      category: 'Security',
      completed: false
    },
    {
      id: 'analytics-overview',
      title: 'Analytics Dashboard Overview',
      description: 'Learn to interpret usage data and reports',
      estimatedTime: '20 min',
      priority: 'medium' as const,
      category: 'Analytics',
      completed: false
    },
    {
      id: 'support-procedures',
      title: 'Support and Maintenance',
      description: 'Understand support channels and maintenance procedures',
      estimatedTime: '15 min',
      priority: 'low' as const,
      category: 'Support',
      completed: false
    }
  ]
};

const roleConfig = {
  student: {
    title: 'Student Onboarding',
    description: 'Get started with your learning journey',
    icon: GraduationCap,
    color: 'bg-blue-500'
  },
  teacher: {
    title: 'Teacher Onboarding',
    description: 'Master the tools for digital teaching',
    icon: User,
    color: 'bg-green-500'
  },
  school_admin: {
    title: 'Administrator Onboarding',
    description: 'Configure and manage your institution',
    icon: Settings,
    color: 'bg-purple-500'
  }
};

export function RoleOnboarding({ role, onTaskComplete }: RoleOnboardingProps) {
  const [tasks, setTasks] = useState<OnboardingTask[]>(onboardingTasks[role]);
  const [activeCategory, setActiveCategory] = useState('all');

  const config = roleConfig[role];
  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  const filteredTasks = activeCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === activeCategory);

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    onTaskComplete?.(taskId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'setup': return <User className="h-4 w-4" />;
      case 'navigation': return <ArrowRight className="h-4 w-4" />;
      case 'learning': return <BookOpen className="h-4 w-4" />;
      case 'management': return <Users className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const isTaskAvailable = (task: OnboardingTask) => {
    if (!task.prerequisites) return true;
    return task.prerequisites.every(prereq => 
      tasks.find(t => t.id === prereq)?.completed
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center`}>
                <config.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {config.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {config.description}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {completedTasks} of {totalTasks} completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      ~{Math.ceil(tasks.reduce((acc, task) => acc + parseInt(task.estimatedTime), 0) / 60)} hours total
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(progress)}%
              </div>
              <Progress value={progress} className="w-24 h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="capitalize"
          >
            {category === 'all' ? 'All Tasks' : category}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isAvailable = isTaskAvailable(task);
          
          return (
            <Card key={task.id} className={`transition-all ${
              task.completed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
              !isAvailable ? 'opacity-60' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleTaskToggle(task.id)}
                    disabled={!isAvailable}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : isAvailable
                        ? 'border-gray-300 hover:border-green-400'
                        : 'border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {task.completed && <CheckCircle className="h-4 w-4" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(task.category)}
                            <span className="ml-1">{task.category}</span>
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority} priority
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {task.estimatedTime}
                          </div>
                        </div>

                        {task.prerequisites && task.prerequisites.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">
                              Prerequisites: {task.prerequisites.map(prereq => 
                                tasks.find(t => t.id === prereq)?.title
                              ).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!isAvailable || task.completed}
                        className="ml-4"
                      >
                        {task.completed ? 'Completed' : 'Start Task'}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Reward */}
      {progress === 100 && (
        <Card className="border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've completed your {config.title.toLowerCase()}! You're now ready to make the most of Edvirons.
            </p>
            <Button className="bg-yellow-500 hover:bg-yellow-600">
              <Award className="h-4 w-4 mr-2" />
              Claim Your Badge
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}