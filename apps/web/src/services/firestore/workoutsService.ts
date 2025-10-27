import { db, auth } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  where,
  getDocs, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc, 
  doc,
  Timestamp
} from 'firebase/firestore';
import { exercises } from '../../data/exercises';

const PROJECT_ID = "fit-league-930c6";

async function getUserId(): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  return uid;
}

/**
 * Generate sample exercises based on focus areas and intensity
 */
function generateSampleExercises(focusAreas: string[], intensity: string): any[] {
  const workoutExercises: any[] = [];
  
  // Filter exercises based on intensity
  const intensityCategory = intensity === 'low' ? 'beginner' : intensity === 'high' ? 'advanced' : 'intermediate';
  const availableExercises = exercises.filter(ex => ex.difficulty === intensityCategory);
  
  // Add warm-up
  workoutExercises.push({
    exerciseId: 'warmup-1',
    name: 'Dynamic Warm-up',
    sets: 1,
    reps: 5,
    duration: 5,
    restSeconds: 0,
    description: 'Light cardio to prepare muscles'
  });
  
  // Add 3-5 exercises based on intensity
  const exerciseCount = intensity === 'high' ? 5 : intensity === 'moderate' ? 4 : 3;
  
  for (let i = 0; i < Math.min(exerciseCount, availableExercises.length); i++) {
    const exercise = availableExercises[i];
    workoutExercises.push({
      exerciseId: exercise.id,
      name: exercise.name,
      sets: intensity === 'high' ? 4 : intensity === 'moderate' ? 3 : 2,
      reps: intensity === 'high' ? 15 : intensity === 'moderate' ? 12 : 10,
      duration: Math.min(exercise.duration || 10, 15),
      restSeconds: intensity === 'high' ? 90 : intensity === 'moderate' ? 60 : 45,
      description: exercise.description,
      youtubeVideoId: exercise.youtubeVideoId,
      instructions: exercise.instructions,
      muscleGroups: exercise.muscleGroups,
      category: exercise.category
    });
  }
  
  // Add cooldown
  workoutExercises.push({
    exerciseId: 'cooldown-1',
    name: 'Stretching & Cooldown',
    sets: 1,
    reps: 1,
    duration: 10,
    restSeconds: 0,
    description: 'Restore and recover'
  });
  
  return workoutExercises;
}

/**
 * Generate a workout plan (client-side)
 */
export async function generatePlan(planData: {
  goalId: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  duration?: number;
  equipment?: string[];
  timePreference?: string;
  intensity?: string;
  focusAreas?: string[];
  customPlanName?: string;
}) {
  const uid = await getUserId();
  
  // Verify goal exists
  const goalRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/goals/${planData.goalId}`);
  const goalDoc = await getDoc(goalRef);
  
  if (!goalDoc.exists()) {
    throw new Error('Goal not found');
  }
  
  // Create workout plan with basic structure
  const plansRef = collection(db, `artifacts/${PROJECT_ID}/users/${uid}/workoutPlans`);
  
  // Generate sample exercises based on focus areas
  const sampleExercises = generateSampleExercises(planData.focusAreas || [], planData.intensity || 'moderate');
  
  const newPlan = {
    goalId: planData.goalId,
    durationWeeks: planData.durationWeeks,
    workoutsPerWeek: planData.workoutsPerWeek,
    duration: planData.duration || 30,
    equipment: planData.equipment || [],
    timePreference: planData.timePreference || 'evening',
    intensity: planData.intensity || 'moderate',
    focusAreas: planData.focusAreas || [],
    name: planData.customPlanName || 'Custom Workout Plan',
    description: `A ${planData.durationWeeks}-week workout plan`,
    difficulty: 'beginner',
    exercises: sampleExercises,
    userId: uid,
    status: 'active',
    createdAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(plansRef, newPlan);
  
  return {
    id: docRef.id,
    ...newPlan as any
  };
}

/**
 * Get all workout plans for the current user
 */
export async function getPlans(goalId?: string) {
  const uid = await getUserId();
  
  let q: any;
  
  // Filter by goalId if provided
  if (goalId) {
    q = query(
      collection(db, `artifacts/${PROJECT_ID}/users/${uid}/workoutPlans`),
      where('goalId', '==', goalId),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(
      collection(db, `artifacts/${PROJECT_ID}/users/${uid}/workoutPlans`),
      orderBy('createdAt', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any
  }));
}

/**
 * Update a workout plan
 */
export async function updatePlan(planId: string, updates: any) {
  const uid = await getUserId();
  
  const planRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/workoutPlans/${planId}`);
  
  await updateDoc(planRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
  
  return { success: true };
}

/**
 * Delete a workout plan
 */
export async function deletePlan(planId: string) {
  const uid = await getUserId();
  
  const planRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/workoutPlans/${planId}`);
  await deleteDoc(planRef);
  
  return { success: true };
}

/**
 * Get a specific workout plan by ID
 */
export async function getPlan(planId: string) {
  const uid = await getUserId();
  
  const planRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/workoutPlans/${planId}`);
  const planDoc = await getDoc(planRef);
  
  if (!planDoc.exists()) {
    throw new Error('Workout plan not found');
  }
  
  return {
    id: planDoc.id,
    ...planDoc.data() as any
  };
}

