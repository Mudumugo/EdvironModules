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
import DeviceManagement from "@/pages/DeviceManagement";
import TeacherDashboard from "@/pages/TeacherDashboard";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import TenantSelector from "@/components/TenantSelector";

// Component mapping for dynamic routing
const componentMap: Record<string, any> = {
  'dashboard': Dashboard,
  'my-locker': MyLocker,
  'school-management': SchoolManagement,
  'device-management': DeviceManagement,
  'digital-library': DigitalLibrary,
  'tutor-hub': TutorHub,
  'teacher-dashboard': TeacherDashboard,
  'family-controls': FamilyControls,
  'scheduling': Scheduling,
  'analytics': Analytics,
  'licensing': Licensing,
  'settings': Settings,
};

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Simplified routing - always show Landing for unauthenticated users
  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/school" component={SchoolManagement} />
          <Route path="/tutor-hub" component={TutorHub} />
          <Route path="/my-locker" component={MyLocker} />
          <Route path="/scheduling" component={Scheduling} />
          <Route path="/family-controls" component={FamilyControls} />
          <Route path="/library" component={DigitalLibrary} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/settings" component={Settings} />
        </>
      ) : (
        <>
          {/* Authenticated user routes */}
          <Layout>
            <Route path="/" component={Dashboard} />
            <Route path="/school" component={SchoolManagement} />
            <Route path="/library" component={DigitalLibrary} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route path="/my-locker" component={MyLocker} />
          </Layout>
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
