import { db, auth } from '../../lib/firebase';
import { 
  doc, 
  getDoc,
  setDoc,
  collection,
  addDoc,
  Timestamp
} from 'firebase/firestore';

const PROJECT_ID = "fit-league-930c6";

async function getUserId(): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  return uid;
}

/**
 * Get onboarding status
 */
export async function getOnboardingStatus() {
  const uid = await getUserId();
  
  const onboardingRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/onboarding/data`);
  const onboardingDoc = await getDoc(onboardingRef);
  
  if (!onboardingDoc.exists()) {
    return {
      isCompleted: false,
      experienceLevel: "beginner",
      fitnessGoals: ["general_fitness"],
    };
  }
  
  const data = onboardingDoc.data();
  return {
    ...data,
    completedAt: data.completedAt?.toDate?.(),
    createdAt: data.createdAt?.toDate?.(),
  };
}

/**
 * Submit onboarding data and create initial goal
 */
export async function submitOnboarding(updates: {
  fitnessGoals: string[];
  experienceLevel: string;
  availableTime: number;
  workoutPreferences?: any;
  biometrics?: any;
  [key: string]: any;
}) {
  const uid = await getUserId();
  
  const onboardingRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/onboarding/data`);
  
  const onboardingData = {
    ...updates,
    userId: uid,
    isCompleted: true,
    completedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  await setDoc(onboardingRef, onboardingData);
  
  // Create initial goal based on onboarding data
  await createInitialGoal(updates);
  
  return {
    success: true,
    message: "Onboarding completed successfully",
  };
}

/**
 * Create initial goal based on onboarding preferences
 */
async function createInitialGoal(onboardingData: {
  fitnessGoals: string[];
  experienceLevel: string;
  availableTime: number;
  biometrics?: any;
}) {
  const uid = await getUserId();
  const goalsRef = collection(db, `artifacts/${PROJECT_ID}/users/${uid}/goals`);
  
  // Get the primary fitness goal
  const primaryGoal = onboardingData.fitnessGoals[0] || 'general_fitness';
  
  // Calculate target date (12 weeks from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + (12 * 7));
  
  // Define goal configurations based on fitness goal type
  const goalConfigs: Record<string, { targetValue: number; unit: string; description: string }> = {
    weight_loss: {
      targetValue: onboardingData.biometrics?.weight ? Math.max(5, onboardingData.biometrics.weight * 0.1) : 10,
      unit: 'kg',
      description: 'Lose weight'
    },
    muscle_gain: {
      targetValue: onboardingData.biometrics?.weight ? Math.max(3, onboardingData.biometrics.weight * 0.05) : 5,
      unit: 'kg',
      description: 'Gain muscle mass'
    },
    flexibility: {
      targetValue: 30,
      unit: 'minutes',
      description: 'Improve flexibility'
    },
    general_fitness: {
      targetValue: 12,
      unit: 'weeks',
      description: 'Improve overall fitness'
    },
    endurance_improvement: {
      targetValue: 30,
      unit: 'minutes',
      description: 'Improve endurance'
    },
    strength_gain: {
      targetValue: 20,
      unit: '%',
      description: 'Increase strength'
    }
  };
  
  const config = goalConfigs[primaryGoal] || goalConfigs.general_fitness;
  
  const initialGoal = {
    type: primaryGoal,
    targetValue: config.targetValue,
    unit: config.unit,
    targetDate: Timestamp.fromDate(targetDate),
    durationWeeks: 12,
    currentValue: 0,
    isActive: true,
    userId: uid,
    description: config.description,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(goalsRef, initialGoal);
  
  return {
    id: docRef.id,
    ...initialGoal
  };
}

