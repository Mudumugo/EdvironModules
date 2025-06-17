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
  const { isAuthenticated, isLoading } = useAuth();
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

  // Show tenant selector if no valid tenant is detected
  if (!currentTenant || !tenantConfig) {
    return <TenantSelector />;
  }

  // Filter modules based on tenant features
  const enabledModules = getEnabledModules().filter(module => 
    tenantConfig.features.includes(module.id)
  );

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Layout>
          {/* Dynamic routing based on tenant-enabled modules */}
          {enabledModules.map((module) => {
            const Component = componentMap[module.id];
            return Component ? (
              <Route key={module.id} path={module.route} component={Component} />
            ) : null;
          })}
        </Layout>
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
