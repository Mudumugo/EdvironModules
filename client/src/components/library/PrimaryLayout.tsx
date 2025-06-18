import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Video, Headphones, Sparkles, Star } from 'lucide-react';
import { LayoutConfig } from './LibraryLayoutConfig';
import { ResourceCard } from './ResourceCard';

interface PrimaryLayoutProps {
  categories: any[];
  resources: any[];
  layout: LayoutConfig;
  onResourceAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}

export const PrimaryLayout = ({ 
  categories, 
  resources, 
  layout, 
  onResourceAccess 
}: PrimaryLayoutProps) => {
  return (
    <div className="space-y-8">
      {/* Fun Interactive Categories for Primary Students */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          <Sparkles className="inline w-8 h-8 mr-2" />
          Choose Your Adventure!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Card key={category.id} className={`${layout.cardStyle} bg-gradient-to-br ${category.color || 'from-blue-400 to-purple-500'} text-white transform hover:scale-105`}>
              <CardContent className="p-6 text-center">
                <div className={`${layout.iconSize} bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90 mb-4">Fun learning activities</p>
                
                {/* Fun stats for primary students */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/20 rounded-lg p-2">
                    <BookOpen className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Books</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2">
                    <Video className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Videos</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2">
                    <Star className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Games</div>
                  </div>
                </div>
                
                <Button variant="secondary" className={`${layout.buttonStyle} w-full bg-white/20 hover:bg-white/30 text-white border-0`}>
                  Let's Explore!
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fun Quick Access Cards */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">Quick Learning!</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Story Time', desc: 'Read amazing stories', color: 'from-pink-400 to-red-500', icon: BookOpen },
            { title: 'Fun Videos', desc: 'Watch and learn', color: 'from-blue-400 to-cyan-500', icon: Video },
            { title: 'Audio Stories', desc: 'Listen to tales', color: 'from-purple-400 to-pink-500', icon: Headphones },
            { title: 'Activity Sheets', desc: 'Color and learn', color: 'from-green-400 to-blue-500', icon: FileText }
          ].map((item, index) => (
            <Card key={index} className={`${layout.cardStyle} bg-gradient-to-br ${item.color} text-white transform hover:scale-105`}>
              <CardContent className="p-4 text-center">
                <item.icon className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs opacity-90">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recently Added Resources */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">New Learning Adventures!</h2>
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