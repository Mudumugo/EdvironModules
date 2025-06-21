import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  iconColor: string;
  badge: string;
  features: string[];
  moreCount?: number;
  href?: string;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  color,
  iconColor,
  badge,
  features,
  moreCount,
  href
}: ModuleCardProps) {
  const CardWrapper = href ? Link : 'div';
  const cardProps = href ? { href } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${color} transition-transform duration-200 group-hover:scale-110`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
                {moreCount && moreCount > 0 && (
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                    +{moreCount} more feature{moreCount > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 p-0 h-auto text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-transform"
              >
                Explore Module
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}