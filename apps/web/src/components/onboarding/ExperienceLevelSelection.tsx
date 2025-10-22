import { ExperienceLevel } from "@fitness-league/shared";
import { Card, CardContent } from "@fitness-league/ui";

interface ExperienceLevelSelectionProps {
  value: ExperienceLevel;
  onChange: (level: ExperienceLevel) => void;
  error?: string;
}

const levels = [
  {
    id: "beginner" as ExperienceLevel,
    title: "Beginner",
    description: "New to fitness or returning after a long break",
    icon: "🌱",
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
    icon: "🚀",
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
    icon: "🏆",
    details: [
      "2+ years of consistent training",
      "Advanced movement patterns",
      "Seeking optimization",
    ],
  },
];

export function ExperienceLevelSelection({ value, onChange, error }: ExperienceLevelSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {levels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              value === level.id
                ? "ring-2 ring-fitness-primary bg-fitness-primary/10"
                : "fitness-card hover:bg-fitness-surface-light"
            }`}
            onClick={() => onChange(level.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{level.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{level.title}</h3>
                  <p className="text-white/70 mb-3">{level.description}</p>
                  <ul className="text-sm text-white/60 space-y-1">
                    {level.details.map((detail, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-fitness-primary rounded-full mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
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
