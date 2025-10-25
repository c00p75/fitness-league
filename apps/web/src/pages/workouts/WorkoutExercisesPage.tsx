import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@fitness-league/ui";
import { ArrowLeft, Play, Eye, Clock, Target, Dumbbell, Calendar } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function WorkoutExercisesPage() {
  const { goalId, workoutId } = useParams<{ goalId: string; workoutId: string }>();
  const navigate = useNavigate();

  // Fetch workout details
  const { data: workout, isLoading: workoutLoading } = trpc.workouts.getPlan.useQuery(
    { planId: workoutId! },
    { enabled: !!workoutId }
  );

  // Fetch goal details
  const { data: goal, isLoading: goalLoading } = trpc.goals.getGoal.useQuery(
    { goalId: goalId! },
    { enabled: !!goalId }
  );

  // Start workout session mutation
  const startSessionMutation = trpc.workouts.startSession.useMutation({
    onSuccess: (session) => {
      navigate(`/goals/${goalId}/workouts/${workoutId}/sessions/${session.id}`);
    },
  });

  const handleStartWorkout = async () => {
    if (workoutId) {
      await startSessionMutation.mutateAsync({ planId: workoutId });
    }
  };

  if (workoutLoading || goalLoading) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!workout || !goal) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fitness-foreground mb-4">Workout Not Found</h2>
          <p className="text-fitness-muted-foreground mb-6">The workout you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`/goals/${goalId}/workouts`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workouts
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cardio: "bg-red-100 text-red-800",
      strength: "bg-blue-100 text-blue-800",
      hiit: "bg-orange-100 text-orange-800",
      yoga: "bg-green-100 text-green-800",
      pilates: "bg-purple-100 text-purple-800",
      mobility: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}`)}
            className="text-fitness-muted-foreground hover:text-fitness-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workout
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground">
              {workout.name} - Exercises
            </h1>
            <p className="text-fitness-muted-foreground">
              {getGoalTypeLabel(goal.type)} • {workout.exercises?.length || 0} exercises
            </p>
          </div>
        </div>
        <Button
          onClick={handleStartWorkout}
          disabled={startSessionMutation.isPending}
          className="bg-fitness-primary hover:bg-fitness-primary/90"
        >
          <Play className="w-4 h-4 mr-2" />
          {startSessionMutation.isPending ? "Starting..." : "Start Workout"}
        </Button>
      </div>

      {/* Exercise List */}
      {workout.exercises && workout.exercises.length > 0 ? (
        <div className="space-y-4">
          {workout.exercises.map((exercise: any, index: number) => (
            <Card key={exercise.exerciseId || index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-fitness-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-fitness-primary">{index + 1}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{exercise.name}</CardTitle>
                      <CardDescription className="mt-1">{exercise.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(exercise.category)}>
                      {exercise.category}
                    </Badge>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Exercise Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-fitness-muted-foreground" />
                      <span className="text-sm text-fitness-muted-foreground">Sets:</span>
                      <span className="font-medium">{exercise.sets}</span>
                    </div>
                    {exercise.reps && (
                      <div className="flex items-center space-x-2">
                        <Dumbbell className="w-4 h-4 text-fitness-muted-foreground" />
                        <span className="text-sm text-fitness-muted-foreground">Reps:</span>
                        <span className="font-medium">{exercise.reps}</span>
                      </div>
                    )}
                    {exercise.duration && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-fitness-muted-foreground" />
                        <span className="text-sm text-fitness-muted-foreground">Duration:</span>
                        <span className="font-medium">{exercise.duration} min</span>
                      </div>
                    )}
                  </div>

                  {/* Muscle Groups */}
                  {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                    <div>
                      <span className="text-sm text-fitness-muted-foreground">Muscle Groups:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {exercise.muscleGroups.map((muscle: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  {exercise.instructions && exercise.instructions.length > 0 && (
                    <div>
                      <span className="text-sm text-fitness-muted-foreground">Instructions:</span>
                      <ol className="list-decimal list-inside space-y-1 mt-1 text-sm">
                        {exercise.instructions.slice(0, 3).map((instruction: string, idx: number) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                        {exercise.instructions.length > 3 && (
                          <li className="text-fitness-muted-foreground">
                            ... and {exercise.instructions.length - 3} more steps
                          </li>
                        )}
                      </ol>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 text-sm text-fitness-muted-foreground">
                      {exercise.restSeconds && (
                        <span>Rest: {exercise.restSeconds}s</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}/exercises/${exercise.exerciseId}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-fitness-primary/10 rounded-full flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-fitness-primary" />
            </div>
            <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
              No exercises found
            </h3>
            <p className="text-fitness-muted-foreground">
              This workout plan doesn't have any exercises yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
