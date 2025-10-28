import { db, auth } from '../../lib/firebase';
import { 
  doc, 
  getDoc,
  updateDoc,
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
 * Get user profile with onboarding data
 */
export async function getProfile() {
  const uid = await getUserId();
  
  // Fetch profile data
  const profileRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/profile/main`);
  const profileDoc = await getDoc(profileRef);
  
  if (!profileDoc.exists()) {
    throw new Error('User profile not found');
  }
  
  const profileData = profileDoc.data();
  
  // Fetch onboarding data
  const onboardingRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/onboarding/data`);
  const onboardingDoc = await getDoc(onboardingRef);
  
  let onboardingData: any = {};
  if (onboardingDoc.exists()) {
    const onboarding = onboardingDoc.data();
    if (onboarding) {
      onboardingData = {
        fitnessGoal: onboarding.fitnessGoals?.[0] || "general_fitness",
        experienceLevel: onboarding.experienceLevel || "beginner",
        workoutPreferences: {
          preferredDuration: onboarding.availableTime || 30,
          weeklyFrequency: 3,
          availableEquipment: ["none"],
          preferredTimeOfDay: "evening",
        }
      };
    }
  }
  
  // Merge profile and onboarding data
  const mergedData = {
    ...profileData,
    ...onboardingData,
    createdAt: profileData.createdAt?.toDate?.(),
    updatedAt: profileData.updatedAt?.toDate?.(),
  };
  
  return mergedData;
}

/**
 * Update user profile
 */
export async function updateProfile(updates: {
  fitnessGoal?: string;
  experienceLevel?: string;
  workoutPreferences?: any;
  [key: string]: any;
}) {
  const uid = await getUserId();
  
  const { fitnessGoal, experienceLevel, workoutPreferences, ...profileData } = updates;
  
  const profileRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/profile/main`);
  const profileDoc = await getDoc(profileRef);
  
  // If profile doesn't exist, create it instead of erroring
  if (!profileDoc.exists()) {
    const user = auth.currentUser;
    const newProfileData = {
      userId: uid,
      email: user?.email || '',
      displayName: profileData.displayName || user?.displayName || '',
      biometrics: profileData.biometrics || {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(profileRef, newProfileData);
  } else {
    // Update profile data
    if (Object.keys(profileData).length > 0) {
      const updateData = {
        ...profileData,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(profileRef, updateData);
    }
  }
  
  // Update onboarding data if provided
  if (fitnessGoal || experienceLevel || workoutPreferences) {
    const onboardingRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/onboarding/data`);
    const onboardingDoc = await getDoc(onboardingRef);
    
    const onboardingUpdate: any = {
      updatedAt: Timestamp.now(),
    };
    
    if (fitnessGoal) {
      onboardingUpdate.fitnessGoals = [fitnessGoal];
    }
    if (experienceLevel) {
      onboardingUpdate.experienceLevel = experienceLevel;
    }
    if (workoutPreferences) {
      if (workoutPreferences.preferredDuration) {
        onboardingUpdate.availableTime = workoutPreferences.preferredDuration;
      }
      onboardingUpdate.workoutPreferences = workoutPreferences;
    }
    
    if (onboardingDoc.exists()) {
      await updateDoc(onboardingRef, onboardingUpdate);
    } else {
      await setDoc(onboardingRef, {
        ...onboardingUpdate,
        isCompleted: true,
        completedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });
    }
  }
  
  return {
    success: true,
    message: "Profile updated successfully",
  };
}

