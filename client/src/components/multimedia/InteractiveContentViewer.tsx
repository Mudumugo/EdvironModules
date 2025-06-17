import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw,
  CheckCircle,
  Clock,
  Target,
  X
} from 'lucide-react';

interface InteractiveElement {
  id: string;
  type: 'quiz' | 'button' | 'hotspot' | 'simulation' | 'assessment';
  position: { x: number; y: number };
  content: any;
  xapiVerb?: string;
  required?: boolean;
}

interface MediaAsset {
  id: string;
  type: 'video' | 'audio';
  url: string;
  duration?: number;
  title?: string;
  subtitles?: string;
}

interface InteractiveContentViewerProps {
  resourceId: number;
  title: string;
  content: string;
  mediaAssets: MediaAsset[];
  interactiveElements: InteractiveElement[];
  xapiEnabled: boolean;
  trackingConfig: any;
  onClose?: () => void;
}

export const InteractiveContentViewer: React.FC<InteractiveContentViewerProps> = ({
  resourceId,
  title,
  content,
  mediaAssets,
  interactiveElements,
  xapiEnabled,
  trackingConfig,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completedElements, setCompletedElements] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // xAPI tracking functions
  const trackActivity = async (statement: any) => {
    if (!xapiEnabled) return;
    
    try {
      await fetch('/api/xapi/statements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: { account: { homePage: window.location.origin, name: 'current-user' } },
          ...statement,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('xAPI tracking error:', error);
    }
  };

  // Initialize xAPI tracking when component mounts
  useEffect(() => {
    if (xapiEnabled) {
      trackActivity({
        verb: { id: 'http://adlnet.gov/expapi/verbs/experienced' },
        object: {
          id: `${window.location.origin}/resource/${resourceId}`,
          definition: {
            name: { 'en-US': title },
            description: { 'en-US': 'Interactive multimedia content' },
            type: 'http://adlnet.gov/expapi/activities/lesson'
          }
        },
        context: {
          platform: 'Edvirons Digital Library',
          language: 'en-US'
        }
      });
    }
  }, [resourceId, title, xapiEnabled]);

  // Track video/audio progress
  const handleTimeUpdate = () => {
    const media = videoRef.current || audioRef.current;
    if (media && xapiEnabled) {
      const currentTime = media.currentTime;
      const duration = media.duration;
      const progressPercent = Math.round((currentTime / duration) * 100);
      
      setCurrentTime(currentTime);
      setProgress(progressPercent);

      // Track progress milestones (25%, 50%, 75%, 100%)
      if (progressPercent === 25 || progressPercent === 50 || progressPercent === 75) {
        trackActivity({
          verb: { id: 'http://adlnet.gov/expapi/verbs/progressed' },
          object: {
            id: `${window.location.origin}/resource/${resourceId}`,
            definition: { name: { 'en-US': title } }
          },
          result: {
            extensions: {
              'http://adlnet.gov/expapi/activities/progress': progressPercent
            }
          }
        });
      }
    }
  };

  // Handle media completion
  const handleMediaEnded = () => {
    if (xapiEnabled) {
      trackActivity({
        verb: { id: 'http://adlnet.gov/expapi/verbs/completed' },
        object: {
          id: `${window.location.origin}/resource/${resourceId}`,
          definition: { name: { 'en-US': title } }
        },
        result: {
          completion: true,
          success: true,
          score: { scaled: 1.0 }
        }
      });
    }
    setIsPlaying(false);
  };

  // Handle interactive element clicks
  const handleElementClick = (element: InteractiveElement) => {
    if (xapiEnabled) {
      trackActivity({
        verb: { id: element.xapiVerb || 'http://adlnet.gov/expapi/verbs/interacted' },
        object: {
          id: `${window.location.origin}/element/${element.id}`,
          definition: {
            name: { 'en-US': `Interactive ${element.type}` },
            type: `http://adlnet.gov/expapi/activities/${element.type}`
          }
        },
        context: {
          parent: [{
            id: `${window.location.origin}/resource/${resourceId}`,
            definition: { name: { 'en-US': title } }
          }]
        }
      });
    }

    // Handle different element types
    switch (element.type) {
      case 'quiz':
      case 'assessment':
        setShowQuiz(element.id);
        break;
      case 'button':
        setCompletedElements(prev => new Set(prev).add(element.id));
        break;
      case 'hotspot':
        // Show additional information
        break;
      case 'simulation':
        // Launch simulation
        break;
    }
  };

  // Quiz completion handler
  const handleQuizComplete = (elementId: string, score: number, answers: any[]) => {
    setCompletedElements(prev => new Set(prev).add(elementId));
    setShowQuiz(null);

    if (xapiEnabled) {
      trackActivity({
        verb: { id: 'http://adlnet.gov/expapi/verbs/answered' },
        object: {
          id: `${window.location.origin}/quiz/${elementId}`,
          definition: {
            name: { 'en-US': 'Interactive Quiz' },
            type: 'http://adlnet.gov/expapi/activities/cmi.interaction'
          }
        },
        result: {
          completion: true,
          success: score >= 0.7,
          score: { scaled: score },
          response: JSON.stringify(answers)
        }
      });
    }
  };

  // Play/pause media
  const togglePlayPause = () => {
    const media = videoRef.current || audioRef.current;
    if (media) {
      if (isPlaying) {
        media.pause();
      } else {
        media.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const media = videoRef.current || audioRef.current;
    if (media) {
      media.muted = !media.muted;
      setIsMuted(!isMuted);
    }
  };

  // Progress calculation
  const overallProgress = Math.round(
    (completedElements.size / Math.max(interactiveElements.length, 1)) * 100
  );

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header with progress and controls */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span className="text-sm">{overallProgress}% Complete</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{completedElements.size}/{interactiveElements.length} Activities</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative overflow-hidden">
        {/* HTML5 Content */}
        <div 
          className="w-full h-full relative"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Video player if video assets exist */}
        {mediaAssets.find(asset => asset.type === 'video') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative bg-black rounded-lg overflow-hidden max-w-4xl max-h-[80vh]">
              <video
                ref={videoRef}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleMediaEnded}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              >
                {mediaAssets
                  .filter(asset => asset.type === 'video')
                  .map(asset => (
                    <source key={asset.id} src={asset.url} />
                  ))}
              </video>
              
              {/* Video controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" onClick={togglePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-xs text-white">
                      {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                    </span>
                    <div className="flex-1 bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-white">
                      {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio player if audio assets exist */}
        {mediaAssets.find(asset => asset.type === 'audio') && (
          <>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleMediaEnded}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            >
              {mediaAssets
                .filter(asset => asset.type === 'audio')
                .map(asset => (
                  <source key={asset.id} src={asset.url} />
                ))}
            </audio>
            
            {/* Audio controls UI */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-sm text-white">
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                  </span>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-white">
                    {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Interactive elements overlay */}
        {interactiveElements.map(element => (
          <button
            key={element.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
              completedElements.has(element.id) 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110`}
            style={{
              left: `${element.position.x}%`,
              top: `${element.position.y}%`
            }}
            onClick={() => handleElementClick(element)}
            title={`${element.type} - ${completedElements.has(element.id) ? 'Completed' : 'Click to interact'}`}
          >
            {completedElements.has(element.id) ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>
        ))}

        {/* Quiz modal */}
        {showQuiz && (
          <QuizModal
            elementId={showQuiz}
            element={interactiveElements.find(e => e.id === showQuiz)}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(null)}
          />
        )}
      </div>

      {/* Footer with overall progress */}
      <div className="bg-gray-900 text-white p-2">
        <div className="flex items-center justify-between text-sm">
          <span>Overall Progress</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-600 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span>{overallProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quiz Modal Component
interface QuizModalProps {
  elementId: string;
  element?: InteractiveElement;
  onComplete: (elementId: string, score: number, answers: any[]) => void;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ elementId, element, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  if (!element?.content?.questions) return null;

  const questions = element.content.questions;
  const question = questions[currentQuestion];

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Calculate score
        const correctAnswers = newAnswers.filter((answer, index) => 
          answer === questions[index].correct
        ).length;
        const score = correctAnswers / questions.length;
        
        onComplete(elementId, score, newAnswers);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-800 mb-4">{question.text}</p>
          
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded border ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Progress: {currentQuestion + 1}/{questions.length}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={selectedAnswer === null}
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveContentViewer;