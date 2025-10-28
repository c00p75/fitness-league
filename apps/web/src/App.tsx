import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { SEO, SEOConfigs } from "./components/ui/SEO";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

// Lazy load pages for code splitting
const LoginPage = lazy(() => import("./pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("./pages/auth/SignupPage").then(m => ({ default: m.SignupPage })));
const OnboardingPage = lazy(() => import("./pages/onboarding/OnboardingPage").then(m => ({ default: m.OnboardingPage })));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage").then(m => ({ default: m.ProfilePage })));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage").then(m => ({ default: m.DashboardPage })));
const GoalsPage = lazy(() => import("./pages/goals/GoalsPage").then(m => ({ default: m.GoalsPage })));
const GoalDetailPage = lazy(() => import("./pages/goals/GoalDetailPage").then(m => ({ default: m.GoalDetailPage })));
const WorkoutDetailPage = lazy(() => import("./pages/workouts/WorkoutDetailPage").then(m => ({ default: m.WorkoutDetailPage })));
const VideosPage = lazy(() => import("./pages/videos/VideosPage").then(m => ({ default: m.VideosPage })));

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
    <ErrorBoundary>
      <SEO {...SEOConfigs.home} />
      <Suspense fallback={
        <div className="min-h-screen bg-fitness-background flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }>
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
            path="/goals/:goalId/workouts/:workoutId/session"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WorkoutDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <VideosPage />
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
      </Suspense>
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
    </ErrorBoundary>
  );
}

export default App;
