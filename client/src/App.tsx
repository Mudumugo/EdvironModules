import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NewLanding } from "@/pages/NewLanding";
import { CBEOverview } from "@/pages/CBEOverview";
import Features from "@/pages/Features";
import Solutions from "@/pages/Solutions";
import About from "@/pages/About";
import Login from "@/pages/Login";
import InteractiveSignUp from "@/pages/InteractiveSignUp";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={InteractiveSignUp} />
      <Route path="/demo" component={Login} />
      <Route path="/features" component={Features} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/cbe-overview" component={CBEOverview} />
      <Route path="/about" component={About} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route>
        <ProtectedRoute fallback={<NewLanding />}>
          <Dashboard />
        </ProtectedRoute>
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