import type { EducationLevel } from "@/components/dashboard/DashboardSwitcher";

export interface Subject {
  id: string;
  name: string;
  progress: number;
  color: string;
  lessons: number;
  completed: number;
  icon: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

export interface DashboardContent {
  subjects: Subject[];
  assignments: Assignment[];
  achievements: Achievement[];
  stats: {
    totalSubjects: number;
    completedLessons: number;
    averageGrade: string;
    studyHours: number;
  };
}

export const dashboardContentByLevel: Record<EducationLevel, DashboardContent> = {
  primary: {
    subjects: [
      {
        id: 'math_basic',
        name: 'Basic Mathematics',
        progress: 75,
        color: 'bg-blue-500',
        lessons: 20,
        completed: 15,
        icon: '🔢'
      },
      {
        id: 'english_reading',
        name: 'Reading & Writing',
        progress: 60,
        color: 'bg-green-500',
        lessons: 18,
        completed: 11,
        icon: '📚'
      },
      {
        id: 'science_nature',
        name: 'Nature Studies',
        progress: 45,
        color: 'bg-yellow-500',
        lessons: 15,
        completed: 7,
        icon: '🌱'
      },
      {
        id: 'art_craft',
        name: 'Arts & Crafts',
        progress: 80,
        color: 'bg-pink-500',
        lessons: 12,
        completed: 10,
        icon: '🎨'
      }
    ],
    assignments: [
      {
        id: 'math_hw1',
        title: 'Addition & Subtraction Practice',
        subject: 'Mathematics',
        dueDate: '2025-06-22',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'reading_hw1',
        title: 'Read "The Little Prince" Chapter 1',
        subject: 'Reading',
        dueDate: '2025-06-23',
        status: 'pending',
        priority: 'low'
      },
      {
        id: 'art_project1',
        title: 'Draw Your Family',
        subject: 'Arts',
        dueDate: '2025-06-25',
        status: 'completed',
        priority: 'medium'
      }
    ],
    achievements: [
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Completed your first lesson!',
        icon: '👣',
        earned: true,
        date: '2025-06-15'
      },
      {
        id: 'math_star',
        title: 'Math Star',
        description: 'Scored 100% on 5 math quizzes',
        icon: '⭐',
        earned: true,
        date: '2025-06-18'
      },
      {
        id: 'reading_champion',
        title: 'Reading Champion',
        description: 'Read 10 books this month',
        icon: '🏆',
        earned: false
      }
    ],
    stats: {
      totalSubjects: 4,
      completedLessons: 43,
      averageGrade: 'A-',
      studyHours: 25
    }
  },
  
  junior_secondary: {
    subjects: [
      {
        id: 'math_algebra',
        name: 'Algebra',
        progress: 65,
        color: 'bg-blue-600',
        lessons: 30,
        completed: 19,
        icon: '📐'
      },
      {
        id: 'english_lit',
        name: 'English Literature',
        progress: 70,
        color: 'bg-green-600',
        lessons: 25,
        completed: 18,
        icon: '📖'
      },
      {
        id: 'science_biology',
        name: 'Biology',
        progress: 55,
        color: 'bg-emerald-500',
        lessons: 28,
        completed: 15,
        icon: '🧬'
      },
      {
        id: 'history',
        name: 'World History',
        progress: 40,
        color: 'bg-amber-500',
        lessons: 22,
        completed: 9,
        icon: '🏛️'
      },
      {
        id: 'geography',
        name: 'Geography',
        progress: 85,
        color: 'bg-cyan-500',
        lessons: 20,
        completed: 17,
        icon: '🌍'
      }
    ],
    assignments: [
      {
        id: 'algebra_test',
        title: 'Quadratic Equations Test',
        subject: 'Algebra',
        dueDate: '2025-06-21',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'bio_lab',
        title: 'Cell Structure Lab Report',
        subject: 'Biology',
        dueDate: '2025-06-24',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'lit_essay',
        title: 'Shakespeare Essay: Romeo & Juliet',
        subject: 'Literature',
        dueDate: '2025-06-26',
        status: 'completed',
        priority: 'high'
      },
      {
        id: 'geo_project',
        title: 'Climate Change Presentation',
        subject: 'Geography',
        dueDate: '2025-06-28',
        status: 'pending',
        priority: 'medium'
      }
    ],
    achievements: [
      {
        id: 'scholar',
        title: 'Young Scholar',
        description: 'Maintained A+ average for 3 months',
        icon: '🎓',
        earned: true,
        date: '2025-06-10'
      },
      {
        id: 'lab_expert',
        title: 'Lab Expert',
        description: 'Completed 15 science experiments',
        icon: '🔬',
        earned: true,
        date: '2025-06-16'
      },
      {
        id: 'debate_master',
        title: 'Debate Master',
        description: 'Won school debate competition',
        icon: '🗣️',
        earned: false
      }
    ],
    stats: {
      totalSubjects: 5,
      completedLessons: 78,
      averageGrade: 'B+',
      studyHours: 45
    }
  },
  
  senior_secondary: {
    subjects: [
      {
        id: 'calculus',
        name: 'Advanced Calculus',
        progress: 50,
        color: 'bg-indigo-600',
        lessons: 40,
        completed: 20,
        icon: '∫'
      },
      {
        id: 'physics',
        name: 'Physics',
        progress: 75,
        color: 'bg-purple-600',
        lessons: 35,
        completed: 26,
        icon: '⚛️'
      },
      {
        id: 'chemistry',
        name: 'Organic Chemistry',
        progress: 60,
        color: 'bg-red-500',
        lessons: 32,
        completed: 19,
        icon: '🧪'
      },
      {
        id: 'literature',
        name: 'Advanced Literature',
        progress: 80,
        color: 'bg-teal-600',
        lessons: 28,
        completed: 22,
        icon: '✍️'
      },
      {
        id: 'economics',
        name: 'Economics',
        progress: 45,
        color: 'bg-orange-500',
        lessons: 30,
        completed: 14,
        icon: '📊'
      },
      {
        id: 'computer_science',
        name: 'Computer Science',
        progress: 90,
        color: 'bg-gray-700',
        lessons: 25,
        completed: 23,
        icon: '💻'
      }
    ],
    assignments: [
      {
        id: 'calc_exam',
        title: 'Integral Calculus Final Exam',
        subject: 'Calculus',
        dueDate: '2025-06-20',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'physics_lab',
        title: 'Quantum Mechanics Lab',
        subject: 'Physics',
        dueDate: '2025-06-22',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'chem_synthesis',
        title: 'Organic Synthesis Project',
        subject: 'Chemistry',
        dueDate: '2025-06-25',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'lit_thesis',
        title: 'Literary Analysis Thesis',
        subject: 'Literature',
        dueDate: '2025-06-30',
        status: 'completed',
        priority: 'high'
      },
      {
        id: 'cs_project',
        title: 'Machine Learning Algorithm',
        subject: 'Computer Science',
        dueDate: '2025-07-05',
        status: 'pending',
        priority: 'medium'
      }
    ],
    achievements: [
      {
        id: 'academic_excellence',
        title: 'Academic Excellence',
        description: 'Dean\'s List for 4 consecutive semesters',
        icon: '🏅',
        earned: true,
        date: '2025-05-30'
      },
      {
        id: 'research_pioneer',
        title: 'Research Pioneer',
        description: 'Published research paper',
        icon: '📄',
        earned: true,
        date: '2025-06-05'
      },
      {
        id: 'olympiad_winner',
        title: 'Science Olympiad Winner',
        description: 'Won national science competition',
        icon: '🥇',
        earned: false
      },
      {
        id: 'coding_master',
        title: 'Coding Master',
        description: 'Completed 100 programming challenges',
        icon: '⚡',
        earned: true,
        date: '2025-06-12'
      }
    ],
    stats: {
      totalSubjects: 6,
      completedLessons: 124,
      averageGrade: 'A',
      studyHours: 72
    }
  }
};