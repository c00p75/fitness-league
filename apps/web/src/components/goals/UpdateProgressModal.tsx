import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { Button } from "@fitness-league/ui";
import { Card } from "@fitness-league/ui";
import { Input } from "@fitness-league/ui";
import { Label } from "@fitness-league/ui";
import toast from "react-hot-toast";
import { X, TrendingUp, Plus, Minus, CheckCircle, Star } from "lucide-react";

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: {
    id: string;
    type: string;
    currentValue: number;
    targetValue: number;
    unit: string;
  };
}

const goalTypeIcons = {
  weight_loss: "🔥",
  muscle_gain: "💪",
  flexibility: "🧘",
  general_fitness: "🏃",
  endurance_improvement: "⚡",
  strength_gain: "🏋️",
};

const goalTypeLabels = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  flexibility: "Flexibility",
  general_fitness: "General Fitness",
  endurance_improvement: "Endurance",
  strength_gain: "Strength",
};

export function UpdateProgressModal({ isOpen, onClose, goal }: UpdateProgressModalProps) {
  const queryClient = useQueryClient();
  const [newValue, setNewValue] = useState(goal.currentValue.toString());
  const [isCompleted, setIsCompleted] = useState(false);

  // Update form when goal prop changes
  useEffect(() => {
    setNewValue(goal.currentValue.toString());
    setIsCompleted(false);
  }, [goal]);

  const updateProgressMutation = trpc.goals.updateGoalProgress.useMutation({
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [["goals", "getGoals"]] });
      
      // Show different success messages based on progress
      const progressPercentage = (variables.currentValue / goal.targetValue) * 100;
      
      if (progressPercentage >= 100) {
        setIsCompleted(true);
        // Show goal completed toast
        toast.success("Goal Completed! 🎉", {
          duration: 4000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
        setTimeout(() => {
          onClose();
          setIsCompleted(false);
        }, 2000);
      } else {
        // Show progress updated toast
        toast.success("Progress updated", {
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    },
    onError: () => {
      toast.error("Failed to update progress. Please try again.", {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericValue = parseFloat(newValue);
    if (isNaN(numericValue) || numericValue < 0) {
      return;
    }

    await updateProgressMutation.mutateAsync({
      goalId: goal.id,
      currentValue: numericValue,
    });
  };

  const handleIncrement = (amount: number) => {
    const current = parseFloat(newValue) || 0;
    const newVal = Math.max(0, current + amount);
    setNewValue(newVal.toString());
  };

  const handleSetToTarget = () => {
    setNewValue(goal.targetValue.toString());
  };

  const currentProgress = parseFloat(newValue) || 0;
  const progressPercentage = Math.min(100, (currentProgress / goal.targetValue) * 100);
  const isGoalReached = currentProgress >= goal.targetValue;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card rounded-lg shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-fitness-primary" />
              </div>
              <h2 className="text-xl font-semibold text-fitness-foreground">
                Update Progress
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
              <span className="text-2xl mr-2">
                {goalTypeIcons[goal.type as keyof typeof goalTypeIcons] || "🎯"}
              </span>
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
                <span className="font-medium">Goal Completed! 🎉</span>
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
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
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
                <Star className="w-4 h-4 mr-2" />
                Complete Goal ({goal.targetValue} {goal.unit})
              </Button>
            )}

            {/* Motivational Message */}
            {progressPercentage > 0 && progressPercentage < 100 && (
              <div className="text-center text-sm text-fitness-muted-foreground">
                {progressPercentage < 25 && "Keep going! Every step counts 💪"}
                {progressPercentage >= 25 && progressPercentage < 50 && "Great progress! You're on track 🎯"}
                {progressPercentage >= 50 && progressPercentage < 75 && "You're halfway there! Keep it up 🔥"}
                {progressPercentage >= 75 && progressPercentage < 100 && "Almost there! You're so close! ⚡"}
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
                disabled={updateProgressMutation.isPending || isNaN(parseFloat(newValue)) || parseFloat(newValue) < 0}
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
              >
                {updateProgressMutation.isPending ? "Updating..." : "Update Progress"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
