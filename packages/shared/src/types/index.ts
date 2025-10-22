// Re-export all types for convenience
export type { LoginInput, SignupInput, AuthToken } from "../schemas/auth";
export type { Biometrics, UserProfile, UpdateProfileInput } from "../schemas/user";
export type { 
  FitnessGoal, 
  ExperienceLevel, 
  WorkoutPreferences, 
  OnboardingInput, 
  OnboardingStatus 
} from "../schemas/onboarding";
export type { GoalType, Goal, CreateGoalInput, UpdateGoalInput } from "../schemas/goal";

// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Firebase-specific types
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
