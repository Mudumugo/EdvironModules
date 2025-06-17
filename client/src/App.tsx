import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { getEnabledModules } from "@/config/modules";
import { getCurrentTenant, getTenantConfig } from "@/lib/tenantUtils";
import { useEffect, useState } from "react";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import SchoolManagement from "@/pages/SchoolManagement";
import DigitalLibrary from "@/pages/DigitalLibrary";
import TutorHub from "@/pages/TutorHub";
import FamilyControls from "@/pages/FamilyControls";
import Scheduling from "@/pages/Scheduling";
import Analytics from "@/pages/Analytics";
import Licensing from "@/pages/Licensing";
import Settings from "@/pages/Settings";
import MyLocker from "@/pages/MyLocker";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import TenantSelector from "@/components/TenantSelector";

// Component mapping for dynamic routing
const componentMap: Record<string, any> = {
  'dashboard': Dashboard,
  'my-locker': MyLocker,
  'school-management': SchoolManagement,
  'digital-library': DigitalLibrary,
  'tutor-hub': TutorHub,
  'family-controls': FamilyControls,
  'scheduling': Scheduling,
  'analytics': Analytics,
  'licensing': Licensing,
  'settings': Settings,
};

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [tenantConfig, setTenantConfig] = useState<any>(null);

  // Initialize tenant detection
  useEffect(() => {
    const tenant = getCurrentTenant();
    setCurrentTenant(tenant);
    if (tenant) {
      setTenantConfig(getTenantConfig(tenant));
    }
  }, []);

  // Show tenant selector if no valid tenant is detected (but allow fallback to demo)
  if (!currentTenant) {
    // Fallback to demo tenant for development
    setCurrentTenant('demo');
    setTenantConfig(getTenantConfig('demo'));
  }
  
  if (!tenantConfig) {
    return <TenantSelector />;
  }

  // Determine academic level for age-appropriate interface
  const getAcademicLevel = () => {
    if (!user) return 'junior';
    
    if (user.role === 'student') {
      const grade = 7; // Would be dynamic from user profile
      if (grade <= 3) return 'primary';
      if (grade <= 8) return 'junior';
      if (grade <= 12) return 'senior';
      return 'college';
    }
    
    if (user.role === 'teacher') return 'senior';
    if (user.role === 'admin') return 'college';
    return 'junior';
  };

  const academicLevel = getAcademicLevel();
  const useStandardLayout = !['primary', 'junior'].includes(academicLevel);

  // Filter modules based on tenant features
  const enabledModules = getEnabledModules().filter(module => 
    tenantConfig.features.includes(module.id)
  );

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {/* Age-appropriate routing */}
          {useStandardLayout ? (
            <Layout>
              {enabledModules.map((module) => {
                const Component = componentMap[module.id];
                return Component ? (
                  <Route key={module.id} path={module.route} component={Component} />
                ) : null;
              })}
            </Layout>
          ) : (
            // Simplified interface for primary and junior users
            enabledModules.map((module) => {
              const Component = componentMap[module.id];
              return Component ? (
                <Route key={module.id} path={module.route} component={Component} />
              ) : null;
            })
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
