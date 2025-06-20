import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import techTutorLogo from "@assets/techtutor_1750281329236.png";

interface TechTutorCardProps {
  viewMode?: "grid" | "list";
  onClick?: () => void;
  variant?: "primary" | "junior" | "senior" | "teacher";
}

export function TechTutorCard({ viewMode = "grid", onClick, variant = "junior" }: TechTutorCardProps) {
  const getDescription = () => {
    switch (variant) {
      case "primary":
        return "Learn about computers, tablets, and fun technology with your AI tutor!";
      case "junior":
        return "Master essential technology skills with personalized AI tutoring";
      case "senior":
        return "Advanced technology training and digital literacy with AI-powered instruction";
      case "teacher":
        return "Professional development and advanced teaching technology tools";
      default:
        return "Learn technology skills with AI-powered tutoring";
    }
  };

  const getFeatures = () => {
    switch (variant) {
      case "primary":
        return ["Basic Computer Skills", "Safe Internet Use", "Fun Tech Games"];
      case "junior":
        return ["Digital Literacy", "Coding Basics", "AI Tutoring"];
      case "senior":
        return ["Advanced Programming", "Tech Career Prep", "Industry Skills"];
      case "teacher":
        return ["EdTech Integration", "Digital Classroom Tools", "Professional Development"];
      default:
        return ["AI Tutoring", "Interactive Learning"];
    }
  };

  // Primary dashboard style (simple, colorful)
  if (variant === "primary") {
    return (
      <Card 
        className="hover:scale-105 transition-all duration-300 cursor-pointer group border-l-blue-500 border-l-4 bg-blue-50"
        onClick={onClick}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white mb-3 sm:mb-4 shadow-sm">
              <img 
                src={techTutorLogo} 
                alt="Tech Tutor" 
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              Tech Tutor
            </h3>
            
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
              {getDescription()}
            </p>
            
            <div className="flex items-center justify-center">
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Junior/Senior dashboard style (advanced)
  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-blue-500 border-l-4 ${
        viewMode === "list" ? "flex items-center p-4 lg:p-6" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className={viewMode === "grid" ? "p-6 lg:p-8" : "flex items-center gap-4 lg:gap-6 p-0 flex-1"}>
        <div className={`${viewMode === "grid" ? "mb-4 lg:mb-6" : ""}`}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
            <img 
              src={techTutorLogo} 
              alt="Tech Tutor" 
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 lg:mb-4">
            <h3 className="font-semibold text-xl lg:text-2xl group-hover:text-blue-600 transition-colors">
              Tech Tutor
            </h3>
            <ExternalLink className="h-5 w-5 lg:h-6 lg:w-6 text-gray-400" />
          </div>
          <p className="text-gray-600 text-base lg:text-lg mb-4 lg:mb-6 line-clamp-2">
            {getDescription()}
          </p>
          
          <div className="flex flex-wrap gap-2 lg:gap-3 mb-4 lg:mb-6">
            {getFeatures().map((feature, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {feature}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border">
              External App
            </span>
            <ArrowUpRight className="h-5 w-5 lg:h-6 lg:w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}