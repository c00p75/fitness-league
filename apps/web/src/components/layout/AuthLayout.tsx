import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-fitness-background">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 fitness-gradient items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Fitness League</h1>
            <p className="text-xl opacity-90">
              Your personalized fitness companion
            </p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
