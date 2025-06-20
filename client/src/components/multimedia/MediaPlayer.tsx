import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw
} from "lucide-react";
import { MediaContent, ViewerSettings, QUALITY_OPTIONS, PLAYBACK_SPEEDS } from "./types";

interface MediaPlayerProps {
  content: MediaContent;
  settings: ViewerSettings;
  onSettingsChange: (settings: Partial<ViewerSettings>) => void;
  onTimeUpdate: (currentTime: number) => void;
  onInteraction: (interaction: any) => void;
}

export function MediaPlayer({ 
  content, 
  settings, 
  onSettingsChange, 
  onTimeUpdate,
  onInteraction 
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const mediaRef = content.type === 'video' ? videoRef : audioRef;

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleTimeUpdate = () => {
      const time = media.currentTime;
      setCurrentTime(time);
      onTimeUpdate(time);
    };

    const handleDurationChange = () => {
      setDuration(media.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onInteraction({ type: 'play', timestamp: media.currentTime });
    };

    const handlePause = () => {
      setIsPlaying(false);
      onInteraction({ type: 'pause', timestamp: media.currentTime });
    };

    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('durationchange', handleDurationChange);
    media.addEventListener('play', handlePlay);
    media.addEventListener('pause', handlePause);

    return () => {
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('durationchange', handleDurationChange);
      media.removeEventListener('play', handlePlay);
      media.removeEventListener('pause', handlePause);
    };
  }, [mediaRef, onTimeUpdate, onInteraction]);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const media = mediaRef.current;
    if (!media || !duration) return;

    const time = (value[0] / 100) * duration;
    media.currentTime = time;
    setCurrentTime(time);
    onInteraction({ type: 'seek', timestamp: time });
  };

  const handleVolumeChange = (value: number[]) => {
    const media = mediaRef.current;
    if (!media) return;

    const volume = value[0] / 100;
    media.volume = volume;
    onSettingsChange({ volume });
    onInteraction({ type: 'volume', data: { volume } });
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = !media.muted;
    onSettingsChange({ volume: media.muted ? 0 : settings.volume });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      onSettingsChange({ fullscreen: true });
    } else {
      document.exitFullscreen();
      onSettingsChange({ fullscreen: false });
    }
    onInteraction({ type: 'fullscreen', data: { fullscreen: !settings.fullscreen } });
  };

  const skip = (seconds: number) => {
    const media = mediaRef.current;
    if (!media) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    media.currentTime = newTime;
    setCurrentTime(newTime);
    onInteraction({ type: 'seek', timestamp: newTime });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="relative group">
      <CardContent className="p-0">
        <div 
          className="relative bg-black"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {content.type === 'video' ? (
            <video
              ref={videoRef}
              src={content.url}
              className="w-full h-auto max-h-96"
              autoPlay={settings.autoplay}
              volume={settings.volume}
              onClick={togglePlay}
            />
          ) : content.type === 'audio' ? (
            <div className="w-full h-48 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <audio
                ref={audioRef}
                src={content.url}
                autoPlay={settings.autoplay}
                volume={settings.volume}
              />
              <div className="text-center text-white">
                <div className="text-2xl mb-2">🎵</div>
                <h3 className="text-lg font-medium">{content.title}</h3>
                <p className="text-sm opacity-75">Audio Content</p>
              </div>
            </div>
          ) : (
            <img 
              src={content.url} 
              alt={content.title}
              className="w-full h-auto max-h-96 object-contain"
            />
          )}

          {/* Media Controls Overlay */}
          {(content.type === 'video' || content.type === 'audio') && (
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Progress Bar */}
              <div className="mb-4">
                <div 
                  className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    handleSeek([percentage]);
                  }}
                >
                  <div 
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skip(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skip(-5)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skip(5)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skip(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {settings.volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div 
                      className="w-20 h-2 bg-white/20 rounded-full cursor-pointer flex items-center"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = (x / rect.width) * 100;
                        handleVolumeChange([percentage]);
                      }}
                    >
                      <div 
                        className="h-full bg-white rounded-full"
                        style={{ width: `${settings.volume * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Settings */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>

                  {/* Fullscreen (Video only) */}
                  {content.type === 'video' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {settings.fullscreen ? (
                        <Minimize className="h-4 w-4" />
                      ) : (
                        <Maximize className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute top-4 right-4 bg-black/90 rounded-lg p-4 text-white min-w-48">
              <h4 className="font-medium mb-3">Settings</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-300">Playback Speed</label>
                  <Select
                    value={settings.playbackSpeed.toString()}
                    onValueChange={(value) => {
                      const speed = parseFloat(value);
                      if (mediaRef.current) {
                        mediaRef.current.playbackRate = speed;
                      }
                      onSettingsChange({ playbackSpeed: speed });
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAYBACK_SPEEDS.map((speed) => (
                        <SelectItem key={speed.value} value={speed.value.toString()}>
                          {speed.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {content.type === 'video' && (
                  <div>
                    <label className="text-sm text-gray-300">Quality</label>
                    <Select
                      value={settings.quality}
                      onValueChange={(value) => onSettingsChange({ quality: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALITY_OPTIONS.map((quality) => (
                          <SelectItem key={quality.value} value={quality.value}>
                            {quality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-medium text-lg">{content.title}</h3>
              {content.description && (
                <p className="text-sm text-gray-600 mt-1">{content.description}</p>
              )}
            </div>
            <Badge variant="outline">
              {content.type}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {content.duration && (
              <span>Duration: {formatTime(content.duration)}</span>
            )}
            <span>Format: {content.format}</span>
            <Badge variant="secondary">{content.difficulty}</Badge>
          </div>

          {content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {content.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}