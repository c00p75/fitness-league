import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { Button } from "@fitness-league/ui";
import { Card } from "@fitness-league/ui";
import { Label } from "@fitness-league/ui";
import { X, Target, Calendar, Users, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface PlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Array<{
    id: string;
    type: string;
    targetValue: number;
    unit: string;
  }>;
}

const durationOptions = [
  { value: 4, label: "4 weeks", description: "Quick start program" },
  { value: 8, label: "8 weeks", description: "Balanced program" },
  { value: 12, label: "12 weeks", description: "Comprehensive program" },
];

const frequencyOptions = [
  { value: 2, label: "2x per week", description: "Light activity" },
  { value: 3, label: "3x per week", description: "Moderate activity" },
  { value: 4, label: "4x per week", description: "Active lifestyle" },
  { value: 5, label: "5x per week", description: "High intensity" },
];

export function PlanGenerator({ isOpen, onClose, goals }: PlanGeneratorProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goalId: "",
    durationWeeks: 4,
    workoutsPerWeek: 3,
    difficulty: "beginner",
  });

  const generatePlanMutation = trpc.workouts.generatePlan.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["workouts", "getPlans"]] });
      onClose();
      setStep(1);
      setFormData({ goalId: "", durationWeeks: 4, workoutsPerWeek: 3, difficulty: "beginner" });
    },
  });

  const handleSubmit = async () => {
    if (!formData.goalId) return;
    
    await generatePlanMutation.mutateAsync({
      name: `Workout Plan for ${formData.goalId}`,
      goalId: formData.goalId,
      durationWeeks: formData.durationWeeks,
      workoutsPerWeek: formData.workoutsPerWeek,
      difficulty: formData.difficulty as "beginner" | "intermediate" | "advanced",
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-fitness-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-fitness-foreground">
                  Generate Workout Plan
                </h2>
                <p className="text-sm text-fitness-muted-foreground">
                  Step {step} of 3
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

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-fitness-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? "bg-fitness-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                  Choose Your Goal
                </h3>
                <p className="text-fitness-muted-foreground mb-4">
                  Select the goal you want to focus on for this workout plan.
                </p>
              </div>
              
              <div className="grid gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, goalId: goal.id }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.goalId === goal.id
                        ? "border-fitness-primary bg-fitness-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <Target className="w-5 h-5 mr-3 text-fitness-primary" />
                      <div>
                        <p className="font-medium text-fitness-foreground">
                          {goal.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-fitness-muted-foreground">
                          Target: {goal.targetValue} {goal.unit}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Duration & Frequency */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                  Plan Duration & Frequency
                </h3>
                <p className="text-fitness-muted-foreground mb-4">
                  How long do you want to commit to this plan?
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                    Program Duration
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {durationOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, durationWeeks: option.value }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          formData.durationWeeks === option.value
                            ? "border-fitness-primary bg-fitness-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-fitness-primary" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-xs text-fitness-muted-foreground">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                    Workouts Per Week
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {frequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, workoutsPerWeek: option.value }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          formData.workoutsPerWeek === option.value
                            ? "border-fitness-primary bg-fitness-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <Users className="w-4 h-4 mr-2 text-fitness-primary" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-xs text-fitness-muted-foreground">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Generate */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                  Review Your Plan
                </h3>
                <p className="text-fitness-muted-foreground mb-4">
                  Here's what we'll create for you:
                </p>
              </div>

              <div className="bg-fitness-primary/5 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Goal:</span>
                  <span className="font-medium text-fitness-foreground">
                    {goals.find(g => g.id === formData.goalId)?.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Duration:</span>
                  <span className="font-medium text-fitness-foreground">
                    {formData.durationWeeks} weeks
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Frequency:</span>
                  <span className="font-medium text-fitness-foreground">
                    {formData.workoutsPerWeek} workouts per week
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Difficulty:</span>
                  <span className="font-medium text-fitness-foreground">
                    {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your workout plan will be generated based on your fitness level and selected goal. 
                  You can always modify exercises or create a new plan later.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? onClose : prevStep}
              className="flex items-center"
            >
              {step === 1 ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </>
              )}
            </Button>

            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && !formData.goalId}
                className="flex items-center bg-fitness-primary hover:bg-fitness-primary/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={generatePlanMutation.isPending}
                className="flex items-center bg-fitness-primary hover:bg-fitness-primary/90"
              >
                {generatePlanMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Generate Plan
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
