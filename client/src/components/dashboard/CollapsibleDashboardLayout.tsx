import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  FolderOpen,
  Calendar,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
  FileText,
  FlaskConical,
  Gamepad2,
  Heart,
  Presentation,
  ClipboardList,
  Video,
  Globe,
  School,
  Monitor,
  Shield,
  PanelLeft,
  Home,
  User
} from "lucide-react";

interface CollapsibleDashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function CollapsibleDashboardLayout({ 
  children, 
  title = "Dashboard",
  subtitle = "Welcome to your learning space"
}: CollapsibleDashboardLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  // Get navigation items based on user role and academic level
  const getNavigationItems = () => {
    const baseItems = [
      { 
        id: "dashboard", 
        title: "Dashboard", 
        icon: Home, 
        url: "/dashboard" 
      },
      { 
        id: "my-locker", 
        title: "My Locker", 
        icon: FolderOpen, 
        url: "/my-locker" 
      },
      { 
        id: "digital-library", 
        title: "Digital Library", 
        icon: BookOpen, 
        url: "/digital-library" 
      },
      { 
        id: "scheduling", 
        title: "Calendar", 
        icon: Calendar, 
        url: "/calendar" 
      }
    ];

    const teacherItems = [
      { 
        id: "teachers-dashboard", 
        title: "Teachers Dashboard", 
        icon: Home, 
        url: "/teachers-dashboard" 
      },
      ...baseItems,
      { 
        id: "analytics", 
        title: "Analytics", 
        icon: BarChart3, 
        url: "/analytics" 
      },
      { 
        id: "assignments", 
        title: "Assignments", 
        icon: ClipboardList, 
        url: "/assignments" 
      },
      { 
        id: "lesson-planning", 
        title: "Lesson Planning", 
        icon: Presentation, 
        url: "/lesson-planning" 
      }
    ];

    const adminItems = [
      ...baseItems,
      { 
        id: "school-management", 
        title: "School Management", 
        icon: School, 
        url: "/school-management" 
      },
      { 
        id: "user-management", 
        title: "User Management", 
        icon: Users, 
        url: "/users" 
      },
      { 
        id: "analytics", 
        title: "Analytics", 
        icon: BarChart3, 
        url: "/analytics" 
      }
    ];

    const studentItems = [
      ...baseItems,
      { 
        id: "tutor-hub", 
        title: "Get Help", 
        icon: Users, 
        url: "/tutor-hub" 
      },
      { 
        id: "apps-hub", 
        title: "Learning Apps", 
        icon: Gamepad2, 
        url: "/apps-hub" 
      }
    ];

    // Return appropriate items based on user role
    if (user?.role?.includes('teacher') || user?.role === 'demo_teacher') {
      return teacherItems;
    }
    if (user?.role?.includes('admin') || user?.role === 'demo_school_admin') {
      return adminItems;
    }
    return studentItems;
  };

  const navigationItems = getNavigationItems();

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return location === '/' || location === '/dashboard';
    }
    if (url === '/teachers-dashboard') {
      return location === '/teachers-dashboard';
    }
    return location.startsWith(url);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="default" collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">EdVirons</span>
                <span className="text-xs text-muted-foreground">Learning Portal</span>
              </div>
            </div>
          </SidebarHeader>
          
          {/* Mobile Sidebar Overlay */}
          <Sidebar variant="default" collapsible="offcanvas">
            <SidebarHeader className="border-b border-sidebar-border p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">EdVirons</span>
                  <span className="text-xs text-muted-foreground">Learning Portal</span>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton asChild isActive={isActive(item.url)}>
                            <Link href={item.url}>
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <span className="text-xs font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen">
        <Sidebar variant="default" collapsible="icon" className="border-r">
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">EdVirons</span>
                <span className="text-xs text-muted-foreground">Learning Portal</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild isActive={isActive(item.url)}>
                          <Link href={item.url}>
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Additional sections for different user types */}
            {(user?.role?.includes('teacher') || user?.role === 'demo_teacher') && (
              <SidebarGroup>
                <SidebarGroupLabel>Teaching Tools</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/parent-portal-admin">
                          <Users className="h-4 w-4" />
                          <span>Parent Communication</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/apps-hub">
                          <Video className="h-4 w-4" />
                          <span>Video Conferencing</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {(user?.role?.includes('admin') || user?.role === 'demo_school_admin') && (
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/timetable">
                          <Calendar className="h-4 w-4" />
                          <span>Timetable Management</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/admin/communications">
                          <Monitor className="h-4 w-4" />
                          <span>Communications</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <span className="text-xs font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          {/* Mobile Header */}
          <header className="flex h-16 items-center justify-between bg-white border-b px-4 lg:hidden">
            <SidebarTrigger className="h-8 w-8 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-semibold">EdVirons</span>
            </div>
            <div className="w-8"></div>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:flex h-16 items-center gap-4 border-b bg-white px-6">
            <SidebarTrigger className="h-8 w-8 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {user && (
              <div className="text-sm text-muted-foreground">
                {user.firstName} {user.lastName}
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}