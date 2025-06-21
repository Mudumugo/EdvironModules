import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export function HeroSection({ onGetStarted, onWatchDemo }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-pulse" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-blue-100 ring-1 ring-blue-300/20 hover:ring-blue-300/30">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                Trusted by 10,000+ schools worldwide
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Transform Your School's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Digital Experience
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Comprehensive educational platform that connects students, teachers, and parents 
            through innovative digital tools, interactive learning experiences, and seamless communication.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={onWatchDemo}
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-16 flow-root sm:mt-20">
            <div className="relative -m-2 rounded-xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="/api/placeholder/800/450"
                alt="EdTech Platform Dashboard"
                className="rounded-md shadow-2xl ring-1 ring-white/10"
                width={800}
                height={450}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}