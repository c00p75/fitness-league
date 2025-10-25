import React, { useEffect, useRef, useState } from "react";
import { cn } from "@fitness-league/ui";
import { Button } from "@fitness-league/ui";
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, RotateCcw } from "lucide-react";

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  startTime?: number;
  endTime?: number;
  controls?: boolean;
  loop?: boolean;
  modestbranding?: boolean;
  onReady?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onQualityChange?: (quality: string) => void;
  onSpeedChange?: (speed: number) => void;
  showControls?: boolean;
  allowFullscreen?: boolean;
  trackProgress?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function YouTubePlayer({
  videoId,
  autoplay = false,
  startTime = 0,
  endTime,
  controls = true,
  loop = false,
  modestbranding = true,
  onReady,
  onEnd,
  onError,
  onProgress,
  onComplete,
  onQualityChange,
  onSpeedChange,
  showControls = true,
  allowFullscreen = true,
  trackProgress = false,
  className,
  width = "100%",
  height = "auto",
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate embed URL with parameters
  const embedUrl = React.useMemo(() => {
    const params = new URLSearchParams();
    
    if (autoplay) params.set('autoplay', '1');
    if (startTime > 0) params.set('start', startTime.toString());
    if (endTime) params.set('end', endTime.toString());
    if (!controls) params.set('controls', '0');
    if (loop) params.set('loop', '1');
    if (modestbranding) params.set('modestbranding', '1');
    
    // Enable JavaScript API
    params.set('enablejsapi', '1');
    params.set('origin', window.location.origin);
    
    const queryString = params.toString();
    return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
  }, [videoId, autoplay, startTime, endTime, controls, loop, modestbranding]);

  // Handle iframe load events
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      onReady?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.('Failed to load YouTube video');
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [onReady, onError]);

  // Handle YouTube API events (if available)
  useEffect(() => {
    if (!window.YT || !window.YT.Player || !iframeRef.current) return;

    const player = new window.YT.Player(iframeRef.current, {
      events: {
        onReady: () => {
          setIsLoading(false);
          setDuration(player.getDuration());
          onReady?.();
        },
        onStateChange: (event: any) => {
          const state = event.data;
          setIsPlaying(state === window.YT.PlayerState.PLAYING);
          
          if (state === window.YT.PlayerState.ENDED) {
            onEnd?.();
            onComplete?.();
          }
        },
        onError: (event: any) => {
          setHasError(true);
          onError?.(`YouTube player error: ${event.data}`);
        },
      },
    });

    // Track progress if enabled
    if (trackProgress) {
      const progressInterval = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
          const time = player.getCurrentTime();
          setCurrentTime(time);
          onProgress?.(time);
        }
      }, 1000);

      return () => {
        clearInterval(progressInterval);
        if (player && typeof player.destroy === 'function') {
          player.destroy();
        }
      };
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId, onReady, onEnd, onError, onProgress, onComplete, trackProgress]);

  // Handle playback speed changes
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    onSpeedChange?.(speed);
    // Note: YouTube API doesn't support speed changes via iframe
    // This would require YouTube Player API implementation
  };

  // Handle volume changes
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Handle fullscreen toggle
  const handleFullscreen = () => {
    if (!allowFullscreen) return;
    
    if (!document.fullscreenElement) {
      iframeRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 rounded-lg",
          "aspect-video w-full",
          className
        )}
        role="img"
        aria-label="Video failed to load"
      >
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600">Video unavailable</p>
          <p className="text-xs text-gray-500 mt-1">
            This video could not be loaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full group", className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-gray-200 animate-pulse rounded-lg",
            "flex items-center justify-center"
          )}
        >
          <div className="text-gray-400">Loading video...</div>
        </div>
      )}

      {/* YouTube iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width={width}
        height={height}
        className={cn(
          "w-full rounded-lg",
          "aspect-video",
          isLoading && "opacity-0"
        )}
        style={{
          aspectRatio: '16/9',
          minHeight: '200px',
        }}
        title={`YouTube video: ${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        aria-label={`YouTube video player for video ${videoId}`}
      />

      {/* Enhanced Controls Overlay */}
      {showControls && !isLoading && !hasError && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar */}
          {trackProgress && duration > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-white text-sm mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-1">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  // Note: This would require YouTube Player API
                  setIsPlaying(!isPlaying);
                }}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              {/* Volume */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => handleVolumeChange(isMuted ? 50 : 0)}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              {/* Settings */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <div className="absolute bottom-full left-0 mb-2 bg-black/90 rounded-lg p-3 min-w-[200px]">
                    {/* Playback Speed */}
                    <div className="mb-3">
                      <label className="text-white text-sm font-medium mb-1 block">Playback Speed</label>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => handleSpeedChange(Number(e.target.value))}
                        className="w-full bg-white/20 text-white rounded px-2 py-1 text-sm"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>

                    {/* Quality */}
                    <div className="mb-3">
                      <label className="text-white text-sm font-medium mb-1 block">Quality</label>
                      <select
                        onChange={(e) => onQualityChange?.(e.target.value)}
                        className="w-full bg-white/20 text-white rounded px-2 py-1 text-sm"
                      >
                        <option value="auto">Auto</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                        <option value="360p">360p</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Restart */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  // Note: This would require YouTube Player API
                  setCurrentTime(0);
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              {/* Fullscreen */}
              {allowFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={handleFullscreen}
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Declare YouTube API types for TypeScript
declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement, config: any) => {
        destroy: () => void;
      };
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}
