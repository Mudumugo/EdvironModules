import { MarketingNav } from "@/components/MarketingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

export function Landing() {
  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  const handleWatchDemo = () => {
    window.open('https://demo.edvirons.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      
      <HeroSection 
        onGetStarted={handleGetStarted}
        onWatchDemo={handleWatchDemo}
      />
      
      <FeaturesSection />
      
      <CTASection onGetStarted={handleGetStarted} />
    </div>
  );
}