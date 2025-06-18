import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import { AppStats, SearchFilters, AppCard, AppGrid, type App } from "@/components/apps/modules";

const mockApps: App[] = [
  {
    id: "1",
    name: "Khan Academy",
    description: "Free online courses, lessons and practice for learners of all ages",
    category: "Education",
    rating: 4.8,
    downloads: "50M+",
    price: "Free",
    icon: "graduation-cap",
    featured: true,
    trending: false,
    recommended: true,
    popular: true,
    essential: true,
    premium: false,
    tags: ["Math", "Science", "Education", "Learning"],
    url: "https://khanacademy.org"
  },
  {
    id: "2",
    name: "Scratch",
    description: "Create stories, games, and animations. Share with others around the world",
    category: "Programming",
    rating: 4.6,
    downloads: "25M+",
    price: "Free",
    icon: "code",
    featured: true,
    trending: true,
    recommended: true,
    popular: false,
    essential: true,
    premium: false,
    tags: ["Programming", "Creativity", "Games", "Animation"],
    url: "https://scratch.mit.edu"
  },
  {
    id: "3",
    name: "GeoGebra",
    description: "Dynamic mathematics software for all levels of education",
    category: "Mathematics",
    rating: 4.7,
    downloads: "30M+",
    price: "Free",
    icon: "calculator",
    featured: false,
    trending: false,
    recommended: true,
    popular: true,
    essential: false,
    premium: false,
    tags: ["Math", "Geometry", "Algebra", "Graphing"],
    url: "https://geogebra.org"
  },
  {
    id: "4",
    name: "Canva for Education",
    description: "Design and create beautiful presentations, posters, and more",
    category: "Design",
    rating: 4.5,
    downloads: "40M+",
    price: "Free",
    icon: "palette",
    featured: true,
    trending: false,
    recommended: false,
    popular: true,
    essential: false,
    premium: false,
    tags: ["Design", "Graphics", "Presentations", "Creative"],
    url: "https://canva.com/education"
  },
  {
    id: "5",
    name: "Duolingo",
    description: "Learn languages for free with fun, bite-sized lessons",
    category: "Languages",
    rating: 4.4,
    downloads: "100M+",
    price: "Freemium",
    icon: "globe",
    featured: false,
    trending: true,
    recommended: true,
    popular: true,
    essential: false,
    premium: true,
    tags: ["Languages", "Learning", "Spanish", "French"],
    url: "https://duolingo.com"
  },
  {
    id: "6",
    name: "Google Classroom",
    description: "Streamline assignments, boost collaboration, and foster seamless communication",
    category: "Communication",
    rating: 4.3,
    downloads: "1B+",
    price: "Free",
    icon: "message-circle",
    featured: false,
    trending: false,
    recommended: true,
    popular: true,
    essential: true,
    premium: false,
    tags: ["Classroom", "Communication", "Assignments", "Collaboration"],
    url: "https://classroom.google.com"
  },
  {
    id: "7",
    name: "Minecraft Education",
    description: "Game-based learning platform that promotes creativity and collaboration",
    category: "Gaming",
    rating: 4.2,
    downloads: "20M+",
    price: "$5/month",
    icon: "gamepad-2",
    featured: false,
    trending: true,
    recommended: false,
    popular: false,
    essential: false,
    premium: true,
    tags: ["Gaming", "Building", "Creativity", "STEM"],
    url: "https://education.minecraft.net"
  }
];

export default function AppsHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Apps");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: apps, isLoading } = useQuery({
    queryKey: ["/api/apps"],
    queryFn: () => Promise.resolve(mockApps),
  });

  const typedApps = (apps || []) as App[];
  const categories = ["All Apps", ...Array.from(new Set(typedApps.map(app => app.category)))];
  
  const totalApps = typedApps.length;
  const featuredApps = typedApps.filter(app => app.featured);
  const categoriesCount = categories.length - 1; // Exclude "All Apps"

  const filteredApps = typedApps.filter((app: App) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All Apps" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading apps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Layers className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Apps Hub
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover and access educational applications to enhance your learning experience
          </p>
        </div>

        {/* Stats Cards */}
        <AppStats
          totalApps={totalApps}
          featuredApps={featuredApps.length}
          categoriesCount={categoriesCount}
        />

        {/* Search and Filter */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
          categories={categories}
        />

        {/* Featured Apps */}
        {featuredApps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Featured Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredApps.map((app: App) => (
                <AppCard key={app.id} app={app} variant="featured" />
              ))}
            </div>
          </div>
        )}

        {/* All Apps */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {selectedCategory === "All Apps" ? "All Apps" : selectedCategory} 
            ({filteredApps.length})
          </h2>
          <AppGrid apps={filteredApps} viewMode={viewMode} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}