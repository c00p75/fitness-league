/**
 * Type definitions for API responses
 */

export interface Goal {
  id: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string | Date;
  startDate?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  isActive: boolean;
  durationWeeks?: number;
  userId?: string;
}

export interface WorkoutPlan {
  id: string;
  goalId: string;
  userId?: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  duration?: number;
  equipment?: string[];
  intensity?: string;
  customPlanName?: string;
  focusAreas?: string[];
  timePreference?: string;
  status?: string;
  createdAt: string | Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  biometrics?: {
    age: number;
    height: number;
    weight: number;
    gender: string;
  };
  fitnessGoal?: string;
  experienceLevel?: string;
  workoutPreferences?: {
    preferredDuration: number;
    weeklyFrequency: number;
    availableEquipment: string[];
    preferredTimeOfDay: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  equipment: string[];
  instructions: string[];
  muscleGroups: string[];
  duration?: number;
  youtubeVideoId?: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: number;
  description: string;
  category: string;
  tags: string[];
}

export interface WorkoutPlaylist {
  id: string;
  name: string;
  description?: string;
  videos: string[];
  isPublic?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserVideoStats {
  totalWatchTime: number;
  videosWatched: number;
  completionRate: number;
  favoriteCategories: string[];
}

export interface ExerciseRecord {
  exerciseId: string;
  completed: boolean;
  sets: Array<{
    reps?: number;
    weight?: number;
    duration?: number;
  }>;
}

export interface WorkoutSession {
  sessionId: string;
  exercises: ExerciseRecord[];
}

export interface OnboardingData {
  fitnessGoal: string;
  experienceLevel: string;
  workoutPreferences?: {
    preferredDuration: number;
    weeklyFrequency: number;
    availableEquipment: string[];
    preferredTimeOfDay: string;
  };
  isCompleted: boolean;
  completedAt: string | Date;
}

