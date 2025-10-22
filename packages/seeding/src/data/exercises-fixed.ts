import { z } from "zod";

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["cardio", "strength", "hiit", "yoga", "pilates", "mobility"]),
  description: z.string(),
  duration: z.number(), // in minutes
  calorieEstimate: z.number(), // per minute
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  equipment: z.array(z.enum([
    "none",
    "dumbbells", 
    "resistance_bands",
    "yoga_mat",
    "pull_up_bar",
    "kettlebell",
    "barbell"
  ])),
  instructions: z.array(z.string()),
  youtubeVideoId: z.string().optional(),
  videoThumbnail: z.string().url().optional(),
  videoDuration: z.number().optional(),
  muscleGroups: z.array(z.string()),
  imageUrl: z.string().url().optional(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

export const exercises: Exercise[] = [
  // Cardio Exercises
  {
    id: "cardio-001",
    name: "Morning Jog",
    category: "cardio",
    description: "A steady-paced jog to get your heart rate up and start your day with energy.",
    duration: 30,
    calorieEstimate: 8,
    difficulty: "beginner",
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
    category: "hiit",
    description: "High-intensity interval training with burpees for maximum calorie burn.",
    duration: 20,
    calorieEstimate: 12,
    difficulty: "intermediate",
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
    id: "cardio-003",
    name: "Cycling Workout",
    category: "cardio", 
    description: "Indoor or outdoor cycling for cardiovascular fitness.",
    duration: 45,
    calorieEstimate: 10,
    difficulty: "beginner",
    equipment: ["none"],
    instructions: [
      "Set up your bike properly",
      "Start with 5-minute warm-up",
      "Maintain steady cadence",
      "Include some hills or resistance",
      "Cool down for 5 minutes"
    ],
    muscleGroups: ["legs", "core", "cardiovascular"],
  },

  // Strength Exercises
  {
    id: "strength-001",
    name: "Push-ups",
    category: "strength",
    description: "Classic bodyweight exercise for upper body strength.",
    duration: 15,
    calorieEstimate: 6,
    difficulty: "intermediate",
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
    category: "strength",
    description: "Fundamental lower body exercise for leg strength.",
    duration: 20,
    calorieEstimate: 8,
    difficulty: "beginner",
    equipment: ["none"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower body as if sitting back into chair",
      "Keep knees behind toes",
      "Return to standing position"
    ],
    youtubeVideoId: "YaXPRqUwItQ",
    videoThumbnail: "https://img.youtube.com/vi/YaXPRqUwItQ/hqdefault.jpg",
    videoDuration: 120,
    muscleGroups: ["legs", "glutes", "core"],
  },
  {
    id: "strength-003",
    name: "Plank",
    category: "strength",
    description: "Isometric core strengthening exercise.",
    duration: 10,
    calorieEstimate: 4,
    difficulty: "beginner",
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

  // Yoga Exercises
  {
    id: "yoga-001",
    name: "Sun Salutation",
    category: "yoga",
    description: "Classic yoga flow sequence for flexibility and strength.",
    duration: 20,
    calorieEstimate: 5,
    difficulty: "beginner",
    equipment: ["yoga_mat"],
    instructions: [
      "Start in mountain pose",
      "Reach arms up and back",
      "Fold forward to touch toes",
      "Step back to plank",
      "Lower to cobra pose",
      "Return to downward dog"
    ],
    youtubeVideoId: "ZbtVVYBFCug",
    videoThumbnail: "https://img.youtube.com/vi/ZbtVVYBFCug/hqdefault.jpg",
    videoDuration: 300,
    muscleGroups: ["full_body", "core", "flexibility"],
  },
  {
    id: "yoga-002",
    name: "Warrior Pose",
    category: "yoga",
    description: "Standing yoga pose for strength and balance.",
    duration: 15,
    calorieEstimate: 4,
    difficulty: "beginner",
    equipment: ["yoga_mat"],
    instructions: [
      "Step one foot forward into lunge",
      "Turn back foot 45 degrees",
      "Bend front knee over ankle",
      "Raise arms parallel to floor",
      "Hold and breathe"
    ],
    muscleGroups: ["legs", "core", "balance"],
  },

  // HIIT Exercises
  {
    id: "hiit-001",
    name: "Mountain Climbers",
    category: "hiit",
    description: "High-intensity cardio exercise for full body conditioning.",
    duration: 15,
    calorieEstimate: 10,
    difficulty: "intermediate",
    equipment: ["none"],
    instructions: [
      "Start in plank position",
      "Bring one knee to chest",
      "Quickly switch legs",
      "Maintain fast pace",
      "Keep core tight"
    ],
    youtubeVideoId: "nmwgirgXLYM",
    videoThumbnail: "https://img.youtube.com/vi/nmwgirgXLYM/hqdefault.jpg",
    videoDuration: 60,
    muscleGroups: ["full_body", "core", "cardiovascular"],
  },
  {
    id: "hiit-002",
    name: "Jumping Jacks",
    category: "hiit",
    description: "Classic cardio exercise for warming up and conditioning.",
    duration: 10,
    calorieEstimate: 8,
    difficulty: "beginner",
    equipment: ["none"],
    instructions: [
      "Start standing with feet together",
      "Jump feet apart while raising arms",
      "Jump back to starting position",
      "Maintain steady rhythm"
    ],
    muscleGroups: ["legs", "arms", "cardiovascular"],
  },

  // Strength Exercises
  {
    id: "strength-004",
    name: "Lunges",
    category: "strength",
    description: "Single-leg exercise for lower body strength and balance.",
    duration: 20,
    calorieEstimate: 7,
    difficulty: "beginner",
    equipment: ["none"],
    instructions: [
      "Step forward with one leg",
      "Lower back knee toward ground",
      "Push back to starting position",
      "Alternate legs"
    ],
    youtubeVideoId: "3XDriUn0udo",
    videoThumbnail: "https://img.youtube.com/vi/3XDriUn0udo/hqdefault.jpg",
    videoDuration: 90,
    muscleGroups: ["legs", "glutes", "core"],
  },
  {
    id: "strength-005",
    name: "Resistance Band Rows",
    category: "strength",
    description: "Upper body pulling exercise using resistance bands.",
    duration: 15,
    calorieEstimate: 5,
    difficulty: "beginner",
    equipment: ["resistance_bands"],
    instructions: [
      "Anchor band at chest height",
      "Hold handles with arms extended",
      "Pull elbows back squeezing shoulder blades",
      "Return to starting position"
    ],
    muscleGroups: ["back", "biceps", "shoulders"],
  },
];
