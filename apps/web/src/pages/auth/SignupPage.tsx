import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox } from "@fitness-league/ui";
import { SignupSchema, type SignupInput } from "@fitness-league/shared";
import { auth } from "../../lib/firebase";

export function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  });

  // const password = watch("password");

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: data.email.split("@")[0], // Use email prefix as display name
      });

      navigate("/onboarding");
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(
        error.code === "auth/email-already-in-use"
          ? "An account with this email already exists"
          : error.code === "auth/weak-password"
          ? "Password is too weak"
          : error.code === "auth/invalid-email"
          ? "Invalid email address"
          : "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="fitness-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join Fitness League</CardTitle>
        <CardDescription>
          Create your account to start your fitness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              {...register("termsAccepted")}
              className={errors.termsAccepted ? "border-destructive" : ""}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link to="/terms" className="text-fitness-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-fitness-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>
          )}

          <Button
            type="submit"
            className="w-full fitness-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-fitness-primary hover:text-fitness-primary-dark font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
