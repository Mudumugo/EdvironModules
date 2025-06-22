import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Search,
  List,
  ArrowRight,
  Play,
  Pause
} from "lucide-react";

interface LandingMainContentProps {
  activeTab: string;
  navigationTabs: string[];
  onTabChange: (tab: string) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export function LandingMainContent({ 
  activeTab, 
  navigationTabs, 
  onTabChange, 
  isAutoPlaying, 
  onToggleAutoPlay 
}: LandingMainContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      {/* Features Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Educational Technology Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how our integrated platform transforms education with specialized modules 
              designed for every aspect of the learning ecosystem.
            </p>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {navigationTabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => {
                    onTabChange(tab);
                    onToggleAutoPlay(); // Pause auto-play when user manually selects
                  }}
                  className="text-sm"
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Auto-play Controls */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleAutoPlay}
                className="flex items-center gap-2"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause Slideshow
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play Slideshow
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                {navigationTabs.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      navigationTabs[index] === activeTab 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Platform Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-lg">
              <div className="bg-white rounded-2xl p-6 shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeTab} Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={viewMode === "grid" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      Grid
                    </Button>
                    <Button 
                      variant={viewMode === "list" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={`Search in ${activeTab}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Explore
                  </Button>
                </div>
                
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-gray-500 mb-4">
                    Interactive {activeTab} interface would appear here
                  </div>
                  <p className="text-sm text-gray-400">
                    This is a preview of the {activeTab} module with real-time data and interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EdVirons Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for the Kenyan education system with features that matter most 
              to local schools, teachers, and students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🇰🇪</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Kenya-Focused</h3>
              <p className="text-gray-600">
                Designed with the Kenyan curriculum, local languages, and cultural context in mind. 
                Supports CBC implementation and local assessment standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Mobile-First</h3>
              <p className="text-gray-600">
                Works perfectly on smartphones and tablets. Offline capabilities ensure learning 
                continues even with limited internet connectivity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Fully Integrated</h3>
              <p className="text-gray-600">
                All modules share data seamlessly. Student progress, attendance, and performance 
                flow automatically between different parts of the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Kenyan Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how schools across Kenya are transforming education with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">🏫</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Nairobi Primary School</h4>
                    <p className="text-sm text-gray-600">Nairobi County</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "EdVirons helped us digitize our entire school management system. 
                  Parent engagement improved by 60% and administrative time reduced by half."
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  → Read full case study
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Mombasa Secondary</h4>
                    <p className="text-sm text-gray-600">Coastal Region</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The digital library transformed how our students access learning materials. 
                  Reading scores improved by 40% in just one term."
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  → Read full case study
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Kisumu Academy</h4>
                    <p className="text-sm text-gray-600">Western Kenya</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Teacher productivity increased dramatically with automated lesson planning 
                  and student progress tracking. More time for actual teaching!"
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  → Read full case study
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join hundreds of Kenyan schools already using EdVirons to improve education outcomes. 
            Start your free trial today and see the difference in just 30 days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                Start Free 30-Day Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-blue-300 text-blue-100 hover:bg-blue-500/20 px-8 py-4 text-lg">
                Schedule a Demo
              </Button>
            </Link>
          </div>
          
          <div className="text-blue-200 text-sm">
            No credit card required • Full platform access • Free setup and training
          </div>
        </div>
      </section>
    </>
  );
}