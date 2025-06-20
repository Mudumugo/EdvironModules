import { 
  BookOpen, 
  MessageSquare, 
  Phone, 
  Mail, 
  User,
  GraduationCap,
  Shield,
  Settings
} from "lucide-react";
import { HelpCategory, HelpArticle, ContactOption, RoleContent, InteractiveFeature } from "./types";

export const helpCategories: HelpCategory[] = [
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

export const popularArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'How to access the Digital Library',
    category: 'Digital Library',
    readTime: '3 min read',
    rating: 4.8,
    helpful: 124,
    lastUpdated: '2024-12-15'
  },
  {
    id: '2',
    title: 'Setting up your student profile',
    category: 'Getting Started',
    readTime: '5 min read',
    rating: 4.9,
    helpful: 89,
    lastUpdated: '2024-12-10'
  },
  {
    id: '3',
    title: 'Organizing files in My Locker',
    category: 'My Locker',
    readTime: '4 min read',
    rating: 4.6,
    helpful: 67,
    lastUpdated: '2024-12-08'
  },
  {
    id: '4',
    title: 'Using educational apps effectively',
    category: 'Apps Hub',
    readTime: '6 min read',
    rating: 4.7,
    helpful: 95,
    lastUpdated: '2024-12-12'
  },
  {
    id: '5',
    title: 'Troubleshooting login issues',
    category: 'Technical Issues',
    readTime: '2 min read',
    rating: 4.5,
    helpful: 156,
    lastUpdated: '2024-12-14'
  }
];

export const contactOptions: ContactOption[] = [
  {
    id: 'live-chat',
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: MessageSquare,
    action: 'Start Chat',
    availability: '24/7'
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: 'Speak with a support specialist',
    icon: Phone,
    action: 'Call Now',
    availability: 'Mon-Fri 9AM-6PM'
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    action: 'Send Email',
    availability: 'Response within 24h'
  },
  {
    id: 'help-desk',
    title: 'Help Desk',
    description: 'Submit a support ticket',
    icon: BookOpen,
    action: 'Create Ticket',
    availability: 'Always available'
  }
];

export const roleBasedContent: { [key: string]: RoleContent } = {
  student: {
    title: 'Student Portal',
    description: 'Access your learning materials and track your progress',
    quickStart: [
      'Complete your profile setup',
      'Explore the Digital Library',
      'Organize files in My Locker',
      'Try educational apps',
      'Join your first class'
    ],
    features: [
      'Access digital textbooks and resources',
      'Submit assignments online',
      'Track your academic progress',
      'Collaborate with classmates',
      'Access educational games and apps'
    ],
    tutorials: [
      'Navigating the Student Dashboard',
      'Using the Digital Library',
      'Managing Your Locker',
      'Participating in Online Classes',
      'Using Study Tools'
    ]
  },
  teacher: {
    title: 'Teacher Dashboard',
    description: 'Manage your classes and create engaging lessons',
    quickStart: [
      'Set up your teacher profile',
      'Create your first class',
      'Upload teaching materials',
      'Schedule assignments',
      'Invite students to join'
    ],
    features: [
      'Create and manage classes',
      'Design interactive lessons',
      'Track student progress',
      'Share resources with students',
      'Communicate with parents'
    ],
    tutorials: [
      'Creating Your First Class',
      'Lesson Planning Tools',
      'Student Assessment Features',
      'Parent Communication',
      'Grading and Feedback'
    ]
  },
  school_admin: {
    title: 'School Administration',
    description: 'Oversee school operations and manage users',
    quickStart: [
      'Configure school settings',
      'Import student and teacher data',
      'Set up class schedules',
      'Configure access permissions',
      'Review system reports'
    ],
    features: [
      'Manage users and permissions',
      'Monitor system usage',
      'Generate reports',
      'Configure school policies',
      'Oversee data management'
    ],
    tutorials: [
      'School Setup and Configuration',
      'User Management',
      'Reports and Analytics',
      'Policy Configuration',
      'Data Import/Export'
    ]
  },
  super_admin: {
    title: 'Platform Administration',
    description: 'Manage the entire Edvirons platform',
    quickStart: [
      'Review platform status',
      'Configure global settings',
      'Monitor school accounts',
      'Review usage analytics',
      'Manage platform updates'
    ],
    features: [
      'Platform-wide administration',
      'School account management',
      'System monitoring',
      'Global configuration',
      'Usage analytics'
    ],
    tutorials: [
      'Platform Overview',
      'School Account Management',
      'System Monitoring',
      'Global Configuration',
      'Analytics and Reporting'
    ]
  }
};

export const interactiveFeatures: InteractiveFeature[] = [
  {
    id: 'guided-tour',
    title: 'Platform Guided Tour',
    description: 'Take a comprehensive tour of the platform',
    icon: User,
    category: 'Getting Started',
    estimatedTime: '15 minutes',
    difficulty: 'beginner'
  },
  {
    id: 'quick-setup',
    title: 'Quick Account Setup',
    description: 'Set up your account in just a few steps',
    icon: Settings,
    category: 'Account',
    estimatedTime: '5 minutes',
    difficulty: 'beginner'
  },
  {
    id: 'library-tutorial',
    title: 'Digital Library Tutorial',
    description: 'Learn to navigate and use the digital library',
    icon: BookOpen,
    category: 'Digital Library',
    estimatedTime: '10 minutes',
    difficulty: 'beginner'
  }
];