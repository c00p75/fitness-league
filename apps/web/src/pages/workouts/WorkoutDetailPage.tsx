import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@fitness-league/ui";
import { ArrowLeft, Play, Eye, Clock, Target, Dumbbell, Calendar } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function WorkoutDetailPage() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/goals/${goalId}/workouts`)}
            className="text-fitness-muted-foreground hover:text-fitness-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workouts
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground">{workout.name}</h1>
            <p className="text-fitness-muted-foreground">
              {getGoalTypeLabel(goal.type)} • {workout.durationWeeks} weeks • {workout.workoutsPerWeek} sessions/week
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{workout.difficulty}</Badge>
        </div>
      </div>

      {/* Workout Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fitness-foreground">{workout.durationWeeks} weeks</div>
            <p className="text-sm text-fitness-muted-foreground">
              {workout.workoutsPerWeek} sessions per week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Dumbbell className="w-5 h-5 mr-2" />
              Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fitness-foreground">
              {workout.exercises?.length || 0}
            </div>
            <p className="text-sm text-fitness-muted-foreground">
              Total exercises in plan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fitness-foreground">
              {formatDate(workout.createdAt)}
            </div>
            <p className="text-sm text-fitness-muted-foreground">
              Plan creation date
            </p>
          </CardContent>
        </Card>
      </div>

      
      {/* Exercises */}
      {workout.exercises && workout.exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
            <CardDescription>
              All exercises in this workout plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workout.exercises.map((exercise: any, index: number) => (
                <div key={exercise.exerciseId || index} className="flex items-center justify-between p-3 bg-fitness-surface rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-fitness-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-fitness-primary">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-fitness-foreground">{exercise.name}</h4>
                      <p className="text-sm text-fitness-muted-foreground">{exercise.category}</p>
                    </div>
                  </div>
                  <div className="text-sm text-fitness-muted-foreground">
                    {exercise.sets} sets
                    {exercise.reps && ` • ${exercise.reps} reps`}
                    {exercise.duration && ` • ${exercise.duration} min`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
