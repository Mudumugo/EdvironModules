import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, Settings, FolderOpen, BarChart3, Gamepad2, Heart, Star } from "lucide-react";

interface AgeAppropriateLayoutProps {
  children: ReactNode;
}

export default function AgeAppropriateLayout({ children }: AgeAppropriateLayoutProps) {
  const { user } = useAuth();

  // Determine academic level based on user profile
  const getAcademicLevel = () => {
    if (!user) return 'primary';
    
    // This would be determined from user's grade/age in a real implementation
    const grade = user.grade || 1;
    if (grade <= 3) return 'primary';
    if (grade <= 8) return 'junior';
    if (grade <= 12) return 'senior';
    return 'college';
  };

  const academicLevel = getAcademicLevel();

  const getDashboardConfig = () => {
    switch (academicLevel) {
      case 'primary':
        return {
          title: "My Learning Space",
          subtitle: "Let's learn and have fun!",
          modules: [
            { id: 'my-locker', name: 'My Backpack', icon: <FolderOpen className="h-8 w-8" />, color: 'bg-blue-100 text-blue-700', description: 'Save your favorite lessons' },
            { id: 'digital-library', name: 'Story Library', icon: <BookOpen className="h-8 w-8" />, color: 'bg-green-100 text-green-700', description: 'Books and videos' },
            { id: 'games', name: 'Learning Games', icon: <Gamepad2 className="h-8 w-8" />, color: 'bg-purple-100 text-purple-700', description: 'Fun learning activities' },
            { id: 'family', name: 'Family Corner', icon: <Heart className="h-8 w-8" />, color: 'bg-pink-100 text-pink-700', description: 'Share with family' },
          ],
          layout: 'large-cards'
        };
      
      case 'junior':
        return {
          title: "Learning Dashboard",
          subtitle: "Explore subjects and build knowledge",
          modules: [
            { id: 'dashboard', name: 'Home', icon: <BarChart3 className="h-6 w-6" />, color: 'bg-blue-50 border-blue-200' },
            { id: 'my-locker', name: 'My Locker', icon: <FolderOpen className="h-6 w-6" />, color: 'bg-green-50 border-green-200' },
            { id: 'digital-library', name: 'Library', icon: <BookOpen className="h-6 w-6" />, color: 'bg-purple-50 border-purple-200' },
            { id: 'scheduling', name: 'Schedule', icon: <Calendar className="h-6 w-6" />, color: 'bg-orange-50 border-orange-200' },
            { id: 'tutor-hub', name: 'Get Help', icon: <Users className="h-6 w-6" />, color: 'bg-teal-50 border-teal-200' },
            { id: 'family-controls', name: 'Family', icon: <Heart className="h-6 w-6" />, color: 'bg-pink-50 border-pink-200' },
          ],
          layout: 'grid-cards'
        };
      
      case 'senior':
        return {
          title: "Academic Portal",
          subtitle: "Prepare for your future",
          modules: [
            { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
            { id: 'my-locker', name: 'My Locker', icon: <FolderOpen className="h-5 w-5" /> },
            { id: 'digital-library', name: 'Digital Library', icon: <BookOpen className="h-5 w-5" /> },
            { id: 'scheduling', name: 'Schedule', icon: <Calendar className="h-5 w-5" /> },
            { id: 'tutor-hub', name: 'Tutoring', icon: <Users className="h-5 w-5" /> },
            { id: 'analytics', name: 'Progress', icon: <BarChart3 className="h-5 w-5" /> },
            { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
          ],
          layout: 'compact-list'
        };
      
      case 'college':
        return {
          title: "EdVirons Portal",
          subtitle: "Advanced learning management",
          modules: [
            { id: 'dashboard', name: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
            { id: 'my-locker', name: 'Personal Workspace', icon: <FolderOpen className="h-5 w-5" /> },
            { id: 'digital-library', name: 'Resource Library', icon: <BookOpen className="h-5 w-5" /> },
            { id: 'scheduling', name: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
            { id: 'tutor-hub', name: 'Academic Support', icon: <Users className="h-5 w-5" /> },
            { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
            { id: 'school-management', name: 'Course Management', icon: <Settings className="h-5 w-5" /> },
          ],
          layout: 'professional'
        };
      
      default:
        return getDashboardConfig();
    }
  };

  const config = getDashboardConfig();

  const renderPrimaryDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{config.title}</h1>
          <p className="text-xl text-gray-600">{config.subtitle}</p>
          {user && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-medium text-gray-700">Hello, {user.firstName}!</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.modules.map((module) => (
            <Card key={module.id} className="hover:scale-105 transition-transform cursor-pointer border-2 border-gray-200 hover:border-gray-300">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${module.color} mb-4`}>
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{module.name}</h3>
                <p className="text-gray-600 text-lg">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJuniorDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h1>
          <p className="text-lg text-gray-600">{config.subtitle}</p>
          {user && (
            <p className="text-md text-gray-500 mt-2">Welcome back, {user.firstName}!</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {config.modules.map((module) => (
            <Card key={module.id} className={`hover:shadow-lg transition-all cursor-pointer ${module.color} border-2`}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  {module.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{module.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSeniorDashboard = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-600">{config.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {config.modules.map((module) => (
            <Button
              key={module.id}
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-gray-100"
            >
              {module.icon}
              <span className="text-sm font-medium">{module.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCollegeDashboard = () => (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-500">{config.subtitle}</p>
          </div>
          {user && (
            <div className="text-sm text-gray-600">
              {user.firstName} {user.lastName}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {config.modules.map((module) => (
            <Button
              key={module.id}
              variant="ghost"
              className="gap-2 px-4 py-2"
            >
              {module.icon}
              {module.name}
            </Button>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );

  // Return appropriate dashboard based on academic level
  if (academicLevel === 'primary') return renderPrimaryDashboard();
  if (academicLevel === 'junior') return renderJuniorDashboard();
  if (academicLevel === 'senior') return renderSeniorDashboard();
  if (academicLevel === 'college') return renderCollegeDashboard();
  
  return renderJuniorDashboard(); // fallback
}