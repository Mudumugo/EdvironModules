import { useState, useEffect } from "react";
import MobileLanding from "./MobileLanding";
import { HeroSection } from "@/components/landing/HeroSection";
import { NavigationTabs } from "@/components/landing/NavigationTabs";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { ContactSection } from "@/components/landing/ContactSection";
import { useLandingAutoPlay } from "@/hooks/useLandingAutoPlay";

export default function Landing() {
  const [isMobile, setIsMobile] = useState(false);

  const navigationTabs = [
    "Educational Modules Dashboard",
    "Interactive Digital Library", 
    "School Managers Tool",
    "Teacher & Student Lockers",
    "Academic Calendar & Planning"
  ];

  const { activeTab, setActiveTab, isAutoPlaying, setIsAutoPlaying } = useLandingAutoPlay(navigationTabs);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileLanding />;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection 
        isAutoPlaying={isAutoPlaying}
        setIsAutoPlaying={setIsAutoPlaying}
      />
      
      <NavigationTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigationTabs={navigationTabs}
      />
      
      <FeatureShowcase activeTab={activeTab} />
      
      <ContactSection />
    </div>
  );
}