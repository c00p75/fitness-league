import { Card } from "@fitness-league/ui";
import { Button } from "@fitness-league/ui";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@fitness-league/ui";
import { 
  Play, 
  Calendar, 
  Clock, 
  Dumbbell,
  Users,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";

interface WorkoutPlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    durationWeeks: number;
    workoutsPerWeek: number;
    difficulty: string;
    exercises: Array<{
      exerciseId: string;
      name?: string;
      category?: string;
      sets: number;
      reps?: number;
      duration?: number;
    }>;
    createdAt: Date;
  };
  onStartWorkout: () => void;
  onUpdateWorkout: () => void;
  onDeleteWorkout: () => void;
  isStarting?: boolean;
  isDeleting?: boolean;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800", 
  advanced: "bg-red-100 text-red-800",
};

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function WorkoutPlanCard({ plan, onStartWorkout, onUpdateWorkout, onDeleteWorkout, isStarting, isDeleting }: WorkoutPlanCardProps) {
  const totalExercises = plan.exercises.length;
  const estimatedDuration = plan.exercises.reduce((total, exercise) => {
    if (exercise.duration) {
      return total + (exercise.duration * exercise.sets);
    } else {
      // Estimate 2 minutes per set for strength exercises
      return total + (exercise.sets * 2);
    }
  }, 0);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-fitness-foreground mb-1">
            {plan.name}
          </h3>
          <p className="text-sm text-fitness-muted-foreground mb-3">
            {plan.description}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[plan.difficulty as keyof typeof difficultyColors]}`}>
              {difficultyLabels[plan.difficulty as keyof typeof difficultyLabels]}
            </span>
          </div>
        </div>
        
        {/* Three-dot menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onUpdateWorkout}>
              <Edit className="w-4 h-4 mr-2" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDeleteWorkout}
              className="text-red-600 focus:text-red-600"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Plan Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-fitness-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-fitness-muted-foreground">Duration</p>
            <p className="text-sm font-medium text-fitness-foreground">
              {plan.durationWeeks} week{plan.durationWeeks > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 text-fitness-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-fitness-muted-foreground">Frequency</p>
            <p className="text-sm font-medium text-fitness-foreground">
              {plan.workoutsPerWeek}/week
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Dumbbell className="w-4 h-4 text-fitness-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-fitness-muted-foreground">Exercises</p>
            <p className="text-sm font-medium text-fitness-foreground">
              {totalExercises}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-fitness-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-fitness-muted-foreground">Est. Time</p>
            <p className="text-sm font-medium text-fitness-foreground">
              ~{Math.round(estimatedDuration)}m
            </p>
          </div>
        </div>
      </div>

      {/* Exercise Preview */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {plan.exercises.slice(0, 3).map((exercise, index) => (
            <span
              key={exercise.exerciseId || index}
              className="px-2 py-1 bg-fitness-primary/10 text-fitness-primary text-xs rounded"
            >
              {exercise.name || `Exercise ${index + 1}`}
            </span>
          ))}
          {plan.exercises.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{plan.exercises.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={onStartWorkout}
        disabled={isStarting}
        className="w-full bg-fitness-primary hover:bg-fitness-primary/90 mt-4"
      >
        {isStarting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Starting...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start Workout
          </>
        )}
      </Button>
    </Card>
  );
}
