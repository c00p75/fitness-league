import { ExperienceLevel } from "@fitness-league/shared";
import { Card, CardContent } from "@fitness-league/ui";
import { useMemo } from "react";

interface ExperienceLevelSelectionProps {
  value: ExperienceLevel;
  onChange: (level: ExperienceLevel) => void;
  error?: string;
  userGender?: string;
}

// Utility function to randomly select gender variant
const getRandomGender = () => Math.random() < 0.5 ? 'male' : 'female';

// Map experience level IDs to their corresponding image filenames
const getExperienceImagePath = (levelId: ExperienceLevel, gender: string): string => {
  return `/images/experience/${levelId}_${gender}.jpg`;
};

const levels = [
  {
    id: "beginner" as ExperienceLevel,
    title: "Beginner",
    description: "New to fitness or returning after a long break",
    details: [
      "0-6 months of regular exercise",
      "Learning basic movements",
      "Building consistency",
    ],
  },
  {
    id: "intermediate" as ExperienceLevel,
    title: "Intermediate",
    description: "Some experience with regular exercise",
    details: [
      "6+ months of regular exercise",
      "Comfortable with basic movements",
      "Ready for progression",
    ],
  },
  {
    id: "advanced" as ExperienceLevel,
    title: "Advanced",
    description: "Experienced with various training methods",
    details: [
      "2+ years of consistent training",
      "Advanced movement patterns",
      "Seeking optimization",
    ],
  },
];

export function ExperienceLevelSelection({ value, onChange, error, userGender }: ExperienceLevelSelectionProps) {
  // Use user's gender selection or fallback to random for each level
  const levelImages = useMemo(() => {
    return levels.map(level => ({
      ...level,
      imagePath: getExperienceImagePath(level.id, userGender || getRandomGender())
    }));
  }, [userGender]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levelImages.map((level) => {
          const isSelected = value === level.id;
          
          return (
            <Card
              key={level.id}
              className={`cursor-pointer transition-all hover:shadow-lg relative overflow-hidden min-h-[600px] ${
                isSelected
                  ? "ring-2 ring-fitness-primary"
                  : "hover:scale-[1.02]"
              }`}
              onClick={() => onChange(level.id)}
              style={{
                backgroundImage: `url(${level.imagePath})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              
              <CardContent className="p-6 relative z-10 h-full flex flex-col justify-end">
                <div>
                  <h3 className="font-semibold text-white drop-shadow-lg text-xl mb-2">{level.title}</h3>
                  <p className="text-white/90 drop-shadow-md mb-4">{level.description}</p>
                  <ul className="text-sm text-white/80 drop-shadow-sm space-y-1">
                    {level.details.map((detail, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
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
