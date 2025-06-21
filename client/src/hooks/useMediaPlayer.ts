import { useState, useRef, useEffect, useCallback } from "react";

export interface MediaContent {
  id: string;
  type: 'video' | 'audio';
  url: string;
  title: string;
  duration?: number;
  thumbnail?: string;
  subtitles?: Array<{
    language: string;
    url: string;
  }>;
}

export interface ViewerSettings {
  quality: string;
  playbackSpeed: number;
  volume: number;
  autoplay: boolean;
  loop: boolean;
  showSubtitles: boolean;
  subtitleLanguage: string;
}

export const QUALITY_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "1080p", value: "1080p" },
  { label: "720p", value: "720p" },
  { label: "480p", value: "480p" },
  { label: "360p", value: "360p" }
];

export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function useMediaPlayer(
  content: MediaContent,
  initialSettings: ViewerSettings,
  onTimeUpdate?: (currentTime: number) => void,
  onInteraction?: (interaction: any) => void
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.duration || 0);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<ViewerSettings>(initialSettings);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const mediaRef = content.type === 'video' ? videoRef : audioRef;

  // Initialize media element
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoadedMetadata = () => {
      setDuration(media.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      const time = media.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (settings.loop) {
        media.currentTime = 0;
        media.play();
      }
    };

    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('play', handlePlay);
    media.addEventListener('pause', handlePause);
    media.addEventListener('ended', handleEnded);

    return () => {
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('play', handlePlay);
      media.removeEventListener('pause', handlePause);
      media.removeEventListener('ended', handleEnded);
    };
  }, [content, settings.loop, onTimeUpdate]);

  // Apply settings to media element
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.playbackRate = settings.playbackSpeed;
    media.volume = settings.volume;
    media.loop = settings.loop;
    
    if (settings.autoplay && !isPlaying) {
      media.play().catch(console.error);
    }
  }, [settings, isPlaying]);

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const togglePlay = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play().catch(console.error);
    }

    onInteraction?.({ type: 'playPause', isPlaying: !isPlaying });
  }, [isPlaying, onInteraction]);

  const seek = useCallback((time: number) => {
    const media = mediaRef.current;
    if (!media) return;

    media.currentTime = Math.max(0, Math.min(time, duration));
    onInteraction?.({ type: 'seek', time });
  }, [duration, onInteraction]);

  const skipForward = useCallback((seconds: number = 10) => {
    seek(currentTime + seconds);
  }, [currentTime, seek]);

  const skipBackward = useCallback((seconds: number = 10) => {
    seek(currentTime - seconds);
  }, [currentTime, seek]);

  const toggleMute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    const newMuted = !isMuted;
    media.muted = newMuted;
    setIsMuted(newMuted);

    onInteraction?.({ type: 'mute', isMuted: newMuted });
  }, [isMuted, onInteraction]);

  const setVolume = useCallback((volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    setSettings(prev => ({ ...prev, volume: newVolume }));
    
    onInteraction?.({ type: 'volumeChange', volume: newVolume });
  }, [onInteraction]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const updateSettings = useCallback((newSettings: Partial<ViewerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        skipBackward();
        break;
      case 'ArrowRight':
        event.preventDefault();
        skipForward();
        break;
      case 'KeyM':
        event.preventDefault();
        toggleMute();
        break;
      case 'KeyF':
        event.preventDefault();
        toggleFullscreen();
        break;
    }
  }, [togglePlay, skipBackward, skipForward, toggleMute, toggleFullscreen]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = useCallback((time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    // Refs
    mediaRef,
    containerRef,
    
    // State
    isPlaying,
    currentTime,
    duration,
    showControls,
    showSettings,
    isFullscreen,
    isMuted,
    isLoading,
    settings,
    
    // Actions
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
    handleKeyDown,
    
    // Utilities
    formatTime,
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
  };
}