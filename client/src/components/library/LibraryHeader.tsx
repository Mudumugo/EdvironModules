import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { LayoutConfig } from './LibraryLayoutConfig';

interface LibraryHeaderProps {
  layout: LayoutConfig;
  gradeLevel: string;
  demoGradeLevel: string;
  onGradeLevelChange: (level: string) => void;
}

export const LibraryHeader = ({ 
  layout, 
  gradeLevel, 
  demoGradeLevel, 
  onGradeLevelChange 
}: LibraryHeaderProps) => {
  return (
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
                onClick={() => onGradeLevelChange('primary')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  demoGradeLevel === 'primary' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Primary
              </button>
              <button
                onClick={() => onGradeLevelChange('junior_secondary')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  demoGradeLevel === 'junior_secondary' 
                    ? 'bg-white text-teal-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Junior Secondary
              </button>
              <button
                onClick={() => onGradeLevelChange('senior_secondary')}
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
  );
};