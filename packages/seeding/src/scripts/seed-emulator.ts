#!/usr/bin/env node

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { exercises } from "../data/exercises.js";
import { badges } from "../data/badges.js";
import { 
  demoUserProfile, 
  demoUserOnboarding, 
  demoUserGoals, 
  demoUserWorkoutLogs,
  demoUserBadges 
} from "../data/demo-user.js";

const PROJECT_ID = "fit-league-930c6";

async function seedEmulator() {
  console.log("🌱 Starting Firebase Emulator seeding...");

  // Initialize Firebase Admin (for emulator, use default credentials)
  if (getApps().length === 0) {
    initializeApp({
      projectId: PROJECT_ID,
    });
  }

  const db = getFirestore();
  
  // Connect to emulator
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
  
  try {
    // Seed exercises
    console.log("📚 Seeding exercises...");
    const exercisesRef = db.collection(`artifacts/${PROJECT_ID}/public/data/exercises`);
    for (const exercise of exercises) {
      await exercisesRef.doc(exercise.id).set(exercise);
    }
    console.log(`✅ Seeded ${exercises.length} exercises`);

    // Seed badges
    console.log("🏆 Seeding badges...");
    const badgesRef = db.collection(`artifacts/${PROJECT_ID}/public/data/badges`);
    for (const badge of badges) {
      await badgesRef.doc(badge.id).set(badge);
    }
    console.log(`✅ Seeded ${badges.length} badges`);

    // Seed demo user profile
    console.log("👤 Seeding demo user...");
    const userRef = db.collection(`artifacts/${PROJECT_ID}/users/${demoUserProfile.uid}/profile`);
    await userRef.doc("main").set(demoUserProfile);
    
    // Seed demo user onboarding
    const onboardingRef = db.collection(`artifacts/${PROJECT_ID}/users/${demoUserProfile.uid}/onboarding`);
    await onboardingRef.doc("data").set({
      ...demoUserOnboarding,
      isCompleted: true,
      completedAt: new Date(),
    });

    // Seed demo user goals
    const goalsRef = db.collection(`artifacts/${PROJECT_ID}/users/${demoUserProfile.uid}/goals`);
    for (const goal of demoUserGoals) {
      await goalsRef.doc(goal.id).set(goal);
    }

    // Seed demo user workout logs
    const workoutLogsRef = db.collection(`artifacts/${PROJECT_ID}/users/${demoUserProfile.uid}/workoutLogs`);
    for (const workout of demoUserWorkoutLogs) {
      await workoutLogsRef.doc(workout.id).set(workout);
    }

    // Seed demo user badges
    const userBadgesRef = db.collection(`artifacts/${PROJECT_ID}/users/${demoUserProfile.uid}/userBadges`);
    for (const userBadge of demoUserBadges) {
      await userBadgesRef.doc(userBadge.id).set(userBadge);
    }

    console.log("✅ Demo user seeded successfully");
    console.log(`📧 Demo user email: ${demoUserProfile.email}`);
    console.log(`🔑 Demo user UID: ${demoUserProfile.uid}`);

    console.log("🎉 Emulator seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding emulator:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEmulator().catch(console.error);
}

export { seedEmulator };
