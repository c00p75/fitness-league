import { z } from "zod";

export const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(), // Icon name or emoji
  criteria: z.object({
    type: z.enum(["workout_count", "streak", "calories", "duration", "custom"]),
    value: z.number(),
    timeframe: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
  }),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  category: z.enum(["achievement", "milestone", "streak", "challenge"]),
});

export type Badge = z.infer<typeof BadgeSchema>;

export const badges: Badge[] = [
  // First Time Achievements
  {
    id: "first-workout",
    name: "First Steps",
    description: "Complete your first workout",
    icon: "🏃‍♂️",
    criteria: {
      type: "workout_count",
      value: 1,
      timeframe: "all_time",
    },
    rarity: "common",
    category: "achievement",
  },
  {
    id: "first-week",
    name: "Week Warrior",
    description: "Complete 3 workouts in a week",
    icon: "💪",
    criteria: {
      type: "workout_count",
      value: 3,
      timeframe: "weekly",
    },
    rarity: "uncommon",
    category: "achievement",
  },

  // Streak Badges
  {
    id: "streak-3",
    name: "Getting Started",
    description: "3-day workout streak",
    icon: "🔥",
    criteria: {
      type: "streak",
      value: 3,
      timeframe: "all_time",
    },
    rarity: "common",
    category: "streak",
  },
  {
    id: "streak-7",
    name: "Consistency King",
    description: "7-day workout streak",
    icon: "👑",
    criteria: {
      type: "streak",
      value: 7,
      timeframe: "all_time",
    },
    rarity: "uncommon",
    category: "streak",
  },
  {
    id: "streak-30",
    name: "Unstoppable",
    description: "30-day workout streak",
    icon: "⚡",
    criteria: {
      type: "streak",
      value: 30,
      timeframe: "all_time",
    },
    rarity: "rare",
    category: "streak",
  },

  // Milestone Badges
  {
    id: "workouts-10",
    name: "Getting Stronger",
    description: "Complete 10 workouts",
    icon: "💯",
    criteria: {
      type: "workout_count",
      value: 10,
      timeframe: "all_time",
    },
    rarity: "common",
    category: "milestone",
  },
  {
    id: "workouts-50",
    name: "Half Century",
    description: "Complete 50 workouts",
    icon: "🎯",
    criteria: {
      type: "workout_count",
      value: 50,
      timeframe: "all_time",
    },
    rarity: "uncommon",
    category: "milestone",
  },
  {
    id: "workouts-100",
    name: "Century Club",
    description: "Complete 100 workouts",
    icon: "🏆",
    criteria: {
      type: "workout_count",
      value: 100,
      timeframe: "all_time",
    },
    rarity: "rare",
    category: "milestone",
  },
  {
    id: "workouts-500",
    name: "Fitness Legend",
    description: "Complete 500 workouts",
    icon: "🌟",
    criteria: {
      type: "workout_count",
      value: 500,
      timeframe: "all_time",
    },
    rarity: "epic",
    category: "milestone",
  },

  // Calorie Badges
  {
    id: "calories-1000",
    name: "Calorie Burner",
    description: "Burn 1,000 calories in a week",
    icon: "🔥",
    criteria: {
      type: "calories",
      value: 1000,
      timeframe: "weekly",
    },
    rarity: "uncommon",
    category: "achievement",
  },
  {
    id: "calories-5000",
    name: "Energy Machine",
    description: "Burn 5,000 calories in a month",
    icon: "⚡",
    criteria: {
      type: "calories",
      value: 5000,
      timeframe: "monthly",
    },
    rarity: "rare",
    category: "achievement",
  },

  // Duration Badges
  {
    id: "duration-60",
    name: "Hour Power",
    description: "Complete a 60-minute workout",
    icon: "⏰",
    criteria: {
      type: "duration",
      value: 60,
      timeframe: "all_time",
    },
    rarity: "uncommon",
    category: "achievement",
  },
  {
    id: "duration-120",
    name: "Marathon Mindset",
    description: "Complete a 2-hour workout",
    icon: "🏃‍♀️",
    criteria: {
      type: "duration",
      value: 120,
      timeframe: "all_time",
    },
    rarity: "rare",
    category: "achievement",
  },

  // Special Challenge Badges
  {
    id: "perfect-week",
    name: "Perfect Week",
    description: "Work out every day for a week",
    icon: "✨",
    criteria: {
      type: "workout_count",
      value: 7,
      timeframe: "weekly",
    },
    rarity: "epic",
    category: "challenge",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Complete 10 morning workouts",
    icon: "🌅",
    criteria: {
      type: "custom",
      value: 10,
      timeframe: "all_time",
    },
    rarity: "uncommon",
    category: "achievement",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Complete 10 evening workouts",
    icon: "🦉",
    criteria: {
      type: "custom",
      value: 10,
      timeframe: "all_time",
    },
    rarity: "uncommon",
    category: "achievement",
  },
];
