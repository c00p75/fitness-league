import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, Target, Dumbbell, Activity } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/", icon: <Home className="w-4 h-4" /> }
    ];

    if (pathSegments.length === 0) return items;

    // Goals
    if (pathSegments[0] === "goals") {
      items.push({ 
        label: "Goals", 
        href: "/goals", 
        icon: <Target className="w-4 h-4" /> 
      });

      if (pathSegments.length >= 2) {
        const goalId = pathSegments[1];
        items.push({ 
          label: "Workouts", 
          href: `/goals/${goalId}`,
          icon: <Dumbbell className="w-4 h-4" />
        });

        if (pathSegments.length >= 3 && pathSegments[2] === "workouts") {
          if (pathSegments.length >= 4) {
            const workoutId = pathSegments[3];
            if (pathSegments.length >= 5 && pathSegments[4] === "session") {
              items.push({ 
                label: "Workout Session", 
                href: `/goals/${goalId}/workouts/${workoutId}/session`,
                icon: <Activity className="w-4 h-4" />
              });
            }
          }
        }
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-1 text-sm text-fitness-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-1">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-fitness-muted-foreground/50" />
          )}
          <Link
            to={item.href}
            className={`flex items-center space-x-1 hover:text-fitness-foreground transition-colors ${
              index === breadcrumbItems.length - 1
                ? "text-fitness-foreground font-medium"
                : "text-fitness-muted-foreground hover:text-fitness-foreground"
            }`}
          >
            {item.icon && <span className="flex items-center">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        </div>
      ))}
    </nav>
  );
}
