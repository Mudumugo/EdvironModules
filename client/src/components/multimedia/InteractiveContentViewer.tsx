import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { MediaPlayer } from './MediaPlayer';
import { InteractiveElements } from './InteractiveElements';
import { ProgressTracker } from './ProgressTracker';
import { 
  MediaContent, 
  ViewerSettings, 
  ViewerProgress, 
  InteractiveElement,
  ViewerInteraction 
} from './types';

interface InteractiveContentViewerProps {
  resourceId: number;
  title: string;
  content: string;
  mediaAssets: any[];
  interactiveElements: any[];
  xapiEnabled: boolean;
  trackingConfig: any;
  onClose?: () => void;
}

export default function InteractiveContentViewer({
  resourceId,
  title,
  content,
  mediaAssets,
  interactiveElements,
  xapiEnabled,
  trackingConfig,
  onClose
}: InteractiveContentViewerProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [completedElements, setCompletedElements] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState<ViewerProgress>({
    contentId: resourceId.toString(),
    userId: 'current-user',
    currentTime: 0,
    totalDuration: 0,
    percentageWatched: 0,
    completed: false,
    lastWatched: new Date().toISOString(),
    bookmarks: [],
    interactions: []
  });

  const [settings, setSettings] = useState<ViewerSettings>({
    autoplay: false,
    volume: 0.8,
    playbackSpeed: 1,
    quality: 'auto',
    captions: false,
    captionLanguage: 'en',
    fullscreen: false,
    annotations: true,
    chapters: true
  });

  // Convert legacy data to new format
  const convertedMediaAssets: MediaContent[] = mediaAssets.map((asset, index) => ({
    id: asset.id || index.toString(),
    title: asset.title || `Media ${index + 1}`,
    type: asset.type as 'video' | 'audio',
    url: asset.url,
    duration: asset.duration,
    size: 0,
    format: asset.type === 'video' ? 'mp4' : 'mp3',
    tags: [],
    category: 'educational',
    difficulty: 'intermediate' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      chapters: [],
      captions: asset.subtitles ? [{ 
        id: '1', 
        language: 'en', 
        url: asset.subtitles, 
        label: 'English',
        isDefault: true 
      }] : [],
      annotations: [],
      interactiveElements: []
    }
  }));

  const convertedElements: InteractiveElement[] = interactiveElements.map((element) => ({
    id: element.id,
    type: element.type,
    timestamp: 0, // Would need to be extracted from position or timing data
    position: element.position,
    data: element.content,
    isActive: true
  }));

  const currentMedia = convertedMediaAssets[currentMediaIndex];

  // xAPI tracking functions
  const trackInteraction = (verb: string, object: any, result?: any) => {
    if (!xapiEnabled) return;

    const interaction: ViewerInteraction = {
      id: `${Date.now()}-${Math.random()}`,
      type: verb as any,
      timestamp: currentTime,
      data: { object, result },
      sessionId: 'current-session',
      createdAt: new Date().toISOString()
    };

    setProgress(prev => ({
      ...prev,
      interactions: [...prev.interactions, interaction]
    }));

    // Send to xAPI endpoint if configured
    if (trackingConfig?.endpoint) {
      // Implementation would send to actual xAPI LRS
      console.log('xAPI Statement:', { verb, object, result });
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    const percentage = currentMedia?.duration ? (time / currentMedia.duration) * 100 : 0;
    
    setProgress(prev => ({
      ...prev,
      currentTime: time,
      percentageWatched: Math.max(prev.percentageWatched, percentage),
      lastWatched: new Date().toISOString()
    }));

    // Track progress milestones
    if (percentage >= 25 && percentage < 50) {
      trackInteraction('progressed', { milestone: '25%' });
    } else if (percentage >= 50 && percentage < 75) {
      trackInteraction('progressed', { milestone: '50%' });
    } else if (percentage >= 75 && percentage < 100) {
      trackInteraction('progressed', { milestone: '75%' });
    } else if (percentage >= 100) {
      setProgress(prev => ({ ...prev, completed: true }));
      trackInteraction('completed', { contentId: resourceId });
    }
  };

  const handleElementComplete = (elementId: string, data: any) => {
    setCompletedElements(prev => new Set([...prev, elementId]));
    trackInteraction('answered', { elementId }, data);
  };

  const handleElementInteraction = (elementId: string, data: any) => {
    trackInteraction('interacted', { elementId, ...data });
  };

  const handleSettingsChange = (newSettings: Partial<ViewerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleAddBookmark = (timestamp: number, title: string, note?: string) => {
    const bookmark = {
      id: `bookmark-${Date.now()}`,
      timestamp,
      title,
      note,
      createdAt: new Date().toISOString()
    };

    setProgress(prev => ({
      ...prev,
      bookmarks: [...prev.bookmarks, bookmark]
    }));

    trackInteraction('bookmarked', { timestamp, title });
  };

  const handleJumpToTime = (timestamp: number) => {
    setCurrentTime(timestamp);
    // This would need to be passed to the media player
    trackInteraction('seeked', { timestamp });
  };

  useEffect(() => {
    // Track content launch
    trackInteraction('launched', { 
      contentId: resourceId, 
      title: title 
    });

    return () => {
      // Track session end
      trackInteraction('terminated', { 
        contentId: resourceId,
        duration: currentTime,
        completed: progress.completed
      });
    };
  }, []);

  if (!currentMedia) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No Media Available</h3>
          <p className="text-gray-600">This content doesn't have any media assets to display.</p>
          {onClose && (
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(90vh-80px)]">
          {/* Media Player Area */}
          <div className="flex-1 relative">
            <MediaPlayer
              content={currentMedia}
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onTimeUpdate={handleTimeUpdate}
              onInteraction={(interaction) => trackInteraction(interaction.type, interaction)}
            />

            {/* Interactive Elements Overlay */}
            <InteractiveElements
              elements={convertedElements}
              currentTime={currentTime}
              completedElements={completedElements}
              onElementComplete={handleElementComplete}
              onElementInteraction={handleElementInteraction}
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-gray-50 overflow-y-auto">
            <ProgressTracker
              progress={progress}
              onAddBookmark={handleAddBookmark}
              onJumpToBookmark={handleJumpToTime}
              onJumpToTime={handleJumpToTime}
            />
          </div>
        </div>

        {/* Media Navigation */}
        {convertedMediaAssets.length > 1 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-2 overflow-x-auto">
              {convertedMediaAssets.map((media, index) => (
                <Button
                  key={media.id}
                  variant={index === currentMediaIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentMediaIndex(index)}
                  className="flex-shrink-0"
                >
                  {media.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}