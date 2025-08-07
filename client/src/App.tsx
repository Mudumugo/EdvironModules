import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// // import { TooltipProvider } from "@/components/ui/tooltip" // Disabled for Replit webview compatibility; // Temporarily disabled for Replit webview compatibility
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
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

import StudentDashboard from "@/pages/StudentDashboard";
import UserManagement from "@/pages/UserManagement-simple";
import PBXDashboard from "@/pages/PBXDashboard";
import ParentPortal from "@/pages/ParentPortal";
import ParentPortalAdmin from "@/pages/ParentPortalAdmin";
import AppsHub from "@/pages/AppsHub";
import AppsHubAdmin from "@/pages/AppsHubAdmin";
import GlobalSupport from "@/pages/GlobalSupport";
import GlobalLicensing from "@/pages/GlobalLicensing";
import TenantManagement from "@/pages/TenantManagement";
import EdVironsAdminDashboard from "@/pages/EdVironsAdminDashboard";
import CBEHub from "@/pages/CBEHub";

import TimetableManagement from "@/pages/TimetableManagement";
import AuthoringDashboard from "@/pages/AuthoringDashboard";
import ClassManagement from "@/pages/ClassManagement";
import LessonPlanning from "@/pages/LessonPlanning";
import DigitalNotebooks from "@/pages/DigitalNotebooks";
import NotificationsCenter from "@/pages/NotificationsCenter";
import Communications from "@/pages/Communications";
import UserProfile from "@/pages/UserProfile";
import TechTutor from "@/pages/TechTutor";
import Help from "@/pages/Help";
import TeachersDashboard from "@/pages/TeachersDashboard";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { USER_ROLES } from "@shared/schema";
import { isRouteIncluded, hasGlobalAuthoringAccess } from "@/config/buildConfig";

// Component mapping for dynamic routing (filtered by build configuration)
const componentMap: Record<string, any> = {
  'dashboard': Dashboard,
  'my-locker': MyLocker,
  'school-management': SchoolManagement,
  'device-management': DeviceManagement,
  'digital-library': DigitalLibrary,
  'tutor-hub': TutorHub,
  'teacher-dashboard': Dashboard,
  'family-controls': FamilyControls,
  'scheduling': Scheduling,
  'analytics': Analytics,
  'user-profile': UserProfile,
  'licensing': Licensing,
  'settings': Settings,
  'users': UserManagement,
  'pbx': PBXDashboard,
  'parent-portal': ParentPortal,
  'parent-portal-admin': ParentPortalAdmin,
  'apps-hub': AppsHub,
  'apps-hub-admin': AppsHubAdmin,
  'teachers-dashboard': TeachersDashboard,
  'timetable': TimetableManagement,
  'security-dashboard': SecurityDashboard,
  'admin/communications': Communications,
  // Global-only components - conditionally included
  ...(isRouteIncluded('/authoring-dashboard') && {'authoring-dashboard': AuthoringDashboard})
};

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Switch>
      {/* Show loading state while checking authentication for other routes */}
      <Route>
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white text-lg">Loading EdVirons...</p>
            </div>
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
              {/* Show mobile landing on phone screens, new landing on desktop */}
              {(() => {
                try {
                  return isMobile ? <MobileLanding /> : <NewLanding />;
                } catch (error) {
                  console.error('Landing page error:', error);
                  return (
                    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">EdVirons</h1>
                        <p className="text-xl mb-8">Educational Platform Loading...</p>
                        <button 
                          onClick={() => window.location.reload()} 
                          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
                        >
                          Reload
                        </button>
                      </div>
                    </div>
                  );
                }
              })()}
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
                   user?.role === 'teacher' ? <Dashboard /> :
                   user?.role?.includes('student') || user?.role === 'student' ? <StudentDashboard /> :
                   user?.role === 'global_author' || user?.role === 'content_admin' ? <AuthoringDashboard /> :
                   user?.role?.startsWith('edvirons_') ? <EdVironsAdminDashboard /> :
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
                  <Dashboard />
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

              {/* Authoring module - Global content creators only */}
              {isRouteIncluded('/authoring-dashboard') && (
                <Route path="/authoring-dashboard">
                  <RoleProtectedRoute 
                    moduleId="authoring-dashboard"
                    customAccessCheck={(user) => hasGlobalAuthoringAccess(user?.role)}
                  >
                    <AuthoringDashboard />
                  </RoleProtectedRoute>
                </Route>
              )}

              {/* Class Management - Teachers */}
              <Route path="/class-management">
                <RoleProtectedRoute moduleId="class-management">
                  <ClassManagement />
                </RoleProtectedRoute>
              </Route>

              {/* Teacher-specific modules */}
              <Route path="/teachers-dashboard">
                <RoleProtectedRoute allowedRoles={["teacher", "school_admin"]}>
                  <TeachersDashboard />
                </RoleProtectedRoute>
              </Route>

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
                <RoleProtectedRoute allowedRoles={["teacher", "school_admin", "student_elementary", "student_middle", "student_high", "student_college", "school_security", "school_it_staff"]}>
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
              
              <Route path="/apps-hub-admin">
                <RoleProtectedRoute moduleId="apps-hub-admin">
                  <AppsHubAdmin />
                </RoleProtectedRoute>
              </Route>
              
              <Route path="/global-support">
                <RoleProtectedRoute moduleId="global-support">
                  <GlobalSupport />
                </RoleProtectedRoute>
              </Route>
              
              <Route path="/global-licensing">
                <RoleProtectedRoute moduleId="global-licensing">
                  <GlobalLicensing />
                </RoleProtectedRoute>
              </Route>
              
              <Route path="/tenant-management">
                <RoleProtectedRoute moduleId="tenant-management">
                  <TenantManagement />
                </RoleProtectedRoute>
              </Route>

              {/* CBE Hub - All authenticated users */}
              <Route path="/cbe-hub">
                <RoleProtectedRoute moduleId="cbe-hub">
                  <CBEHub />
                </RoleProtectedRoute>
              </Route>

              {/* CBE Hub - All users */}
              <Route path="/cbe-hub">
                <CBEHub />
              </Route>

              {/* Tech Tutor - Students and Teachers */}
              <Route path="/tech-tutor">
                <RoleProtectedRoute allowedRoles={["student_elementary", "student_middle", "student_high", "student_college", "teacher", "school_admin"]}>
                  <TechTutor />
                </RoleProtectedRoute>
              </Route>

              {/* Help Center - All users */}
              <Route path="/help">
                <Help />
              </Route>

              {/* Communication modules - Multiple roles */}
              <Route path="/admin/communications">
                <RoleProtectedRoute allowedRoles={["school_admin", "edvirons_admin"]}>
                  <Communications />
                </RoleProtectedRoute>
              </Route>

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
      <div className="min-h-screen">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
