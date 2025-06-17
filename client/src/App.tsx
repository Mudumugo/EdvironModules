import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
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
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Layout>
          <Route path="/" component={Dashboard} />
          <Route path="/school-management" component={SchoolManagement} />
          <Route path="/digital-library" component={DigitalLibrary} />
          <Route path="/tutor-hub" component={TutorHub} />
          <Route path="/family-controls" component={FamilyControls} />
          <Route path="/scheduling" component={Scheduling} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/licensing" component={Licensing} />
          <Route path="/settings" component={Settings} />
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
