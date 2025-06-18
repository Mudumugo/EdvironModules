export const isStudent = (role: string | undefined) => {
  return role?.includes('student') || false;
};

export const isStaff = (role: string | undefined) => {
  return role && !role.includes('student') && !role.includes('parent');
};

export const getRoleDisplayName = (role: string) => {
  const roleMap: Record<string, string> = {
    'student_elementary': 'Elementary Student',
    'student_middle': 'Middle School Student',
    'student_high': 'High School Student',
    'teacher': 'Teacher',
    'tutor': 'Tutor',
    'librarian': 'Librarian',
    'school_admin': 'School Administrator',
    'school_it_staff': 'IT Staff',
    'district_admin': 'District Administrator',
    'super_admin': 'System Administrator'
  };
  return roleMap[role] || role;
};

export const getInitials = (firstName?: string | null, lastName?: string | null) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};