import { FeaturesHero } from "@/components/features/FeaturesHero";
import { FeatureGrid } from "@/components/features/FeatureGrid";
import { CTASection } from "@/components/features/CTASection";

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <FeaturesHero />
      <FeatureGrid />
      <CTASection />
    </div>
  );
}