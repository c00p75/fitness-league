import { CheckCircle } from "lucide-react";

export function OnboardingComplete() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-fitness-primary rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-black" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">
          You're all set! 🎉
        </h3>
        <p className="text-white/70">
          We've personalized your Fitness League experience and created your first fitness goal based on your preferences.
        </p>
      </div>

      <div className="bg-fitness-surface-light/50 p-6 rounded-lg text-left">
        <h4 className="font-semibold text-white mb-3">What's next?</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-fitness-primary rounded-full mr-3" />
            Check out your automatically created fitness goal
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-fitness-primary rounded-full mr-3" />
            Explore your personalized workout recommendations
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-fitness-primary rounded-full mr-3" />
            Start your first workout
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-fitness-primary rounded-full mr-3" />
            Track your progress and earn badges
          </li>
        </ul>
      </div>
    </div>
  );
}
