import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  Gamepad2, 
  GraduationCap
} from 'lucide-react';

export interface LayoutConfig {
  headerColor: string;
  title: string;
  subtitle: string;
  cardStyle: string;
  buttonStyle: string;
  iconSize: string;
  spacing: string;
}

export const getLayoutConfig = (gradeLevel: string): LayoutConfig => {
  switch (gradeLevel) {
    case 'primary':
      return {
        headerColor: 'from-blue-500 to-purple-600',
        title: 'Welcome to Primary Learning! 🎓',
        subtitle: 'Continue your learning journey with engaging activities and lessons',
        cardStyle: 'rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
        buttonStyle: 'rounded-full px-6 py-2 font-medium',
        iconSize: 'w-12 h-12',
        spacing: 'gap-4'
      };
    case 'junior_secondary':
      return {
        headerColor: 'from-teal-500 to-green-600',
        title: 'CBE Junior Secondary Education 📚',
        subtitle: 'Competency-Based Education | Grades 7-9 | VCU Aligned',
        cardStyle: 'rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
        buttonStyle: 'rounded-lg px-4 py-2',
        iconSize: 'w-10 h-10',
        spacing: 'gap-6'
      };
    case 'senior_secondary':
      return {
        headerColor: 'from-purple-600 to-indigo-700',
        title: 'Advanced CBE Secondary Education 🎯',
        subtitle: 'Career-focused CBE Learning | Grades 10-12 | University Preparation',
        cardStyle: 'rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
        buttonStyle: 'rounded-lg px-4 py-2',
        iconSize: 'w-10 h-10',
        spacing: 'gap-6'
      };
    default:
      return {
        headerColor: 'from-gray-500 to-gray-600',
        title: 'Digital Library',
        subtitle: 'Educational Resources',
        cardStyle: 'rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
        buttonStyle: 'rounded-lg px-4 py-2',
        iconSize: 'w-10 h-10',
        spacing: 'gap-6'
      };
  }
};

export const getResourceIcon = (type: string) => {
  const icons = {
    book: BookOpen,
    worksheet: FileText,
    video: Video,
    audio: Headphones,
    game: Gamepad2,
    guide: GraduationCap
  };
  return icons[type] || BookOpen;
};

export const getResourceTypeColor = (type: string) => {
  const colors = {
    book: 'bg-blue-500',
    worksheet: 'bg-green-500',
    video: 'bg-red-500',
    audio: 'bg-purple-500',
    game: 'bg-orange-500',
    guide: 'bg-teal-500'
  };
  return colors[type] || 'bg-gray-500';
};