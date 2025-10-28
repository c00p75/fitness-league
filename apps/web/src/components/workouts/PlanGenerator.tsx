import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { generatePlan } from "../../services/firestore/workoutsService";
import { getOnboardingStatus } from "../../services/firestore/onboardingService";
import { Button } from "@fitness-league/ui";
import { Card } from "@fitness-league/ui";
import { Label } from "@fitness-league/ui";
import { Input } from "@fitness-league/ui";
import { X, Target, Users, ArrowRight, ArrowLeft } from "lucide-react";

interface PlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Array<{
    id: string;
    type: string;
    targetValue: number;
    unit: string;
    durationWeeks?: number;
  }>;
  preSelectedGoalId?: string;
}


const frequencyOptions = [
  { value: 2, label: "2x per week", description: "Light activity" },
  { value: 3, label: "3x per week", description: "Moderate activity" },
  { value: 4, label: "4x per week", description: "Active lifestyle" },
  { value: 5, label: "5x per week", description: "High intensity" },
];

// Removed unused fitnessLevelOptions
// const fitnessLevelOptions = [
//   { 
//     value: "beginner", 
//     label: "Beginner", 
//     icon: "🌱",
//     description: "New to fitness" 
//   },
//   { 
//     value: "intermediate", 
//     label: "Intermediate", 
//     icon: "💪",
//     description: "Some experience" 
//   },
//   { 
//     value: "advanced", 
//     label: "Advanced", 
//     icon: "🏆",
//     description: "Experienced athlete" 
//   },
// ];

const durationOptions = [
  { value: 15, label: "15 min", icon: "⚡", description: "Quick workout" },
  { value: 30, label: "30 min", icon: "🏃", description: "Standard session" },
  { value: 45, label: "45 min", icon: "💪", description: "Extended workout" },
  { value: 60, label: "60 min", icon: "🏋️", description: "Full session" },
];

const equipmentOptions = [
  { value: "none", label: "No Equipment", icon: "🏃", description: "Bodyweight only" },
  { value: "dumbbells", label: "Dumbbells", icon: "🏋️", description: "Light weights" },
  { value: "barbell", label: "Barbell", icon: "🏋️‍♂️", description: "Heavy lifting" },
  { value: "resistance_bands", label: "Bands", icon: "🎯", description: "Portable" },
  { value: "kettlebell", label: "Kettlebell", icon: "⚡", description: "Functional" },
  { value: "yoga_mat", label: "Yoga Mat", icon: "🧘", description: "Floor work" },
  { value: "pull_up_bar", label: "Pull-up Bar", icon: "🆙", description: "Upper body" },
  { value: "gym_access", label: "Full Gym", icon: "🏢", description: "All equipment" },
];

const timePreferenceOptions = [
  { value: "morning", label: "Morning", icon: "🌅", description: "6-10 AM" },
  { value: "afternoon", label: "Afternoon", icon: "☀️", description: "12-4 PM" },
  { value: "evening", label: "Evening", icon: "🌆", description: "5-8 PM" },
  { value: "night", label: "Night", icon: "🌙", description: "8-11 PM" },
];

const intensityOptions = [
  { value: "low", label: "Low Intensity", icon: "🐌", description: "Gentle, recovery" },
  { value: "moderate", label: "Moderate", icon: "🚶", description: "Balanced effort" },
  { value: "high", label: "High Intensity", icon: "🏃", description: "Challenging" },
  { value: "variable", label: "Variable", icon: "📈", description: "Mix of levels" },
];

const goalFocusOptions: Record<string, {
  title: string;
  description: string;
  options: Array<{ value: string; label: string; icon: string; description: string }>;
}> = {
  muscle_gain: {
    title: "Target Muscle Groups",
    description: "Which muscles do you want to focus on?",
    options: [
      { value: "biceps", label: "Biceps", icon: "💪", description: "Arm curls & pulls" },
      { value: "triceps", label: "Triceps", icon: "🦾", description: "Arm extensions" },
      { value: "chest", label: "Chest", icon: "🏋️", description: "Push exercises" },
      { value: "back", label: "Back", icon: "🔙", description: "Pull exercises" },
      { value: "legs", label: "Legs", icon: "🦵", description: "Lower body" },
      { value: "shoulders", label: "Shoulders", icon: "💪", description: "Deltoids" },
      { value: "core", label: "Core", icon: "⭕", description: "Abs & obliques" },
      { value: "full_body", label: "Full Body", icon: "🏃", description: "Complete workout" },
    ],
  },
  weight_loss: {
    title: "Focus Areas",
    description: "Which areas do you want to target?",
    options: [
      { value: "full_body", label: "Full Body", icon: "🏃", description: "Complete fat burn" },
      { value: "upper_body", label: "Upper Body", icon: "💪", description: "Arms, chest, back" },
      { value: "lower_body", label: "Lower Body", icon: "🦵", description: "Legs & glutes" },
      { value: "core", label: "Core", icon: "⭕", description: "Abs & waist" },
    ],
  },
  flexibility: {
    title: "Flexibility Focus",
    description: "Which areas need more flexibility?",
    options: [
      { value: "full_body", label: "Full Body", icon: "🧘", description: "Complete stretching" },
      { value: "upper_body", label: "Upper Body", icon: "🙆", description: "Arms, shoulders, back" },
      { value: "lower_body", label: "Lower Body", icon: "🦵", description: "Legs & hips" },
      { value: "hips_hamstrings", label: "Hips & Hamstrings", icon: "🦿", description: "Lower flexibility" },
      { value: "back_spine", label: "Back & Spine", icon: "🔙", description: "Spinal mobility" },
    ],
  },
  strength_gain: {
    title: "Strength Focus",
    description: "Which type of strength training?",
    options: [
      { value: "upper_body", label: "Upper Body", icon: "💪", description: "Push & pull strength" },
      { value: "lower_body", label: "Lower Body", icon: "🦵", description: "Leg power" },
      { value: "full_body", label: "Full Body", icon: "🏋️", description: "Complete strength" },
      { value: "core", label: "Core Strength", icon: "⭕", description: "Stability & power" },
    ],
  },
  endurance_improvement: {
    title: "Endurance Type",
    description: "What kind of endurance?",
    options: [
      { value: "cardio", label: "Cardio", icon: "🏃", description: "Heart & lungs" },
      { value: "muscular", label: "Muscular", icon: "💪", description: "Muscle stamina" },
      { value: "mixed", label: "Mixed", icon: "⚡", description: "Combined endurance" },
    ],
  },
  general_fitness: {
    title: "Fitness Focus",
    description: "What's your main focus?",
    options: [
      { value: "balanced", label: "Balanced", icon: "⚖️", description: "Equal mix" },
      { value: "cardio_focused", label: "Cardio-Focused", icon: "🏃", description: "More cardio" },
      { value: "strength_focused", label: "Strength-Focused", icon: "💪", description: "More strength" },
    ],
  },
};

export function PlanGenerator({ isOpen, onClose, goals, preSelectedGoalId }: PlanGeneratorProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Fetch user's onboarding data to get default fitness level
  const { data: onboardingData } = useQuery({
    queryKey: ['onboarding', 'status'],
    queryFn: getOnboardingStatus,
  });
  const userFitnessLevel = (onboardingData as any)?.experienceLevel || "beginner";
  
  const [formData, setFormData] = useState({
    goalId: preSelectedGoalId || "",
    focusAreas: [] as string[],
    workoutsPerWeek: 3,
    duration: 30,
    equipment: ["none"] as string[],
    timePreference: "evening",
    intensity: "moderate",
    planName: "",
    useCustomName: false,
  });

  // Determine if we need goal selection step
  const needsGoalSelection = !preSelectedGoalId && goals.length > 1;
  const selectedGoal = goals.find(g => g.id === formData.goalId);
  // Removed unused hasFocusOptions

  // Generate smart workout plan name suggestions
  const generateNameSuggestions = () => {
    if (!selectedGoal) return [];
    
    const intensity = formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1);
    const focusArea = formData.focusAreas[0] 
      ? formData.focusAreas[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      : "Full Body";
    const goalType = selectedGoal.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const duration = selectedGoal.durationWeeks || 8;
    
    return [
      `${intensity} ${focusArea} Plan`, // e.g., "High Upper Body Plan"
      `${goalType} ${intensity} Plan`, // e.g., "Muscle Gain High Plan"
      `${duration}-Week ${focusArea} Plan`, // e.g., "8-Week Upper Body Plan"
      `${intensity} ${goalType} Program`, // e.g., "High Muscle Gain Program"
    ];
  };

  const nameSuggestions = generateNameSuggestions();

  const totalSteps = 4; // Always 4 steps: Plan Structure, Focus Areas, Execution Details, Review

  // Validation function for each step
  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        // Must have goal selected if needed
        if (needsGoalSelection && !formData.goalId) return false;
        return true;
      case 2:
        // Must have at least one focus area selected
        return formData.focusAreas.length > 0;
      case 3:
        // Must have at least one equipment option selected
        return formData.equipment.length > 0;
      case 4:
        // Must have a plan name before generating
        return formData.planName.trim().length > 0;
      default:
        return true;
    }
  };

  // Update when onboarding data loads
  useEffect(() => {
    if (userFitnessLevel && formData.intensity === "moderate") {
      // Map experience level to intensity
      const intensityMap = {
        beginner: "low",
        intermediate: "moderate",
        advanced: "high",
      };
      setFormData(prev => ({ 
        ...prev, 
        intensity: intensityMap[userFitnessLevel as keyof typeof intensityMap] || "moderate" 
      }));
    }
  }, [userFitnessLevel]);

  // Set default focus area when goal is selected
  useEffect(() => {
    if (selectedGoal && goalFocusOptions[selectedGoal.type] && formData.focusAreas.length === 0) {
      const options = goalFocusOptions[selectedGoal.type].options;
      const fullBodyOption = options.find(opt => opt.value === "full_body");
      if (fullBodyOption) {
        setFormData(prev => ({ ...prev, focusAreas: ["full_body"] }));
      } else if (options.length > 0) {
        // If no full_body option, select the first option
        setFormData(prev => ({ ...prev, focusAreas: [options[0].value] }));
      }
    }
  }, [selectedGoal, formData.focusAreas.length]);

  // Set default plan name when selections change
  useEffect(() => {
    if (!formData.useCustomName && selectedGoal && formData.focusAreas.length > 0) {
      const suggestions = generateNameSuggestions();
      if (suggestions.length > 0 && !formData.planName) {
        setFormData(prev => ({ ...prev, planName: suggestions[0] }));
      }
    }
  }, [selectedGoal, formData.focusAreas, formData.intensity, formData.useCustomName]);

  const generatePlanMutation = useMutation({
    mutationFn: generatePlan,
    onError: (error: any) => {
      console.error('Failed to create workout plan:', error);
    },
    onSuccess: (newPlan: any) => {
      // Invalidate and refetch queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.refetchQueries({ queryKey: ['workouts'] });
      
      // Reset form
      onClose();
      setStep(1);
      setFormData({ 
        goalId: preSelectedGoalId || "", 
        focusAreas: [],
        workoutsPerWeek: 3, 
        duration: 30,
        equipment: ["none"],
        timePreference: "evening",
        intensity: "moderate",
        planName: "",
        useCustomName: false,
      });
      
      // Navigate to the workout session for the newly created plan
      navigate(`/goals/${newPlan.goalId}/workouts/${newPlan.id}/session`);
    },
  });

  const handleSubmit = async () => {
    if (!formData.goalId) return;
    
    const selectedGoal = goals.find(g => g.id === formData.goalId);
    if (!selectedGoal) return;
    
    await generatePlanMutation.mutateAsync({
      goalId: formData.goalId,
      durationWeeks: selectedGoal.durationWeeks || 8,
      workoutsPerWeek: formData.workoutsPerWeek,
      duration: formData.duration,
      equipment: formData.equipment,
      timePreference: formData.timePreference as "morning" | "afternoon" | "evening" | "night",
      intensity: formData.intensity as "low" | "moderate" | "high" | "variable",
      focusAreas: formData.focusAreas,
      customPlanName: formData.planName,
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
                  Configure your personalized workout plan
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

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-fitness-foreground">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-fitness-muted-foreground">
                {step === 1 && "Plan Structure"}
                {step === 2 && "Focus Areas"}
                {step === 3 && "Execution Details"}
                {step === 4 && "Review"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-fitness-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Goal Selection + Basic Plan Structure */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Goal Selection (only if needed) */}
              {needsGoalSelection && (
                <div>
                  <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                    Choose Your Goal
                  </h3>
                  <p className="text-fitness-muted-foreground mb-4">
                    Select the goal you want to focus on for this workout plan.
                  </p>
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

              {/* Workouts Per Week */}
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

              {/* Workout Duration */}
              <div>
                <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                  Workout Duration
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, duration: option.value }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        formData.duration === option.value
                          ? "border-fitness-primary bg-fitness-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="font-medium text-sm mb-1">{option.label}</div>
                      <p className="text-xs text-fitness-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Focus Areas (Goal-Specific) */}
          {step === 2 && selectedGoal && goalFocusOptions[selectedGoal.type] && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                  {goalFocusOptions[selectedGoal.type].title}
                </h3>
                <p className="text-fitness-muted-foreground mb-4">
                  {goalFocusOptions[selectedGoal.type].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {goalFocusOptions[selectedGoal.type].options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const newFocusAreas = formData.focusAreas.includes(option.value)
                        ? formData.focusAreas.filter(a => a !== option.value)
                        : [...formData.focusAreas, option.value];
                      setFormData(prev => ({ ...prev, focusAreas: newFocusAreas }));
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                      formData.focusAreas.includes(option.value)
                        ? "border-fitness-primary bg-fitness-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-medium text-sm mb-1">{option.label}</div>
                    <p className="text-xs text-fitness-muted-foreground">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>

              <p className="text-xs text-fitness-muted-foreground">
                💡 Select one or more areas to focus on
              </p>
            </div>
          )}

          {/* Step 3: Execution Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                  Execution Details
                </h3>
                <p className="text-fitness-muted-foreground mb-4">
                  Configure your workout environment and intensity
                </p>
              </div>

              {/* Available Equipment */}
              <div>
                <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                  Available Equipment
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {equipmentOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const newEquipment = formData.equipment.includes(option.value)
                          ? formData.equipment.filter(e => e !== option.value)
                          : [...formData.equipment, option.value];
                        setFormData(prev => ({ ...prev, equipment: newEquipment }));
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        formData.equipment.includes(option.value)
                          ? "border-fitness-primary bg-fitness-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="font-medium text-xs mb-1">{option.label}</div>
                      <p className="text-xs text-fitness-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-fitness-muted-foreground mt-2">
                  💡 Select all equipment you have access to
                </p>
              </div>

              {/* Preferred Workout Time */}
              <div>
                <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                  Preferred Workout Time
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {timePreferenceOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, timePreference: option.value }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        formData.timePreference === option.value
                          ? "border-fitness-primary bg-fitness-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="font-medium text-sm mb-1">{option.label}</div>
                      <p className="text-xs text-fitness-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workout Intensity */}
              <div>
                <Label className="text-sm font-medium text-fitness-foreground mb-3 block">
                  Workout Intensity
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {intensityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, intensity: option.value }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        formData.intensity === option.value
                          ? "border-fitness-primary bg-fitness-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="font-medium text-sm mb-1">{option.label}</div>
                      <p className="text-xs text-fitness-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>


            </div>
          )}

          {/* Step 4: Review & Generate */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-fitness-foreground mb-2">
                  Review Your Workout Plan
                </h3>
                <p className="text-fitness-muted-foreground mb-4">
                  Review all your selections before generating your personalized workout plan.
                </p>
              </div>

              {/* Review Summary */}
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
                    {goals.find(g => g.id === formData.goalId)?.durationWeeks || 8} weeks
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Frequency:</span>
                  <span className="font-medium text-fitness-foreground">
                    {formData.workoutsPerWeek} workouts per week
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Workout Duration:</span>
                  <span className="font-medium text-fitness-foreground">
                    {formData.duration} minutes
                  </span>
                </div>
                {formData.equipment.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-fitness-muted-foreground">Equipment:</span>
                    <span className="font-medium text-fitness-foreground">
                      {formData.equipment.map(e => 
                        e.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ).join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Workout Time:</span>
                  <span className="font-medium text-fitness-foreground">
                    {formData.timePreference.charAt(0).toUpperCase() + formData.timePreference.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fitness-muted-foreground">Intensity:</span>
                  <span className="font-medium text-fitness-foreground">
                    {formData.intensity.charAt(0).toUpperCase() + formData.intensity.slice(1)}
                  </span>
                </div>
                {formData.focusAreas.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-fitness-muted-foreground">Focus Areas:</span>
                    <span className="font-medium text-fitness-foreground">
                      {formData.focusAreas.map(area => 
                        area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Workout Plan Name */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-fitness-foreground mb-2 block">
                    Name Your Workout Plan
                  </Label>
                  <p className="text-xs text-fitness-muted-foreground mb-3">
                    Choose a suggested name or create your own
                  </p>
                </div>
                
                {/* Name Suggestions */}
                <div className="grid grid-cols-2 gap-3">
                  {nameSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        planName: suggestion,
                        useCustomName: false 
                      }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        formData.planName === suggestion && !formData.useCustomName
                          ? "border-fitness-primary bg-fitness-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-sm text-fitness-foreground">
                        {suggestion}
                      </p>
                    </button>
                  ))}
                </div>
                
                {/* Custom Name Input */}
                <div className="pt-2">
                  <p className="text-sm text-fitness-muted-foreground mb-2">
                    Or enter custom name
                  </p>                                    
                </div>
                
                {/* Preview - Editable */}
                {formData.planName && (
                  <div className="bg-fitness-primary/10 rounded-lg p-3 border border-fitness-primary/20">
                    <p className="text-xs text-fitness-muted-foreground mb-2">
                      {formData.planName.length}/50 characters
                    </p>
                    <Input
                      type="text"
                      value={formData.planName}
                      onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value, useCustomName: true }))}
                      className="font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                      maxLength={50}
                    />
                  </div>
                )}
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

            {step < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className="flex items-center bg-fitness-primary hover:bg-fitness-primary/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={generatePlanMutation.isPending || !canProceedToNextStep()}
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
