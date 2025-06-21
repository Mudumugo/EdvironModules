import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Play, Pause } from "lucide-react";

interface HeroSectionProps {
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
}

export function HeroSection({ isAutoPlaying, setIsAutoPlaying }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EdVirons
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Empowering Education Through Innovative Technology Solutions
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A comprehensive educational platform designed for Kenya's CBC curriculum, 
              supporting students, teachers, and administrators with cutting-edge digital tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Get Started Today
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Watch Demo
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2"
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlaying ? "Pause Tour" : "Start Tour"}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5K+</div>
              <div className="text-gray-600">Educators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">200+</div>
              <div className="text-gray-600">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">47</div>
              <div className="text-gray-600">Counties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}