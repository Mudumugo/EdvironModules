import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Landing } from "@/pages/Landing";
import { NewLanding } from "@/pages/NewLanding";
import { MobileLanding } from "@/pages/MobileLanding";
import { Solutions } from "@/pages/Solutions";
import { CBEOverview } from "@/pages/CBEOverview";
import { About } from "@/pages/About";
import { Features } from "@/pages/Features";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import InteractiveSignUp from "@/pages/InteractiveSignUp";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Always show landing page since authentication is disabled
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={InteractiveSignUp} />
      <Route path="/interactive-signup" component={InteractiveSignUp} />
      <Route path="/old-signup" component={SignUp} />
      <Route path="/demo" component={Login} />
      <Route path="/features" component={Features} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/cbe-overview" component={CBEOverview} />
      <Route path="/about" component={About} />
      <Route path="/mobile" component={MobileLanding} />
      <Route>
        {/* Always show NewLanding for all routes */}
        <NewLanding />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;