import { MobileHero } from "@/components/mobile/MobileHero";
import { MobileFeatures } from "@/components/mobile/MobileFeatures";
import { MobileContact } from "@/components/mobile/MobileContact";

export default function MobileLanding() {
  return (
    <div className="min-h-screen bg-white">
      <MobileHero />
      <MobileFeatures />
      <MobileContact />
    </div>
  );
}