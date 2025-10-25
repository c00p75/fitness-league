import { FitnessGoal } from "@fitness-league/shared";
import { Card, CardContent } from "@fitness-league/ui";
import { useMemo } from "react";

interface GoalSelectionProps {
  value: FitnessGoal;
  onChange: (goal: FitnessGoal) => void;
  error?: string;
}

// Utility function to randomly select gender variant
const getRandomGender = () => Math.random() < 0.5 ? 'male' : 'female';

// Map goal IDs to their corresponding image filenames
const getGoalImagePath = (goalId: FitnessGoal, gender: string): string => {
  const imageMap: Record<FitnessGoal, string> = {
    build_strength: 'build_strength',
    lose_weight: 'lose_weight',
    gain_muscle: 'gain_muscle',
    improve_endurance: 'endurance',
    general_fitness: 'general_fitness',
    flexibility: 'flexibility',
    sport_specific: 'sports_specific'
  };
  
  return `/images/goals/${imageMap[goalId]}_${gender}.jpeg`;
};

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
  // Generate random gender for each goal individually
  const goalImages = useMemo(() => {
    return goals.map(goal => ({
      ...goal,
      imagePath: getGoalImagePath(goal.id, getRandomGender())
    }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goalImages.map((goal) => {
          const isSelected = value === goal.id;
          
          return (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all hover:shadow-lg relative overflow-hidden min-h-[350px] ${
                isSelected
                  ? "ring-2 ring-fitness-primary"
                  : "hover:scale-[1.02]"
              }`}
              onClick={() => onChange(goal.id)}
              style={{
                backgroundImage: `url(${goal.imagePath})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              
              <CardContent className="p-6 relative z-10 h-full flex flex-col justify-end">
                <div>
                  <h3 className="font-semibold text-white drop-shadow-lg text-xl">{goal.title}</h3>
                  <p className="text-sm text-white/90 drop-shadow-md mt-2">{goal.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
