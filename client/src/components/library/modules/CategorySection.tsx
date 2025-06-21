import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  Gamepad2, 
  GraduationCap 
} from 'lucide-react';

interface CategorySectionProps {
  categories: any[];
  resources: any[];
  onCategorySelect: (categoryId: string) => void;
}

export function CategorySection({ categories, resources, onCategorySelect }: CategorySectionProps) {
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('book')) return BookOpen;
    if (name.includes('video') || name.includes('film')) return Video;
    if (name.includes('audio') || name.includes('sound')) return Headphones;
    if (name.includes('game') || name.includes('interactive')) return Gamepad2;
    if (name.includes('worksheet') || name.includes('document')) return FileText;
    return GraduationCap;
  };

  const getCategoryResources = (categoryId: string) => {
    return resources.filter(resource => resource.categoryId === categoryId);
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      { bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
      { bg: 'from-green-50 to-green-100', text: 'text-green-700', icon: 'text-green-600' },
      { bg: 'from-purple-50 to-purple-100', text: 'text-purple-700', icon: 'text-purple-600' },
      { bg: 'from-orange-50 to-orange-100', text: 'text-orange-700', icon: 'text-orange-600' },
      { bg: 'from-pink-50 to-pink-100', text: 'text-pink-700', icon: 'text-pink-600' },
      { bg: 'from-indigo-50 to-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-600' }
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Browse by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.name);
            const colors = getCategoryColor(index);
            const categoryResources = getCategoryResources(category.id);
            
            return (
              <Card 
                key={category.id} 
                className={`bg-gradient-to-br ${colors.bg} border-0 cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-md`}
                onClick={() => onCategorySelect(category.id)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.icon}`} />
                    <Badge variant="secondary" className="text-xs">
                      {categoryResources.length}
                    </Badge>
                  </div>
                  <h4 className={`font-semibold text-sm sm:text-base ${colors.text} mb-1`}>
                    {category.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {category.description || `Explore ${category.name} resources`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}