import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FolderOpen, 
  Gamepad2, 
  Heart, 
  Star,
  Calendar,
  Users,
  ArrowUpRight
} from "lucide-react";
import { Link } from "wouter";

const primaryModules = [
  {
    id: "story-library",
    title: "Story Library",
    description: "Fun books, videos, and interactive stories just for you!",
    icon: BookOpen,
    color: "border-l-blue-500",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: "my-backpack",
    title: "My Backpack", 
    description: "Keep all your favorite lessons and drawings safe here",
    icon: FolderOpen,
    color: "border-l-green-500",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    id: "fun-games",
    title: "Fun Games",
    description: "Play exciting games while learning new things",
    icon: Gamepad2,
    color: "border-l-purple-500",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: "my-progress",
    title: "My Progress",
    description: "See all the amazing things you've learned!",
    icon: Heart,
    color: "border-l-pink-500",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600"
  },
  {
    id: "my-calendar",
    title: "My Calendar",
    description: "See what fun activities are coming up",
    icon: Calendar,
    color: "border-l-orange-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    id: "friends",
    title: "My Friends",
    description: "Learn and play together with your classmates",
    icon: Users,
    color: "border-l-cyan-500",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600"
  }
];

interface PrimaryDashboardProps {
  user: any;
}

export function PrimaryDashboard({ user }: PrimaryDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Plan Info */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                Free Basic Plan
              </Badge>
              <p className="text-sm text-gray-600">
                Ask your parent about Premium for more fun activities!
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Upgrade to Premium
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Learning Space</h1>
          <p className="text-xl text-gray-600">Let's learn and have fun together!</p>
          {user && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-gray-700">Hello, {user.firstName}!</span>
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>
        
        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {primaryModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className={`hover:scale-105 transition-all duration-300 cursor-pointer group ${module.color} border-l-4 ${module.bgColor}`}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 shadow-sm`}>
                      <Icon className={`h-8 w-8 ${module.iconColor}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}