import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";
import { Button } from "@fitness-league/ui";
import { 
  Plus, 
  Play, 
  Clock, 
  Target, 
  TrendingUp,
  Dumbbell
} from "lucide-react";
import { PlanGenerator } from "../../components/workouts/PlanGenerator";
import { WorkoutPlanCard } from "../../components/workouts/WorkoutPlanCard";
import { UpdateWorkoutModal } from "../../components/workouts/UpdateWorkoutModal";

export function WorkoutsPage() {
  const navigate = useNavigate();
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [deletingWorkoutId, setDeletingWorkoutId] = useState<string | null>(null);

  // Fetch user goals for plan generation
  const { data: goals = [] } = trpc.goals.getGoals.useQuery(undefined);
  const activeGoals = goals.filter((goal: any) => goal.isActive !== false);

  // Fetch workout plans
  const { data: plans = [], isLoading: plansLoading } = trpc.workouts.getPlans.useQuery(undefined);

  // Fetch workout sessions
  const { data: sessions = [], isLoading: sessionsLoading } = trpc.workouts.getSessions.useQuery(undefined);

  // Start workout session mutation
  const startSessionMutation = trpc.workouts.startSession.useMutation({
    onSuccess: (_, variables) => {
      // Find the workout plan to get the goalId
      const plan = plans.find((p: any) => p.id === variables.planId);
      if (plan && (plan as any).goalId) {
        navigate(`/goals/${(plan as any).goalId}/workouts/${variables.planId}/session`);
      } else {
        // Fallout to a generic route if goalId is not available
        navigate(`/workouts/${variables.planId}/session`);
      }
    },
  });

  // Delete workout plan mutation
  const deleteWorkoutMutation = trpc.workouts.deletePlan.useMutation({
    onSuccess: () => {
      setDeletingWorkoutId(null);
      // Refetch plans to update the list
      window.location.reload(); // Simple refresh for now
    },
    onError: () => {
      setDeletingWorkoutId(null);
    },
  });

  const handleStartWorkout = async (planId: string) => {
    await startSessionMutation.mutateAsync({ planId });
  };

  const handleUpdateWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setShowUpdateModal(true);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (window.confirm("Are you sure you want to delete this workout plan? This action cannot be undone.")) {
      setDeletingWorkoutId(workoutId);
      await deleteWorkoutMutation.mutateAsync({ planId: workoutId });
    }
  };

  if (plansLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-fitness-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 h-64">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fitness-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground mb-2">
              Workout Plans
            </h1>
            <p className="text-fitness-muted-foreground">
              Personalized workout plans tailored to your goals
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate("/goals")}
              variant="outline"
              className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Update Goals
            </Button>
            <Button
              onClick={() => setShowPlanGenerator(true)}
              disabled={activeGoals.length === 0}
              className="bg-fitness-primary hover:bg-fitness-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </div>
        </div>

        {/* No Goals Warning */}
        {activeGoals.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                You need to create a fitness goal before generating workout plans.
                <Button
                  variant="link"
                  onClick={() => navigate("/goals")}
                  className="ml-2 p-0 h-auto text-yellow-800 underline"
                >
                  Create a goal
                </Button>
              </p>
            </div>
          </div>
        )}

        {/* Workout Plans Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-fitness-primary/10 rounded-full flex items-center justify-center">
              <Dumbbell className="w-12 h-12 text-fitness-primary" />
            </div>
            <h3 className="text-xl font-semibold text-fitness-foreground mb-2">
              No workout plans yet
            </h3>
            <p className="text-fitness-muted-foreground mb-6 max-w-md mx-auto">
              Generate your first personalized workout plan based on your fitness goals and experience level.
            </p>
            <Button
              onClick={() => setShowPlanGenerator(true)}
              disabled={activeGoals.length === 0}
              className="bg-fitness-primary hover:bg-fitness-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Your First Plan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: any) => (
              <WorkoutPlanCard
                key={plan.id}
                plan={{
                  id: plan.id,
                  name: plan.name || "Unnamed Plan",
                  description: plan.description || "No description available",
                  durationWeeks: plan.durationWeeks || 4,
                  workoutsPerWeek: plan.workoutsPerWeek || 3,
                  difficulty: plan.difficulty || "beginner",
                  exercises: plan.exercises || [],
                  createdAt: plan.createdAt?.toDate ? plan.createdAt.toDate() : new Date(plan.createdAt),
                }}
                onStartWorkout={() => handleStartWorkout(plan.id)}
                onUpdateWorkout={() => handleUpdateWorkout(plan)}
                onDeleteWorkout={() => handleDeleteWorkout(plan.id)}
                isStarting={startSessionMutation.isPending}
                isDeleting={deletingWorkoutId === plan.id}
              />
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {plans.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Dumbbell className="w-5 h-5 text-fitness-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-fitness-foreground">Total Plans</h3>
                  <p className="text-sm text-fitness-muted-foreground">Created</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-foreground">
                {plans.length}
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-fitness-foreground">Completed</h3>
                  <p className="text-sm text-fitness-muted-foreground">Workouts</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-foreground">
                {sessions.filter(session => session.completedAt).length}
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-fitness-foreground">Total Time</h3>
                  <p className="text-sm text-fitness-muted-foreground">This week</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-foreground">
                {Math.round(sessions.reduce((total, session) => {
                  if (session.completedAt) {
                    const duration = session.completedAt.getTime() - session.startedAt.getTime();
                    return total + (duration / (1000 * 60)); // Convert to minutes
                  }
                  return total;
                }, 0))}m
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-fitness-foreground">Streak</h3>
                  <p className="text-sm text-fitness-muted-foreground">Days</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-foreground">
                {(() => {
                  // Calculate workout streak
                  const today = new Date();
                  let streak = 0;
                  for (let i = 0; i < 30; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const hasWorkout = sessions.some(session => {
                      const sessionDate = new Date(session.startedAt);
                      return sessionDate.toDateString() === date.toDateString() && session.completedAt;
                    });
                    if (hasWorkout) {
                      streak++;
                    } else {
                      break;
                    }
                  }
                  return streak;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Plan Generator Modal */}
        <PlanGenerator
          isOpen={showPlanGenerator}
          onClose={() => setShowPlanGenerator(false)}
          goals={activeGoals.map((goal: any) => ({
            id: goal.id,
            type: goal.type || "general_fitness",
            targetValue: goal.targetValue || 0,
            unit: goal.unit || "",
            durationWeeks: goal.durationWeeks || 8,
          }))}
        />

        {/* Update Workout Modal */}
        {selectedWorkout && (
          <UpdateWorkoutModal
            isOpen={showUpdateModal}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedWorkout(null);
            }}
            workout={selectedWorkout}
          />
        )}
      </div>
    </div>
  );
}
