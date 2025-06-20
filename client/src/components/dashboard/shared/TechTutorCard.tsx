import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import techTutorLogo from "@assets/techtutor_1750281329236.png";

interface TechTutorCardProps {
  viewMode?: "grid" | "list";
  onClick?: () => void;
  variant?: "primary" | "junior" | "senior";
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
        viewMode === "list" ? "flex items-center p-3 sm:p-4" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className={viewMode === "grid" ? "p-4 sm:p-6" : "flex items-center gap-3 sm:gap-4 p-0 flex-1"}>
        <div className={`${viewMode === "grid" ? "mb-3 sm:mb-4" : ""}`}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
            <img 
              src={techTutorLogo} 
              alt="Tech Tutor" 
              className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <h3 className="font-semibold text-base sm:text-lg group-hover:text-blue-600 transition-colors">
              Tech Tutor
            </h3>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {getDescription()}
          </p>
          
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {getFeatures().map((feature, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {feature}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border">
              External App
            </span>
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}