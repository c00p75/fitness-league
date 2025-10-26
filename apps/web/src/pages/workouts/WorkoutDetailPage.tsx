import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@fitness-league/ui";
import { Clock, Dumbbell, Calendar, Target, Eye, Activity, Check, TrendingUp, CheckCircle, ArrowLeft, Star } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { WorkoutGoalUpdateModal } from "../../components/goals/WorkoutGoalUpdateModal";

export function WorkoutDetailPage() {
  const { goalId, workoutId } = useParams<{ goalId: string; workoutId: string }>();
  const navigate = useNavigate();
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [showGoalUpdateModal, setShowGoalUpdateModal] = useState(false);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);

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


  // Handle goal updates from workout completion
  const handleGoalUpdate = async (goalUpdates: Array<{ goalId: string; progressValue: number }>) => {
    // For now, we'll just complete the session without goal updates
    // In a real implementation, you might want to create a session first
    // and then complete it with goal updates
    try {
      // This is a placeholder - in a real app, you'd have a session ID
      // For now, we'll just update the goal directly
      const goalUpdateMutation = trpc.goals.updateGoalProgress.useMutation();
      
      for (const goalUpdate of goalUpdates) {
        await goalUpdateMutation.mutateAsync({
          goalId: goalUpdate.goalId,
          currentValue: goalUpdate.progressValue,
        });
      }
      
      setIsWorkoutCompleted(true);
    } catch (error) {
      console.error("Failed to update goal:", error);
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
          <Button onClick={() => navigate(`/goals/${goalId}`)}>
            Go to Workouts
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
        <div className="flex items-start flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/goals/${goalId}`)}
            className="bg-[#212121] hover:bg-[#262626] mb-6 py-1 h-fit text-[0.8rem] -mt-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workouts
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-fitness-foreground">{(workout as any).name}</h1>
            <p className="text-fitness-muted-foreground">
              {getGoalTypeLabel((goal as any).type)} • {(workout as any).durationWeeks} weeks • {(workout as any).workoutsPerWeek} sessions/week
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{(workout as any).difficulty}</Badge>
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
            <div className="text-2xl font-bold text-fitness-foreground">{(workout as any).durationWeeks} weeks</div>
            <p className="text-sm text-fitness-muted-foreground">
              {(workout as any).workoutsPerWeek} sessions per week
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
              {(workout as any).exercises?.length || 0}
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
              {formatDate((workout as any).createdAt)}
            </div>
            <p className="text-sm text-fitness-muted-foreground">
              Plan creation date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      {(workout as any).exercises && (workout as any).exercises.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Player and Exercise Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
              {(workout as any).exercises[selectedExerciseIndex]?.youtubeVideoId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${(workout as any).exercises[selectedExerciseIndex].youtubeVideoId}?rel=0`}
                  title={(workout as any).exercises[selectedExerciseIndex].name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No video available</p>
                    <p className="text-sm opacity-75">Follow the instructions below</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exercise Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-fitness-foreground mb-2">
                  {(workout as any).exercises[selectedExerciseIndex]?.name}
                </h1>
                <p className="text-fitness-muted-foreground">
                  {(workout as any).exercises[selectedExerciseIndex]?.description || 
                   "A comprehensive exercise designed to improve your fitness and strength."}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-fitness-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {(workout as any).exercises?.length} exercises
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {(workout as any).durationWeeks || 4} weeks
                  </span>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-fitness-surface">
                    <CardContent className="text-center p-4">
                      <Target className="w-6 h-6 mx-auto mb-2 text-fitness-primary" />
                      <p className="text-2xl font-bold text-fitness-foreground">
                        {(workout as any).exercises[selectedExerciseIndex]?.sets || 0}
                      </p>
                      <p className="text-sm text-fitness-muted-foreground">Total sets</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-fitness-surface">
                    <CardContent className="text-center p-4">
                      <Dumbbell className="w-6 h-6 mx-auto mb-2 text-fitness-primary" />
                      <p className="text-2xl font-bold text-fitness-foreground">
                        {(workout as any).exercises[selectedExerciseIndex]?.reps || 0}
                      </p>
                      <p className="text-sm text-fitness-muted-foreground">Per set</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-fitness-surface">
                    <CardContent className="text-center p-4">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-fitness-primary" />
                      <p className="text-2xl font-bold text-fitness-foreground">60</p>
                      <p className="text-sm text-fitness-muted-foreground">Seconds</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Exercise Description */}
                <Card className="bg-fitness-surface">
                  <CardHeader>
                    <CardTitle className="text-lg">Exercise Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-fitness-foreground">
                      {(workout as any).exercises[selectedExerciseIndex]?.description || 
                       "Classic bodyweight exercise for upper body strength."}
                    </p>
                  </CardContent>
                </Card>

                {/* How to Perform */}
                <Card className="bg-fitness-surface">
                  <CardHeader>
                    <CardTitle className="text-lg">How to Perform</CardTitle>
                    <CardDescription>Step-by-step instructions for this exercise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {((workout as any).exercises[selectedExerciseIndex]?.instructions || [
                        "Start in plank position",
                        "Lower body until chest nearly touches floor", 
                        "Push back up to starting position",
                        "Keep core tight throughout"
                      ]).map((instruction: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-cyan-400 text-black rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-fitness-foreground">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Target Muscles */}
                <Card className="bg-fitness-surface">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Target Muscles
                    </CardTitle>
                    <CardDescription>Muscle groups worked by this exercise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {((workout as any).exercises[selectedExerciseIndex]?.targetMuscles || [
                        "chest", "triceps", "shoulders", "core"
                      ]).map((muscle: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-neutral-700 text-fitness-foreground">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
        </div>

              {/* Mark Complete Button */}
        <Button
                onClick={() => {
                  const isCompleted = completedExercises.has(selectedExerciseIndex);
                  
                  if (!isCompleted) {
                    // Mark current exercise as complete
                    setCompletedExercises(prev => new Set([...prev, selectedExerciseIndex]));
                    
                    // Move to next exercise if not the last one
                    const totalExercises = (workout as any).exercises?.length || 0;
                    if (selectedExerciseIndex < totalExercises - 1) {
                      setSelectedExerciseIndex(selectedExerciseIndex + 1);
                      // Auto scroll to top when advancing to next exercise
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                className={`w-full py-6 text-lg ${
                  completedExercises.has(selectedExerciseIndex)
                    ? 'bg-green-700 hover:bg-green-600 text-white'
                    : 'bg-transparent outline outline-1 outline-fitness-primary text-fitness-primary hover:bg-fitness-primary/10'
                }`}
              >
                {completedExercises.has(selectedExerciseIndex) ? <Check className="w-5 h-5 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                {completedExercises.has(selectedExerciseIndex) ? "Completed" : "Mark Complete"}
        </Button>

              {/* Complete Workout Section */}
              {completedExercises.size === (workout as any).exercises?.length && !isWorkoutCompleted && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                  <div className="text-center mb-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                      Workout Complete! 🎉
                    </h3>
                    <p className="text-fitness-muted-foreground">
                      Great job! You've completed all exercises. Update your goal progress to track your achievement.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowGoalUpdateModal(true)}
                      className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Update Goal Progress
                    </Button>
                    <Button
                      onClick={() => setIsWorkoutCompleted(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      Skip for Now
                    </Button>
                  </div>
                </div>
              )}

              {/* Workout Completed Message */}
              {isWorkoutCompleted && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Workout completed successfully!</span>
                  </div>
                </div>
              )}
            </div>
      </div>

          {/* Right Column - Exercise List */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
        <Card>
          <CardHeader>
                  <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
                  <div className="space-y-3 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-neutral-700 py-5 px-6">
                  {(workout as any).exercises.map((exercise: any, index: number) => {
                    const isCompleted = completedExercises.has(index);
                    return (
                      <button
                        key={exercise.exerciseId || index}
                        onClick={() => setSelectedExerciseIndex(index)}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 border border-neutral-700 ${
                          index === selectedExerciseIndex
                            ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20 bg-gradient-to-br from-purple-600/10 via-blue-500/10 to-cyan-400/10'
                            : 'hover:bg-gradient-to-br hover:from-purple-600/5 hover:via-blue-500/5 hover:to-cyan-400/5 hover:ring-1 hover:ring-cyan-400/50'
                        } ${isCompleted ? 'bg-green-900/20 border border-green-500/30' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="bg-white text-black px-2 py-1 rounded-full text-xs font-medium">
                            {exercise.duration || exercise.sets * 2} min
                    </div>
                          {isCompleted && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                    </div>
                          )}
                  </div>
                        <h4 className="font-medium text-fitness-foreground text-sm">
                          {exercise.name}
                        </h4>
                        <p className="text-xs text-fitness-muted-foreground mt-1">
                          {exercise.category}
                        </p>
                      </button>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Goal Update Modal */}
      {goalId && (
        <WorkoutGoalUpdateModal
          isOpen={showGoalUpdateModal}
          onClose={() => setShowGoalUpdateModal(false)}
          goalId={goalId}
          onComplete={handleGoalUpdate}
        />
      )}
    </div>
  );
}
