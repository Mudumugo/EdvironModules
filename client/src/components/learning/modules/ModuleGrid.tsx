import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Star, Plus } from "lucide-react";
import { Link } from "wouter";

interface ModuleGridProps {
  moduleCards: any[];
  viewMode: 'grid' | 'list';
  searchTerm: string;
  selectedCategory: string;
}

export function ModuleGrid({ moduleCards, viewMode, searchTerm, selectedCategory }: ModuleGridProps) {
  const filteredModules = moduleCards.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {filteredModules.map((module) => (
          <Card key={module.id} className={`hover:shadow-lg transition-all duration-200 border-l-4 ${module.color}`}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                      <Badge variant="secondary" className="text-xs">{module.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {module.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
                      ))}
                      {module.moreCount > 0 && (
                        <Badge variant="secondary" className="text-xs">+{module.moreCount} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={module.route}>
                  <Button variant="outline" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredModules.map((module) => (
        <Card key={module.id} className={`hover:shadow-lg transition-all duration-200 border-l-4 ${module.color} group`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                <module.icon className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-xs">{module.category}</Badge>
            </div>
            <CardTitle className="text-lg">{module.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-1">
              {module.features.map((feature: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
              ))}
              {module.moreCount > 0 && (
                <Badge variant="secondary" className="text-xs">+{module.moreCount} more</Badge>
              )}
            </div>
            <Link href={module.route}>
              <Button className="w-full group-hover:shadow-md transition-shadow">
                Open Module
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}