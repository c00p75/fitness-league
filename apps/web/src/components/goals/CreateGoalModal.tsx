import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createGoal } from "../../services/firestore/goalsService";
import { getProfile } from "../../services/firestore/userService";
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
  { value: "weight_loss", label: "Weight Loss", unit: "kg" },
  { value: "muscle_gain", label: "Muscle Gain", unit: "kg" },
  { value: "flexibility", label: "Flexibility", unit: "sessions" },
  { value: "general_fitness", label: "General Fitness", unit: "workouts" },
  { value: "endurance_improvement", label: "Endurance", unit: "minutes" },
  { value: "strength_gain", label: "Strength", unit: "kg" },
];

const goalDurationOptions = [
  { value: 4, label: "4 weeks", description: "Quick start program", weeks: 4 },
  { value: 8, label: "8 weeks", description: "Balanced program", weeks: 8 },
  { value: 12, label: "12 weeks", description: "Comprehensive program", weeks: 12 },
  { value: 16, label: "16 weeks", description: "Extended program", weeks: 16 },
  { value: 24, label: "24 weeks", description: "Long-term goal", weeks: 24 },
  { value: 0, label: "Custom", description: "Set your own timeline", weeks: 0 },
];

const targetValueRecommendations: Record<string, {
  unit: string;
  suggestions: Array<{ value: number; label: string; description: string }>;
}> = {
  weight_loss: {
    unit: "kg",
    suggestions: [
      { value: 5, label: "5 kg", description: "Moderate goal" },
      { value: 10, label: "10 kg", description: "Ambitious goal" },
      { value: 15, label: "15 kg", description: "Major transformation" },
      { value: 0, label: "Custom", description: "Set your own target" },
    ],
  },
  muscle_gain: {
    unit: "kg",
    suggestions: [
      { value: 3, label: "3 kg", description: "Lean muscle gain" },
      { value: 5, label: "5 kg", description: "Solid progress" },
      { value: 8, label: "8 kg", description: "Major bulk" },
      { value: 0, label: "Custom", description: "Set your own target" },
    ],
  },
  flexibility: {
    unit: "sessions",
    suggestions: [
      { value: 20, label: "20 sessions", description: "Regular practice" },
      { value: 40, label: "40 sessions", description: "Dedicated training" },
      { value: 60, label: "60 sessions", description: "Advanced flexibility" },
      { value: 0, label: "Custom", description: "Set your own target" },
    ],
  },
  general_fitness: {
    unit: "workouts",
    suggestions: [
      { value: 24, label: "24 workouts", description: "2x per week" },
      { value: 36, label: "36 workouts", description: "3x per week" },
      { value: 48, label: "48 workouts", description: "4x per week" },
      { value: 0, label: "Custom", description: "Set your own target" },
    ],
  },
  endurance_improvement: {
    unit: "minutes",
    suggestions: [
      { value: 30, label: "30 min", description: "Beginner endurance" },
      { value: 60, label: "60 min", description: "Intermediate level" },
      { value: 90, label: "90 min", description: "Advanced endurance" },
      { value: 0, label: "Custom", description: "Set your own target" },
    ],
  },
  strength_gain: {
    unit: "kg",
    suggestions: [
      { value: 20, label: "+20 kg", description: "Moderate strength" },
      { value: 40, label: "+40 kg", description: "Significant gains" },
      { value: 60, label: "+60 kg", description: "Major strength boost" },
      { value: 0, label: "Custom", description: "Set your own target" },
    ],
  },
};

// Image path utility functions
const getGoalImagePath = (goalType: string, gender: string): string => {
  const mapping: Record<string, string> = {
    weight_loss: 'lose_weight',
    muscle_gain: 'gain_muscle',
    flexibility: 'flexibility',
    general_fitness: 'general_fitness',
    endurance_improvement: 'endurance',
    strength_gain: 'build_strength'
  };
  const safeGender = gender === 'other' ? 'male' : gender;
  return `/images/goals/${mapping[goalType]}_${safeGender}.jpeg`;
};

// Removed getWorkoutImagePath as we're using gradients instead

// Dynamic gradient colors based on goal type
const getGoalGradient = (goalType: string): string => {
  const gradients: Record<string, string> = {
    weight_loss: 'from-red-500 via-orange-500 to-yellow-500',
    muscle_gain: 'from-blue-500 via-purple-500 to-indigo-500',
    flexibility: 'from-green-500 via-teal-500 to-cyan-500',
    general_fitness: 'from-purple-500 via-pink-500 to-rose-500',
    endurance_improvement: 'from-yellow-500 via-orange-500 to-red-500',
    strength_gain: 'from-gray-600 via-gray-700 to-gray-800',
  };
  return gradients[goalType] || 'from-purple-500 via-pink-500 to-rose-500';
};

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Fetch user profile to get gender for image selection
  const { data: profileData } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getProfile,
  });
  const userGender = profileData?.biometrics?.gender || 'male';
  
  const [formData, setFormData] = useState({
    type: "",
    targetValue: "",
    unit: "",
    targetDate: "",
    durationWeeks: 8, // Default to 8 weeks
  });
  const [showCustomValue, setShowCustomValue] = useState(false);
  const [showCustomTimeline, setShowCustomTimeline] = useState(false);
  // Removed unused imageLoadStates

  const createGoalMutation = useMutation({
    mutationFn: (data: {
      type: string;
      targetValue: number;
      unit: string;
      targetDate: Date;
      durationWeeks: number;
    }) => createGoal(data),
    onSuccess: (newGoal: any) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onClose();
      setFormData({ type: "", targetValue: "", unit: "", targetDate: "", durationWeeks: 8 });
      setShowCustomValue(false);
      setShowCustomTimeline(false);
      // Redirect to the goal's workouts page
      navigate(`/goals/${newGoal.id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.targetValue || parseFloat(formData.targetValue) <= 0 || !formData.targetDate || !formData.durationWeeks || formData.durationWeeks < 1 || formData.durationWeeks > 52) {
      return;
    }

    const selectedGoalType = goalTypes.find(gt => gt.value === formData.type);
    const unit = formData.unit || selectedGoalType?.unit || "";

    await createGoalMutation.mutateAsync({
      type: formData.type as "weight_loss" | "muscle_gain" | "flexibility" | "general_fitness" | "endurance_improvement" | "strength_gain",
      targetValue: parseFloat(formData.targetValue),
      unit,
      targetDate: new Date(formData.targetDate),
      durationWeeks: formData.durationWeeks,
    });
  };

  const handleGoalTypeSelect = (type: string) => {
    const selectedGoalType = goalTypes.find(gt => gt.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      unit: selectedGoalType?.unit || "",
      targetValue: "", // Reset target value when goal type changes
    }));
    setShowCustomValue(false); // Reset custom value state
  };

  const handleTargetValueSelect = (value: number) => {
    if (value === 0) {
      setShowCustomValue(true);
      setFormData(prev => ({ ...prev, targetValue: "" }));
    } else {
      setShowCustomValue(false);
      setFormData(prev => ({ ...prev, targetValue: value.toString() }));
    }
  };

  const handleCustomDurationChange = (weeks: number) => {
    if (weeks >= 1 && weeks <= 52) {
      const targetDate = calculateTargetDate(weeks);
      setFormData(prev => ({
        ...prev,
        durationWeeks: weeks,
        targetDate,
      }));
    }
  };

  const calculateTargetDate = (weeks: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (weeks * 7));
    return targetDate.toISOString().split('T')[0];
  };

  const handleDurationSelect = (weeks: number) => {
    if (weeks === 0) {
      // Custom timeline selected
      setShowCustomTimeline(true);
      setFormData(prev => ({
        ...prev,
        durationWeeks: 0, // Set to 0 to indicate custom selection
        targetDate: "",
      }));
    } else {
      // Preset duration selected
      setShowCustomTimeline(false);
      const targetDate = calculateTargetDate(weeks);
      setFormData(prev => ({
        ...prev,
        durationWeeks: weeks,
        targetDate,
      }));
    }
  };

  // Initialize with default target date
  useEffect(() => {
    if (isOpen && !formData.targetDate) {
      const defaultTargetDate = calculateTargetDate(formData.durationWeeks);
      setFormData(prev => ({
        ...prev,
        targetDate: defaultTargetDate,
      }));
    }
  }, [isOpen, formData.durationWeeks, formData.targetDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {goalTypes.map((goalType) => {
                  const isSelected = formData.type === goalType.value;
                  const imagePath = getGoalImagePath(goalType.value, userGender);
                  
                  return (
                    <button
                      key={goalType.value}
                      type="button"
                      onClick={() => handleGoalTypeSelect(goalType.value)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 text-left min-h-[120px] focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:ring-offset-2 ${
                        isSelected
                          ? "border-fitness-primary ring-2 ring-fitness-primary"
                          : "border-gray-200 hover:border-gray-300 hover:scale-[1.02]"
                      }`}
                      style={{
                        backgroundImage: `url(${imagePath})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      {/* Dark gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                      
                      {/* Content */}
                      <div className="relative z-10 p-3 h-full flex flex-col justify-end">
                        <div className="flex items-center mb-2">
                          <span className="font-medium text-sm text-white drop-shadow-lg">{goalType.label}</span>
                        </div>
                        <p className="text-xs text-white/90 drop-shadow-md">
                          {goalType.unit}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unit Display - Shows after goal type selected */}
            {formData.type && (
              <div className="bg-fitness-primary/10 p-4 rounded-lg border border-fitness-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-fitness-muted-foreground uppercase tracking-wide mb-1">
                      Measurement Unit
                    </p>
                    <p className="text-lg font-semibold text-fitness-foreground">
                      {formData.unit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Target Value with Recommendations - Card-based UI */}
            {formData.type && (
              <div>
                <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                  What's your target?
                </Label>
                
                {/* Dynamic Gradient Preview Banner */}
                <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                  <div 
                    className={`h-24 w-full relative bg-gradient-to-r ${getGoalGradient(formData.type)}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                    <div className="relative z-10 p-4 h-full flex items-center">
                      <div className="flex items-center">
                        <Target className="w-6 h-6 text-white mr-3 drop-shadow-lg" />
                        <div>
                          <h3 className="text-white font-semibold drop-shadow-lg">
                            {goalTypes.find(gt => gt.value === formData.type)?.label}
                          </h3>
                          <p className="text-white/90 text-sm drop-shadow-md">
                            Set your target in {formData.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {targetValueRecommendations[formData.type]?.suggestions.map((suggestion) => (
                    <button
                      key={suggestion.value}
                      type="button"
                      onClick={() => handleTargetValueSelect(suggestion.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:ring-offset-2 ${
                        (suggestion.value === 0 && showCustomValue) ||
                        (suggestion.value !== 0 && formData.targetValue === suggestion.value.toString())
                          ? "border-fitness-primary bg-fitness-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <Hash className="w-4 h-4 mr-2 text-fitness-primary" />
                        <span className="font-medium">{suggestion.label}</span>
                      </div>
                      <p className="text-xs text-fitness-muted-foreground">
                        {suggestion.description}
                      </p>
                    </button>
                  ))}
                </div>
                
                {/* Custom Value Input - Shows when Custom is selected */}
                {showCustomValue && (
                  <div className="mt-4 p-4 rounded-lg border">
                    <Label htmlFor="customValue" className="text-sm font-medium text-fitness-foreground mb-2 block">
                      Enter Custom Target
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fitness-muted-foreground" />
                      <Input
                        id="customValue"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={formData.targetValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                        placeholder={`Enter target in ${formData.unit}`}
                        className="pl-10"
                        required
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-fitness-muted-foreground mt-2">
                      Enter a realistic target for your {formData.durationWeeks}-week program
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Goal Timeline */}
            <div>
              <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                Goal Timeline
              </Label>
              
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {goalDurationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleDurationSelect(option.weeks)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:ring-offset-2 ${
                      (option.weeks === 0 && showCustomTimeline) ||
                      (option.weeks !== 0 && formData.durationWeeks === option.weeks)
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
                    {option.weeks !== 0 && (
                      <p className="text-xs text-fitness-muted-foreground mt-1">
                        Target: {calculateTargetDate(option.weeks).split('-').reverse().join('/')}
                      </p>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Custom Timeline Input - Shows when Custom is selected */}
              {showCustomTimeline && (
                <div className="mt-4 p-4 rounded-lg border">
                  <Label htmlFor="customDuration" className="text-sm font-medium text-fitness-foreground mb-2 block">
                    Enter Custom Duration
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fitness-muted-foreground" />
                    <Input
                      id="customDuration"
                      type="number"
                      step="1"
                      min="1"
                      max="52"
                      value={formData.durationWeeks === 0 ? "" : formData.durationWeeks || ""}
                      onChange={(e) => handleCustomDurationChange(parseInt(e.target.value))}
                      placeholder="Enter weeks (1-52)"
                      className="pl-10"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-fitness-muted-foreground mt-2">
                    Choose between 1 and 52 weeks for your goal timeline
                  </p>
                  {formData.durationWeeks && formData.durationWeeks > 0 && formData.durationWeeks >= 1 && formData.durationWeeks <= 52 && (
                    <p className="text-xs text-fitness-primary mt-2 font-medium">
                      Target date: {calculateTargetDate(formData.durationWeeks).split('-').reverse().join('/')}
                    </p>
                  )}
                </div>
              )}
              
              <p className="text-xs text-fitness-muted-foreground mt-2">
                Choose a realistic timeline for your goal. This will help create an appropriate workout plan.
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
                disabled={createGoalMutation.isPending || !formData.type || !formData.targetValue || parseFloat(formData.targetValue) <= 0 || !formData.targetDate || !formData.durationWeeks || formData.durationWeeks < 1 || formData.durationWeeks > 52}
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
