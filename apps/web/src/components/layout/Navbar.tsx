import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@fitness-league/ui";
import { LogOut, User } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-fitness-surface border-b border-fitness-surface-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 fitness-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <span className="text-xl font-bold text-white">Fitness League</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-fitness-primary text-black font-semibold"
                    : "text-white/70 hover:text-white hover:bg-fitness-surface-light"
                }`}
              >
                {item.label}
              </Link>
            ))}
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
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
