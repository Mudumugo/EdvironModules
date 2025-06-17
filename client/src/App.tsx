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
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import SchoolManagement from "@/pages/SchoolManagement";
import DigitalLibrary from "@/pages/DigitalLibrary";
import DigitalLibraryNew from "@/pages/DigitalLibraryNew";
import TutorHub from "@/pages/TutorHub";
import FamilyControls from "@/pages/FamilyControls";
import Scheduling from "@/pages/Scheduling";
import Analytics from "@/pages/Analytics";
import Licensing from "@/pages/Licensing";
import Settings from "@/pages/Settings";
import MyLocker from "@/pages/MyLocker";
import DeviceManagement from "@/pages/DeviceManagement";
import TeacherDashboard from "@/pages/TeacherDashboard";
import UserManagement from "@/pages/UserManagement-simple";
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
  'users': UserManagement,
};

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show main application with role-based routing
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/users" component={UserManagement} />
        <Route path="/school-management" component={SchoolManagement} />
        <Route path="/digital-library" component={DigitalLibraryNew} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/settings" component={Settings} />
        <Route path="/my-locker" component={MyLocker} />
        <Route path="/tutor-hub" component={TutorHub} />
        <Route path="/teacher-dashboard" component={TeacherDashboard} />
        <Route path="/family-controls" component={FamilyControls} />
        <Route path="/scheduling" component={Scheduling} />
        <Route path="/licensing" component={Licensing} />
        <Route path="/device-management" component={DeviceManagement} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
