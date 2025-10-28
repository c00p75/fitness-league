import { Input, Label, Button, Card, CardContent } from "@fitness-league/ui";
import { useState, useEffect } from "react";

interface WorkoutPreferencesFormProps {
  register: any;
  errors: any;
  setValue: any;
  watch: any;
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

export function WorkoutPreferencesForm({ register, errors, setValue, watch }: WorkoutPreferencesFormProps) {
  const [duration, setDuration] = useState(30);
  const [frequency, setFrequency] = useState(3);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("evening");

  // Watch form values to sync with local state
  const watchedDuration = watch("workoutPreferences.preferredDuration");
  const watchedFrequency = watch("workoutPreferences.weeklyFrequency");
  const watchedEquipment = watch("workoutPreferences.availableEquipment");
  const watchedTime = watch("workoutPreferences.preferredTimeOfDay");

  // Sync local state with form values
  useEffect(() => {
    if (watchedDuration !== undefined && watchedDuration !== duration) {
      setDuration(watchedDuration);
    }
  }, [watchedDuration, duration]);

  useEffect(() => {
    if (watchedFrequency !== undefined && watchedFrequency !== frequency) {
      setFrequency(watchedFrequency);
    }
  }, [watchedFrequency, frequency]);

  useEffect(() => {
    if (watchedEquipment !== undefined && Array.isArray(watchedEquipment)) {
      setSelectedEquipment(watchedEquipment);
    }
  }, [watchedEquipment]);

  useEffect(() => {
    if (watchedTime !== undefined && watchedTime !== selectedTime) {
      setSelectedTime(watchedTime);
    }
  }, [watchedTime, selectedTime]);

  const adjustValue = (field: string, delta: number) => {
    if (field === 'duration') {
      const newDuration = Math.max(15, Math.min(180, duration + delta));
      setDuration(newDuration);
      setValue("workoutPreferences.preferredDuration", newDuration);
    } else if (field === 'frequency') {
      const newFrequency = Math.max(1, Math.min(7, frequency + delta));
      setFrequency(newFrequency);
      setValue("workoutPreferences.weeklyFrequency", newFrequency);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (field === 'duration') {
      const clampedValue = Math.max(15, Math.min(180, numValue));
      setDuration(clampedValue);
      setValue("workoutPreferences.preferredDuration", clampedValue);
    } else if (field === 'frequency') {
      const clampedValue = Math.max(1, Math.min(7, numValue));
      setFrequency(clampedValue);
      setValue("workoutPreferences.weeklyFrequency", clampedValue);
    }
  };

  const toggleEquipment = (equipmentId: string) => {
    const newSelection = selectedEquipment.includes(equipmentId)
      ? selectedEquipment.filter(id => id !== equipmentId)
      : [...selectedEquipment, equipmentId];
    
    setSelectedEquipment(newSelection);
    setValue("workoutPreferences.availableEquipment", newSelection);
  };

  const selectTime = (timeId: string) => {
    setSelectedTime(timeId);
    setValue("workoutPreferences.preferredTimeOfDay", timeId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-2">
          <Label className="text-center w-full block mb-3" htmlFor="preferredDuration">Preferred Workout Duration (minutes)</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('duration', -5)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              −
            </Button>
            <Input
              id="preferredDuration"
              type="number"
              value={duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              {...register("workoutPreferences.preferredDuration", { valueAsNumber: true })}
              className={`py-8 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors?.preferredDuration ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('duration', 5)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              +
            </Button>
          </div>
          {errors?.preferredDuration && (
            <p className="text-sm text-destructive">{errors.preferredDuration.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-center w-full block mb-3" htmlFor="weeklyFrequency">Workouts per Week</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('frequency', -1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              −
            </Button>
            <Input
              id="weeklyFrequency"
              type="number"
              value={frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              {...register("workoutPreferences.weeklyFrequency", { valueAsNumber: true })}
              className={`py-8 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors?.weeklyFrequency ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('frequency', 1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              +
            </Button>
          </div>
          {errors?.weeklyFrequency && (
            <p className="text-sm text-destructive">{errors.weeklyFrequency.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-center w-full block mb-5 mt-10 text-lg">Select Available Equipment</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {equipmentOptions.map((equipment) => {
            const isSelected = selectedEquipment.includes(equipment.id);
            return (
              <Card
                key={equipment.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-fitness-primary bg-fitness-primary/10"
                    : "bg-black hover:ring-2 hover:ring-fitness-primary"
                }`}
                onClick={() => toggleEquipment(equipment.id)}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-white mb-1">{equipment.label}</h3>
                  <p className="text-xs text-white/60">{equipment.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {errors?.availableEquipment && (
          <p className="text-sm text-destructive">{errors.availableEquipment.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-center w-full block mb-5 mt-10 text-lg">Preferred Workout Time</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timeOptions.map((time) => {
            const isSelected = selectedTime === time.id;
            return (
              <Card
                key={time.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-fitness-primary bg-fitness-primary/10"
                    : "bg-black hover:ring-2 hover:ring-fitness-primary"
                }`}
                onClick={() => selectTime(time.id)}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-white mb-1">{time.label}</h3>
                  <p className="text-xs text-white/60">{time.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {errors?.preferredTimeOfDay && (
          <p className="text-sm text-destructive">{errors.preferredTimeOfDay.message}</p>
        )}
      </div>
    </div>
  );
}
