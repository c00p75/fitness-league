import { Input, Label, Checkbox } from "@fitness-league/ui";

interface WorkoutPreferencesFormProps {
  register: any;
  errors: any;
}

const equipmentOptions = [
  { id: "none", label: "No Equipment", description: "Bodyweight exercises only" },
  { id: "dumbbells", label: "Dumbbells", description: "Light to medium weights" },
  { id: "resistance_bands", label: "Resistance Bands", description: "Elastic bands for resistance" },
  { id: "yoga_mat", label: "Yoga Mat", description: "For floor exercises" },
  { id: "pull_up_bar", label: "Pull-up Bar", description: "For upper body strength" },
  { id: "kettlebell", label: "Kettlebell", description: "For functional training" },
  { id: "barbell", label: "Barbell", description: "For heavy lifting" },
];

const timeOptions = [
  { id: "morning", label: "Morning", description: "6 AM - 12 PM" },
  { id: "afternoon", label: "Afternoon", description: "12 PM - 6 PM" },
  { id: "evening", label: "Evening", description: "6 PM - 10 PM" },
  { id: "flexible", label: "Flexible", description: "Any time works" },
];

export function WorkoutPreferencesForm({ register, errors }: WorkoutPreferencesFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="preferredDuration">Preferred Workout Duration (minutes)</Label>
          <Input
            id="preferredDuration"
            type="number"
            placeholder="30"
            {...register("workoutPreferences.preferredDuration", { valueAsNumber: true })}
            className={errors?.preferredDuration ? "border-destructive" : ""}
          />
          {errors?.preferredDuration && (
            <p className="text-sm text-destructive">{errors.preferredDuration.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weeklyFrequency">Workouts per Week</Label>
          <Input
            id="weeklyFrequency"
            type="number"
            placeholder="3"
            min="1"
            max="7"
            {...register("workoutPreferences.weeklyFrequency", { valueAsNumber: true })}
            className={errors?.weeklyFrequency ? "border-destructive" : ""}
          />
          {errors?.weeklyFrequency && (
            <p className="text-sm text-destructive">{errors.weeklyFrequency.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Available Equipment</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {equipmentOptions.map((equipment) => (
            <div key={equipment.id} className="flex items-start space-x-3">
              <Checkbox
                id={equipment.id}
                value={equipment.id}
                {...register("workoutPreferences.availableEquipment")}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={equipment.id} className="text-sm font-medium">
                  {equipment.label}
                </Label>
                <p className="text-xs text-white/60">{equipment.description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors?.availableEquipment && (
          <p className="text-sm text-destructive">{errors.availableEquipment.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Preferred Workout Time</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timeOptions.map((time) => (
            <div key={time.id} className="flex items-center space-x-3">
              <input
                type="radio"
                id={time.id}
                value={time.id}
                {...register("workoutPreferences.preferredTimeOfDay")}
                className="w-4 h-4 text-fitness-primary"
              />
              <div>
                <Label htmlFor={time.id} className="text-sm font-medium">
                  {time.label}
                </Label>
                <p className="text-xs text-white/60">{time.description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors?.preferredTimeOfDay && (
          <p className="text-sm text-destructive">{errors.preferredTimeOfDay.message}</p>
        )}
      </div>
    </div>
  );
}
