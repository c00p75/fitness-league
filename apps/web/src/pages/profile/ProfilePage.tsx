import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@fitness-league/ui";
import { UpdateProfileSchema, type UpdateProfileInput, FitnessGoal, ExperienceLevel } from "@fitness-league/shared";
import { useAuth } from "../../hooks/useAuth";
import { AvatarUpload } from "../../components/profile/AvatarUpload";
import { GoalSelection } from "../../components/onboarding/GoalSelection";
import { ExperienceLevelSelection } from "../../components/onboarding/ExperienceLevelSelection";
import { WorkoutPreferencesForm } from "../../components/onboarding/WorkoutPreferencesForm";
import { trpc } from "../../lib/trpc";
import toast from "react-hot-toast";

type TabType = "personal" | "goals" | "preferences";

export function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  // Fetch profile data with onboarding data
  const { data: profileData, isLoading: profileLoading, refetch } = trpc.user.getProfile.useQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      displayName: "",
      biometrics: {
        age: 25,
        height: 170,
        weight: 70,
        gender: "other",
      },
      fitnessGoal: "general_fitness",
      experienceLevel: "beginner",
      workoutPreferences: {
        preferredDuration: 30,
        weeklyFrequency: 3,
        availableEquipment: ["none"],
        preferredTimeOfDay: "evening",
      },
    },
  });

  // Update form when profile data loads
  React.useEffect(() => {
    if (profileData) {
      reset({
        displayName: profileData.displayName || "",
        biometrics: profileData.biometrics || {
          age: 25,
          height: 170,
          weight: 70,
          gender: "other",
        },
        fitnessGoal: (profileData as any).fitnessGoal || "general_fitness",
        experienceLevel: (profileData as any).experienceLevel || "beginner",
        workoutPreferences: (profileData as any).workoutPreferences || {
          preferredDuration: 30,
          weeklyFrequency: 3,
          availableEquipment: ["none"],
          preferredTimeOfDay: "evening",
        },
      });
    }
  }, [profileData, reset]);

  // Update profile mutation
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile. Please try again.");
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      // Error handled by onError callback
      console.error("Profile update error:", error);
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-white/70">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-fitness-surface-light p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "personal"
                  ? "bg-fitness-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "goals"
                  ? "bg-fitness-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Goals
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "preferences"
                  ? "bg-fitness-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Preferences
            </button>
          </div>

          {/* Tab Content */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>
                {activeTab === "personal" && "Personal Information"}
                {activeTab === "goals" && "Fitness Goals & Experience"}
                {activeTab === "preferences" && "Workout Preferences"}
              </CardTitle>
              <CardDescription>
                {activeTab === "personal" && "Update your personal details and biometrics"}
                {activeTab === "goals" && "Set your fitness goals and experience level"}
                {activeTab === "preferences" && "Configure your workout preferences"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info Tab */}
                {activeTab === "personal" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Enter your display name"
                        {...register("displayName")}
                        className={errors.displayName ? "border-destructive" : ""}
                      />
                      {errors.displayName && (
                        <p className="text-sm text-destructive">{errors.displayName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-fitness-surface-light text-white/50"
                      />
                      <p className="text-xs text-white/60">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="25"
                          {...register("biometrics.age", { valueAsNumber: true })}
                          className={errors.biometrics?.age ? "border-destructive" : ""}
                        />
                        {errors.biometrics?.age && (
                          <p className="text-sm text-destructive">{errors.biometrics.age.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                          id="gender"
                          {...register("biometrics.gender")}
                          className={`w-full h-10 px-3 py-2 rounded-xl border bg-background text-foreground ${
                            errors.biometrics?.gender ? "border-destructive" : "border-input"
                          }`}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.biometrics?.gender && (
                          <p className="text-sm text-destructive">{errors.biometrics.gender.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="170"
                          {...register("biometrics.height", { valueAsNumber: true })}
                          className={errors.biometrics?.height ? "border-destructive" : ""}
                        />
                        {errors.biometrics?.height && (
                          <p className="text-sm text-destructive">{errors.biometrics.height.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          {...register("biometrics.weight", { valueAsNumber: true })}
                          className={errors.biometrics?.weight ? "border-destructive" : ""}
                        />
                        {errors.biometrics?.weight && (
                          <p className="text-sm text-destructive">{errors.biometrics.weight.message}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Goals Tab */}
                {activeTab === "goals" && (
                  <>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-medium">Fitness Goal</Label>
                        <Controller
                          name="fitnessGoal"
                          control={control}
                          render={({ field }) => (
                            <GoalSelection
                              value={field.value as FitnessGoal}
                              onChange={field.onChange}
                              error={errors.fitnessGoal?.message}
                            />
                          )}
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium">Experience Level</Label>
                        <Controller
                          name="experienceLevel"
                          control={control}
                          render={({ field }) => (
                            <ExperienceLevelSelection
                              value={field.value as ExperienceLevel}
                              onChange={field.onChange}
                              error={errors.experienceLevel?.message}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <div>
                    <Controller
                      name="workoutPreferences"
                      control={control}
                      render={({ field }) => (
                        <WorkoutPreferencesForm
                          register={(name: string) => ({
                            ...register(name as any),
                            onChange: (e: any) => {
                              const value = e.target.type === 'checkbox' 
                                ? e.target.checked 
                                : e.target.type === 'number'
                                ? Number(e.target.value)
                                : e.target.value;
                              field.onChange({
                                ...field.value,
                                [name.replace('workoutPreferences.', '')]: value
                              });
                            }
                          })}
                          errors={errors.workoutPreferences}
                        />
                      )}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="fitness-button"
                  disabled={updateProfileMutation.isPending || !isDirty}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a photo to personalize your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarUpload />
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Email Verified</span>
                <Badge variant={user?.emailVerified ? "fitness" : "destructive"}>
                  {user?.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Member Since</span>
                <span className="text-sm text-white">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "Unknown"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
