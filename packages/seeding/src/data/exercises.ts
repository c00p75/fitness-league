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
  videoUrl: z.string().url().optional(),
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
    videoUrl: "https://youtube.com/watch?v=example1",
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
    videoUrl: "https://youtube.com/watch?v=example2",
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
  },

  // Strength Exercises
  {
    id: "strength-001",
    name: "Push-ups",
    category: "strength",
    description: "Classic bodyweight exercise for upper body strength.",
    duration: 15,
    calorieEstimate: 6,
    difficulty: "beginner",
    equipment: ["none"],
    instructions: [
      "Start in plank position",
      "Lower chest to ground",
      "Push back up to starting position",
      "Keep core tight throughout"
    ],
    videoUrl: "https://youtube.com/watch?v=example3",
  },
  {
    id: "strength-002",
    name: "Squats",
    category: "strength",
    description: "Fundamental lower body exercise for leg and glute strength.",
    duration: 20,
    calorieEstimate: 7,
    difficulty: "beginner", 
    equipment: ["none"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower down as if sitting in chair",
      "Keep knees behind toes",
      "Return to standing position"
    ],
    videoUrl: "https://youtube.com/watch?v=example4",
  },
  {
    id: "strength-003",
    name: "Dumbbell Rows",
    category: "strength",
    description: "Upper body pulling exercise for back and biceps.",
    duration: 25,
    calorieEstimate: 8,
    difficulty: "intermediate",
    equipment: ["dumbbells"],
    instructions: [
      "Hold dumbbells with neutral grip",
      "Hinge at hips, keep back straight",
      "Pull weights to chest",
      "Lower with control"
    ],
  },

  // Yoga & Mobility
  {
    id: "yoga-001",
    name: "Sun Salutation",
    category: "yoga",
    description: "Classic yoga flow sequence for flexibility and mindfulness.",
    duration: 15,
    calorieEstimate: 4,
    difficulty: "beginner",
    equipment: ["yoga_mat"],
    instructions: [
      "Start in mountain pose",
      "Reach arms up and back",
      "Fold forward to forward fold",
      "Step back to plank",
      "Lower to cobra",
      "Push back to downward dog",
      "Step forward and rise up"
    ],
    videoUrl: "https://youtube.com/watch?v=example5",
  },
  {
    id: "yoga-002",
    name: "Warrior Flow",
    category: "yoga",
    description: "Dynamic yoga sequence building strength and balance.",
    duration: 30,
    calorieEstimate: 5,
    difficulty: "intermediate",
    equipment: ["yoga_mat"],
    instructions: [
      "Start in warrior I",
      "Transition to warrior II",
      "Move to reverse warrior",
      "Flow to warrior III",
      "Return to center"
    ],
  },

  // HIIT Workouts
  {
    id: "hiit-001",
    name: "Tabata Intervals",
    category: "hiit",
    description: "20 seconds work, 10 seconds rest for 8 rounds.",
    duration: 4,
    calorieEstimate: 15,
    difficulty: "advanced",
    equipment: ["none"],
    instructions: [
      "Choose 4 exercises",
      "20 seconds maximum effort",
      "10 seconds rest",
      "Repeat for 8 rounds total"
    ],
  },
  {
    id: "hiit-002",
    name: "Mountain Climbers",
    category: "hiit",
    description: "Fast-paced cardio exercise for full body conditioning.",
    duration: 10,
    calorieEstimate: 10,
    difficulty: "intermediate",
    equipment: ["none"],
    instructions: [
      "Start in plank position",
      "Alternate bringing knees to chest",
      "Maintain plank position",
      "Keep core tight"
    ],
  },

  // Full Body Workouts
  {
    id: "fullbody-001",
    name: "Bodyweight Blast",
    category: "strength",
    description: "Complete full body workout using only bodyweight.",
    duration: 40,
    calorieEstimate: 9,
    difficulty: "intermediate",
    equipment: ["none"],
    instructions: [
      "Warm up for 5 minutes",
      "3 rounds of: 10 push-ups, 15 squats, 20 lunges",
      "3 rounds of: 30 seconds plank, 10 burpees",
      "Cool down and stretch"
    ],
  },
  {
    id: "fullbody-002",
    name: "Resistance Band Circuit",
    category: "strength",
    description: "Full body workout using resistance bands.",
    duration: 35,
    calorieEstimate: 8,
    difficulty: "beginner",
    equipment: ["resistance_bands"],
    instructions: [
      "Warm up with band stretches",
      "Band rows, band squats, band chest press",
      "Band lateral raises, band tricep extensions",
      "Cool down with band stretches"
    ],
  }
];
