import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@fitness-league/ui";
import { UpdateProfileSchema, type UpdateProfileInput } from "@fitness-league/shared";
import { useAuth } from "../../hooks/useAuth";
import { AvatarUpload } from "../../components/profile/AvatarUpload";

export function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      biometrics: {
        age: 25,
        height: 170,
        weight: 70,
        gender: "other",
      },
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Call tRPC mutation to update profile
      console.log("Profile update:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-white/70">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

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

                <Button
                  type="submit"
                  className="fitness-button"
                  disabled={loading || !isDirty}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Avatar and Stats */}
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
