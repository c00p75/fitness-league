import { useState } from "react";
import { Plus, Play, Trash2, Edit, Share, Clock, Users, Lock, Unlock } from "lucide-react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge } from "@fitness-league/ui";
import { cn } from "@fitness-league/ui";

export interface WorkoutPlaylist {
  id: string;
  name: string;
  description: string;
  videos: Exercise[];
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalDuration?: number;
  difficulty?: string;
  category?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: string;
  youtubeVideoId?: string;
  videoThumbnail?: string;
}

interface PlaylistManagerProps {
  playlists: WorkoutPlaylist[];
  onCreatePlaylist: (playlist: Omit<WorkoutPlaylist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePlaylist: (id: string, playlist: Partial<WorkoutPlaylist>) => void;
  onDeletePlaylist: (id: string) => void;
  onPlayPlaylist: (playlist: WorkoutPlaylist) => void;
  className?: string;
}

export function PlaylistManager({
  playlists,
  onCreatePlaylist,
  onUpdatePlaylist,
  onDeletePlaylist,
  onPlayPlaylist,
  className,
}: PlaylistManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    isPublic: false,
    videos: [] as Exercise[],
  });

  const handleCreatePlaylist = () => {
    if (!newPlaylist.name.trim()) return;

    onCreatePlaylist({
      ...newPlaylist,
      createdBy: "current-user", // This would come from auth context
    });

    setNewPlaylist({
      name: "",
      description: "",
      isPublic: false,
      videos: [],
    });
    setShowCreateForm(false);
  };

  const handleEditPlaylist = (playlist: WorkoutPlaylist) => {
    setEditingPlaylist(playlist.id);
    setNewPlaylist({
      name: playlist.name,
      description: playlist.description,
      isPublic: playlist.isPublic,
      videos: playlist.videos,
    });
  };

  const handleUpdatePlaylist = () => {
    if (!editingPlaylist || !newPlaylist.name.trim()) return;

    onUpdatePlaylist(editingPlaylist, {
      name: newPlaylist.name,
      description: newPlaylist.description,
      isPublic: newPlaylist.isPublic,
      videos: newPlaylist.videos,
      updatedAt: new Date(),
    });

    setEditingPlaylist(null);
    setNewPlaylist({
      name: "",
      description: "",
      isPublic: false,
      videos: [],
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Playlists</h2>
          <p className="text-gray-600">Create and manage your workout playlists</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingPlaylist) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPlaylist ? "Edit Playlist" : "Create New Playlist"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Playlist Name</label>
              <Input
                value={newPlaylist.name}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                placeholder="Enter playlist name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                placeholder="Describe your playlist..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newPlaylist.isPublic}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, isPublic: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Make this playlist public
              </label>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist}
                disabled={!newPlaylist.name.trim()}
              >
                {editingPlaylist ? "Update Playlist" : "Create Playlist"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPlaylist(null);
                  setNewPlaylist({
                    name: "",
                    description: "",
                    isPublic: false,
                    videos: [],
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{playlist.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {playlist.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {playlist.isPublic ? (
                    <Unlock className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Playlist Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(playlist.totalDuration || 0)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{playlist.videos.length} videos</span>
                  </div>
                </div>
                {playlist.difficulty && (
                  <Badge className={cn("text-white", getDifficultyColor(playlist.difficulty))}>
                    {playlist.difficulty}
                  </Badge>
                )}
              </div>

              {/* Video Thumbnails Preview */}
              {playlist.videos.length > 0 && (
                <div className="flex space-x-1">
                  {playlist.videos.slice(0, 3).map((video, index) => (
                    <div
                      key={video.id}
                      className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium"
                    >
                      {index + 1}
                    </div>
                  ))}
                  {playlist.videos.length > 3 && (
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                      +{playlist.videos.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => onPlayPlaylist(playlist)}
                    className="flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPlaylist(playlist)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </Button>
                </div>

                <div className="flex space-x-1">
                  {playlist.isPublic && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Handle share functionality
                        navigator.clipboard.writeText(`${window.location.origin}/playlist/${playlist.id}`);
                      }}
                    >
                      <Share className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeletePlaylist(playlist.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {playlists.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first workout playlist to get started
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Your First Playlist
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
