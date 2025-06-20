import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { HelpCategory } from "./types";

interface HelpCategoriesProps {
  categories: HelpCategory[];
  onCategorySelect: (categoryId: string) => void;
}

export function HelpCategories({ categories, onCategorySelect }: HelpCategoriesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card 
          key={category.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onCategorySelect(category.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-white text-lg`}>
                  {category.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-3">{category.description}</p>
            <Badge variant="secondary">{category.articles} articles</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}