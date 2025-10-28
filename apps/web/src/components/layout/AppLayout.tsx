import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Breadcrumbs } from "./Breadcrumbs";
import { setupSkipLinks, SKIP_LINK_IDS } from "../../utils/accessibility";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  
  useEffect(() => {
    setupSkipLinks();
  }, []);
  
  return (
    <div className={`min-h-screen ${isDashboard ? 'bg-fitness-background' : 'bg-fitness-background'}`}>
      <Navbar />
      <main 
        id={SKIP_LINK_IDS.main}
        className="container mx-auto px-5 py-8 animate-fade-in"
        role="main"
        aria-label="Main content"
      >
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
}
