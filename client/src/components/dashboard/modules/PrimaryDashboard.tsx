import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  FolderOpen, 
  Gamepad2, 
  Heart, 
  Star 
} from "lucide-react";
import { Link } from "wouter";

interface PrimaryDashboardProps {
  user: any;
}

export function PrimaryDashboard({ user }: PrimaryDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Learning Space</h1>
          <p className="text-xl text-gray-600">Let's learn and have fun!</p>
          {user && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-gray-700">Hello, {user.firstName}!</span>
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/my-locker">
            <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-blue-200 hover:border-blue-300 bg-blue-50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-700 mb-4">
                  <FolderOpen className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">My Backpack</h3>
                <p className="text-gray-600 text-lg">Save your favorite lessons and stories</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/digital-library">
            <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-green-200 hover:border-green-300 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-700 mb-4">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Story Library</h3>
                <p className="text-gray-600 text-lg">Books, videos, and fun activities</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-purple-200 hover:border-purple-300 bg-purple-50">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 text-purple-700 mb-4">
                <Gamepad2 className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Fun Games</h3>
              <p className="text-gray-600 text-lg">Learn while playing games</p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-pink-200 hover:border-pink-300 bg-pink-50">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 text-pink-700 mb-4">
                <Heart className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">My Progress</h3>
              <p className="text-gray-600 text-lg">See how awesome you're doing!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}