import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { Button } from "@fitness-league/ui";
import { Card } from "@fitness-league/ui";
import { Input } from "@fitness-league/ui";
import { Label } from "@fitness-league/ui";
import { X, Target, Calendar, Hash } from "lucide-react";

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: {
    id: string;
    type: string;
    targetValue: number;
    unit: string;
    targetDate: Date;
  };
}

const goalTypes = [
  { value: "weight_loss", label: "Weight Loss", icon: "🔥", unit: "kg" },
  { value: "muscle_gain", label: "Muscle Gain", icon: "💪", unit: "kg" },
  { value: "flexibility", label: "Flexibility", icon: "🧘", unit: "sessions" },
  { value: "general_fitness", label: "General Fitness", icon: "🏃", unit: "workouts" },
  { value: "endurance_improvement", label: "Endurance", icon: "⚡", unit: "minutes" },
  { value: "strength_gain", label: "Strength", icon: "🏋️", unit: "kg" },
];

export function EditGoalModal({ isOpen, onClose, goal }: EditGoalModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: goal.type,
    targetValue: goal.targetValue.toString(),
    unit: goal.unit,
    targetDate: goal.targetDate.toISOString().split('T')[0],
  });

  // Update form data when goal prop changes
  useEffect(() => {
    setFormData({
      type: goal.type,
      targetValue: goal.targetValue.toString(),
      unit: goal.unit,
      targetDate: goal.targetDate.toISOString().split('T')[0],
    });
  }, [goal]);

  const updateGoalMutation = trpc.goals.updateGoal.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["goals", "getGoals"]] });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.targetValue || !formData.targetDate) {
      return;
    }

    await updateGoalMutation.mutateAsync({
      goalId: goal.id,
      type: formData.type,
      targetValue: parseFloat(formData.targetValue),
      unit: formData.unit,
      targetDate: new Date(formData.targetDate),
    });
  };

  const handleGoalTypeSelect = (type: string) => {
    const selectedGoalType = goalTypes.find(gt => gt.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      unit: selectedGoalType?.unit || prev.unit,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card rounded-lg shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-fitness-primary" />
              </div>
              <h2 className="text-xl font-semibold text-fitness-foreground">
                Edit Goal
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Goal Type */}
            <div>
              <Label className="text-sm font-medium text-fitness-foreground">
                Goal Type
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {goalTypes.map((goalType) => (
                  <Button
                    key={goalType.value}
                    type="button"
                    variant={formData.type === goalType.value ? "default" : "outline"}
                    onClick={() => handleGoalTypeSelect(goalType.value)}
                    className={`justify-start ${
                      formData.type === goalType.value
                        ? "bg-fitness-primary hover:bg-fitness-primary/90"
                        : ""
                    }`}
                  >
                    <span className="mr-2">{goalType.icon}</span>
                    {goalType.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Target Value */}
            <div>
              <Label htmlFor="targetValue" className="text-sm font-medium text-fitness-foreground">
                Target Value
              </Label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fitness-muted-foreground" />
                <Input
                  id="targetValue"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.targetValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                  placeholder="Enter your target"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-fitness-muted-foreground mt-1">
                Unit: {formData.unit || "Select a goal type first"}
              </p>
            </div>

            {/* Custom Unit (if needed) */}
            {formData.type && (
              <div>
                <Label htmlFor="unit" className="text-sm font-medium text-fitness-foreground">
                  Unit (optional)
                </Label>
                <Input
                  id="unit"
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., kg, lbs, sessions, minutes"
                  className="mt-1"
                />
              </div>
            )}

            {/* Target Date */}
            <div>
              <Label htmlFor="targetDate" className="text-sm font-medium text-fitness-foreground">
                Target Date
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fitness-muted-foreground" />
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-fitness-muted-foreground mt-1">
                When do you want to achieve this goal?
              </p>
            </div>

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
                disabled={updateGoalMutation.isPending || !formData.type || !formData.targetValue || !formData.targetDate}
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
              >
                {updateGoalMutation.isPending ? "Updating..." : "Update Goal"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
