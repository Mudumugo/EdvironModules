import { Express } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../replitAuth';
import { requirePermission, requireRole, requireSameTenant } from '../roleMiddleware';
import { PERMISSIONS, USER_ROLES, type UserRole } from '@shared/schema';
import { getRoleDisplayName, getAccessibleRoles, canManageUser } from '@shared/roleUtils';

export function registerUserRoutes(app: Express) {
  // Get current user profile
  app.get('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        ...user,
        roleDisplayName: getRoleDisplayName(user.role as UserRole)
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

  // Update user role (admin only)
  app.put('/api/users/:userId/role', 
    isAuthenticated,
    requirePermission(PERMISSIONS.MANAGE_USERS),
    async (req: any, res) => {
      try {
        const { userId } = req.params;
        const { role, gradeLevel, department } = req.body;
        const currentUser = req.user;

        // Check if current user can manage the target user
        const targetUser = await storage.getUser(userId);
        if (!targetUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        if (!canManageUser(currentUser.role, targetUser.role as UserRole)) {
          return res.status(403).json({ 
            message: 'Cannot modify user with equal or higher privileges' 
          });
        }

        const updatedUser = await storage.updateUserRole(userId, role, gradeLevel, department);
        
        res.json({
          ...updatedUser,
          roleDisplayName: getRoleDisplayName(updatedUser.role as UserRole)
        });
      } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Failed to update user role' });
      }
    }
  );

  // Get users by role
  app.get('/api/users/role/:role',
    isAuthenticated,
    requirePermission(PERMISSIONS.VIEW_STUDENT_RECORDS),
    async (req: any, res) => {
      try {
        const { role } = req.params;
        const tenantId = req.user.tenantId;
        
        const users = await storage.getUsersByRole(role, tenantId);
        
        const usersWithDisplayNames = users.map(user => ({
          ...user,
          roleDisplayName: getRoleDisplayName(user.role as UserRole)
        }));

        res.json(usersWithDisplayNames);
      } catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
      }
    }
  );

  // Get all users in tenant (admin only)
  app.get('/api/users',
    isAuthenticated,
    requirePermission(PERMISSIONS.MANAGE_USERS),
    async (req: any, res) => {
      try {
        const tenantId = req.user.tenantId;
        const users = await storage.getUsersByTenant(tenantId);
        
        const usersWithDisplayNames = users.map(user => ({
          ...user,
          roleDisplayName: getRoleDisplayName(user.role as UserRole)
        }));

        res.json(usersWithDisplayNames);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
      }
    }
  );

  // Get available roles for current user
  app.get('/api/users/available-roles',
    isAuthenticated,
    async (req: any, res) => {
      try {
        const currentUserRole = req.user.role as UserRole;
        const accessibleRoles = getAccessibleRoles(currentUserRole);
        
        const rolesWithDisplayNames = accessibleRoles.map(role => ({
          value: role,
          label: getRoleDisplayName(role),
          description: getRoleDescription(role)
        }));

        res.json(rolesWithDisplayNames);
      } catch (error) {
        console.error('Error fetching available roles:', error);
        res.status(500).json({ message: 'Failed to fetch available roles' });
      }
    }
  );

  // Get students for teacher/admin
  app.get('/api/users/students',
    isAuthenticated,
    requireRole([USER_ROLES.TEACHER, USER_ROLES.TUTOR, USER_ROLES.PRINCIPAL, USER_ROLES.VICE_PRINCIPAL, USER_ROLES.SCHOOL_ADMIN]),
    async (req: any, res) => {
      try {
        const tenantId = req.user.tenantId;
        
        // Get all student roles
        const studentRoles = [
          USER_ROLES.STUDENT_ELEMENTARY,
          USER_ROLES.STUDENT_MIDDLE,
          USER_ROLES.STUDENT_HIGH,
          USER_ROLES.STUDENT_COLLEGE
        ];

        const students = [];
        for (const role of studentRoles) {
          const roleStudents = await storage.getUsersByRole(role, tenantId);
          students.push(...roleStudents);
        }

        const studentsWithDisplayNames = students.map(student => ({
          ...student,
          roleDisplayName: getRoleDisplayName(student.role as UserRole)
        }));

        res.json(studentsWithDisplayNames);
      } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students' });
      }
    }
  );

  // Get teachers for admin
  app.get('/api/users/teachers',
    isAuthenticated,
    requirePermission(PERMISSIONS.MANAGE_USERS),
    async (req: any, res) => {
      try {
        const tenantId = req.user.tenantId;
        const teachers = await storage.getUsersByRole(USER_ROLES.TEACHER, tenantId);
        
        const teachersWithDisplayNames = teachers.map(teacher => ({
          ...teacher,
          roleDisplayName: getRoleDisplayName(teacher.role as UserRole)
        }));

        res.json(teachersWithDisplayNames);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Failed to fetch teachers' });
      }
    }
  );
}

function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    [USER_ROLES.STUDENT_ELEMENTARY]: "Grades K-5, basic learning activities",
    [USER_ROLES.STUDENT_MIDDLE]: "Grades 6-8, intermediate coursework",
    [USER_ROLES.STUDENT_HIGH]: "Grades 9-12, advanced curriculum",
    [USER_ROLES.STUDENT_COLLEGE]: "College-level courses and research",
    [USER_ROLES.TEACHER]: "Classroom instruction and student management",
    [USER_ROLES.TUTOR]: "Individual and small group instruction",
    [USER_ROLES.PRINCIPAL]: "School leadership and administration",
    [USER_ROLES.VICE_PRINCIPAL]: "Assistant administrative duties",
    [USER_ROLES.SCHOOL_ADMIN]: "Administrative support and operations",
    [USER_ROLES.SCHOOL_IT_STAFF]: "Technology management and support",
    [USER_ROLES.SCHOOL_SECURITY]: "Campus safety and security monitoring",
    [USER_ROLES.COUNSELOR]: "Student guidance and counseling services",
    [USER_ROLES.LIBRARIAN]: "Library resources and information services",
    [USER_ROLES.PARENT]: "Access to child's academic information",
  };
  return descriptions[role] || "Standard user access";
}