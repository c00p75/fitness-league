import { cn } from "@fitness-league/ui";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                index <= currentStep
                  ? "bg-fitness-primary text-black"
                  : "bg-fitness-surface-light text-white/50"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "text-xs mt-2 text-center",
                index <= currentStep ? "text-white" : "text-white/50"
              )}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-4",
                index < currentStep ? "bg-fitness-primary" : "bg-fitness-surface-light"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
