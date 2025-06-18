import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LearningDashboard from "@/pages/LearningDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import SchoolManagement from "@/pages/SchoolManagement";
import DigitalLibrary from "@/pages/DigitalLibrary";
import DigitalLibraryNew from "@/pages/DigitalLibraryNew";
import SecurityDashboard from "@/pages/SecurityDashboard";
import TutorHub from "@/pages/TutorHub";
import FamilyControls from "@/pages/FamilyControls";
import Scheduling from "@/pages/Scheduling";
import SchoolCalendar from "@/pages/SchoolCalendar";
import Calendar from "@/pages/Calendar";
import Analytics from "@/pages/Analytics";
import Licensing from "@/pages/Licensing";
import Settings from "@/pages/Settings";
import MyLocker from "@/pages/MyLocker";
import DeviceManagement from "@/pages/DeviceManagement";
import TeacherDashboard from "@/pages/TeacherDashboard";
import UserManagement from "@/pages/UserManagement-simple";
import PBXDashboard from "@/pages/PBXDashboard";
import ParentPortal from "@/pages/ParentPortal";
import ParentPortalAdmin from "@/pages/ParentPortalAdmin";
import AppsHub from "@/pages/AppsHub";
import HotCall from "@/pages/HotCall";
import TimetableManagement from "@/pages/TimetableManagement";
import AuthoringDashboard from "@/pages/AuthoringDashboard";
import UserProfile from "@/pages/UserProfile";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { USER_ROLES } from "@shared/schema";

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
  'authoring-dashboard': AuthoringDashboard,
  'user-profile': UserProfile,
  'licensing': Licensing,
  'settings': Settings,
  'users': UserManagement,
  'pbx': PBXDashboard,
  'parent-portal': ParentPortal,
  'parent-portal-admin': ParentPortalAdmin,
  'apps-hub': AppsHub,
  'hot-call': HotCall,
  'timetable': TimetableManagement,
  'security-dashboard': SecurityDashboard,
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
        {/* Core modules - available to all authenticated users */}
        <Route path="/">
          <RoleProtectedRoute moduleId="dashboard">
            {user?.role === 'school_admin' ? <AdminDashboard /> : 
             user?.role === 'school_security' ? <SecurityDashboard /> : 
             user?.role === 'school_it_staff' ? <DeviceManagement /> : 
             user?.role === 'teacher' ? <TeacherDashboard /> :
             user?.role?.includes('student') ? <LearningDashboard /> :
             <LearningDashboard />}
          </RoleProtectedRoute>
        </Route>
        
        <Route path="/learning-dashboard">
          <RoleProtectedRoute moduleId="dashboard">
            <LearningDashboard />
          </RoleProtectedRoute>
        </Route>
        
        <Route path="/settings">
          <RoleProtectedRoute moduleId="settings">
            <Settings />
          </RoleProtectedRoute>
        </Route>

        <Route path="/user-profile">
          <RoleProtectedRoute moduleId="user-profile">
            <UserProfile />
          </RoleProtectedRoute>
        </Route>

        {/* Student and Teacher modules */}
        <Route path="/digital-library">
          <RoleProtectedRoute moduleId="digital-library">
            <DigitalLibrary />
          </RoleProtectedRoute>
        </Route>

        <Route path="/my-locker">
          <RoleProtectedRoute moduleId="my-locker">
            <MyLocker />
          </RoleProtectedRoute>
        </Route>

        {/* Teacher-only modules */}
        <Route path="/teacher-dashboard">
          <RoleProtectedRoute moduleId="teacher-dashboard">
            <TeacherDashboard />
          </RoleProtectedRoute>
        </Route>

        <Route path="/tutor-hub">
          <RoleProtectedRoute moduleId="tutor-hub">
            <TutorHub />
          </RoleProtectedRoute>
        </Route>

        <Route path="/scheduling">
          <RoleProtectedRoute moduleId="scheduling">
            <Scheduling />
          </RoleProtectedRoute>
        </Route>
        
        <Route path="/school-calendar">
          <RoleProtectedRoute moduleId="scheduling">
            <SchoolCalendar />
          </RoleProtectedRoute>
        </Route>
        
        <Route path="/calendar">
          <RoleProtectedRoute moduleId="scheduling">
            <Calendar />
          </RoleProtectedRoute>
        </Route>

        {/* Administrative modules - School Admin only */}
        <Route path="/users">
          <RoleProtectedRoute moduleId="users">
            <UserManagement />
          </RoleProtectedRoute>
        </Route>

        <Route path="/school-management">
          <RoleProtectedRoute moduleId="school-management">
            <SchoolManagement />
          </RoleProtectedRoute>
        </Route>

        <Route path="/analytics">
          <RoleProtectedRoute moduleId="analytics">
            <Analytics />
          </RoleProtectedRoute>
        </Route>

        <Route path="/licensing">
          <RoleProtectedRoute moduleId="licensing">
            <Licensing />
          </RoleProtectedRoute>
        </Route>

        {/* Technical modules - IT Staff + School Admin */}
        <Route path="/device-management">
          <RoleProtectedRoute moduleId="device-management">
            <DeviceManagement />
          </RoleProtectedRoute>
        </Route>

        {/* Authoring module - Content creators */}
        <Route path="/authoring-dashboard">
          <RoleProtectedRoute moduleId="authoring-dashboard">
            <AuthoringDashboard />
          </RoleProtectedRoute>
        </Route>

        {/* Security modules - Security Staff + School Admin */}
        <Route path="/security-dashboard">
          <RoleProtectedRoute moduleId="security-dashboard">
            <SecurityDashboard />
          </RoleProtectedRoute>
        </Route>

        <Route path="/family-controls">
          <RoleProtectedRoute moduleId="family-controls">
            <FamilyControls />
          </RoleProtectedRoute>
        </Route>

        {/* Communication modules - Multiple roles */}
        <Route path="/pbx">
          <RoleProtectedRoute moduleId="pbx">
            <PBXDashboard />
          </RoleProtectedRoute>
        </Route>

        {/* Parent modules - Parent role only */}
        <Route path="/parent-portal">
          <RoleProtectedRoute moduleId="parent-portal">
            <ParentPortal />
          </RoleProtectedRoute>
        </Route>

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
