import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@fitness-league/ui";
import { ArrowLeft, Play, Clock, Target, Dumbbell, Users, Timer } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export function ExerciseDetailPage() {
  const { goalId, workoutId, exerciseId } = useParams<{ 
    goalId: string; 
    workoutId: string; 
    exerciseId: string; 
  }>();
  const navigate = useNavigate();

  // Fetch workout details to find the exercise
  const { data: workout, isLoading: workoutLoading } = trpc.workouts.getPlan.useQuery(
    { planId: workoutId! },
    { enabled: !!workoutId }
  );

  // Fetch goal details
  const { data: goal, isLoading: goalLoading } = trpc.goals.getGoal.useQuery(
    { goalId: goalId! },
    { enabled: !!goalId }
  );

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
          <h2 className="text-2xl font-bold text-fitness-foreground mb-4">Exercise Not Found</h2>
          <p className="text-fitness-muted-foreground mb-6">The exercise you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}/exercises`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercises
          </Button>
        </div>
      </div>
    );
  }

  // Find the specific exercise
  const exercise = workout.exercises?.find((ex: any) => ex.exerciseId === exerciseId);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fitness-foreground mb-4">Exercise Not Found</h2>
          <p className="text-fitness-muted-foreground mb-6">This exercise is not part of this workout plan.</p>
          <Button onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}/exercises`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercises
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
            onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}/exercises`)}
            className="text-fitness-muted-foreground hover:text-fitness-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercises
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground">{exercise.name}</h1>
            <p className="text-fitness-muted-foreground">
              {getGoalTypeLabel(goal.type)} • {workout.name}
            </p>
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

      {/* Exercise Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Sets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fitness-foreground">{exercise.sets}</div>
            <p className="text-sm text-fitness-muted-foreground">Total sets</p>
          </CardContent>
        </Card>

        {exercise.reps && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Dumbbell className="w-5 h-5 mr-2" />
                Reps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fitness-foreground">{exercise.reps}</div>
              <p className="text-sm text-fitness-muted-foreground">Per set</p>
            </CardContent>
          </Card>
        )}

        {exercise.duration && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Timer className="w-5 h-5 mr-2" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fitness-foreground">{exercise.duration}</div>
              <p className="text-sm text-fitness-muted-foreground">Minutes</p>
            </CardContent>
          </Card>
        )}

        {exercise.restSeconds && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Rest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fitness-foreground">{exercise.restSeconds}</div>
              <p className="text-sm text-fitness-muted-foreground">Seconds</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-fitness-muted-foreground">{exercise.description}</p>
        </CardContent>
      </Card>

      {/* Instructions */}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>How to Perform</CardTitle>
            <CardDescription>Step-by-step instructions for this exercise</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {exercise.instructions.map((instruction: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-fitness-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold text-fitness-primary">{index + 1}</span>
                  </div>
                  <p className="text-fitness-foreground">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Muscle Groups */}
      {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Target Muscles
            </CardTitle>
            <CardDescription>Muscle groups worked by this exercise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map((muscle: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {muscle}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* YouTube Video */}
      {exercise.youtubeVideoId && (
        <Card>
          <CardHeader>
            <CardTitle>Exercise Video</CardTitle>
            <CardDescription>Watch the proper form and technique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-fitness-surface rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${exercise.youtubeVideoId}`}
                title={exercise.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            {exercise.videoDuration && (
              <p className="text-sm text-fitness-muted-foreground mt-2">
                Video duration: {Math.floor(exercise.videoDuration / 60)}:{(exercise.videoDuration % 60).toString().padStart(2, '0')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}/exercises`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Exercises
        </Button>
        <Button
          onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}`)}
          className="bg-fitness-primary hover:bg-fitness-primary/90"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
      </div>
    </div>
  );
}
