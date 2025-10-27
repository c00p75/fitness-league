import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getGoal, updateGoalProgress, getGoals } from "../../services/firestore/goalsService";
import { getPlans, deletePlan } from "../../services/firestore/workoutsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Progress, Badge } from "@fitness-league/ui";
import { Target, Calendar, TrendingUp, Plus, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { PlanGenerator } from "../../components/workouts/PlanGenerator";
import { WorkoutPlanCard } from "../../components/workouts/WorkoutPlanCard";
import { UpdateWorkoutModal } from "../../components/workouts/UpdateWorkoutModal";

export function GoalDetailPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [deletingWorkoutId, setDeletingWorkoutId] = useState<string | null>(null);

  // Fetch goal details
  const { data: goal, isLoading: goalLoading } = useQuery({
    queryKey: ['goals', goalId],
    queryFn: () => getGoal(goalId!),
    enabled: !!goalId,
  });

  // Fetch workouts for this goal
  const { data: workouts = [], isLoading: workoutsLoading } = useQuery({
    queryKey: ['workouts', 'plans', goalId],
    queryFn: async () => {
      if (!goalId) return [];
      return getPlans(goalId);
    },
    enabled: !!goalId,
  });

  // Fetch all goals for the PlanGenerator
  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  // Delete workout plan mutation
  const deleteWorkoutMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      setDeletingWorkoutId(null);
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
    onError: () => {
      setDeletingWorkoutId(null);
    },
  });

  // Update goal progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ goalId, currentValue }: { goalId: string; currentValue: number }) =>
      updateGoalProgress(goalId, currentValue),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleIncrementProgress = async () => {
    if (!goal) return;
    const newValue = Math.min(((goal as any).currentValue || 0) + 1, (goal as any).targetValue || 0);
    await updateProgressMutation.mutateAsync({
      goalId: goalId!,
      currentValue: newValue
    });
  };

  const handleDecrementProgress = async () => {
    if (!goal) return;
    const newValue = Math.max(((goal as any).currentValue || 0) - 1, 0);
    await updateProgressMutation.mutateAsync({
      goalId: goalId!,
      currentValue: newValue
    });
  };

  const handleUpdateWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setShowUpdateModal(true);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (window.confirm("Are you sure you want to delete this workout plan? This action cannot be undone.")) {
      setDeletingWorkoutId(workoutId);
      await deleteWorkoutMutation.mutateAsync(workoutId);
    }
  };

  if (goalLoading) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fitness-foreground mb-4">Goal Not Found</h2>
          <p className="text-fitness-muted-foreground mb-6">The goal you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/goals")}>
            Go to Goals
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = (goal as any).currentValue 
    ? Math.min(((goal as any).currentValue / (goal as any).targetValue) * 100, 100)
    : 0;

  const getGoalTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      weight_loss: "Weight Loss",
      muscle_gain: "Muscle Gain",
      flexibility: "Flexibility",
      general_fitness: "General Fitness",
      endurance_improvement: "Endurance",
      strength_gain: "Strength Gain",
    };
    return labels[type] || type;
  };

  const getGoalTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      weight_loss: "bg-red-100 text-red-800",
      muscle_gain: "bg-blue-100 text-blue-800",
      flexibility: "bg-green-100 text-green-800",
      general_fitness: "bg-purple-100 text-purple-800",
      endurance_improvement: "bg-orange-100 text-orange-800",
      strength_gain: "bg-yellow-100 text-yellow-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: any) => {
    // Handle Firestore Timestamp or Date objects
    let dateObj: Date;
    if (date && typeof date.toDate === 'function') {
      // Firestore Timestamp
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      // Already a Date object
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      // String or number timestamp
      dateObj = new Date(date);
    } else {
      // Fallback
      dateObj = new Date();
    }
    
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    // Handle Firestore Timestamp or Date objects
    let targetDate: Date;
    if (goal.targetDate && typeof goal.targetDate.toDate === 'function') {
      // Firestore Timestamp
      targetDate = goal.targetDate.toDate();
    } else if (goal.targetDate instanceof Date) {
      // Already a Date object
      targetDate = goal.targetDate;
    } else {
      // String or number timestamp
      targetDate = new Date(goal.targetDate);
    }
    
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start flex-col">
          <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/goals")}
              className="bg-[#212121] hover:bg-[#262626] mb-6 py-1 h-fit text-[0.8rem] -mt-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Goals
            </Button>
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground">{getGoalTypeLabel((goal as any).type)}</h1>
            <p className="text-fitness-muted-foreground">Track your progress and manage workouts</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getGoalTypeColor((goal as any).type)}>
            {getGoalTypeLabel((goal as any).type)}
          </Badge>
        </div>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Goal Progress</span>
          </CardTitle>
          <CardDescription>
            <div className="flex items-center justify-between">
              <span>{(goal as any).currentValue} {(goal as any).unit} of {(goal as any).targetValue} {(goal as any).unit}</span>
              <div className="flex items-center space-x-4 -mt-5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDecrementProgress}
                  className="h-6 w-6 scale-125 p-0 bg-[#212121] hover:bg-[#262626]"
                  disabled={!(goal as any).currentValue || (goal as any).currentValue <= 0 || updateProgressMutation.isPending}
                >
                  -
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleIncrementProgress}
                  className="h-6 w-6 scale-125 p-0 bg-[#212121] hover:bg-[#262626]"
                  disabled={(goal as any).currentValue >= (goal as any).targetValue || updateProgressMutation.isPending}
                >
                  +
                </Button>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-fitness-muted-foreground">
              <span>{progressPercentage.toFixed(1)}% complete</span>
              <span>{getDaysRemaining()} days remaining</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Target: {formatDate(goal.targetDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Progress: {(goal as any).currentValue || 0} {(goal as any).unit}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workouts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-fitness-foreground">Workout Plans</h2>
          <Button
            onClick={() => setShowPlanGenerator(true)}
            className="bg-fitness-primary hover:bg-fitness-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {workoutsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : workouts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-fitness-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-fitness-primary" />
              </div>
              <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                No workout plans yet
              </h3>
              <p className="text-fitness-muted-foreground mb-6">
                Create your first workout plan to start working towards this goal.
              </p>
              <Button
                onClick={() => setShowPlanGenerator(true)}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout: any) => (
              <WorkoutPlanCard
                key={workout.id}
                plan={{
                  id: workout.id,
                  name: workout.name || "Unnamed Plan",
                  description: workout.description || "No description available",
                  durationWeeks: workout.durationWeeks || 4,
                  workoutsPerWeek: workout.workoutsPerWeek || 3,
                  difficulty: workout.difficulty || "beginner",
                  exercises: workout.exercises || [],
                  createdAt: workout.createdAt?.toDate ? workout.createdAt.toDate() : new Date(workout.createdAt),
                }}
                onStartWorkout={() => navigate(`/goals/${goalId}/workouts/${workout.id}/session`)}
                onUpdateWorkout={() => handleUpdateWorkout(workout)}
                onDeleteWorkout={() => handleDeleteWorkout(workout.id)}
                isDeleting={deletingWorkoutId === workout.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Plan Generator Modal */}
      <PlanGenerator
        isOpen={showPlanGenerator}
        onClose={() => setShowPlanGenerator(false)}
        goals={goals as any}
        preSelectedGoalId={goalId}
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
  );
}
