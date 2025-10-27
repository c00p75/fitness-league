import { db, auth } from '../../lib/firebase';
import { 
  doc, 
  getDoc,
  setDoc,
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
 * Submit onboarding data
 */
export async function submitOnboarding(updates: {
  fitnessGoals: string[];
  experienceLevel: string;
  availableTime: number;
  workoutPreferences?: any;
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
  
  return {
    success: true,
    message: "Onboarding completed successfully",
  };
}

