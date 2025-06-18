import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  Gamepad2, 
  GraduationCap
} from 'lucide-react';

export interface ResourceType {
  id: string;
  name: string;
  icon: any;
}

export class LibraryResourceTypes {
  static getResourceTypes(): ResourceType[] {
    return [
      { id: 'all', name: 'All Resources', icon: BookOpen },
      { id: 'book', name: 'Digital Books', icon: BookOpen },
      { id: 'worksheet', name: 'Worksheets', icon: FileText },
      { id: 'video', name: 'Video Content', icon: Video },
      { id: 'audio', name: 'Audio Lessons', icon: Headphones },
      { id: 'game', name: 'Learning Games', icon: Gamepad2 },
      { id: 'guide', name: 'Teacher Guides', icon: GraduationCap }
    ];
  }

  static getResourceIcon(type: string) {
    const types = this.getResourceTypes();
    const resourceType = types.find(t => t.id === type);
    return resourceType?.icon || BookOpen;
  }

  static getResourceTypeColor(type: string): string {
    const colors: Record<string, string> = {
      book: 'bg-blue-500',
      worksheet: 'bg-green-500', 
      video: 'bg-red-500',
      audio: 'bg-purple-500',
      game: 'bg-orange-500',
      guide: 'bg-teal-500'
    };
    return colors[type] || 'bg-gray-500';
  }
}