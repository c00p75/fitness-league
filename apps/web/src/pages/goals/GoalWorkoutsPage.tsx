import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@fitness-league/ui";
import { ArrowLeft, Plus, Play, Eye, Dumbbell, Clock, Target } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { PlanGenerator } from "../../components/workouts/PlanGenerator";

export function GoalWorkoutsPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);

  // Fetch goal details
  const { data: goal, isLoading: goalLoading } = trpc.goals.getGoal.useQuery(
    { goalId: goalId! },
    { enabled: !!goalId }
  );

  // Fetch workouts for this goal
  const { data: workouts = [], isLoading: workoutsLoading } = trpc.workouts.getPlans.useQuery(
    { goalId: goalId! },
    { enabled: !!goalId }
  );

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
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goals
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/goals/${goalId}`)}
            className="text-fitness-muted-foreground hover:text-fitness-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Goal
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground">
              Workout Plans for {getGoalTypeLabel(goal.type)}
            </h1>
            <p className="text-fitness-muted-foreground">Create and manage workout plans for this goal</p>
          </div>
        </div>
        <Button
          onClick={() => setShowPlanGenerator(true)}
          className="bg-fitness-primary hover:bg-fitness-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Workout Plans Grid */}
      {workoutsLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : workouts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-fitness-primary/10 rounded-full flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-fitness-primary" />
            </div>
            <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
              No workout plans yet
            </h3>
            <p className="text-fitness-muted-foreground mb-6">
              Create your first personalized workout plan based on your fitness goals and experience level.
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
            <Card key={workout.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{workout.name}</CardTitle>
                <CardDescription>{workout.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fitness-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Duration
                    </span>
                    <span>{workout.durationWeeks} weeks</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fitness-muted-foreground flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Frequency
                    </span>
                    <span>{workout.workoutsPerWeek} sessions/week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fitness-muted-foreground">Difficulty</span>
                    <Badge variant="secondary">{workout.difficulty}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fitness-muted-foreground">Exercises</span>
                    <span>{workout.exercises?.length || 0} exercises</span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/goals/${goalId}/workouts/${workout.id}`)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/goals/${goalId}/workouts/${workout.id}`)}
                      className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Plan Generator Modal */}
      {showPlanGenerator && (
        <PlanGenerator
          isOpen={showPlanGenerator}
          onClose={() => setShowPlanGenerator(false)}
          goals={[goal]}
          preSelectedGoalId={goalId}
        />
      )}
    </div>
  );
}
