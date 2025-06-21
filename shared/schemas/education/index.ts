// Re-export all education schemas
export * from './institutions';
export * from './classes';

// Legacy compatibility - export the full schema as before but with modular structure
export {
  institutions,
  students,
  parentChildRelationships,
  classes,
  classEnrollments,
  assignments,
  assignmentSubmissions,
  insertInstitutionSchema,
  insertStudentSchema,
  insertParentChildRelationshipSchema,
  insertClassSchema,
  insertClassEnrollmentSchema,
  insertAssignmentSchema,
  insertAssignmentSubmissionSchema
} from './institutions';

export {
  insertClassSchema,
  insertClassEnrollmentSchema,
  insertAssignmentSchema,
  insertAssignmentSubmissionSchema
} from './classes';