# Exercise Generation Fix

## Problem
After migrating to client-side Firestore, workout plans were created without exercises, resulting in "0 exercises" error.

## Solution
Updated `workoutsService.ts` to automatically generate sample exercises when creating a workout plan.

## What Was Changed
- Added `generateSampleExercises()` function to workoutsService.ts
- This function creates exercises based on workout intensity:
  - **Low intensity**: Gentle stretches and bodyweight movements
  - **Moderate intensity**: Squats, push-ups, and planks  
  - **High intensity**: Jump squats, burpees, mountain climbers
- Each workout plan now includes warm-up, main exercises, and cooldown

## Result
Newly generated workout plans now have exercises automatically included!

## Next Steps
To test the fix:
1. Delete any existing workout plans
2. Generate a new workout plan
3. You should see exercises (not "0 exercises")

