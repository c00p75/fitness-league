import { Input, Label } from "@fitness-league/ui";

interface BiometricsFormProps {
  register: any;
  errors: any;
}

export function BiometricsForm({ register, errors }: BiometricsFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            {...register("biometrics.age", { valueAsNumber: true })}
            className={errors?.age ? "border-destructive" : ""}
          />
          {errors?.age && (
            <p className="text-sm text-destructive">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            {...register("biometrics.gender")}
            className={`w-full h-10 px-3 py-2 rounded-xl border bg-background text-foreground ${
              errors?.gender ? "border-destructive" : "border-input"
            }`}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors?.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="170"
            {...register("biometrics.height", { valueAsNumber: true })}
            className={errors?.height ? "border-destructive" : ""}
          />
          {errors?.height && (
            <p className="text-sm text-destructive">{errors.height.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            {...register("biometrics.weight", { valueAsNumber: true })}
            className={errors?.weight ? "border-destructive" : ""}
          />
          {errors?.weight && (
            <p className="text-sm text-destructive">{errors.weight.message}</p>
          )}
        </div>
      </div>

      <div className="bg-fitness-surface-light/50 p-4 rounded-lg">
        <p className="text-sm text-white/70">
          💡 This information helps us personalize your workout recommendations and track your progress accurately.
        </p>
      </div>
    </div>
  );
}
