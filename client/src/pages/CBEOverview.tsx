import { useCBEOverview } from "@/hooks/useCBEOverview";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNav } from "@/components/MarketingNav";
import { 
  BookOpen, 
  BarChart3, 
  Wifi,
  GraduationCap,
  School,
  Building2,
  Check,
  Users,
  Shield,
  Rocket,
  FileText,
  Clock,
  TrendingUp,
  Settings,
  Database,
  Award,
  Target,
  Zap,
  Quote
} from "lucide-react";

const iconMap = {
  BookOpen, BarChart3, Wifi, GraduationCap, School, Building2, 
  Check, Users, Shield, Rocket, FileText, Clock, TrendingUp, 
  Settings, Database, Award, Target, Zap, Quote
};

export default function CBEOverview() {
  const {
    activeSection,
    selectedFeature,
    keyFeatures,
    benefits,
    impactStats,
    navigateToSection,
    selectFeature,
    closeFeatureModal
  } = useCBEOverview();

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      {/* Hero Section */}
      <section id="overview" className="pt-20 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Competency-Based Education
              <span className="block text-blue-300">for Kenya's Future</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Transforming education through learner-centered approaches aligned with Kenya's CBC curriculum
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/interactive-signup">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-300 text-blue-100 hover:bg-blue-800">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              CBE-Aligned Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed specifically for Kenya's Competency-Based Curriculum
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => selectFeature(feature)}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-6`}>
                    <span className={feature.iconColor}>
                      {getIcon(feature.icon)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-blue-600 font-medium mb-3">{feature.subtitle}</p>
                  <p className="text-gray-600">{feature.description}</p>
                  {feature.highlight && (
                    <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {feature.highlight}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CBE Benefits */}
      <section id="benefits" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Benefits of Competency-Based Education
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Understanding how CBE transforms learning outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white">
                    {getIcon(benefit.icon)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              CBE Impact in Kenya
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Real results from competency-based education implementation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {getIcon(stat.icon)}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.title}</div>
                <div className="text-blue-100 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyan schools already implementing CBE with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/interactive-signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-300 hover:bg-gray-800">
              <Link href="/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{selectedFeature.title}</h3>
              <button onClick={closeFeatureModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-blue-600 font-medium mb-3">{selectedFeature.subtitle}</p>
            <p className="text-gray-600 mb-4">{selectedFeature.description}</p>
            {selectedFeature.highlight && (
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                {selectedFeature.highlight}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}