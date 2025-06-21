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
    <div className="space-y-6 sm:space-y-8">
      {/* Fun Interactive Categories for Primary Students */}
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-blue-600 px-2">
          <Sparkles className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" />
          Choose Your Adventure!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {categories.map(category => (
            <Card key={category.id} className={`${layout.cardStyle} bg-gradient-to-br ${category.color || 'from-blue-400 to-purple-500'} text-white transform hover:scale-105 transition-transform`}>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">Fun learning activities</p>
                
                {/* Fun stats for primary students */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <div className="bg-white/20 rounded-lg p-1 sm:p-2">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Books</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-1 sm:p-2">
                    <Video className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Videos</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-1 sm:p-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold">Games</div>
                  </div>
                </div>
                
                <Button variant="secondary" className={`${layout.buttonStyle} w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm`}>
                  Let's Explore!
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fun Quick Access Cards */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 text-purple-600 px-2">Quick Learning!</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[
            { title: 'Story Time', desc: 'Read amazing stories', color: 'from-pink-400 to-red-500', icon: BookOpen },
            { title: 'Fun Videos', desc: 'Watch and learn', color: 'from-blue-400 to-cyan-500', icon: Video },
            { title: 'Audio Stories', desc: 'Listen to tales', color: 'from-purple-400 to-pink-500', icon: Headphones },
            { title: 'Activity Sheets', desc: 'Color and learn', color: 'from-green-400 to-blue-500', icon: FileText }
          ].map((item, index) => (
            <Card key={index} className={`${layout.cardStyle} bg-gradient-to-br ${item.color} text-white transform hover:scale-105 transition-transform`}>
              <CardContent className="p-3 sm:p-4 text-center">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <h3 className="font-bold text-xs sm:text-sm mb-1">{item.title}</h3>
                <p className="text-xs opacity-90 leading-tight">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recently Added Resources */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 text-green-600 px-2">New Learning Adventures!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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