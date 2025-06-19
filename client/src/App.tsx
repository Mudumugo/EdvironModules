import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { Landing } from "@/pages/Landing";
import MobileLanding from "@/pages/MobileLanding";
import { Solutions } from "@/pages/Solutions";
import { CBEOverview } from "@/pages/CBEOverview";
import { About } from "@/pages/About";
import { Features } from "@/pages/Features";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import InteractiveSignUp from "@/pages/InteractiveSignUp";
import Dashboard from "@/pages/Dashboard";
import LearningDashboard from "@/pages/LearningDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import SchoolManagement from "@/pages/SchoolManagement";
import DigitalLibrary from "@/pages/DigitalLibrary";
import DigitalLibraryNew from "@/pages/DigitalLibraryNew";
import SecurityDashboard from "@/pages/SecurityDashboard";
import ITDashboard from "@/pages/ITDashboard";
import TutorHub from "@/pages/TutorHub";
import FamilyControls from "@/pages/FamilyControls";
import Scheduling from "@/pages/Scheduling";
import SchoolCalendar from "@/pages/SchoolCalendar";
import Calendar from "@/pages/Calendar";
import Analytics from "@/pages/Analytics";
import Licensing from "@/pages/Licensing";
import Settings from "@/pages/Settings";
import CRM from "@/pages/CRM";
import MyLocker from "@/pages/MyLocker";
import DeviceManagement from "@/pages/DeviceManagement";
import TeacherDashboard from "@/pages/TeacherDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import UserManagement from "@/pages/UserManagement-simple";
import PBXDashboard from "@/pages/PBXDashboard";
import ParentPortal from "@/pages/ParentPortal";
import ParentPortalAdmin from "@/pages/ParentPortalAdmin";
import AppsHub from "@/pages/AppsHub";

import TimetableManagement from "@/pages/TimetableManagement";
import AuthoringDashboard from "@/pages/AuthoringDashboard";
import ClassManagement from "@/pages/ClassManagement";
import LessonPlanning from "@/pages/LessonPlanning";
import DigitalNotebooks from "@/pages/DigitalNotebooks";
import NotificationsCenter from "@/pages/NotificationsCenter";
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

  'timetable': TimetableManagement,
  'security-dashboard': SecurityDashboard,
};

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Switch>
      {/* Show loading state while checking authentication for other routes */}
      <Route>
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !isAuthenticated ? (
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
              {/* Show mobile landing on phone screens, full landing on desktop */}
              {isMobile ? <MobileLanding /> : <Landing />}
            </Route>
          </Switch>
        ) : (
          <Layout>
            <Switch>
              {/* Core modules - available to all authenticated users */}
              <Route path="/">
                <RoleProtectedRoute moduleId="dashboard">
                  {user?.role === 'school_admin' ? <AdminDashboard /> : 
                   user?.role === 'security_staff' || user?.role === 'school_security' ? <SecurityDashboard /> : 
                   user?.role === 'it_staff' || user?.role === 'school_it_staff' ? <ITDashboard /> : 
                   user?.role === 'teacher' ? <TeacherDashboard /> :
                   user?.role?.includes('student') || user?.role === 'student' ? <StudentDashboard /> :
                   <Dashboard />}
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

              {/* Class Management - Teachers */}
              <Route path="/class-management">
                <RoleProtectedRoute moduleId="class-management">
                  <ClassManagement />
                </RoleProtectedRoute>
              </Route>

              {/* Teacher-specific modules */}
              <Route path="/lesson-planning">
                <RoleProtectedRoute allowedRoles={["teacher", "school_admin"]}>
                  <LessonPlanning />
                </RoleProtectedRoute>
              </Route>

              <Route path="/digital-notebooks">
                <RoleProtectedRoute allowedRoles={["teacher", "school_admin", "student_elementary", "student_middle", "student_high", "student_college"]}>
                  <DigitalNotebooks />
                </RoleProtectedRoute>
              </Route>

              {/* Notifications Center */}
              <Route path="/notifications">
                <RoleProtectedRoute allowedRoles={["teacher", "school_admin", "student_elementary", "student_middle", "student_high", "student_college", "security_staff", "it_staff"]}>
                  <NotificationsCenter />
                </RoleProtectedRoute>
              </Route>

              {/* Security modules - Security Staff + School Admin */}
              <Route path="/security-dashboard">
                <RoleProtectedRoute moduleId="security-dashboard">
                  <SecurityDashboard />
                </RoleProtectedRoute>
              </Route>

              <Route path="/crm">
                <RoleProtectedRoute moduleId="crm">
                  <CRM />
                </RoleProtectedRoute>
              </Route>

              <Route path="/family-controls">
                <RoleProtectedRoute moduleId="family-controls">
                  <FamilyControls />
                </RoleProtectedRoute>
              </Route>

              {/* Apps Hub - Multiple roles */}
              <Route path="/apps-hub">
                <RoleProtectedRoute moduleId="apps-hub">
                  <AppsHub />
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
        )}
      </Route>
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
