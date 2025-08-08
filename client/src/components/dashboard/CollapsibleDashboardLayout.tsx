import { Link, useLocation } from "wouter";
import { GraduationCap, Home, BookOpen, Cloud, Smartphone, Settings, User, Calendar, BarChart3, PenTool, Users, Video, Monitor, FileText, MessageSquare, Clock, Shield, Wrench, BookOpenCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface CollapsibleDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function CollapsibleDashboardLayout({ 
  children, 
  title = "Dashboard",
  subtitle 
}: CollapsibleDashboardLayoutProps) {
  const [location] = useLocation();

  // Re-enabled auth query with no polling  
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    refetchInterval: false, // No polling
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  }) as { data: any };

  // Base navigation items (filtered by tenant configuration)
  const navigationItems = [
    { id: "dashboard", title: "Dashboard", url: "/dashboard", icon: Home },
    { id: "my-locker", title: "My Locker", url: "/my-locker", icon: Cloud },
    { id: "digital-library", title: "Digital Library", url: "/digital-library", icon: BookOpen },
    { id: "calendar", title: "Calendar", url: "/calendar", icon: Calendar },
    { id: "analytics", title: "Analytics", url: "/analytics", icon: BarChart3 },
    { id: "assignments", title: "Assignments", url: "/assignments", icon: PenTool },
    { id: "lesson-planning", title: "Lesson Planning", url: "/lesson-planning", icon: BookOpenCheck },
    { id: "apps-hub", title: "Apps Hub", url: "/apps-hub", icon: Smartphone },
    { id: "settings", title: "Settings", url: "/settings", icon: Settings },
    { id: "my-profile", title: "My Profile", url: "/my-profile", icon: User },
    { id: "phone-system", title: "Phone System", url: "/phone-system", icon: MessageSquare },
  ].filter(item => {
    // All base items are included in tenant builds
    return true;
  });

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return location === '/dashboard' || location === '/';
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
                        <Link href="/video-conferencing">
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

          <SidebarFooter className="border-t border-sidebar-border">
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-2 text-sm">
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
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger className="mr-2 h-8 w-8 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md" />
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold truncate">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            </div>
            {user && (
              <div className="text-sm text-muted-foreground">
                {user.firstName} {user.lastName}
              </div>
            )}
          </header>

          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default CollapsibleDashboardLayout;