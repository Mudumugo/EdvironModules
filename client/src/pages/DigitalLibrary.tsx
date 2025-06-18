import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  Gamepad2, 
  GraduationCap,
  Search,
  Filter,
  Heart,
  Download,
  Eye,
  Star,
  Bookmark,
  Play,
  Clock,
  Award,
  Sparkles
} from 'lucide-react';
// Library types are imported from education schema

// Age-appropriate layouts based on grade level
const getLayoutConfig = (gradeLevel: string) => {
  switch (gradeLevel) {
    case 'primary':
      return {
        headerColor: 'from-blue-500 to-purple-600',
        title: 'Welcome to Primary Learning! 🎓',
        subtitle: 'Continue your learning journey with engaging activities and lessons',
        cardStyle: 'rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
        buttonStyle: 'rounded-full px-6 py-2 font-medium',
        iconSize: 'w-12 h-12',
        spacing: 'gap-4'
      };
    case 'junior_secondary':
      return {
        headerColor: 'from-teal-500 to-green-600',
        title: 'CBE Junior Secondary Education 📚',
        subtitle: 'Competency-Based Education | Grades 7-9 | VCU Aligned',
        cardStyle: 'rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
        buttonStyle: 'rounded-lg px-4 py-2',
        iconSize: 'w-10 h-10',
        spacing: 'gap-6'
      };
    case 'senior_secondary':
      return {
        headerColor: 'from-purple-600 to-indigo-700',
        title: 'CBE Senior Secondary Education 🎯',
        subtitle: 'Competency-Based Education | Grades 10-12 | VCU Aligned',
        cardStyle: 'rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
        buttonStyle: 'rounded-lg px-4 py-2',
        iconSize: 'w-10 h-10',
        spacing: 'gap-6'
      };
    default:
      return {
        headerColor: 'from-blue-500 to-purple-600',
        title: 'Digital Library',
        subtitle: 'Explore educational resources',
        cardStyle: 'rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
        buttonStyle: 'rounded-lg px-4 py-2',
        iconSize: 'w-10 h-10',
        spacing: 'gap-6'
      };
  }
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'book':
      return BookOpen;
    case 'worksheet':
      return FileText;
    case 'video':
      return Video;
    case 'audio':
      return Headphones;
    case 'game':
      return Gamepad2;
    case 'guide':
      return GraduationCap;
    default:
      return BookOpen;
  }
};

const getResourceTypeColor = (type: string) => {
  const colors = {
    book: 'bg-blue-500',
    worksheet: 'bg-green-500',
    video: 'bg-red-500',
    audio: 'bg-purple-500',
    game: 'bg-orange-500',
    guide: 'bg-teal-500'
  };
  return colors[type] || 'bg-gray-500';
};

export default function DigitalLibrary() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResourceType, setSelectedResourceType] = useState('all');

  // Allow manual grade level switching for demo purposes
  const [demoGradeLevel, setDemoGradeLevel] = useState<string>('primary');
  const gradeLevel = demoGradeLevel;
  const layout = getLayoutConfig(gradeLevel);

  // Fetch categories for current grade level
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/library/categories', gradeLevel],
    queryFn: () => apiRequest('GET', `/api/library/categories?gradeLevel=${gradeLevel}`),
  }) as { data: any[] };

  // Fetch subjects for current grade level
  const { data: subjects = [] } = useQuery({
    queryKey: ['/api/library/subjects', gradeLevel, selectedCategory],
    queryFn: () => apiRequest('GET', `/api/library/subjects?gradeLevel=${gradeLevel}&categoryId=${selectedCategory !== 'all' ? selectedCategory : ''}`),
  }) as { data: any[] };

  // Fetch resources
  const { data: resources = [] } = useQuery({
    queryKey: ['/api/library/resources', gradeLevel, selectedCategory, selectedResourceType, searchTerm],
    queryFn: () => apiRequest('GET', '/api/library/resources', {
      gradeLevel,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      resourceType: selectedResourceType !== 'all' ? selectedResourceType : undefined,
      search: searchTerm || undefined
    }),
  });

  // Get featured resources
  const featuredResources = resources.filter(r => r.isFeatured);
  const recentResources = resources.slice(0, 8);

  const resourceTypes = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'book', name: 'Digital Books', icon: BookOpen },
    { id: 'worksheet', name: 'Worksheets', icon: FileText },
    { id: 'video', name: 'Video Content', icon: Video },
    { id: 'audio', name: 'Audio Lessons', icon: Headphones },
    { id: 'game', name: 'Learning Games', icon: Gamepad2 },
    { id: 'guide', name: 'Teacher Guides', icon: GraduationCap }
  ];

  const handleResourceAccess = async (resource: any, accessType: 'view' | 'save_to_locker') => {
    try {
      await apiRequest('POST', '/api/library/access', {
        resourceId: resource.id,
        accessType
      });
      
      if (accessType === 'view') {
        // Open resource viewer
        window.open(`/library/viewer/${resource.id}`, '_blank');
      }
    } catch (error) {
      console.error('Failed to access resource:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${layout.headerColor} text-white`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{layout.title}</h1>
            <p className="text-lg opacity-90 mb-6">{layout.subtitle}</p>
            
            {/* Demo Grade Level Switcher */}
            <div className="mb-6">
              <p className="text-sm opacity-75 mb-2">Demo: Switch Grade Levels</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setDemoGradeLevel('primary')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    demoGradeLevel === 'primary' 
                      ? 'bg-white text-blue-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Primary
                </button>
                <button
                  onClick={() => setDemoGradeLevel('junior_secondary')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    demoGradeLevel === 'junior_secondary' 
                      ? 'bg-white text-teal-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Junior Secondary
                </button>
                <button
                  onClick={() => setDemoGradeLevel('senior_secondary')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    demoGradeLevel === 'senior_secondary' 
                      ? 'bg-white text-purple-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Senior Secondary
                </button>
              </div>
            </div>
            
            {gradeLevel === 'primary' && (
              <div className="flex justify-center gap-4 mb-6">
                <Button variant="secondary" className={layout.buttonStyle}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" className={`${layout.buttonStyle} bg-white/10 border-white/20 text-white hover:bg-white/20`}>
                  Learning Goals
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select
                value={selectedResourceType}
                onChange={(e) => setSelectedResourceType(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background"
              >
                {resourceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {gradeLevel === 'primary' ? (
          <PrimaryLayout 
            categories={categories} 
            resources={resources}
            layout={layout}
            onResourceAccess={handleResourceAccess}
          />
        ) : (
          <SecondaryLayout 
            categories={categories} 
            subjects={subjects}
            resources={resources}
            layout={layout}
            gradeLevel={gradeLevel}
            onResourceAccess={handleResourceAccess}
          />
        )}
      </div>
    </div>
  );
}

// Primary school layout with simpler, more colorful design
function PrimaryLayout({ categories, resources, layout, onResourceAccess }: {
  categories: any[];
  resources: any[];
  layout: any;
  onResourceAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}) {
  const [activeTab, setActiveTab] = useState('subjects');

  return (
    <div className="space-y-8">
      {/* Quick Access Sections */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-blue-800">New Books</h3>
            <p className="text-sm text-blue-600">Added this week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-green-800">Popular Worksheets</h3>
            <p className="text-sm text-green-600">Most accessed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0">
          <CardContent className="p-4 text-center">
            <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Audio Lessons</h3>
            <p className="text-sm text-purple-600">Listen and learn</p>
          </CardContent>
        </Card>
      </div>

      {/* CBE Subjects */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">CBE Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Card key={category.id} className={`${layout.cardStyle} bg-gradient-to-br ${category.color || 'from-blue-500 to-blue-600'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-sm opacity-90">Learning Resources</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm opacity-90 mb-3">Available Resources:</p>
                  <div className="flex justify-between text-center">
                    <div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <p className="text-xs">Books</p>
                    </div>
                    <div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-xs">Worksheets</p>
                    </div>
                    <div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Video className="w-4 h-4" />
                      </div>
                      <p className="text-xs">Videos</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                  View All
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resource Type Tabs */}
      <Tabs defaultValue="books" className="mt-8">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Digital Books</span>
          </TabsTrigger>
          <TabsTrigger value="worksheets" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Worksheets</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden md:inline">Video Content</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            <span className="hidden md:inline">Audio Lessons</span>
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden md:inline">Learning Games</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden md:inline">Teacher Guides</span>
          </TabsTrigger>
        </TabsList>

        {['books', 'worksheets', 'videos', 'audio', 'games', 'guides'].map(type => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.filter(r => r.resourceType === type.slice(0, -1)).map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  layout={layout}
                  onAccess={onResourceAccess}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Secondary school layout with more sophisticated design
function SecondaryLayout({ categories, subjects, resources, layout, gradeLevel, onResourceAccess }: {
  categories: any[];
  subjects: any[];
  resources: any[];
  layout: any;
  gradeLevel: string;
  onResourceAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}) {
  return (
    <div className="space-y-8">
      {/* Main Learning Areas */}
      <div>
        <h2 className="text-2xl font-bold mb-6">CBE Learning Areas - {gradeLevel === 'junior_secondary' ? 'Junior Secondary' : 'Senior Secondary'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map(category => (
            <Card key={category.id} className={`${layout.cardStyle} bg-gradient-to-br ${category.color || 'from-blue-500 to-blue-600'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{category.name}</h3>
                    <p className="text-xs opacity-90">Core Competencies</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-center text-xs">
                    <div>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <BookOpen className="w-3 h-3" />
                      </div>
                      <p>Books</p>
                    </div>
                    <div>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <FileText className="w-3 h-3" />
                      </div>
                      <p>Worksheets</p>
                    </div>
                    <div>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Video className="w-3 h-3" />
                      </div>
                      <p>Videos</p>
                    </div>
                    <div>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Award className="w-3 h-3" />
                      </div>
                      <p>Assessments</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                  <span className="text-xs">Explore Learning Area</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Resource Hub */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Learning Resource Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'VCU Past Papers', desc: 'Examination preparation', color: 'from-red-500 to-red-600', icon: FileText },
            { title: 'Scholarship Applications', desc: 'Funding opportunities', color: 'from-blue-500 to-blue-600', icon: Award },
            { title: 'Advanced Workshops', desc: 'Skills development', color: 'from-purple-500 to-purple-600', icon: GraduationCap },
            { title: 'Career Pathways', desc: 'Future planning', color: 'from-green-500 to-green-600', icon: BookOpen }
          ].map((item, index) => (
            <Card key={index} className={`${layout.cardStyle} bg-gradient-to-br ${item.color} text-white`}>
              <CardContent className="p-6">
                <item.icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90 mb-4">{item.desc}</p>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Career Pathways (for Senior Secondary) */}
      {gradeLevel === 'senior_secondary' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">CBE Career Pathways & Learning Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: 'STEM Careers', 
                desc: 'Science, Technology, Engineering & Mathematics paths',
                color: 'from-blue-500 to-blue-600',
                subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics']
              },
              { 
                title: 'Health & Life Sciences', 
                desc: 'Healthcare and life science career options',
                color: 'from-red-500 to-red-600',
                subjects: ['Biology', 'Chemistry', 'Health Science', 'Psychology']
              },
              { 
                title: 'Business & Entrepreneurship', 
                desc: 'Commerce and business management paths',
                color: 'from-green-500 to-green-600',
                subjects: ['Economics', 'Business Studies', 'Accounting', 'Marketing']
              }
            ].map((pathway, index) => (
              <Card key={index} className={`${layout.cardStyle} bg-gradient-to-br ${pathway.color} text-white`}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{pathway.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{pathway.desc}</p>
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Key Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {pathway.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-white/20 text-white text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                    Explore Pathway
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Resources */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recently Added Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.slice(0, 8).map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              layout={layout}
              onAccess={onResourceAccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Resource card component
function ResourceCard({ resource, layout, onAccess }: {
  resource: any;
  layout: any;
  onAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}) {
  const ResourceIcon = getResourceIcon(resource.resourceType);
  
  return (
    <Card className={`${layout.cardStyle} group cursor-pointer`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 ${getResourceTypeColor(resource.resourceType)} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <ResourceIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {resource.resourceType.charAt(0).toUpperCase() + resource.resourceType.slice(1)}
            </p>
          </div>
        </div>
        
        {resource.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {resource.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {resource.viewCount || 0}
            </span>
            {resource.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {resource.rating}
              </span>
            )}
          </div>
          {resource.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {resource.duration}m
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1" 
            onClick={() => onAccess(resource, 'view')}
          >
            <Play className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAccess(resource, 'save_to_locker')}
          >
            <Bookmark className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}