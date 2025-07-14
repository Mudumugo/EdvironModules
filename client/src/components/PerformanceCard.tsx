import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PerformanceCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  badge?: string;
  progress?: number;
  onClick?: () => void;
  className?: string;
}

export const PerformanceCard = memo(function PerformanceCard({
  id,
  icon,
  title,
  description,
  actionText,
  badge,
  progress,
  onClick,
  className = ""
}: PerformanceCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50 shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{title}</CardTitle>
            {badge && (
              <Badge className="mt-1" variant="secondary">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {description}
        </p>
        
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Button 
          onClick={onClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label={`${actionText} for ${title}`}
        >
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
});