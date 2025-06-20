import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlayCircle, User, GraduationCap, Shield, Settings } from "lucide-react";
import { RoleContent } from "./types";

interface RoleBasedHelpProps {
  userRole: string;
  roleContent: { [key: string]: RoleContent };
  completedTasks: number[];
  onTaskComplete: (taskId: number) => void;
  onStartGuide: (guideType: string) => void;
}

export function RoleBasedHelp({ 
  userRole, 
  roleContent, 
  completedTasks, 
  onTaskComplete,
  onStartGuide 
}: RoleBasedHelpProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return GraduationCap;
      case 'teacher': return User;
      case 'school_admin': return Shield;
      case 'super_admin': return Settings;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-green-500';
      case 'teacher': return 'bg-blue-500';
      case 'school_admin': return 'bg-purple-500';
      case 'super_admin': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const content = roleContent[userRole];
  if (!content) return null;

  const RoleIcon = getRoleIcon(userRole);
  const roleColorClass = getRoleColor(userRole);
  const completionPercentage = (completedTasks.length / content.quickStart.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${roleColorClass} rounded-lg flex items-center justify-center text-white`}>
              <RoleIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{content.title}</CardTitle>
              <p className="text-sm text-gray-600">{content.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Setup Progress</span>
                <span className="text-sm text-gray-600">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div>
              <h4 className="font-medium mb-3">Quick Start Checklist</h4>
              <div className="space-y-2">
                {content.quickStart.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <button
                      onClick={() => onTaskComplete(index)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        completedTasks.includes(index)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {completedTasks.includes(index) && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </button>
                    <span className={`flex-1 ${
                      completedTasks.includes(index) ? 'text-gray-500 line-through' : ''
                    }`}>
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="default"
                onClick={() => onStartGuide('interactive')}
                className="justify-start"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Interactive Guide
              </Button>
              <Button
                variant="outline"
                onClick={() => onStartGuide('video')}
                className="justify-start"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Video Tutorials
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Tutorials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.tutorials.map((tutorial, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onStartGuide(`tutorial-${index}`)}
                >
                  <span className="text-sm">{tutorial}</span>
                  <PlayCircle className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}