import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Breadcrumbs } from "./Breadcrumbs";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  
  return (
    <div className={`min-h-screen ${isDashboard ? 'bg-fitness-background' : 'bg-fitness-background'}`}>
      <Navbar />
      <main className="container mx-auto px-14 py-8">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
}
