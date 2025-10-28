import { db, auth } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp
} from 'firebase/firestore';

const PROJECT_ID = "fit-league-930c6";

async function getUserId(): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  return uid;
}

/**
 * Get all goals for the current user
 */
export async function getGoals() {
  const uid = await getUserId();
  
  const goalsRef = collection(db, `artifacts/${PROJECT_ID}/users/${uid}/goals`);
  const q = query(goalsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Get a specific goal by ID
 */
export async function getGoal(goalId: string) {
  const uid = await getUserId();
  
  const goalRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/goals/${goalId}`);
  const goalDoc = await getDoc(goalRef);
  
  if (!goalDoc.exists()) {
    throw new Error('Goal not found');
  }
  
  return {
    id: goalDoc.id,
    ...goalDoc.data()
  };
}

/**
 * Create a new goal
 */
export async function createGoal(goalData: {
  type: string;
  targetValue: number;
  unit: string;
  targetDate: Date;
  durationWeeks?: number;
}) {
  const uid = await getUserId();
  
  const goalsRef = collection(db, `artifacts/${PROJECT_ID}/users/${uid}/goals`);
  
  const newGoal = {
    type: goalData.type,
    targetValue: goalData.targetValue,
    unit: goalData.unit,
    targetDate: Timestamp.fromDate(goalData.targetDate),
    durationWeeks: goalData.durationWeeks || 12,
    currentValue: 0,
    isActive: true,
    userId: uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(goalsRef, newGoal);
  
  return {
    id: docRef.id,
    ...newGoal
  };
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(goalId: string, currentValue: number) {
  const uid = await getUserId();
  
  const goalRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/goals/${goalId}`);
  
  await updateDoc(goalRef, {
    currentValue,
    updatedAt: Timestamp.now(),
  });
  
  return { success: true };
}

/**
 * Update a goal
 */
export async function updateGoal(goalId: string, updates: Partial<{
  type: string;
  targetValue: number;
  unit: string;
  targetDate: Date;
  durationWeeks: number;
  isActive: boolean;
}>) {
  const uid = await getUserId();
  
  const goalRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/goals/${goalId}`);
  
  const updateData: any = {
    updatedAt: Timestamp.now(),
  };
  
  if (updates.type) updateData.type = updates.type;
  if (updates.targetValue !== undefined) updateData.targetValue = updates.targetValue;
  if (updates.unit) updateData.unit = updates.unit;
  if (updates.targetDate) updateData.targetDate = Timestamp.fromDate(updates.targetDate);
  if (updates.durationWeeks !== undefined) updateData.durationWeeks = updates.durationWeeks;
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
  
  await updateDoc(goalRef, updateData);
  
  return { success: true };
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string) {
  const uid = await getUserId();
  
  const goalRef = doc(db, `artifacts/${PROJECT_ID}/users/${uid}/goals/${goalId}`);
  await deleteDoc(goalRef);
  
  return { success: true };
}

