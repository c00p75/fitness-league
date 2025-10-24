import { useState } from "react";
import { Button, Card, Badge, Progress } from "@fitness-league/ui";
import { trpc } from "../../lib/trpc";
import { ArrowLeft, Target, Calendar, TrendingUp, Play, Plus } from "lucide-react";
import { PlanGenerator } from "../workouts/PlanGenerator";

interface GoalDetailViewProps {
  goal: any;
  onBack: () => void;
  onStartWorkout: (workout: any) => void;
}

export function GoalDetailView({ goal, onBack, onStartWorkout }: GoalDetailViewProps) {
  const [showCreatePlan, setShowCreatePlan] = useState(false);

  // Fetch workout plans for this goal
  const { data: workoutPlans, isLoading: plansLoading } = trpc.workouts.getPlans.useQuery({
    goalId: goal.id,
  });

  const progressPercentage = goal.currentValue 
    ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-fitness-text-secondary hover:text-fitness-text"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goals
          </Button>
        </div>
      </div>

      {/* Goal Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-fitness-text">{goal.title}</h2>
              <Badge className={getGoalTypeColor(goal.type)}>
                {getGoalTypeLabel(goal.type)}
              </Badge>
            </div>
            <p className="text-fitness-text-secondary">
              Target: {goal.targetValue} {goal.unit} by {formatDate(goal.targetDate)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-fitness-primary">
              {progressPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-fitness-text-secondary">
              {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Goal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-fitness-primary" />
            <div>
              <div className="text-sm text-fitness-text-secondary">Target</div>
              <div className="font-semibold">{goal.targetValue} {goal.unit}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-fitness-primary" />
            <div>
              <div className="text-sm text-fitness-text-secondary">Days Left</div>
              <div className="font-semibold">{getDaysRemaining()}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-fitness-primary" />
            <div>
              <div className="text-sm text-fitness-text-secondary">Progress</div>
              <div className="font-semibold">{progressPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Workout Plans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-fitness-text">Workout Plans</h3>
          <Button
            onClick={() => setShowCreatePlan(true)}
            className="bg-fitness-primary hover:bg-fitness-primary-dark text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate New Plan
          </Button>
        </div>

        {plansLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary mx-auto"></div>
            <p className="text-fitness-text-secondary mt-2">Loading workout plans...</p>
          </div>
        ) : workoutPlans && workoutPlans.length > 0 ? (
          <div className="grid gap-4">
            {workoutPlans.map((plan: any) => (
              <Card key={plan.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-fitness-text">{plan.name}</h4>
                    <p className="text-sm text-fitness-text-secondary">
                      {plan.exercises?.length || 0} exercises • {plan.duration} minutes
                    </p>
                    <p className="text-sm text-fitness-text-secondary mt-1">
                      Created {formatDate(plan.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => onStartWorkout(plan)}
                      className="bg-fitness-primary hover:bg-fitness-primary-dark text-black"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 text-fitness-text-secondary mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-fitness-text mb-2">No Workout Plans Yet</h4>
            <p className="text-fitness-text-secondary mb-4">
              Generate a personalized workout plan to help you achieve this goal.
            </p>
            <Button
              onClick={() => setShowCreatePlan(true)}
              className="bg-fitness-primary hover:bg-fitness-primary-dark text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Plan
            </Button>
          </Card>
        )}
      </div>

      {/* Create Workout Plan Modal */}
      {showCreatePlan && (
        <PlanGenerator
          isOpen={showCreatePlan}
          onClose={() => setShowCreatePlan(false)}
          goals={[{ ...goal, durationWeeks: goal.durationWeeks }]}
          preSelectedGoalId={goal.id}
        />
      )}
    </div>
  );
}
