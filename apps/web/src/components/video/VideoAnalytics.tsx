import React from "react";
import { BarChart3, Clock, Play, Target, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@fitness-league/ui";
import { cn } from "@fitness-league/ui";

export interface VideoAnalytics {
  videoId: string;
  userId: string;
  watchTime: number; // in minutes
  completionRate: number; // percentage
  lastWatched: Date;
  totalViews: number;
  averageWatchTime: number;
  category: string;
  difficulty: string;
}

export interface UserVideoStats {
  totalWatchTime: number; // in minutes
  totalVideosWatched: number;
  averageCompletionRate: number;
  favoriteCategory: string;
  weeklyGoal: number;
  weeklyProgress: number;
  streak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: "streak" | "time" | "completion" | "variety";
}

interface VideoAnalyticsProps {
  userStats: UserVideoStats;
  recentVideos: VideoAnalytics[];
  weeklyData: { date: string; watchTime: number }[];
  className?: string;
}

export function VideoAnalytics({
  userStats,
  recentVideos,
  weeklyData,
  className,
}: VideoAnalyticsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600";
    if (streak >= 14) return "text-blue-600";
    if (streak >= 7) return "text-green-600";
    return "text-gray-600";
  };

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case "streak": return "🔥";
      case "time": return "⏰";
      case "completion": return "✅";
      case "variety": return "🎯";
      default: return "🏆";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Video Analytics</h2>
        <p className="text-gray-600">Track your workout video progress and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Watch Time</p>
                <p className="text-2xl font-bold">{formatTime(userStats.totalWatchTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Videos Watched</p>
                <p className="text-2xl font-bold">{userStats.totalVideosWatched}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(userStats.averageCompletionRate)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className={cn("text-2xl font-bold", getStreakColor(userStats.streak))}>
                  {userStats.streak} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">This Week</span>
                <span className="text-sm text-gray-600">
                  {formatTime(userStats.weeklyProgress)} / {formatTime(userStats.weeklyGoal)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((userStats.weeklyProgress / userStats.weeklyGoal) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600">
                {Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100)}% of weekly goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-2">
                {userStats.favoriteCategory === "cardio" && "🏃‍♀️"}
                {userStats.favoriteCategory === "strength" && "💪"}
                {userStats.favoriteCategory === "yoga" && "🧘‍♀️"}
                {userStats.favoriteCategory === "hiit" && "⚡"}
                {userStats.favoriteCategory === "pilates" && "🤸‍♀️"}
                {userStats.favoriteCategory === "mobility" && "🔄"}
              </div>
              <p className="text-lg font-medium capitalize">{userStats.favoriteCategory}</p>
              <p className="text-sm text-gray-600">Most watched category</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentVideos.slice(0, 5).map((video) => (
              <div key={video.videoId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                    {video.category.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Video {video.videoId.slice(0, 8)}</p>
                    <p className="text-xs text-gray-600 capitalize">{video.category} • {video.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{formatTime(video.watchTime)}</p>
                    <p className="text-xs text-gray-600">Watch time</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{Math.round(video.completionRate)}%</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {userStats.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userStats.achievements.slice(0, 4).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className="text-2xl">{getAchievementIcon(achievement.category)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
