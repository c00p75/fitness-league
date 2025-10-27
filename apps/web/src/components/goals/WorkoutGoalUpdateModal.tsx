import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGoal } from "../../services/firestore/goalsService";
import { Button } from "@fitness-league/ui";
import { Card } from "@fitness-league/ui";
import { Input } from "@fitness-league/ui";
import { Label } from "@fitness-league/ui";
import toast from "react-hot-toast";
import { X, TrendingUp, Plus, Minus, Target, CheckCircle } from "lucide-react";

interface WorkoutGoalUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  onComplete: (goalUpdates: Array<{ goalId: string; progressValue: number }>) => void;
}

const goalTypeLabels = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
  endurance_improvement: "Endurance",
  strength_gain: "Strength",
};

export function WorkoutGoalUpdateModal({ isOpen, onClose, goalId, onComplete }: WorkoutGoalUpdateModalProps) {
  const [progressValue, setProgressValue] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch goal details
  const { data: goal, isLoading: goalLoading } = useQuery({
    queryKey: ['goals', goalId],
    queryFn: () => getGoal(goalId),
    enabled: !!goalId && isOpen,
  });

  // Update form when goal prop changes
  useEffect(() => {
    if (goal && typeof goal === 'object' && 'currentValue' in goal) {
      setProgressValue((goal as any).currentValue.toString());
      setIsCompleted(false);
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericValue = parseFloat(progressValue);
    if (isNaN(numericValue) || numericValue < 0) {
      toast.error("Please enter a valid progress value", {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      return;
    }

    // Call the completion callback with goal updates
    onComplete([{ goalId, progressValue: numericValue }]);
    
    // Show success message
    const progressPercentage = (numericValue / goal!.targetValue) * 100;
    if (progressPercentage >= 100) {
      setIsCompleted(true);
      toast.success("Goal Completed!", {
        duration: 4000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    } else {
      toast.success("Progress updated", {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    }
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
      setIsCompleted(false);
    }, 1500);
  };

  const handleIncrement = (amount: number) => {
    const current = parseFloat(progressValue) || 0;
    const newVal = Math.max(0, current + amount);
    setProgressValue(newVal.toString());
  };

  const handleSetToTarget = () => {
    if (goal) {
      setProgressValue(goal.targetValue.toString());
    }
  };

  if (!isOpen || !goal) return null;

  const currentProgress = parseFloat(progressValue) || 0;
  const progressPercentage = Math.min(100, (currentProgress / goal.targetValue) * 100);
  const isGoalReached = currentProgress >= goal.targetValue;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card rounded-lg shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-fitness-primary" />
              </div>
              <h2 className="text-xl font-semibold text-fitness-foreground">
                Update Goal Progress
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Goal Info */}
          <div className="mb-6 p-4 bg-fitness-primary/5 rounded-lg">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-fitness-primary mr-2" />
              <h3 className="font-semibold text-fitness-foreground">
                {goalTypeLabels[goal.type as keyof typeof goalTypeLabels] || goal.type}
              </h3>
            </div>
            <div className="text-sm text-fitness-muted-foreground">
              Target: {goal.targetValue} {goal.unit}
            </div>
          </div>

          {/* Current Progress Display */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-fitness-foreground">
                Current Progress
              </span>
              <span className="text-sm text-fitness-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  isGoalReached ? "bg-green-500" : "bg-fitness-primary"
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-center text-sm text-fitness-muted-foreground">
              {currentProgress.toFixed(1)} / {goal.targetValue} {goal.unit}
            </div>
          </div>

          {/* Success Message */}
          {isCompleted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Goal Completed!</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Progress Input */}
            <div>
              <Label htmlFor="progressValue" className="text-sm font-medium text-fitness-foreground">
                Update Progress
              </Label>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncrement(-1)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <Input
                      id="progressValue"
                      type="number"
                      step="0.1"
                      min="0"
                      value={progressValue}
                      onChange={(e) => setProgressValue(e.target.value)}
                      placeholder="Enter progress"
                      className="text-center"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncrement(1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleIncrement(5)}
                className="text-xs"
              >
                +5
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleIncrement(10)}
                className="text-xs"
              >
                +10
              </Button>
            </div>

            {/* Complete Goal Button */}
            {!isGoalReached && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSetToTarget}
                className="w-full"
              >
                <Target className="w-4 h-4 mr-2" />
                Complete Goal ({goal.targetValue} {goal.unit})
              </Button>
            )}

            {/* Motivational Message */}
            {progressPercentage > 0 && progressPercentage < 100 && (
              <div className="text-center text-sm text-fitness-muted-foreground">
                {progressPercentage < 25 && "Keep going! Every step counts"}
                {progressPercentage >= 25 && progressPercentage < 50 && "Great progress! You're on track"}
                {progressPercentage >= 50 && progressPercentage < 75 && "You're halfway there! Keep it up"}
                {progressPercentage >= 75 && progressPercentage < 100 && "Almost there! You're so close!"}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isNaN(parseFloat(progressValue)) || parseFloat(progressValue) < 0}
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
              >
                Update Progress
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
