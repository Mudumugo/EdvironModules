import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  Gamepad2, 
  GraduationCap,
  Award
} from 'lucide-react';
import { LayoutConfig } from './LibraryLayoutConfig';
import { ResourceCard } from './ResourceCard';

interface SecondaryLayoutProps {
  categories: any[];
  subjects: any[];
  resources: any[];
  layout: LayoutConfig;
  gradeLevel: string;
  onResourceAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}

export const SecondaryLayout = ({ 
  categories, 
  subjects, 
  resources, 
  layout, 
  gradeLevel, 
  onResourceAccess 
}: SecondaryLayoutProps) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources
                .filter(resource => resource.resourceType === type)
                .slice(0, 8)
                .map(resource => (
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

      {/* Subject Performance Analytics (for secondary) */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Subject Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => {
            const bgColors = [
              'bg-gradient-to-br from-blue-50 to-blue-100', 
              'bg-gradient-to-br from-green-50 to-green-100',
              'bg-gradient-to-br from-purple-50 to-purple-100',
              'bg-gradient-to-br from-orange-50 to-orange-100'
            ];
            
            return (
              <Card key={subject.id} className={`${layout.cardStyle} ${bgColors[index % 4]} border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <BookOpen className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{subject.name}</h3>
                      <p className="text-sm text-gray-600">CBE Aligned</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{subject.resourceCount || 24}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Resources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{subject.lessonsCount || 12}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Lessons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{subject.quizzesCount || 8}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Quizzes</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200"
                    onClick={() => {
                      console.log('View resources for', subject.id);
                    }}
                  >
                    View All
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
};