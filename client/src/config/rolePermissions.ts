import { UserRole } from "@shared/schema";

export interface ModulePermission {
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
  allowedRoles: UserRole[];
  requiredPermissions?: string[];
  isCore?: boolean; // Core modules that most users need
}

export const MODULE_PERMISSIONS: ModulePermission[] = [
  // Core modules
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/",
    icon: "BarChart3",
    description: "Main overview and statistics",
    allowedRoles: ["student", "student_elementary", "student_middle", "student_high", "student_college", "teacher", "school_admin", "it_staff", "security_staff", "school_it_staff", "school_security", "global_author", "content_admin"],
    isCore: true
  },
  {
    id: "crm",
    name: "CRM",
    path: "/crm",
    icon: "Users",
    description: "Customer Relationship Management and lead tracking",
    allowedRoles: ["school_admin", "teacher", "it_staff", "security_staff"],
    isCore: false
  },
  {
    id: "digital-library",
    name: "Digital Library",
    path: "/digital-library",
    icon: "BookOpen",
    description: "Access digital books and educational resources",
    allowedRoles: ["student", "student_elementary", "student_middle", "student_high", "student_college", "teacher", "school_admin", "global_author", "content_admin"],
    isCore: true
  },
  {
    id: "my-locker",
    name: "My Locker",
    path: "/my-locker",
    icon: "CloudDownload",
    description: "Personal storage and saved content",
    allowedRoles: ["student", "student_elementary", "student_middle", "student_high", "student_college", "teacher", "global_author", "content_admin"],
    isCore: true
  },
  {
    id: "class-management",
    name: "Class Management",
    path: "/class-management",
    icon: "Users",
    description: "Manage classes, student enrollment, and performance tracking",
    allowedRoles: ["teacher", "school_admin"],
    isCore: false
  },
  {
    id: "apps-hub",
    name: "Apps Hub",
    path: "/apps-hub",
    icon: "FlaskRound",
    description: "External learning applications and educational tools",
    allowedRoles: ["student", "student_elementary", "teacher", "school_admin"],
    isCore: true
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
    icon: "Settings",
    description: "Personal account settings",
    allowedRoles: ["student", "student_elementary", "teacher", "school_admin", "it_staff", "security_staff", "school_it_staff", "school_security", "global_author", "content_admin"],
    isCore: true
  },
  {
    id: "user-profile",
    name: "My Profile",
    path: "/user-profile",
    icon: "User",
    description: "Manage your personal information and settings",
    allowedRoles: [
      "student", "student_elementary", "student_middle", "student_high", "student_college",
      "teacher", "tutor", "principal", "vice_principal", "counselor", "librarian",
      "school_admin", "security_staff", "school_security",
      "it_staff", "school_it_staff", "parent"
    ],
    isCore: true
  },

  // Educational modules
  {
    id: "teacher-dashboard",
    name: "Teaching Center",
    path: "/teacher-dashboard",
    icon: "Presentation",
    description: "Teaching tools, class management, and student analytics",
    allowedRoles: ["teacher"],
  },
  {
    id: "tutor-hub",
    name: "Tutor Hub",
    path: "/tutor-hub",
    icon: "GraduationCap",
    description: "Tutoring sessions and student support",
    allowedRoles: ["teacher"],
  },
  {
    id: "scheduling",
    name: "Scheduling",
    path: "/scheduling",
    icon: "Calendar",
    description: "Class schedules and timetables",
    allowedRoles: ["teacher", "school_admin"],
  },
  {
    id: "authoring-dashboard",
    name: "Content Authoring",
    path: "/authoring-dashboard",
    icon: "PenTool",
    description: "Create and manage educational content for global library",
    allowedRoles: ["teacher", "tutor", "librarian", "school_admin", "global_author", "content_admin"],
  },

  // Administrative modules
  {
    id: "users",
    name: "User Management",
    path: "/users",
    icon: "Users",
    description: "Manage students, teachers, and staff",
    allowedRoles: ["school_admin"],
  },
  {
    id: "school-management",
    name: "School Management",
    path: "/school-management",
    icon: "School",
    description: "School administration and institutional settings",
    allowedRoles: ["school_admin"],
  },
  {
    id: "analytics",
    name: "Analytics",
    path: "/analytics",
    icon: "BarChart3",
    description: "Comprehensive reporting and data analysis",
    allowedRoles: ["school_admin", "teacher"],
  },
  {
    id: "licensing",
    name: "Licensing",
    path: "/licensing",
    icon: "CreditCard",
    description: "Software licenses and subscription management",
    allowedRoles: ["school_admin"],
  },

  // Technical modules
  {
    id: "device-management",
    name: "Device Management",
    path: "/device-management",
    icon: "Monitor",
    description: "Manage school devices and technical infrastructure",
    allowedRoles: ["it_staff", "school_admin"],
  },

  // Security modules
  {
    id: "security-dashboard",
    name: "Security Dashboard",
    path: "/security-dashboard",
    icon: "Shield",
    description: "Security monitoring, alerts and threat intelligence",
    allowedRoles: ["security_staff", "school_admin"],
  },
  {
    id: "family-controls",
    name: "Access Controls",
    path: "/family-controls",
    icon: "Shield",
    description: "Security settings and access control management",
    allowedRoles: ["security_staff", "school_admin"],
  },

  // Communication modules
  {
    id: "pbx",
    name: "Phone System",
    path: "/pbx",
    icon: "Phone",
    description: "Campus phone system and communication center",
    allowedRoles: [
      "school_admin", "school_it_staff", "school_security", "teacher", 
      "principal", "vice_principal", "office_staff", "receptionist", 
      "secretary", "registrar", "nurse", "counselor"
    ],
    isCore: true
  },


  // Parent modules
  {
    id: "parent-portal",
    name: "Parent Portal",
    path: "/parent-portal",
    icon: "Users",
    description: "View children's information, teacher messages, and school announcements",
    allowedRoles: ["parent"],
    isCore: true
  },
];

export function getAccessibleModules(userRole: UserRole): ModulePermission[] {
  return MODULE_PERMISSIONS.filter(module => 
    module.allowedRoles.includes(userRole)
  );
}

export function hasModuleAccess(userRole: UserRole, moduleId: string): boolean {
  const module = MODULE_PERMISSIONS.find(m => m.id === moduleId);
  if (!module) return false;
  
  // Map demo roles to their corresponding real roles for permission checking
  const roleMapping: Record<string, UserRole> = {
    'demo_student_elementary': 'student_elementary',
    'demo_student_middle': 'student_middle', 
    'demo_student_high': 'student_high',
    'demo_student_college': 'student_college',
    'demo_teacher': 'teacher',
    'demo_global_author': 'global_author',
    'demo_school_admin': 'school_admin'
  };
  
  const mappedRole = roleMapping[userRole as string] || userRole;
  return module.allowedRoles.includes(mappedRole);
}

export function getCoreModules(userRole: UserRole): ModulePermission[] {
  return MODULE_PERMISSIONS.filter(module => 
    module.isCore && module.allowedRoles.includes(userRole)
  );
}

export function getModulesByCategory(userRole: UserRole) {
  const accessibleModules = getAccessibleModules(userRole);
  
  return {
    core: accessibleModules.filter(m => m.isCore),
    educational: accessibleModules.filter(m => 
      ['teacher-dashboard', 'tutor-hub', 'scheduling'].includes(m.id)
    ),
    administrative: accessibleModules.filter(m => 
      ['users', 'school-management', 'analytics', 'licensing'].includes(m.id)
    ),
    technical: accessibleModules.filter(m => 
      ['device-management'].includes(m.id)
    ),
    security: accessibleModules.filter(m => 
      ['security-dashboard', 'family-controls'].includes(m.id)
    ),
  };
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Partial<Record<UserRole, string>> = {
    student_elementary: "Elementary Student",
    student_middle: "Middle School Student",
    student_high: "High School Student", 
    student_college: "College Student",
    teacher: "Teacher",
    tutor: "Tutor",
    principal: "Principal",
    vice_principal: "Vice Principal",
    counselor: "Counselor",
    librarian: "Librarian",
    school_admin: "School Administrator",
    school_security: "Security Staff",
    school_it_staff: "IT Staff",
    parent: "Parent"
  };
  return roleNames[role] || role;
}

export function getRoleDescription(role: UserRole): string {
  const descriptions: Partial<Record<UserRole, string>> = {
    student_elementary: "Access learning materials and personal content",
    student_middle: "Access age-appropriate educational resources",
    student_high: "Advanced learning tools and career preparation",
    student_college: "Higher education resources and research tools",
    teacher: "Manage classes, students, and educational content",
    tutor: "Provide specialized tutoring and support",
    principal: "School leadership and administrative oversight",
    vice_principal: "Assistant administrative responsibilities",
    counselor: "Student guidance and support services",
    librarian: "Manage digital library and educational resources",
    school_admin: "Full administrative access to school systems",
    school_it_staff: "Technical management and device administration", 
    school_security: "Security oversight and access control management",
    parent: "Monitor and support student progress"
  };
  return descriptions[role] || "";
}

