import { useState } from "react";
import { Button, Card, Badge, Progress } from "@fitness-league/ui";
import { trpc } from "../../lib/trpc";
import { ArrowLeft, Play, CheckCircle, Clock, Target, Youtube } from "lucide-react";
import { YouTubePlayer } from "../video/YouTubePlayer";
import toast from "react-hot-toast";

interface WorkoutViewProps {
  workout: any;
  goal: any;
  onBack: () => void;
  onComplete: () => void;
}

export function WorkoutView({ workout, goal, onBack, onComplete }: WorkoutViewProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const exercises = workout.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const progressPercentage = (completedExercises.size / exercises.length) * 100;

  // If exercise doesn't have full data, show a helpful message
  if (currentExercise && !currentExercise.name) {
    return (
      <div className="text-center p-8">
        <p className="text-fitness-text-secondary">
          Exercise data is incomplete. Please regenerate your workout plan.
        </p>
        <Button onClick={onBack} className="mt-4">
          Back to Goal
        </Button>
      </div>
    );
  }

  const markExerciseComplete = (exerciseIndex: number) => {
    const newCompleted = new Set(completedExercises);
    newCompleted.add(exerciseIndex);
    setCompletedExercises(newCompleted);
    
    // Auto-advance to next exercise if not the last one
    if (exerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
    }
  };

  const goToExercise = (index: number) => {
    setCurrentExerciseIndex(index);
    setPlayingVideo(null);
  };

  const playVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const completeWorkout = () => {
    // Here you would typically save workout completion to the backend
    toast.success("Workout completed! Great job! 🎉");
    onComplete();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800", 
      advanced: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  if (playingVideo) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPlayingVideo(null)}
            className="text-fitness-text-secondary hover:text-fitness-text"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercise
          </Button>
          <h3 className="text-lg font-semibold text-fitness-text">
            {currentExercise?.name} - Video Tutorial
          </h3>
        </div>
        
        <div className="bg-black rounded-lg overflow-hidden">
          <YouTubePlayer
            videoId={playingVideo}
            width="100%"
            height="400px"
            showControls={true}
            allowFullscreen={true}
            trackProgress={true}
            onComplete={() => {
              toast.success("Video completed! Ready to do the exercise?");
            }}
          />
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setPlayingVideo(null)}
            variant="outline"
          >
            Back to Exercise
          </Button>
          <Button
            onClick={() => markExerciseComplete(currentExerciseIndex)}
            className="bg-fitness-primary hover:bg-fitness-primary-dark text-black"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      </div>
    );
  }

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
            Back to Goal
          </Button>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-fitness-primary">
            {progressPercentage.toFixed(0)}%
          </div>
          <div className="text-sm text-fitness-text-secondary">
            {completedExercises.size} of {exercises.length} exercises
          </div>
        </div>
      </div>

      {/* Workout Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-fitness-text">{workout.name}</h2>
            <p className="text-fitness-text-secondary">
              Goal: {goal.title}
            </p>
          </div>
          <Badge className={getDifficultyColor(workout.difficulty)}>
            {workout.difficulty}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-fitness-primary" />
            <div>
              <div className="text-sm text-fitness-text-secondary">Exercises</div>
              <div className="font-semibold">{exercises.length}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-fitness-primary" />
            <div>
              <div className="text-sm text-fitness-text-secondary">Duration</div>
              <div className="font-semibold">{workout.duration} min</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-fitness-primary" />
            <div>
              <div className="text-sm text-fitness-text-secondary">Completed</div>
              <div className="font-semibold">{completedExercises.size}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Exercise */}
      {currentExercise && (
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-fitness-text">
                {currentExercise.name}
              </h3>
              <p className="text-fitness-text-secondary">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </p>
            </div>
            <Badge className={getDifficultyColor(currentExercise.difficulty)}>
              {currentExercise.difficulty}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exercise Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-fitness-text mb-2">Instructions</h4>
                <p className="text-fitness-text-secondary">
                  {currentExercise.instructions || "Follow the video tutorial for proper form."}
                </p>
              </div>

              {currentExercise.sets && (
                <div>
                  <h4 className="font-semibold text-fitness-text mb-2">Sets & Reps</h4>
                  <p className="text-fitness-text-secondary">
                    {currentExercise.sets} sets × {currentExercise.reps} reps
                  </p>
                </div>
              )}

              {currentExercise.duration && (
                <div>
                  <h4 className="font-semibold text-fitness-text mb-2">Duration</h4>
                  <p className="text-fitness-text-secondary">
                    {formatDuration(currentExercise.duration)} seconds
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                {currentExercise.youtubeVideoId && (
                  <Button
                    onClick={() => playVideo(currentExercise.youtubeVideoId)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </Button>
                )}
                <Button
                  onClick={() => markExerciseComplete(currentExerciseIndex)}
                  className="bg-fitness-primary hover:bg-fitness-primary-dark text-black"
                  disabled={completedExercises.has(currentExerciseIndex)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completedExercises.has(currentExerciseIndex) ? "Completed" : "Mark Complete"}
                </Button>
              </div>
            </div>

            {/* Exercise List */}
            <div>
              <h4 className="font-semibold text-fitness-text mb-3">All Exercises</h4>
              <div className="space-y-2">
                {exercises.map((exercise: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentExerciseIndex
                        ? "border-fitness-primary bg-fitness-primary/10"
                        : completedExercises.has(index)
                        ? "border-green-200 bg-green-50"
                        : "border-fitness-border hover:border-fitness-primary/50"
                    }`}
                    onClick={() => goToExercise(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          index === currentExerciseIndex
                            ? "bg-fitness-primary text-black"
                            : completedExercises.has(index)
                            ? "bg-green-500 text-white"
                            : "bg-fitness-border text-fitness-text-secondary"
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-fitness-text">{exercise.name}</span>
                      </div>
                      {completedExercises.has(index) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Complete Workout Button */}
      {completedExercises.size === exercises.length && (
        <div className="text-center">
          <Button
            onClick={completeWorkout}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete Workout
          </Button>
        </div>
      )}
    </div>
  );
}
