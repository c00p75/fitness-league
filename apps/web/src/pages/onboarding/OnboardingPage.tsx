import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fitness-league/ui";
import { OnboardingInputSchema, type OnboardingInput } from "@fitness-league/shared";
import { trpc } from "../../lib/trpc";
import { StepIndicator } from "../../components/onboarding/StepIndicator";
import { GoalSelection } from "../../components/onboarding/GoalSelection";
import { ExperienceLevelSelection } from "../../components/onboarding/ExperienceLevelSelection";
import { BiometricsForm } from "../../components/onboarding/BiometricsForm";
import { WorkoutPreferencesForm } from "../../components/onboarding/WorkoutPreferencesForm";
import { OnboardingComplete } from "../../components/onboarding/OnboardingComplete";

const steps = [
  { id: "goal", title: "Fitness Goal", description: "What's your main fitness goal?" },
  { id: "level", title: "Experience", description: "What's your fitness level?" },
  { id: "biometrics", title: "About You", description: "Tell us about yourself" },
  { id: "preferences", title: "Preferences", description: "Your workout preferences" },
  { id: "complete", title: "Complete", description: "You're all set!" },
];

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(OnboardingInputSchema),
    defaultValues: {
      fitnessGoal: "general_fitness",
      experienceLevel: "beginner",
      biometrics: {
        age: 25,
        height: 170,
        weight: 70,
        gender: "other",
      },
      workoutPreferences: {
        preferredDuration: 30,
        weeklyFrequency: 3,
        availableEquipment: ["none"],
        preferredTimeOfDay: "evening",
      },
    },
  });

  const watchedValues = watch();

  const submitOnboardingMutation = trpc.onboarding.submitOnboarding.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["onboarding"]] });
      navigate("/");
    },
    onError: (error) => {
      setError(error.message || "Failed to save your preferences. Please try again.");
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: OnboardingInput) => {
    setLoading(true);
    setError(null);

    try {
      await submitOnboardingMutation.mutateAsync({
        experienceLevel: data.experienceLevel,
        fitnessGoals: [data.fitnessGoal], // Convert single goal to array
        availableTime: data.workoutPreferences.preferredDuration,
        biometrics: data.biometrics,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
      // Error already handled by onError callback
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GoalSelection
            value={watchedValues.fitnessGoal}
            onChange={(goal) => setValue("fitnessGoal", goal)}
            error={errors.fitnessGoal?.message}
          />
        );
      case 1:
        return (
          <ExperienceLevelSelection
            value={watchedValues.experienceLevel}
            onChange={(level) => setValue("experienceLevel", level)}
            error={errors.experienceLevel?.message}
          />
        );
      case 2:
        return (
          <BiometricsForm
            register={register}
            errors={errors.biometrics}
          />
        );
      case 3:
        return (
          <WorkoutPreferencesForm
            register={register}
            errors={errors.workoutPreferences}
          />
        );
      case 4:
        return <OnboardingComplete />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-fitness-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Fitness League
          </h1>
          <p className="text-white/70">
            Let's personalize your fitness journey
          </p>
        </div>

        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
        />

        <Card className="fitness-card">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStep()}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className="text-white/70 hover:text-white"
                >
                  Previous
                </Button>

                {isLastStep ? (
                  <Button
                    type="submit"
                    className="fitness-button"
                    disabled={loading}
                  >
                    {loading ? "Completing..." : "Complete Setup"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="fitness-button"
                  >
                    Next
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
