import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@fitness-league/ui";
import { LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/goals", label: "Goals" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <nav 
      className="bg-fitness-surface border-b border-fitness-surface-light"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-fitness-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Fitness League Home"
          >
            <div className="w-8 h-8 fitness-gradient rounded-lg flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <span className="text-xl font-bold text-white">Fitness League</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => {
              // Special logic for Goals - show as active for all goal-related routes
              const isActive = item.path === "/goals" 
                ? location.pathname.startsWith("/goals")
                : location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-fitness-primary focus-visible:ring-offset-2 focus-visible:outline-none ${
                    isActive
                      ? "bg-fitness-primary text-black font-semibold"
                      : "text-white/70 hover:text-white hover:bg-fitness-surface-light"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-fitness-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                <span className="text-white text-sm hidden sm:block">
                  {user.displayName || user.email}
                </span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white/70 hover:text-white"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
