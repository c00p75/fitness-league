import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Search, BarChart3, List, Plus, ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@fitness-league/ui";
import { VideoSearch, VideoFilters } from "../../components/video/VideoSearch";
import { PlaylistManager, WorkoutPlaylist } from "../../components/video/PlaylistManager";
import { VideoAnalytics, UserVideoStats } from "../../components/video/VideoAnalytics";
import { PlaylistPlayer } from "../../components/video/PlaylistPlayer";
import { YouTubePlayer } from "../../components/video/YouTubePlayer";
import { useQuery, useMutation } from "@tanstack/react-query";

export function VideosPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("search");
  const [selectedPlaylist, setSelectedPlaylist] = useState<WorkoutPlaylist | null>(null);
  const [videoFilters, setVideoFilters] = useState<VideoFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Note: Video features not yet implemented
  const searchResults: any[] = [];
  const isSearching = false;
  const playlists: any[] = [];
  const userAnalytics: any = null;
  
  const createPlaylistMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Create playlist - not yet implemented');
      return Promise.resolve();
    },
  });

  const updatePlaylistMutation = useMutation({
    mutationFn: async ({ playlistId, data }: any) => {
      console.log('Update playlist - not yet implemented');
      return Promise.resolve();
    },
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: async (playlistId: string) => {
      console.log('Delete playlist - not yet implemented');
      return Promise.resolve();
    },
  });

  const trackVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Track video - not yet implemented');
      return Promise.resolve();
    },
  });
  
  const refetchPlaylists = () => {};

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters: VideoFilters) => {
    setVideoFilters(filters);
  };

  const handleCreatePlaylist = (playlist: Omit<WorkoutPlaylist, 'id' | 'createdAt' | 'updatedAt'>) => {
    createPlaylistMutation.mutate(playlist);
  };

  const handleUpdatePlaylist = (id: string, updates: Partial<WorkoutPlaylist>) => {
    updatePlaylistMutation.mutate({ playlistId: id, updates });
  };

  const handleDeletePlaylist = (id: string) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylistMutation.mutate({ playlistId: id });
    }
  };

  const handlePlayPlaylist = (playlist: WorkoutPlaylist) => {
    setSelectedPlaylist(playlist);
  };

  const handleVideoComplete = (videoId: string) => {
    // Track video completion
    trackVideoMutation.mutate({
      videoId,
      watchTime: 0, // This would be calculated from actual watch time
      completionRate: 100,
      lastWatched: new Date(),
    });
  };

  const handlePlaylistComplete = (playlistId: string) => {
    setSelectedPlaylist(null);
    // Could show completion celebration here
  };

  if (selectedPlaylist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PlaylistPlayer
          playlist={selectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
          onVideoComplete={handleVideoComplete}
          onPlaylistComplete={handlePlaylistComplete}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="bg-[#212121] hover:bg-[#262626] mb-6 py-1 h-fit text-[0.8rem] -mt-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Workout Videos</h1>
            <p className="text-gray-600">
              Discover, organize, and track your fitness journey with our comprehensive video library
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center space-x-2">
            <List className="w-4 h-4" />
            <span>Playlists</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Trending</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <VideoSearch
            onFilter={handleFilter}
            onSearch={handleSearch}
            filters={videoFilters}
          />

          {/* Search Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Search Results</h2>
              {searchResults && (
                <span className="text-sm text-gray-600">
                  {searchResults.total} videos found
                </span>
              )}
            </div>

            {isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gray-200 rounded mb-3" />
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults?.exercises ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.exercises.map((exercise) => (
                  <Card key={exercise.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      {/* Video Thumbnail */}
                      {exercise.youtubeVideoId && (
                        <div className="relative">
                          <img
                            src={`https://img.youtube.com/vi/${exercise.youtubeVideoId}/hqdefault.jpg`}
                            alt={exercise.name}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Play className="w-4 h-4 mr-1" />
                              Watch
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Exercise Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{exercise.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {exercise.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {exercise.category}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {exercise.difficulty}
                            </span>
                          </div>
                          <span className="text-gray-500">{exercise.duration} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No videos found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists">
          <PlaylistManager
            playlists={playlists || []}
            onCreatePlaylist={handleCreatePlaylist}
            onUpdatePlaylist={handleUpdatePlaylist}
            onDeletePlaylist={handleDeletePlaylist}
            onPlayPlaylist={handlePlayPlaylist}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          {userAnalytics ? (
            <VideoAnalytics
              userStats={userAnalytics}
              recentVideos={userAnalytics.recentVideos}
              weeklyData={[]} // This would be populated from actual weekly data
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No analytics data yet</h3>
                <p className="text-gray-600">
                  Start watching videos to see your progress and statistics
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Trending Workout Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Trending videos coming soon</h3>
                <p className="text-gray-600">
                  Discover the most popular workout videos in our community
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
