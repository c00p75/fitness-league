import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, List, X, CheckCircle } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from "@fitness-league/ui";
import { cn } from "@fitness-league/ui";
import { YouTubePlayer } from "./YouTubePlayer";
import { WorkoutPlaylist } from "./PlaylistManager";

interface PlaylistPlayerProps {
  playlist: WorkoutPlaylist;
  onClose: () => void;
  onVideoComplete?: (videoId: string) => void;
  onPlaylistComplete?: (playlistId: string) => void;
  className?: string;
}

export function PlaylistPlayer({
  playlist,
  onClose,
  onVideoComplete,
  onPlaylistComplete,
  className,
}: PlaylistPlayerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [showPlaylist, setShowPlaylist] = useState(false);
  // Removed unused videoProgress

  const currentVideo = playlist.videos[currentVideoIndex];
  const progress = ((currentVideoIndex + 1) / playlist.videos.length) * 100;

  useEffect(() => {
    if (currentVideoIndex >= playlist.videos.length) {
      onPlaylistComplete?.(playlist.id);
    }
  }, [currentVideoIndex, playlist.videos.length, playlist.id, onPlaylistComplete]);

  const handleVideoComplete = () => {
    if (currentVideo) {
      setCompletedVideos(prev => new Set([...prev, currentVideo.id]));
      onVideoComplete?.(currentVideo.id);
      
      // Auto-advance to next video
      if (currentVideoIndex < playlist.videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
        // Removed unused setVideoProgress call
      }
    }
  };

  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress);
  };

  const handleNext = () => {
    if (currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      // Removed unused setVideoProgress call
    }
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
      // Removed unused setVideoProgress call
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    // Removed unused setVideoProgress call
    setShowPlaylist(false);
  };

  // Removed unused formatTime function

  if (!currentVideo) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Playlist Complete!</h3>
          <p className="text-gray-600 mb-4">Great job finishing all the videos</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{playlist.name}</h2>
          <p className="text-sm text-gray-600">
            Video {currentVideoIndex + 1} of {playlist.videos.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex items-center space-x-1"
          >
            <List className="w-4 h-4" />
            <span>Playlist</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Overall Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Video Player */}
      <div className="relative">
        <YouTubePlayer
          videoId={currentVideo.youtubeVideoId || ""}
          autoplay={isPlaying}
          onReady={() => setIsPlaying(true)}
          onComplete={handleVideoComplete}
          onProgress={handleVideoProgress}
          trackProgress={true}
          showControls={true}
          allowFullscreen={true}
          className="w-full"
        />
      </div>

      {/* Video Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{currentVideo.name}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {currentVideo.category} • {currentVideo.difficulty} • {currentVideo.duration} min
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {completedVideos.has(currentVideo.id) && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentVideoIndex === 0}
          className="flex items-center space-x-1"
        >
          <SkipBack className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center space-x-1"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentVideoIndex === playlist.videos.length - 1}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Playlist Sidebar */}
      {showPlaylist && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Playlist ({playlist.videos.length} videos)</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {playlist.videos.map((video, index) => (
                <div
                  key={video.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                    index === currentVideoIndex
                      ? "bg-blue-100 border border-blue-200"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleVideoSelect(index)}
                >
                  <div className="flex-shrink-0">
                    {completedVideos.has(video.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{video.name}</p>
                    <p className="text-xs text-gray-600">
                      {video.duration} min • {video.difficulty}
                    </p>
                  </div>
                  {index === currentVideoIndex && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
