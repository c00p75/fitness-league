import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { Button, Badge, Progress } from "@fitness-league/ui";
import { ArrowLeft, Play, Check, Clock, Target, Dumbbell, Eye } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

// Video Player Component
const VideoPlayer = ({ videoId, exerciseName }: { videoId?: string; exerciseName: string }) => {
  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No video available</p>
          <p className="text-sm opacity-75">Follow the instructions below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
      title={exerciseName}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  </div>
  );
};

// Exercise Carousel Component
const ExerciseCarousel = ({ 
  exercises, 
  currentIndex, 
  onExerciseSelect 
}: { 
  exercises: any[]; 
  currentIndex: number; 
  onExerciseSelect: (index: number) => void; 
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Exercises in this session</h3>
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-700">
      {exercises?.map((exercise: any, index: number) => (
        <button
          key={exercise.exerciseId || index}
          onClick={() => onExerciseSelect(index)}
          className={`flex-shrink-0 w-48 rounded-xl overflow-hidden transition-all ${
            index === currentIndex
              ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20'
              : 'hover:ring-2 hover:ring-neutral-600'
          }`}
        >
          <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 relative">
            {exercise.youtubeVideoId ? (
              <img
                src={`https://img.youtube.com/vi/${exercise.youtubeVideoId}/mqdefault.jpg`}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-neutral-600" />
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
              {exercise.duration || exercise.sets * 2} min
            </div>
            {exercise.completed && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
            )}
          </div>
          <div className="p-3 bg-neutral-900 text-left">
            <p className="font-medium text-sm truncate">{exercise.name}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// Session Controls Sidebar Component
const SessionControlsSidebar = ({
  isPlaying,
  progressPercentage,
  completedExercises,
  totalExercises,
  currentExercise,
  onStartSession,
  onCompleteExercise,
  onPreviousExercise,
  onNextExercise,
  currentExerciseIndex,
  onCompleteSession,
  completeSessionMutation
}: {
  isPlaying: boolean;
  progressPercentage: number;
  completedExercises: number;
  totalExercises: number;
  currentExercise: any;
  onStartSession: () => void;
  onCompleteExercise: () => void;
  onPreviousExercise: () => void;
  onNextExercise: () => void;
  currentExerciseIndex: number;
  onCompleteSession: () => void;
  completeSessionMutation: any;
}) => (
  <>
    {/* Progress Card */}
    <div className="bg-neutral-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Session Progress</h3>
        <Badge className="bg-cyan-400/20 text-cyan-400">
          {isPlaying ? 'In Progress' : 'Ready'}
        </Badge>
      </div>
      <Progress value={progressPercentage} className="h-2 mb-2" />
      <p className="text-sm text-neutral-400">
        {completedExercises} of {totalExercises} completed
      </p>
    </div>

    {/* Current Exercise Details */}
    <div className="bg-neutral-900 rounded-2xl p-6 space-y-4">
      <h3 className="font-semibold">Current Exercise</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-neutral-800 rounded-lg">
          <Target className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
          <p className="text-2xl font-bold">{currentExercise?.sets}</p>
          <p className="text-xs text-neutral-400">Sets</p>
        </div>
        {currentExercise?.reps && (
          <div className="text-center p-3 bg-neutral-800 rounded-lg">
            <Dumbbell className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <p className="text-2xl font-bold">{currentExercise.reps}</p>
            <p className="text-xs text-neutral-400">Reps</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!isPlaying ? (
          <Button
            onClick={onStartSession}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        ) : (
          <Button
            onClick={onCompleteExercise}
            disabled={currentExercise?.completed}
            className="w-full bg-green-600 hover:bg-green-500"
          >
            <Check className="w-4 h-4 mr-2" />
            Complete Exercise
          </Button>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPreviousExercise}
            disabled={currentExerciseIndex === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={onNextExercise}
            disabled={currentExerciseIndex === totalExercises - 1}
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    {/* Complete Session Button */}
    {completedExercises === totalExercises && (
      <Button
        onClick={onCompleteSession}
        disabled={completeSessionMutation.isPending}
        className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold"
      >
        <Check className="w-4 h-4 mr-2" />
        Complete Session
      </Button>
    )}
  </>
);

export function WorkoutSessionPage() {
  const { goalId, workoutId, sessionId } = useParams<{ 
    goalId: string; 
    workoutId: string; 
    sessionId: string; 
  }>();
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch session details
  const { data: session, isLoading: sessionLoading } = trpc.workouts.getSession.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  // Fetch workout plan details
  const { data: workout, isLoading: workoutLoading } = trpc.workouts.getPlan.useQuery(
    { planId: workoutId! },
    { enabled: !!workoutId }
  );

  // Fetch goal details
  const { data: goal, isLoading: goalLoading } = trpc.goals.getGoal.useQuery(
    { goalId: goalId! },
    { enabled: !!goalId }
  );

  // Update session mutation
  const updateSessionMutation = trpc.workouts.updateSession.useMutation();
  const completeSessionMutation = trpc.workouts.completeSession.useMutation();

  if (sessionLoading || workoutLoading || goalLoading) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || !workout || !goal) {
    return (
      <div className="min-h-screen bg-fitness-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fitness-foreground mb-4">Session Not Found</h2>
          <p className="text-fitness-muted-foreground mb-6">The workout session you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workout
          </Button>
        </div>
      </div>
    );
  }


  const currentExercise = (session as any)?.exercises?.[currentExerciseIndex];
  const completedExercises = (session as any)?.exercises?.filter((ex: any) => ex.completed).length || 0;
  const totalExercises = (session as any)?.exercises?.length || 0;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const handleStartSession = () => {
    setIsPlaying(true);
  };

  const handleCompleteExercise = async () => {
    if (!currentExercise) return;

    const updatedExercises = (session as any).exercises.map((ex: any, index: number) => 
      index === currentExerciseIndex ? { ...ex, completed: true } : ex
    );

    await updateSessionMutation.mutateAsync({
      sessionId: sessionId!,
      exercises: updatedExercises,
    });

    // Move to next exercise
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handleCompleteSession = async () => {
    await completeSessionMutation.mutateAsync({ sessionId: sessionId! });
    navigate(`/goals/${goalId}/workouts/${workoutId}`);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with back button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/goals/${goalId}/workouts/${workoutId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Video Player & Exercise Carousel */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer 
              videoId={currentExercise?.youtubeVideoId} 
              exerciseName={currentExercise?.name || ''} 
            />
            
            {/* Exercise Title & Description */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentExercise?.name}</h1>
              <p className="text-neutral-400">{currentExercise?.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-neutral-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {totalExercises} exercises
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {(workout as any).durationWeeks || 4} weeks
                </span>
              </div>
            </div>

            {/* Exercise Carousel */}
            <ExerciseCarousel 
              exercises={(session as any)?.exercises || []}
              currentIndex={currentExerciseIndex}
              onExerciseSelect={setCurrentExerciseIndex}
            />
          </div>

          {/* Right: Session Controls & Progress */}
          <div className="space-y-6">
            <SessionControlsSidebar
              isPlaying={isPlaying}
              progressPercentage={progressPercentage}
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              currentExercise={currentExercise}
              onStartSession={handleStartSession}
              onCompleteExercise={handleCompleteExercise}
              onPreviousExercise={handlePreviousExercise}
              onNextExercise={handleNextExercise}
              currentExerciseIndex={currentExerciseIndex}
              onCompleteSession={handleCompleteSession}
              completeSessionMutation={completeSessionMutation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
