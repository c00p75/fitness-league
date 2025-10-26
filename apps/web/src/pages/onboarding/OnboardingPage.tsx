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
  { id: "biometrics", title: "About You", description: "Tell us about yourself" },
  { id: "goal", title: "Fitness Goal", description: "What's your main fitness goal?" },
  { id: "level", title: "Experience", description: "What's your fitness level?" },
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
        gender: "male",
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
    onSuccess: async () => {
      // Invalidate both onboarding and goals queries to ensure dashboard updates
      queryClient.invalidateQueries({ queryKey: [["onboarding"]] });
      queryClient.invalidateQueries({ queryKey: [["goals", "getGoals"]] });
      
      // Refetch goals immediately to ensure fresh data
      await queryClient.refetchQueries({ queryKey: [["goals", "getGoals"]] });
      
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
          <BiometricsForm
            register={register}
            errors={errors.biometrics}
            setValue={setValue}
            watch={watch}
          />
        );
      case 1:
        return (
          <GoalSelection
            value={watchedValues.fitnessGoal}
            onChange={(goal) => setValue("fitnessGoal", goal)}
            error={errors.fitnessGoal?.message}
            userGender={watchedValues.biometrics?.gender}
          />
        );
      case 2:
        return (
          <ExperienceLevelSelection
            value={watchedValues.experienceLevel}
            onChange={(level) => setValue("experienceLevel", level)}
            error={errors.experienceLevel?.message}
            userGender={watchedValues.biometrics?.gender}
          />
        );
      case 3:
        return (
          <WorkoutPreferencesForm
            register={register}
            errors={errors.workoutPreferences}
            setValue={setValue}
            watch={watch}
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 ">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">Welcome to </span>
            <span className="bg-gradient-to-r from-fitness-primary to-cyan-400 bg-clip-text text-transparent">
              Fitness League
            </span>
          </h1>
          <p className="text-white/70">
            Let's personalize your fitness journey
          </p>
        </div>

       
        <div className="max-w-2xl mx-auto bg-card rounded-2xl px-5">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            className="mb-8 mt-12 pb-3 pt-4"
          />
        </div>

        <Card className="fitness-card">
          <CardHeader className="text-center mb-3">
            <CardTitle 
              className="text-3xl bg-gradient-to-b from-white via-gray-50 to-gray-100 bg-clip-text text-transparent"
              style={{
                textShadow: '0 0 10px rgba(156,163,175,0.5), 0 0 20px rgba(156,163,175,0.3), 0 0 30px rgba(156,163,175,0.2)'
              }}
            >
              {steps[currentStep].title}
            </CardTitle>
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
