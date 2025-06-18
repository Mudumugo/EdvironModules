import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Search, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  Monitor,
  Smartphone,
  Globe,
  Filter
} from "lucide-react";

interface ExternalApp {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  rating: number;
  users: string;
  lastUpdated: string;
  features: string[];
  platforms: string[];
  pricing: "free" | "freemium" | "paid";
  ageGroup: string;
  subjects: string[];
}

export default function AppsHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["/api/apps-hub"],
  });

  // Mock data for demonstration - in production this would come from the API
  const mockApps: ExternalApp[] = [
    {
      id: "1",
      name: "Khan Academy",
      description: "Free online courses, lessons and practice for students of all ages",
      category: "general",
      icon: "🎓",
      url: "https://khanacademy.org",
      rating: 4.8,
      users: "120M+",
      lastUpdated: "2024-01-15",
      features: ["Video Lessons", "Practice Exercises", "Progress Tracking", "Personalized Learning"],
      platforms: ["Web", "iOS", "Android"],
      pricing: "free",
      ageGroup: "K-12, College",
      subjects: ["Math", "Science", "Programming", "History"]
    },
    {
      id: "2",
      name: "Duolingo",
      description: "Learn languages through gamified lessons and daily practice",
      category: "language",
      icon: "🦜",
      url: "https://duolingo.com",
      rating: 4.7,
      users: "500M+",
      lastUpdated: "2024-01-20",
      features: ["Gamification", "Speaking Practice", "Streak System", "Community"],
      platforms: ["Web", "iOS", "Android"],
      pricing: "freemium",
      ageGroup: "All Ages",
      subjects: ["Languages"]
    },
    {
      id: "3",
      name: "Scratch",
      description: "Visual programming language for creating interactive stories and games",
      category: "programming",
      icon: "🐱",
      url: "https://scratch.mit.edu",
      rating: 4.6,
      users: "80M+",
      lastUpdated: "2024-01-10",
      features: ["Visual Programming", "Project Sharing", "Community", "Tutorials"],
      platforms: ["Web", "Offline"],
      pricing: "free",
      ageGroup: "8-16",
      subjects: ["Programming", "Creative Arts"]
    },
    {
      id: "4",
      name: "Coursera",
      description: "Online courses from top universities and companies worldwide",
      category: "university",
      icon: "🏛️",
      url: "https://coursera.org",
      rating: 4.5,
      users: "100M+",
      lastUpdated: "2024-01-18",
      features: ["University Courses", "Certificates", "Specializations", "Degrees"],
      platforms: ["Web", "iOS", "Android"],
      pricing: "freemium",
      ageGroup: "College, Adult",
      subjects: ["Technology", "Business", "Science", "Arts"]
    },
    {
      id: "5",
      name: "Photomath",
      description: "Solve math problems using camera and get step-by-step explanations",
      category: "math",
      icon: "📐",
      url: "https://photomath.com",
      rating: 4.4,
      users: "220M+",
      lastUpdated: "2024-01-12",
      features: ["Camera Solving", "Step-by-step Solutions", "Graphing", "Multiple Methods"],
      platforms: ["iOS", "Android"],
      pricing: "freemium",
      ageGroup: "Middle School, High School",
      subjects: ["Math"]
    },
    {
      id: "6",
      name: "Quizlet",
      description: "Study tools including flashcards, games, and practice tests",
      category: "study",
      icon: "📚",
      url: "https://quizlet.com",
      rating: 4.3,
      users: "60M+",
      lastUpdated: "2024-01-16",
      features: ["Flashcards", "Study Games", "Practice Tests", "Collaborative Sets"],
      platforms: ["Web", "iOS", "Android"],
      pricing: "freemium",
      ageGroup: "All Ages",
      subjects: ["All Subjects"]
    }
  ];

  const displayApps = apps.length > 0 ? apps : mockApps;

  const categories = [
    { id: "all", name: "All Categories", count: displayApps.length },
    { id: "general", name: "General Education", count: displayApps.filter(app => app.category === "general").length },
    { id: "language", name: "Languages", count: displayApps.filter(app => app.category === "language").length },
    { id: "programming", name: "Programming", count: displayApps.filter(app => app.category === "programming").length },
    { id: "math", name: "Mathematics", count: displayApps.filter(app => app.category === "math").length },
    { id: "study", name: "Study Tools", count: displayApps.filter(app => app.category === "study").length },
    { id: "university", name: "University", count: displayApps.filter(app => app.category === "university").length }
  ];

  const filteredApps = displayApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    const matchesPricing = selectedPricing === "all" || app.pricing === selectedPricing;
    
    return matchesSearch && matchesCategory && matchesPricing;
  });

  const getPricingBadgeColor = (pricing: string) => {
    switch (pricing) {
      case "free": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "freemium": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "paid": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Web": return <Globe className="h-4 w-4" />;
      case "iOS": case "Android": return <Smartphone className="h-4 w-4" />;
      case "Offline": return <Monitor className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Apps Hub</h1>
        <p className="text-muted-foreground">
          Discover and access external learning applications to enhance your educational experience
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search apps, subjects, or features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPricing}
            onChange={(e) => setSelectedPricing(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        {/* Category Tabs */}
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:flex">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs lg:text-sm">
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Apps Grid */}
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map(app => (
                <Card key={app.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{app.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{app.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground ml-1">
                                {app.rating}
                              </span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span className="text-sm ml-1">{app.users}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className={getPricingBadgeColor(app.pricing)}>
                        {app.pricing}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{app.description}</p>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-1">
                      {app.subjects.slice(0, 3).map(subject => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {app.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{app.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Features:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {app.features.slice(0, 3).map(feature => (
                          <li key={feature} className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Available on:</span>
                      <div className="flex space-x-1">
                        {app.platforms.map(platform => (
                          <div key={platform} className="flex items-center space-x-1">
                            {getPlatformIcon(platform)}
                            <span className="text-xs">{platform}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Age Group */}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Age Group: {app.ageGroup}
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full group-hover:bg-primary/90 transition-colors"
                      onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open App
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No apps found</h3>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}