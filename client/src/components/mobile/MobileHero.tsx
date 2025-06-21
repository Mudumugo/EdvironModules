import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { GraduationCap, Users, BookOpen, Calendar } from "lucide-react";

export function MobileHero() {
  return (
    <div className="text-center space-y-6 px-6 py-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Welcome to EdVirons
        </h1>
        
        <p className="text-lg text-gray-600 max-w-sm mx-auto">
          Your comprehensive educational platform designed for Kenya's CBC curriculum
        </p>
      </div>

      <div className="space-y-3">
        <Link href="/signup">
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Get Started Today
          </Button>
        </Link>
        
        <Link href="/demo">
          <Button variant="outline" size="lg" className="w-full">
            Watch Demo
          </Button>
        </Link>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">50K+</div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">5K+</div>
          <div className="text-sm text-gray-600">Teachers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">200+</div>
          <div className="text-sm text-gray-600">Schools</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">47</div>
          <div className="text-sm text-gray-600">Counties</div>
        </div>
      </div>
    </div>
  );
}