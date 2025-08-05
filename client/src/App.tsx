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
import MyLocker from "@/pages/MyLocker";
import DigitalLibrary from "@/pages/DigitalLibrary";
import Calendar from "@/pages/Calendar";
import Analytics from "@/pages/Analytics";
import Assignments from "@/pages/Assignments";
import LessonPlanning from "@/pages/LessonPlanning";
import AppsHub from "@/pages/AppsHub";
import Settings from "@/pages/Settings";
import MyProfile from "@/pages/MyProfile";
import PhoneSystem from "@/pages/PhoneSystem";
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
      <Route path="/my-locker">
        <ProtectedRoute>
          <MyLocker />
        </ProtectedRoute>
      </Route>
      <Route path="/digital-library">
        <ProtectedRoute>
          <DigitalLibrary />
        </ProtectedRoute>
      </Route>
      <Route path="/calendar">
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      </Route>
      <Route path="/assignments">
        <ProtectedRoute>
          <Assignments />
        </ProtectedRoute>
      </Route>
      <Route path="/lesson-planning">
        <ProtectedRoute>
          <LessonPlanning />
        </ProtectedRoute>
      </Route>
      <Route path="/apps-hub">
        <ProtectedRoute>
          <AppsHub />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/my-profile">
        <ProtectedRoute>
          <MyProfile />
        </ProtectedRoute>
      </Route>
      <Route path="/phone-system">
        <ProtectedRoute>
          <PhoneSystem />
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