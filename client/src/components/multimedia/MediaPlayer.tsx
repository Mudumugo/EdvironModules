import { useMediaPlayer, MediaContent, ViewerSettings, QUALITY_OPTIONS, PLAYBACK_SPEEDS } from "@/hooks/useMediaPlayer";
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

interface MediaPlayerProps {
  content: MediaContent;
  settings: ViewerSettings;
  onSettingsChange: (settings: Partial<ViewerSettings>) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onInteraction?: (interaction: any) => void;
}

export default function MediaPlayer({ 
  content, 
  settings, 
  onSettingsChange, 
  onTimeUpdate,
  onInteraction 
}: MediaPlayerProps) {
  const {
    mediaRef,
    containerRef,
    isPlaying,
    currentTime,
    duration,
    showControls,
    showSettings,
    isFullscreen,
    isMuted,
    isLoading,
    settings: playerSettings,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    toggleMute,
    setVolume,
    toggleFullscreen,
    updateSettings,
    setShowControls,
    setShowSettings,
    handleMouseMove,
    formatTime,
    progress
  } = useMediaPlayer(content, settings, onTimeUpdate, onInteraction);

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    seek(percentage * duration);
  };

  const handleVolumeChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    setVolume(percentage);
  };

  const handleSettingsChange = (key: keyof ViewerSettings, value: any) => {
    const newSettings = { ...playerSettings, [key]: value };
    updateSettings({ [key]: value });
    onSettingsChange(newSettings);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Media Element */}
      {content.type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={content.url}
          className="w-full h-full object-contain"
          poster={content.thumbnail}
        />
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={content.url}
          />
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium">{content.title}</h3>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-4 text-white min-w-48">
            <h4 className="font-medium mb-3">Settings</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Quality</label>
                <Select 
                  value={playerSettings.quality} 
                  onValueChange={(value) => handleSettingsChange('quality', value)}
                >
                  <SelectTrigger className="bg-black/50 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-1">Playback Speed</label>
                <Select 
                  value={playerSettings.playbackSpeed.toString()} 
                  onValueChange={(value) => handleSettingsChange('playbackSpeed', parseFloat(value))}
                >
                  <SelectTrigger className="bg-black/50 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAYBACK_SPEEDS.map(speed => (
                      <SelectItem key={speed} value={speed.toString()}>
                        {speed}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skipBackward(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => skipForward(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <div 
                  className="w-20 h-1 bg-white/20 rounded-full cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${playerSettings.volume * 100}%` }}
                  />
                </div>
              </div>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}