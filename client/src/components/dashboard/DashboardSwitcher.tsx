import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, BookOpen, GraduationCap, Users } from "lucide-react";

export type EducationLevel = 'primary' | 'junior_secondary' | 'senior_secondary';

interface DashboardSwitcherProps {
  currentLevel: EducationLevel;
  onLevelChange: (level: EducationLevel) => void;
}

const educationLevels = [
  {
    id: 'primary' as EducationLevel,
    name: 'Primary School',
    description: 'Ages 6-11 • Basic subjects',
    icon: BookOpen,
    color: 'bg-green-500',
    badgeColor: 'bg-green-100 text-green-800',
  },
  {
    id: 'junior_secondary' as EducationLevel,
    name: 'Junior Secondary',
    description: 'Ages 12-14 • Core subjects',
    icon: Users,
    color: 'bg-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'senior_secondary' as EducationLevel,
    name: 'Senior Secondary',
    description: 'Ages 15-18 • Advanced studies',
    icon: GraduationCap,
    color: 'bg-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
];

export function DashboardSwitcher({ currentLevel, onLevelChange }: DashboardSwitcherProps) {
  const currentLevelData = educationLevels.find(level => level.id === currentLevel);

  return (
    <div className="flex items-center space-x-3">
      <Badge variant="secondary" className="text-xs font-medium">
        Testing Mode
      </Badge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2 min-w-0">
            {currentLevelData && (
              <>
                <currentLevelData.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">{currentLevelData.name}</span>
                <span className="sm:hidden truncate">{currentLevelData.name.split(' ')[0]}</span>
              </>
            )}
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <h4 className="font-medium text-sm mb-2">Switch Dashboard Level</h4>
            {educationLevels.map((level) => (
              <DropdownMenuItem
                key={level.id}
                onClick={() => onLevelChange(level.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                  currentLevel === level.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
              >
                <div className={`p-2 rounded-full ${level.color} text-white`}>
                  <level.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{level.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {level.description}
                  </div>
                </div>
                {currentLevel === level.id && (
                  <Badge className={level.badgeColor}>Active</Badge>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}