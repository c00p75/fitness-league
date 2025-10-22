import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { Button } from "@fitness-league/ui";
import { Card } from "@fitness-league/ui";
import { Input } from "@fitness-league/ui";
import { Label } from "@fitness-league/ui";
import { X, Target, Calendar, Hash } from "lucide-react";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const goalTypes = [
  { value: "weight_loss", label: "Weight Loss", icon: "🔥", unit: "kg" },
  { value: "muscle_gain", label: "Muscle Gain", icon: "💪", unit: "kg" },
  { value: "flexibility", label: "Flexibility", icon: "🧘", unit: "sessions" },
  { value: "general_fitness", label: "General Fitness", icon: "🏃", unit: "workouts" },
  { value: "endurance_improvement", label: "Endurance", icon: "⚡", unit: "minutes" },
  { value: "strength_gain", label: "Strength", icon: "🏋️", unit: "kg" },
];

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: "",
    targetValue: "",
    unit: "",
    targetDate: "",
  });

  const createGoalMutation = trpc.goals.createGoal.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["goals", "getGoals"]] });
      onClose();
      setFormData({ type: "", targetValue: "", unit: "", targetDate: "" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.targetValue || !formData.targetDate) {
      return;
    }

    const selectedGoalType = goalTypes.find(gt => gt.value === formData.type);
    const unit = formData.unit || selectedGoalType?.unit || "";

    await createGoalMutation.mutateAsync({
      type: formData.type as "weight_loss" | "muscle_gain" | "flexibility" | "general_fitness" | "endurance_improvement" | "strength_gain",
      targetValue: parseFloat(formData.targetValue),
      unit,
      targetDate: new Date(formData.targetDate),
    });
  };

  const handleGoalTypeSelect = (type: string) => {
    const selectedGoalType = goalTypes.find(gt => gt.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      unit: selectedGoalType?.unit || "",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-fitness-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-fitness-foreground">
                  Create New Goal
                </h2>
                <p className="text-sm text-fitness-muted-foreground">
                  Set a target to work towards
                </p>
              </div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Type Selection */}
            <div>
              <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                What do you want to achieve?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {goalTypes.map((goalType) => (
                  <button
                    key={goalType.value}
                    type="button"
                    onClick={() => handleGoalTypeSelect(goalType.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.type === goalType.value
                        ? "border-fitness-primary bg-fitness-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{goalType.icon}</span>
                      <span className="font-medium text-sm">{goalType.label}</span>
                    </div>
                    <p className="text-xs text-fitness-muted-foreground">
                      {goalType.unit}
                    </p>
                  </button>
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
                disabled={createGoalMutation.isPending || !formData.type || !formData.targetValue || !formData.targetDate}
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
              >
                {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
