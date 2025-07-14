import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CBECardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  badge?: string;
  progress?: number;
  completedModules?: number;
  totalModules?: number;
}

export const CBECard = memo(function CBECard({
  id,
  icon,
  title,
  description,
  actionText,
  badge,
  progress,
  completedModules,
  totalModules
}: CBECardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50">
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {badge && (
              <Badge className="mt-1" variant="secondary">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {completedModules !== undefined && totalModules !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {completedModules} of {totalModules} modules completed
              </p>
            )}
          </div>
        )}
        
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
});