import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  requireAuth?: boolean;
  requiredRoles?: string[];
  title?: string;
  description?: string;
  isPublic?: boolean;
  isMobileOnly?: boolean;
  isDesktopOnly?: boolean;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  isActive?: boolean;
  children?: NavigationItem[];
}

export const PUBLIC_ROUTES: RouteConfig[] = [
  { path: "/", component: () => null, isPublic: true, title: "EdVirons - Educational Platform" },
  { path: "/solutions", component: () => null, isPublic: true, title: "Solutions - EdVirons" },
  { path: "/cbe-overview", component: () => null, isPublic: true, title: "CBE Overview - EdVirons" },
  { path: "/about", component: () => null, isPublic: true, title: "About - EdVirons" },
  { path: "/features", component: () => null, isPublic: true, title: "Features - EdVirons" },
  { path: "/login", component: () => null, isPublic: true, title: "Login - EdVirons" },
  { path: "/signup", component: () => null, isPublic: true, title: "Sign Up - EdVirons" },
  { path: "/interactive-signup", component: () => null, isPublic: true, title: "Get Started - EdVirons" },
];

export const PROTECTED_ROUTES: RouteConfig[] = [
  { path: "/dashboard", component: () => null, requireAuth: true, title: "Dashboard - EdVirons" },
  { path: "/learning-dashboard", component: () => null, requireAuth: true, title: "Learning Dashboard - EdVirons" },
  { path: "/admin-dashboard", component: () => null, requireAuth: true, requiredRoles: ["admin"], title: "Admin Dashboard - EdVirons" },
  { path: "/school-management", component: () => null, requireAuth: true, requiredRoles: ["admin", "school_admin"], title: "School Management - EdVirons" },
  { path: "/digital-library", component: () => null, requireAuth: true, title: "Digital Library - EdVirons" },
  { path: "/security-dashboard", component: () => null, requireAuth: true, requiredRoles: ["admin", "security"], title: "Security Dashboard - EdVirons" },
  { path: "/it-dashboard", component: () => null, requireAuth: true, requiredRoles: ["admin", "it_staff"], title: "IT Dashboard - EdVirons" },
  { path: "/analytics", component: () => null, requireAuth: true, title: "Analytics - EdVirons" },
  { path: "/settings", component: () => null, requireAuth: true, title: "Settings - EdVirons" },
];

export const MOBILE_ROUTES: RouteConfig[] = [
  { path: "/mobile", component: () => null, isPublic: true, isMobileOnly: true, title: "EdVirons Mobile" },
];

export function useAppRouter() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentRoute, setCurrentRoute] = useState<RouteConfig | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<NavigationItem[]>([]);

  // Find current route configuration
  useEffect(() => {
    const allRoutes = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES, ...MOBILE_ROUTES];
    const route = allRoutes.find(r => r.path === location);
    setCurrentRoute(route || null);
  }, [location]);

  // Update document title
  useEffect(() => {
    if (currentRoute?.title) {
      document.title = currentRoute.title;
    }
  }, [currentRoute]);

  // Generate breadcrumbs
  useEffect(() => {
    const pathSegments = location.split('/').filter(Boolean);
    const crumbs: NavigationItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const route = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES].find(r => r.path === currentPath);
      
      if (route) {
        crumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
          path: currentPath
        });
      }
    });

    setBreadcrumbs(crumbs);
  }, [location]);

  const canAccessRoute = (route: RouteConfig): boolean => {
    // Check if route requires authentication
    if (route.requireAuth && !isAuthenticated) {
      return false;
    }

    // Check role requirements
    if (route.requiredRoles && route.requiredRoles.length > 0) {
      if (!user?.role || !route.requiredRoles.includes(user.role)) {
        return false;
      }
    }

    // Check device requirements
    if (route.isMobileOnly && !isMobile) {
      return false;
    }

    if (route.isDesktopOnly && isMobile) {
      return false;
    }

    return true;
  };

  const navigate = (path: string, replace: boolean = false) => {
    const route = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES, ...MOBILE_ROUTES].find(r => r.path === path);
    
    if (route && !canAccessRoute(route)) {
      // Redirect to appropriate page
      if (!isAuthenticated) {
        setLocation('/login');
      } else {
        setLocation('/dashboard');
      }
      return;
    }

    setLocation(path, { replace });
  };

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const getRoutesByCategory = (category: 'public' | 'protected' | 'mobile') => {
    switch (category) {
      case 'public':
        return PUBLIC_ROUTES;
      case 'protected':
        return PROTECTED_ROUTES;
      case 'mobile':
        return MOBILE_ROUTES;
      default:
        return [];
    }
  };

  const getUserAccessibleRoutes = (): RouteConfig[] => {
    const allRoutes = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES, ...MOBILE_ROUTES];
    return allRoutes.filter(route => canAccessRoute(route));
  };

  const generateNavigation = (): NavigationItem[] => {
    const accessibleRoutes = getUserAccessibleRoutes();
    
    return accessibleRoutes
      .filter(route => !route.path.includes(':') && route.path !== '/') // Exclude parameterized and root routes
      .map(route => ({
        label: route.title?.replace(' - EdVirons', '') || route.path.replace('/', '').replace('-', ' '),
        path: route.path,
        isActive: location === route.path
      }));
  };

  const getRouteTitle = (path: string): string => {
    const route = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES, ...MOBILE_ROUTES].find(r => r.path === path);
    return route?.title || 'EdVirons';
  };

  const isProtectedRoute = (path: string): boolean => {
    return PROTECTED_ROUTES.some(route => route.path === path);
  };

  const isPublicRoute = (path: string): boolean => {
    return PUBLIC_ROUTES.some(route => route.path === path);
  };

  const shouldShowMobileVersion = (): boolean => {
    return isMobile && currentRoute?.isMobileOnly !== false;
  };

  return {
    // Current state
    location,
    currentRoute,
    breadcrumbs,
    isMobile,
    isAuthenticated,
    authLoading,
    user,

    // Navigation functions
    navigate,
    goBack,
    goForward,
    setLocation,

    // Route utilities
    canAccessRoute,
    getRoutesByCategory,
    getUserAccessibleRoutes,
    generateNavigation,
    getRouteTitle,
    isProtectedRoute,
    isPublicRoute,
    shouldShowMobileVersion,

    // Computed values
    accessibleRoutes: getUserAccessibleRoutes(),
    navigation: generateNavigation(),
    canGoBack: window.history.length > 1,
    isHomePage: location === '/',
    isDashboard: location.includes('/dashboard'),
    isAdminArea: location.includes('/admin') || location.includes('/school-management'),
  };
}