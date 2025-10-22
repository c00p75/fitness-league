import { FitnessGoal } from "@fitness-league/shared";
import { Card, CardContent } from "@fitness-league/ui";

interface GoalSelectionProps {
  value: FitnessGoal;
  onChange: (goal: FitnessGoal) => void;
  error?: string;
}

const goals = [
  {
    id: "build_strength" as FitnessGoal,
    title: "Build Strength",
    description: "Increase muscle mass and overall strength",
    icon: "💪",
  },
  {
    id: "lose_weight" as FitnessGoal,
    title: "Lose Weight",
    description: "Burn fat and achieve a healthier weight",
    icon: "🔥",
  },
  {
    id: "gain_muscle" as FitnessGoal,
    title: "Gain Muscle",
    description: "Build lean muscle mass and definition",
    icon: "🏋️‍♂️",
  },
  {
    id: "improve_endurance" as FitnessGoal,
    title: "Improve Endurance",
    description: "Build cardiovascular fitness and stamina",
    icon: "🏃‍♂️",
  },
  {
    id: "general_fitness" as FitnessGoal,
    title: "General Fitness",
    description: "Maintain overall health and wellness",
    icon: "🌟",
  },
  {
    id: "flexibility" as FitnessGoal,
    title: "Flexibility",
    description: "Improve mobility and flexibility",
    icon: "🧘‍♀️",
  },
  {
    id: "sport_specific" as FitnessGoal,
    title: "Sport Specific",
    description: "Train for a specific sport or activity",
    icon: "⚽",
  },
];

export function GoalSelection({ value, onChange, error }: GoalSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              value === goal.id
                ? "ring-2 ring-fitness-primary bg-fitness-primary/10"
                : "fitness-card hover:bg-fitness-surface-light"
            }`}
            onClick={() => onChange(goal.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{goal.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{goal.title}</h3>
                  <p className="text-sm text-white/70">{goal.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
