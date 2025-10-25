import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { GoalsPage } from "./pages/goals/GoalsPage";
import { GoalDetailPage } from "./pages/goals/GoalDetailPage";
import { GoalWorkoutsPage } from "./pages/goals/GoalWorkoutsPage";
import { WorkoutDetailPage } from "./pages/workouts/WorkoutDetailPage";
import { WorkoutExercisesPage } from "./pages/workouts/WorkoutExercisesPage";
import { ExerciseDetailPage } from "./pages/workouts/ExerciseDetailPage";
import { WorkoutSessionPage } from "./pages/workouts/WorkoutSessionPage";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { Toaster } from "react-hot-toast";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignupPage />
            </AuthLayout>
          }
        />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <AppLayout>
                <GoalsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/:goalId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <GoalDetailPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/:goalId/workouts"
          element={
            <ProtectedRoute>
              <AppLayout>
                <GoalWorkoutsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/:goalId/workouts/:workoutId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WorkoutDetailPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/:goalId/workouts/:workoutId/exercises"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WorkoutExercisesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/:goalId/workouts/:workoutId/exercises/:exerciseId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ExerciseDetailPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/:goalId/workouts/:workoutId/sessions/:sessionId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WorkoutSessionPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}

export default App;
