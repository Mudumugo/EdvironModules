// Re-export all education schemas
export * from './institutions';
export * from './classes';

// Legacy compatibility exports for main schema
export {
  institutions,
  students,
  parentChildRelationships,
  insertInstitutionSchema,
  insertStudentSchema,
  insertParentChildRelationshipSchema
} from './institutions';

export {
  classes,
  classEnrollments,
  assignments,
  assignmentSubmissions,
  insertClassSchema,
  insertClassEnrollmentSchema,
  insertAssignmentSchema,
  insertAssignmentSubmissionSchema
} from './classes';