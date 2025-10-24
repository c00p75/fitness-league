import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { Button } from "@fitness-league/ui";
import { Plus, Target, TrendingUp, Calendar } from "lucide-react";
import { CreateGoalModal } from "../../components/goals/CreateGoalModal";
import { EditGoalModal } from "../../components/goals/EditGoalModal";
import { UpdateProgressModal } from "../../components/goals/UpdateProgressModal";
import { GoalCard } from "../../components/goals/GoalCard";
import { GoalDetailView } from "../../components/goals/GoalDetailView";
import { WorkoutView } from "../../components/goals/WorkoutView";

export function GoalsPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<{
    id: string;
    type: string;
    targetValue: number;
    unit: string;
    targetDate: Date;
  } | null>(null);
  const [updatingProgressGoal, setUpdatingProgressGoal] = useState<{
    id: string;
    type: string;
    currentValue: number;
    targetValue: number;
    unit: string;
  } | null>(null);
  
  // New state for goal-centric navigation
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);

  // Fetch user goals
  const { data: goals = [], isLoading } = trpc.goals.getGoals.useQuery(undefined);

  // Delete goal mutation
  const deleteGoalMutation = trpc.goals.deleteGoal.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await deleteGoalMutation.mutateAsync({ goalId });
    }
  };

  const handleEditGoal = (goalId: string) => {
    const goal = goals.find((g: any) => g.id === goalId) as any;
    if (goal) {
      setEditingGoal({
        id: goal.id,
        type: goal.type || "general_fitness",
        targetValue: goal.targetValue || 0,
        unit: goal.unit || "",
        targetDate: goal.targetDate?.toDate ? goal.targetDate.toDate() : new Date(goal.targetDate),
      });
    }
  };

  const handleUpdateProgress = (goalId: string) => {
    const goal = goals.find((g: any) => g.id === goalId) as any;
    if (goal) {
      setUpdatingProgressGoal({
        id: goal.id,
        type: goal.type || "general_fitness",
        currentValue: goal.currentValue || 0,
        targetValue: goal.targetValue || 0,
        unit: goal.unit || "",
      });
    }
  };

  // New handlers for goal-centric navigation
  const handleViewGoal = (goalId: string) => {
    const goal = goals.find((g: any) => g.id === goalId) as any;
    if (goal) {
      setSelectedGoal(goal);
    }
  };

  const handleStartWorkout = (workout: any) => {
    setSelectedWorkout(workout);
  };

  const handleBackToGoal = () => {
    setSelectedWorkout(null);
  };

  const handleBackToGoals = () => {
    setSelectedGoal(null);
    setSelectedWorkout(null);
  };

  const handleCompleteWorkout = () => {
    setSelectedWorkout(null);
    // Refresh goals to show updated progress
    queryClient.invalidateQueries({ queryKey: [["goals"]] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fitness-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 h-48">
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

  // Show workout view if a workout is selected
  if (selectedWorkout && selectedGoal) {
    return (
      <div className="min-h-screen bg-fitness-background p-6">
        <div className="max-w-6xl mx-auto">
          <WorkoutView
            workout={selectedWorkout}
            goal={selectedGoal}
            onBack={handleBackToGoal}
            onComplete={handleCompleteWorkout}
          />
        </div>
      </div>
    );
  }

  // Show goal detail view if a goal is selected
  if (selectedGoal) {
    return (
      <div className="min-h-screen bg-fitness-background p-6">
        <div className="max-w-6xl mx-auto">
          <GoalDetailView
            goal={selectedGoal}
            onBack={handleBackToGoals}
            onStartWorkout={handleStartWorkout}
          />
        </div>
      </div>
    );
  }

  // Show goals list (default view)
  return (
    <div className="min-h-screen bg-fitness-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground mb-2">
              Your Goals
            </h1>
            <p className="text-fitness-muted-foreground">
              Track your fitness progress and stay motivated
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-fitness-primary hover:bg-fitness-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-fitness-primary/10 rounded-full flex items-center justify-center">
              <Target className="w-12 h-12 text-fitness-primary" />
            </div>
            <h3 className="text-xl font-semibold text-fitness-foreground mb-2">
              No goals yet
            </h3>
            <p className="text-fitness-muted-foreground mb-6 max-w-md mx-auto">
              Set your first fitness goal to start tracking your progress and stay motivated on your journey.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-fitness-primary hover:bg-fitness-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal: any) => (
              <GoalCard
                key={goal.id}
                goal={{
                  id: goal.id,
                  type: goal.type || "general_fitness",
                  targetValue: goal.targetValue || 0,
                  currentValue: goal.currentValue || 0,
                  unit: goal.unit || "",
                  targetDate: goal.targetDate?.toDate ? goal.targetDate.toDate() : new Date(goal.targetDate),
                  isActive: goal.isActive !== false,
                  createdAt: goal.createdAt?.toDate ? goal.createdAt.toDate() : new Date(goal.createdAt),
                }}
                onEdit={() => handleEditGoal(goal.id)}
                onDelete={() => handleDeleteGoal(goal.id)}
                onUpdateProgress={() => handleUpdateProgress(goal.id)}
                onStartWorkout={() => handleViewGoal(goal.id)}
                isDeleting={deleteGoalMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {goals.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-fitness-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-fitness-foreground">Active Goals</h3>
                  <p className="text-sm text-fitness-muted-foreground">Currently tracking</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-foreground">
                {goals.filter((goal: any) => goal.isActive !== false).length}
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-fitness-foreground">Completed</h3>
                  <p className="text-sm text-fitness-muted-foreground">Goals achieved</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-foreground">
                {goals.filter((goal: any) => (goal.currentValue || 0) >= (goal.targetValue || 0)).length}
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-fitness-foreground">Upcoming</h3>
                  <p className="text-sm text-fitness-muted-foreground">Deadlines this month</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-fitness-foreground">
                {goals.filter((goal: any) => {
                  const targetDate = goal.targetDate?.toDate ? goal.targetDate.toDate() : new Date(goal.targetDate);
                  const now = new Date();
                  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                  return targetDate <= oneMonthFromNow && (goal.currentValue || 0) < (goal.targetValue || 0);
                }).length}
              </div>
            </div>
          </div>
        )}

        {/* Create Goal Modal */}
        <CreateGoalModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        {/* Edit Goal Modal */}
        {editingGoal && (
          <EditGoalModal
            isOpen={!!editingGoal}
            onClose={() => setEditingGoal(null)}
            goal={editingGoal}
          />
        )}

        {/* Update Progress Modal */}
        {updatingProgressGoal && (
          <UpdateProgressModal
            isOpen={!!updatingProgressGoal}
            onClose={() => setUpdatingProgressGoal(null)}
            goal={updatingProgressGoal}
          />
        )}
      </div>
    </div>
  );
}
