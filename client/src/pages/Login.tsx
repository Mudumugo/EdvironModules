import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, Shield, Settings, Users, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  permissions: string[];
}

const userRoles: UserRole[] = [
  {
    id: "demo_student_elementary",
    name: "Primary Student",
    description: "Elementary school student (Ages 5-10) - Child-friendly learning interface",
    icon: BookOpen,
    color: "bg-blue-500",
    permissions: ["view_library", "submit_assignments", "view_grades"]
  },
  {
    id: "demo_student_middle",
    name: "Junior Student", 
    description: "Middle school student (Ages 11-13) - Subject-focused learning modules",
    icon: BookOpen,
    color: "bg-cyan-500",
    permissions: ["view_library", "submit_assignments", "view_grades", "group_projects"]
  },
  {
    id: "demo_student_high",
    name: "Senior Student",
    description: "High school student (Ages 14-18) - Advanced academic tools and research",
    icon: BookOpen,
    color: "bg-indigo-500", 
    permissions: ["view_library", "submit_assignments", "view_grades", "research_tools", "college_prep"]
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Classroom instructor with student management and curriculum access",
    icon: GraduationCap,
    color: "bg-green-500",
    permissions: ["manage_students", "create_assignments", "grade_assignments", "view_analytics"]
  },
  {
    id: "school_admin",
    name: "School Administrator",
    description: "Administrative staff with oversight of school operations and staff",
    icon: Users,
    color: "bg-purple-500",
    permissions: ["manage_users", "view_reports", "manage_curriculum", "system_settings"]
  },
  {
    id: "school_it_staff",
    name: "IT Staff",
    description: "Technical support with system management and maintenance access",
    icon: Settings,
    color: "bg-orange-500",
    permissions: ["system_admin", "user_support", "technical_maintenance", "data_backup"]
  },
  {
    id: "school_security",
    name: "Security Staff",
    description: "Security personnel with monitoring and safety management capabilities",
    icon: Shield,
    color: "bg-red-500",
    permissions: ["security_monitoring", "incident_reporting", "access_control"]
  }
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      // Create a demo user session for the selected role
      const response = await apiRequest("POST", "/api/auth/demo-login", {
        role: role.id,
        name: `Demo ${role.name}`,
        email: `demo.${role.id}@edvirons.com`
      });

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: `Logged in as ${role.name}`,
        });
        // Reload to trigger auth state update
        window.location.reload();
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edvirons Learning Portal
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Select your role to access the platform
          </p>
          <p className="text-sm text-gray-500">
            Demo environment - Choose any role to explore the system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {userRoles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole?.id === role.id;
            
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <CardDescription className="text-sm text-center">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Key Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 2).map((permission) => (
                        <Badge
                          key={permission}
                          variant="secondary"
                          className="text-xs"
                        >
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                      {role.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedRole && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <selectedRole.icon className="w-5 h-5" />
                  Login as {selectedRole.name}
                </CardTitle>
                <CardDescription>
                  You'll have access to {selectedRole.name.toLowerCase()} features and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700 mb-2">Full Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRole.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="secondary"
                          className="text-xs"
                        >
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRoleLogin(selectedRole)}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? "Logging in..." : `Login as ${selectedRole.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>This is a demonstration environment. In production, users would authenticate through secure login credentials.</p>
        </div>
      </div>
    </div>
  );
}