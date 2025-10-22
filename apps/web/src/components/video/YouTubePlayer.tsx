import React, { useEffect, useRef, useState } from "react";
import { cn } from "@fitness-league/ui";

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
  className,
  width = "100%",
  height = "auto",
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
          onReady?.();
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            onEnd?.();
          }
        },
        onError: (event: any) => {
          setHasError(true);
          onError?.(`YouTube player error: ${event.data}`);
        },
      },
    });

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId, onReady, onEnd, onError]);

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
    <div className={cn("relative w-full", className)}>
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
