// Exercise data from seeding package
// Extracted to avoid firebase-admin dependencies in browser

export const exercises = [
  // Cardio Exercises
  {
    id: "cardio-001",
    name: "Morning Jog",
    category: "cardio" as const,
    description: "A steady-paced jog to get your heart rate up and start your day with energy.",
    duration: 30,
    calorieEstimate: 8,
    difficulty: "beginner" as const,
    equipment: ["none"],
    instructions: [
      "Start with a 5-minute warm-up walk",
      "Begin jogging at a comfortable pace",
      "Maintain steady breathing",
      "Cool down with a 5-minute walk"
    ],
    youtubeVideoId: "IODxDxX7oi4",
    videoThumbnail: "https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg",
    videoDuration: 180,
    muscleGroups: ["legs", "core", "cardiovascular"],
  },
  {
    id: "cardio-002", 
    name: "HIIT Burpees",
    category: "hiit" as const,
    description: "High-intensity interval training with burpees for maximum calorie burn.",
    duration: 20,
    calorieEstimate: 12,
    difficulty: "intermediate" as const,
    equipment: ["none"],
    instructions: [
      "Start in standing position",
      "Drop to squat, place hands on floor",
      "Jump feet back to plank position",
      "Do a push-up",
      "Jump feet back to squat",
      "Jump up with arms overhead"
    ],
    youtubeVideoId: "TU8QYVW0gDU",
    videoThumbnail: "https://img.youtube.com/vi/TU8QYVW0gDU/hqdefault.jpg",
    videoDuration: 120,
    muscleGroups: ["full_body", "core", "cardiovascular"],
  },
  {
    id: "strength-001",
    name: "Push-ups",
    category: "strength" as const,
    description: "Classic bodyweight exercise for upper body strength.",
    duration: 15,
    calorieEstimate: 6,
    difficulty: "intermediate" as const,
    equipment: ["none"],
    instructions: [
      "Start in plank position",
      "Lower body until chest nearly touches floor",
      "Push back up to starting position",
      "Keep core tight throughout"
    ],
    youtubeVideoId: "IODxDxX7oi4",
    videoThumbnail: "https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg",
    videoDuration: 90,
    muscleGroups: ["chest", "triceps", "shoulders", "core"],
  },
  {
    id: "strength-002",
    name: "Squats",
    category: "strength" as const,
    description: "Fundamental lower body exercise for leg strength.",
    duration: 20,
    calorieEstimate: 8,
    difficulty: "beginner" as const,
    equipment: ["none"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower body as if sitting back into chair",
      "Keep knees behind toes",
      "Return to standing position"
    ],
    youtubeVideoId: "1xMaFs0L3ao",
    videoThumbnail: "https://img.youtube.com/vi/1xMaFs0L3ao/hqdefault.jpg",
    videoDuration: 120,
    muscleGroups: ["legs", "glutes", "core"],
  },
  {
    id: "strength-003",
    name: "Plank",
    category: "strength" as const,
    description: "Isometric core strengthening exercise.",
    duration: 10,
    calorieEstimate: 4,
    difficulty: "beginner" as const,
    equipment: ["none"],
    instructions: [
      "Start in push-up position",
      "Lower to forearms",
      "Keep body in straight line",
      "Hold position"
    ],
    youtubeVideoId: "pSHjTRCQxIw",
    videoThumbnail: "https://img.youtube.com/vi/pSHjTRCQxIw/hqdefault.jpg",
    videoDuration: 60,
    muscleGroups: ["core", "shoulders", "back"],
  },
  // Add more exercises as needed for diversity
  {
    id: "strength-004",
    name: "Lunges",
    category: "strength" as const,
    description: "Single-leg exercise for lower body strength and balance.",
    duration: 20,
    calorieEstimate: 7,
    difficulty: "beginner" as const,
    equipment: ["none"],
    instructions: [
      "Step forward with one leg",
      "Lower back knee toward ground",
      "Push back to starting position",
      "Alternate legs"
    ],
    youtubeVideoId: "COKYKgQ8KR0",
    videoThumbnail: "https://img.youtube.com/vi/COKYKgQ8KR0/hqdefault.jpg",
    videoDuration: 90,
    muscleGroups: ["legs", "glutes", "core"],
  },
];

