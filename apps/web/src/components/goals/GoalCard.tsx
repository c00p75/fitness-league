import { Card } from "@fitness-league/ui";
import { Button } from "@fitness-league/ui";
import { 
  TrendingUp, 
  Calendar, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock
} from "lucide-react";

interface GoalCardProps {
  goal: {
    id: string;
    type: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    targetDate: Date;
    isActive: boolean;
    createdAt: Date;
  };
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const goalTypeIcons = {
  weight_loss: "🔥",
  muscle_gain: "💪",
  flexibility: "🧘",
  general_fitness: "🏃",
  endurance: "⚡",
  strength: "🏋️",
};

const goalTypeLabels = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain", 
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
  endurance: "Endurance",
  strength: "Strength",
};

export function GoalCard({ goal, onEdit, onDelete, isDeleting }: GoalCardProps) {
  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isCompleted = goal.currentValue >= goal.targetValue;
  const daysRemaining = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0 && !isCompleted;

  const getProgressColor = () => {
    if (isCompleted) return "bg-green-500";
    if (isOverdue) return "bg-red-500";
    if (progress > 75) return "bg-green-400";
    if (progress > 50) return "bg-yellow-400";
    return "bg-fitness-primary";
  };

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isOverdue) return <Clock className="w-5 h-5 text-red-500" />;
    return <TrendingUp className="w-5 h-5 text-fitness-primary" />;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="text-2xl mr-3">
            {goalTypeIcons[goal.type as keyof typeof goalTypeIcons] || "🎯"}
          </div>
          <div>
            <h3 className="font-semibold text-fitness-foreground">
              {goalTypeLabels[goal.type as keyof typeof goalTypeLabels] || goal.type}
            </h3>
            <p className="text-sm text-fitness-muted-foreground">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-fitness-foreground">
            Progress
          </span>
          <span className="text-sm text-fitness-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-fitness-muted-foreground uppercase tracking-wide">
            Current
          </p>
          <p className="text-lg font-semibold text-fitness-foreground">
            {goal.currentValue}
          </p>
        </div>
        <div>
          <p className="text-xs text-fitness-muted-foreground uppercase tracking-wide">
            Target
          </p>
          <p className="text-lg font-semibold text-fitness-foreground">
            {goal.targetValue}
          </p>
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-1 text-fitness-muted-foreground" />
          <span className={isOverdue ? "text-red-500" : "text-fitness-muted-foreground"}>
            {isOverdue 
              ? `${Math.abs(daysRemaining)} days overdue`
              : isCompleted
              ? "Completed!"
              : `${daysRemaining} days left`
            }
          </span>
        </div>
        {isCompleted && (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="font-medium">Achieved!</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              // Navigate to update progress or start workout
              console.log("Update progress for goal:", goal.id);
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Update Progress
          </Button>
        </div>
      )}
    </Card>
  );
}
