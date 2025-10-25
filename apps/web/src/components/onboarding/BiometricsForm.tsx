import { Input, Label, Button, Card, CardContent } from "@fitness-league/ui";
import { useState, useEffect } from "react";

interface BiometricsFormProps {
  register: any;
  errors: any;
  setValue: any;
  watch: any;
}

export function BiometricsForm({ register, errors, setValue, watch }: BiometricsFormProps) {
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [gender, setGender] = useState("male");

  // Watch form values to sync with local state
  const watchedAge = watch("biometrics.age");
  const watchedHeight = watch("biometrics.height");
  const watchedWeight = watch("biometrics.weight");
  const watchedGender = watch("biometrics.gender");

  // Sync local state with form values
  useEffect(() => {
    if (watchedAge !== undefined && watchedAge !== age) {
      setAge(watchedAge);
    }
  }, [watchedAge, age]);

  useEffect(() => {
    if (watchedHeight !== undefined && watchedHeight !== height) {
      setHeight(watchedHeight);
    }
  }, [watchedHeight, height]);

  useEffect(() => {
    if (watchedWeight !== undefined && watchedWeight !== weight) {
      setWeight(watchedWeight);
    }
  }, [watchedWeight, weight]);

  useEffect(() => {
    if (watchedGender !== undefined && watchedGender !== gender) {
      setGender(watchedGender);
    }
  }, [watchedGender, gender]);

  const adjustValue = (field: string, delta: number) => {
    if (field === 'age') {
      const newAge = Math.max(13, Math.min(120, age + delta));
      setAge(newAge);
      setValue("biometrics.age", newAge);
    } else if (field === 'height') {
      const newHeight = Math.max(100, Math.min(250, height + delta));
      setHeight(newHeight);
      setValue("biometrics.height", newHeight);
    } else if (field === 'weight') {
      const newWeight = Math.max(30, Math.min(300, weight + delta));
      setWeight(newWeight);
      setValue("biometrics.weight", newWeight);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (field === 'age') {
      const clampedValue = Math.max(13, Math.min(120, numValue));
      setAge(clampedValue);
      setValue("biometrics.age", clampedValue);
    } else if (field === 'height') {
      const clampedValue = Math.max(100, Math.min(250, numValue));
      setHeight(clampedValue);
      setValue("biometrics.height", clampedValue);
    } else if (field === 'weight') {
      const clampedValue = Math.max(30, Math.min(300, numValue));
      setWeight(clampedValue);
      setValue("biometrics.weight", clampedValue);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-2">
          <Label className="text-center w-full block mb-3" htmlFor="age">Age</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('age', -1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              −
            </Button>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              {...register("biometrics.age", { valueAsNumber: true })}
              className={`h-12 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors?.age ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('age', 1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              +
            </Button>
          </div>
          {errors?.age && (
            <p className="text-sm text-destructive">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-2 mx-12">
          <Label className="text-center w-full block mb-3" htmlFor="gender">Gender</Label>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all ${
                gender === 'male'
                  ? "ring-2 ring-fitness-primary bg-fitness-primary/10"
                  : "bg-black"
              }`}
              onClick={() => {
                setGender('male');
                setValue("biometrics.gender", "male");
              }}
            >
              <CardContent className="p-2 text-center">
                <h3 className="font-semibold text-white">Male</h3>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-all h-12 ${
                gender === 'female'
                  ? "ring-2 ring-fitness-primary bg-fitness-primary/10"
                  : "bg-black"
              }`}
              onClick={() => {
                setGender('female');
                setValue("biometrics.gender", "female");
              }}
            >
              <CardContent className="p-2 text-center">
                <h3 className="font-semibold text-white">Female</h3>
              </CardContent>
            </Card>
          </div>
          {errors?.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-2">
          <Label className="text-center w-full block mb-3" htmlFor="height">Height (cm)</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('height', -1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              −
            </Button>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              {...register("biometrics.height", { valueAsNumber: true })}
              className={`h-12 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors?.height ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('height', 1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              +
            </Button>
          </div>
          {errors?.height && (
            <p className="text-sm text-destructive">{errors.height.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-center w-full block mb-3" htmlFor="weight">Weight (kg)</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('weight', -1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              −
            </Button>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              {...register("biometrics.weight", { valueAsNumber: true })}
              className={`h-12 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors?.weight ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustValue('weight', 1)}
              className="w-10 h-10 scale-125 rounded-full flex items-center justify-center hover:bg-fitness-primary/20"
            >
              +
            </Button>
          </div>
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
