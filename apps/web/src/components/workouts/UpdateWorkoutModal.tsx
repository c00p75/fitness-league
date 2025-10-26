import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { Button } from "@fitness-league/ui";
import { Card } from "@fitness-league/ui";
import { Input } from "@fitness-league/ui";
import { Label } from "@fitness-league/ui";
import { X } from "lucide-react";

interface UpdateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: {
    id: string;
    name: string;
    description: string;
    durationWeeks: number;
    workoutsPerWeek: number;
    difficulty: string;
  };
}

export function UpdateWorkoutModal({ isOpen, onClose, workout }: UpdateWorkoutModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: workout.name,
    description: workout.description,
    durationWeeks: workout.durationWeeks,
    workoutsPerWeek: workout.workoutsPerWeek,
    difficulty: workout.difficulty,
  });

  const updateWorkoutMutation = trpc.workouts.updatePlan.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["workouts", "getPlans"]] });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateWorkoutMutation.mutateAsync({
      planId: workout.id,
      ...formData,
    });
  };

  // Update form data when workout changes
  useEffect(() => {
    setFormData({
      name: workout.name,
      description: workout.description,
      durationWeeks: workout.durationWeeks,
      workoutsPerWeek: workout.workoutsPerWeek,
      difficulty: workout.difficulty,
    });
  }, [workout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-fitness-foreground">
                Update Workout Plan
              </h2>
              <p className="text-sm text-fitness-muted-foreground">
                Modify your workout plan details
              </p>
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
            {/* Workout Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-fitness-foreground">
                Workout Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter workout name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-fitness-foreground">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter workout description"
                required
              />
            </div>

            {/* Duration and Frequency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="durationWeeks" className="text-sm font-medium text-fitness-foreground">
                  Duration (weeks)
                </Label>
                <Input
                  id="durationWeeks"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.durationWeeks}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationWeeks: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="workoutsPerWeek" className="text-sm font-medium text-fitness-foreground">
                  Workouts/Week
                </Label>
                <Input
                  id="workoutsPerWeek"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.workoutsPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, workoutsPerWeek: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <Label htmlFor="difficulty" className="text-sm font-medium text-fitness-foreground">
                Difficulty
              </Label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fitness-primary bg-background"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
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
                disabled={updateWorkoutMutation.isPending}
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
              >
                {updateWorkoutMutation.isPending ? "Updating..." : "Update Workout"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
