import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Award 
} from 'lucide-react';

export function QuickAccessSection() {
  const quickAccessItems = [
    {
      icon: BookOpen,
      title: "New Books",
      description: "Added this week",
      gradient: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      descColor: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Worksheets",
      description: "Practice materials",
      gradient: "from-green-100 to-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      descColor: "text-green-600"
    },
    {
      icon: Video,
      title: "Videos",
      description: "Educational content",
      gradient: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600",
      titleColor: "text-purple-800",
      descColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {quickAccessItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className={`bg-gradient-to-br ${item.gradient} border-0 cursor-pointer hover:scale-105 transition-transform`}>
            <CardContent className="p-3 sm:p-4 text-center">
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${item.iconColor}`} />
              <h3 className={`font-semibold text-sm sm:text-base ${item.titleColor}`}>{item.title}</h3>
              <p className={`text-xs sm:text-sm ${item.descColor}`}>{item.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}