import type { EducationLevel } from "@/components/dashboard/DashboardSwitcher";

export interface EdvironsModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  features: string[];
  isAvailable: boolean;
}

export interface RecentActivity {
  id: string;
  title: string;
  module: string;
  time: string;
  type: 'accessed' | 'created' | 'completed' | 'shared';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  author: string;
}

export interface DashboardContent {
  modules: EdvironsModule[];
  recentActivities: RecentActivity[];
  announcements: Announcement[];
  stats: {
    modulesAccessed: number;
    resourcesViewed: number;
    timeSpent: string;
    lastLogin: string;
  };
}

export const dashboardContentByLevel: Record<EducationLevel, DashboardContent> = {
  primary: {
    modules: [
      {
        id: 'digital_library',
        name: 'Digital Library',
        description: 'Access age-appropriate books, stories, and educational resources',
        icon: '📚',
        color: 'bg-blue-500',
        href: '/digital-library',
        features: ['Picture books', 'Interactive stories', 'Basic reference'],
        isAvailable: true
      },
      {
        id: 'my_locker',
        name: 'My Locker',
        description: 'Store your favorite content, notes, and creative work',
        icon: '🗂️',
        color: 'bg-green-500',
        href: '/my-locker',
        features: ['Save favorites', 'Digital notebooks', 'Art gallery'],
        isAvailable: true
      },
      {
        id: 'apps_hub',
        name: 'Apps Hub',
        description: 'Fun educational games and learning activities',
        icon: '🎮',
        color: 'bg-purple-500',
        href: '/apps-hub',
        features: ['Learning games', 'Puzzles', 'Art tools'],
        isAvailable: true
      },
      {
        id: 'tech_tutor',
        name: 'Tech Tutor',
        description: 'Get help with basic computer and internet skills',
        icon: '🤖',
        color: 'bg-orange-500',
        href: '/tech-tutor',
        features: ['Basic computing', 'Internet safety', 'Digital citizenship'],
        isAvailable: true
      },
      {
        id: 'cbe_hub',
        name: 'CBE Hub',
        description: 'Track your learning goals and build your achievement portfolio',
        icon: '🎯',
        color: 'bg-blue-500',
        href: '/cbe-hub',
        features: ['Learning goals', 'Achievement tracking', 'Fun rewards'],
        isAvailable: true
      },
      {
        id: 'help_center',
        name: 'Help Center',
        description: 'Get assistance and learn how to use the portal',
        icon: '❓',
        color: 'bg-gray-500',
        href: '/help',
        features: ['How-to guides', 'Ask for help', 'Parent resources'],
        isAvailable: true
      }
    ],
    recentActivities: [
      {
        id: '1',
        title: 'Read "The Three Little Pigs"',
        module: 'Digital Library',
        time: '2 hours ago',
        type: 'accessed'
      },
      {
        id: '2',
        title: 'Drew a picture in Art Tools',
        module: 'Apps Hub',
        time: 'Yesterday',
        type: 'created'
      },
      {
        id: '3',
        title: 'Saved story to favorites',
        module: 'My Locker',
        time: '2 days ago',
        type: 'shared'
      }
    ],
    announcements: [
      {
        id: '1',
        title: 'New Story Collection Available',
        content: 'Check out our new collection of fairy tales in the Digital Library!',
        date: '2025-06-18',
        priority: 'medium',
        author: 'Library Team'
      },
      {
        id: '2',
        title: 'Art Contest This Month',
        content: 'Submit your best digital artwork for our monthly contest!',
        date: '2025-06-17',
        priority: 'high',
        author: 'Activities Team'
      }
    ],
    stats: {
      modulesAccessed: 4,
      resourcesViewed: 23,
      timeSpent: '2.5 hours',
      lastLogin: 'Today at 9:30 AM'
    }
  },

  junior_secondary: {
    modules: [
      {
        id: 'digital_library',
        name: 'Digital Library',
        description: 'Access academic resources, research materials, and reference books',
        icon: '📖',
        color: 'bg-blue-600',
        href: '/digital-library',
        features: ['Academic databases', 'Research tools', 'Subject guides'],
        isAvailable: true
      },
      {
        id: 'my_locker',
        name: 'My Locker',
        description: 'Organize research notes, projects, and academic resources',
        icon: '📋',
        color: 'bg-green-600',
        href: '/my-locker',
        features: ['Research notes', 'Project files', 'Citation manager'],
        isAvailable: true
      },
      {
        id: 'apps_hub',
        name: 'Apps Hub',
        description: 'Educational applications for collaborative learning',
        icon: '🔬',
        color: 'bg-purple-600',
        href: '/apps-hub',
        features: ['Lab simulations', 'Collaboration tools', 'Study aids'],
        isAvailable: true
      },
      {
        id: 'tech_tutor',
        name: 'Tech Tutor',
        description: 'Learn digital research skills and academic technology',
        icon: '💻',
        color: 'bg-orange-600',
        href: '/tech-tutor',
        features: ['Research skills', 'Digital literacy', 'Online safety'],
        isAvailable: true
      },
      {
        id: 'cbe_hub',
        name: 'CBE Hub',
        description: 'Competency-based learning with skill tracking and assessments',
        icon: '🎯',
        color: 'bg-blue-600',
        href: '/cbe-hub',
        features: ['Skill assessments', 'Competency tracking', 'Progress portfolios'],
        isAvailable: true
      },
      {
        id: 'help_center',
        name: 'Help Center',
        description: 'Academic support and technical assistance',
        icon: '🆘',
        color: 'bg-gray-600',
        href: '/help',
        features: ['Study help', 'Tech support', 'Academic guidance'],
        isAvailable: true
      }
    ],
    recentActivities: [
      {
        id: '1',
        title: 'Downloaded Biology research paper',
        module: 'Digital Library',
        time: '1 hour ago',
        type: 'accessed'
      },
      {
        id: '2',
        title: 'Created new project folder',
        module: 'My Locker',
        time: '3 hours ago',
        type: 'created'
      },
      {
        id: '3',
        title: 'Completed lab simulation',
        module: 'Apps Hub',
        time: 'Yesterday',
        type: 'completed'
      }
    ],
    announcements: [
      {
        id: '1',
        title: 'New Science Database Available',
        content: 'Access the latest scientific journals and research papers.',
        date: '2025-06-19',
        priority: 'high',
        author: 'Library Services'
      },
      {
        id: '2',
        title: 'Study Group Tools Updated',
        content: 'New collaboration features added to Apps Hub.',
        date: '2025-06-16',
        priority: 'medium',
        author: 'Tech Team'
      }
    ],
    stats: {
      modulesAccessed: 5,
      resourcesViewed: 47,
      timeSpent: '6.2 hours',
      lastLogin: 'Today at 8:15 AM'
    }
  },

  senior_secondary: {
    modules: [
      {
        id: 'digital_library',
        name: 'Digital Library',
        description: 'Advanced academic resources, research databases, and scholarly publications',
        icon: '🎓',
        color: 'bg-indigo-700',
        href: '/digital-library',
        features: ['Scholarly articles', 'Thesis databases', 'Advanced search'],
        isAvailable: true
      },
      {
        id: 'my_locker',
        name: 'My Locker',
        description: 'Advanced project management and research organization tools',
        icon: '📁',
        color: 'bg-green-700',
        href: '/my-locker',
        features: ['Research portfolio', 'Project management', 'Bibliography tools'],
        isAvailable: true
      },
      {
        id: 'apps_hub',
        name: 'Apps Hub',
        description: 'Professional-grade tools for advanced learning and research',
        icon: '⚗️',
        color: 'bg-purple-700',
        href: '/apps-hub',
        features: ['Research tools', 'Data analysis', 'Collaboration platforms'],
        isAvailable: true
      },
      {
        id: 'tech_tutor',
        name: 'Tech Tutor',
        description: 'Advanced digital skills and research methodology training',
        icon: '🧠',
        color: 'bg-orange-700',
        href: '/tech-tutor',
        features: ['Research methods', 'Data analysis', 'Academic writing'],
        isAvailable: true
      },
      {
        id: 'cbe_hub',
        name: 'CBE Hub',
        description: 'Advanced competency framework with portfolio and assessment tools',
        icon: '🎓',
        color: 'bg-blue-700',
        href: '/cbe-hub',
        features: ['Advanced assessments', 'Competency mapping', 'Career portfolios'],
        isAvailable: true
      },
      {
        id: 'help_center',
        name: 'Help Center',
        description: 'Comprehensive academic and technical support services',
        icon: '🆘',
        color: 'bg-gray-700',
        href: '/help',
        features: ['Academic counseling', 'Research support', 'Career guidance'],
        isAvailable: true
      }
    ],
    recentActivities: [
      {
        id: '1',
        title: 'Downloaded advanced physics journals',
        module: 'Digital Library',
        time: '30 minutes ago',
        type: 'accessed'
      },
      {
        id: '2',
        title: 'Updated research project bibliography',
        module: 'My Locker',
        time: '2 hours ago',
        type: 'created'
      },
      {
        id: '3',
        title: 'Completed data analysis tutorial',
        module: 'Tech Tutor',
        time: 'Yesterday',
        type: 'completed'
      }
    ],
    announcements: [
      {
        id: '1',
        title: 'University Research Partnership',
        content: 'New collaboration with leading universities for advanced research access.',
        date: '2025-06-20',
        priority: 'high',
        author: 'Academic Affairs'
      },
      {
        id: '2',
        title: 'Career Guidance Sessions',
        content: 'Schedule one-on-one sessions with career counselors.',
        date: '2025-06-18',
        priority: 'medium',
        author: 'Counseling Services'
      }
    ],
    stats: {
      modulesAccessed: 5,
      resourcesViewed: 89,
      timeSpent: '12.7 hours',
      lastLogin: 'Today at 7:45 AM'
    }
  }
};