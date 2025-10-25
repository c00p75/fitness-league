import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Breadcrumbs } from "./Breadcrumbs";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-fitness-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
}
