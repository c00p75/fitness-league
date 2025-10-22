import { UserProfile, Biometrics, OnboardingInput } from "@fitness-league/shared";

export const demoUserProfile: UserProfile = {
  uid: "demo-user-123",
  email: "demo@fitnessteam.com",
  displayName: "Demo User",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  biometrics: {
    age: 28,
    height: 175, // cm
    weight: 70, // kg
    gender: "other",
  },
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

export const demoUserBiometrics: Biometrics = {
  age: 28,
  height: 175,
  weight: 70,
  gender: "other",
};

export const demoUserOnboarding: OnboardingInput = {
  fitnessGoal: "build_strength",
  experienceLevel: "intermediate",
  biometrics: demoUserBiometrics,
  workoutPreferences: {
    preferredDuration: 45,
    weeklyFrequency: 4,
    availableEquipment: ["dumbbells", "resistance_bands", "yoga_mat"],
    preferredTimeOfDay: "evening",
  },
};

export const demoUserGoals = [
  {
    id: "goal-001",
    userId: "demo-user-123",
    type: "strength_gain" as const,
    targetValue: 5, // 5 more reps on bench press
    currentValue: 0,
    unit: "reps",
    startDate: new Date("2024-01-01"),
    targetDate: new Date("2024-03-01"),
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "goal-002", 
    userId: "demo-user-123",
    type: "weight_loss" as const,
    targetValue: 5, // lose 5kg
    currentValue: 0,
    unit: "kg",
    startDate: new Date("2024-01-01"),
    targetDate: new Date("2024-06-01"),
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const demoUserWorkoutLogs = [
  {
    id: "workout-001",
    userId: "demo-user-123",
    activityType: "strength",
    startTime: new Date("2024-01-15T18:00:00Z"),
    duration: 45,
    distance: 0,
    caloriesBurned: 320,
    exercises: [
      {
        exerciseId: "strength-001",
        sets: 3,
        reps: 12,
        weight: 0,
        duration: 15,
      },
      {
        exerciseId: "strength-002", 
        sets: 3,
        reps: 15,
        weight: 0,
        duration: 20,
      },
    ],
    notes: "Great workout! Felt strong today.",
    createdAt: new Date("2024-01-15T18:45:00Z"),
  },
  {
    id: "workout-002",
    userId: "demo-user-123", 
    activityType: "cardio",
    startTime: new Date("2024-01-17T07:00:00Z"),
    duration: 30,
    distance: 5.2, // km
    caloriesBurned: 240,
    exercises: [
      {
        exerciseId: "cardio-001",
        sets: 1,
        reps: 1,
        weight: 0,
        duration: 30,
      },
    ],
    notes: "Morning run felt amazing!",
    createdAt: new Date("2024-01-17T07:30:00Z"),
  },
];

export const demoUserBadges = [
  {
    id: "user-badge-001",
    userId: "demo-user-123",
    badgeId: "first-workout",
    achievedAt: new Date("2024-01-15T18:45:00Z"),
  },
  {
    id: "user-badge-002",
    userId: "demo-user-123", 
    badgeId: "streak-3",
    achievedAt: new Date("2024-01-20T19:00:00Z"),
  },
];
