import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../../shared/schema";
import { eq, and, or, desc, asc, like, ilike, count, isNull, isNotNull, gte, lte } from "drizzle-orm";
import type {
  LibraryCategory,
  InsertLibraryCategory,
  LibrarySubject,
  InsertLibrarySubject,
  LibraryItem,
  InsertLibraryItem,
  Assignment,
  InsertAssignment,
  AssignmentSubmission,
  InsertAssignmentSubmission,
  Notebook,
  InsertNotebook,
  NotebookSection,
  InsertNotebookSection,
  NotebookPage,
  InsertNotebookPage,
  LockerItem,
  InsertLockerItem
} from "../../shared/schema";

export class ContentStorage {
  constructor(private db: ReturnType<typeof drizzle>) {}

  // Library Categories
  async createLibraryCategory(categoryData: InsertLibraryCategory): Promise<LibraryCategory> {
    const result = await this.db.insert(schema.libraryCategories).values(categoryData).returning();
    return result[0];
  }

  async getLibraryCategories(tenantId: string): Promise<LibraryCategory[]> {
    return this.db
      .select()
      .from(schema.libraryCategories)
      .where(and(eq(schema.libraryCategories.tenantId, tenantId), eq(schema.libraryCategories.isActive, true)))
      .orderBy(asc(schema.libraryCategories.order), asc(schema.libraryCategories.name));
  }

  async updateLibraryCategory(id: string, categoryData: Partial<InsertLibraryCategory>): Promise<LibraryCategory | null> {
    const result = await this.db
      .update(schema.libraryCategories)
      .set({ ...categoryData, updatedAt: new Date() })
      .where(eq(schema.libraryCategories.id, id))
      .returning();
    return result[0] || null;
  }

  // Library Subjects
  async createLibrarySubject(subjectData: InsertLibrarySubject): Promise<LibrarySubject> {
    const result = await this.db.insert(schema.librarySubjects).values(subjectData).returning();
    return result[0];
  }

  async getLibrarySubjects(tenantId: string, categoryId?: string): Promise<LibrarySubject[]> {
    const whereClause = categoryId
      ? and(
          eq(schema.librarySubjects.tenantId, tenantId),
          eq(schema.librarySubjects.categoryId, categoryId),
          eq(schema.librarySubjects.isActive, true)
        )
      : and(eq(schema.librarySubjects.tenantId, tenantId), eq(schema.librarySubjects.isActive, true));

    return this.db
      .select()
      .from(schema.librarySubjects)
      .where(whereClause)
      .orderBy(asc(schema.librarySubjects.order), asc(schema.librarySubjects.name));
  }

  // Library Items
  async createLibraryItem(itemData: InsertLibraryItem): Promise<LibraryItem> {
    const result = await this.db.insert(schema.libraryItems).values(itemData).returning();
    return result[0];
  }

  async getLibraryItems(
    tenantId: string,
    filters?: {
      categoryId?: string;
      subjectId?: string;
      type?: string;
      gradeLevel?: string;
      isPublic?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<LibraryItem[]> {
    let whereClause = eq(schema.libraryItems.tenantId, tenantId);

    if (filters?.categoryId) {
      whereClause = and(whereClause, eq(schema.libraryItems.categoryId, filters.categoryId));
    }
    if (filters?.subjectId) {
      whereClause = and(whereClause, eq(schema.libraryItems.subjectId, filters.subjectId));
    }
    if (filters?.type) {
      whereClause = and(whereClause, eq(schema.libraryItems.type, filters.type));
    }
    if (filters?.gradeLevel) {
      whereClause = and(whereClause, eq(schema.libraryItems.gradeLevel, filters.gradeLevel));
    }
    if (filters?.isPublic !== undefined) {
      whereClause = and(whereClause, eq(schema.libraryItems.isPublic, filters.isPublic));
    }

    const query = this.db
      .select()
      .from(schema.libraryItems)
      .where(whereClause)
      .orderBy(desc(schema.libraryItems.createdAt));

    if (filters?.limit) {
      query.limit(filters.limit);
    }
    if (filters?.offset) {
      query.offset(filters.offset);
    }

    return query;
  }

  async searchLibraryItems(query: string, tenantId: string, limit = 20): Promise<LibraryItem[]> {
    const searchClause = or(
      ilike(schema.libraryItems.title, `%${query}%`),
      ilike(schema.libraryItems.description, `%${query}%`)
    );

    return this.db
      .select()
      .from(schema.libraryItems)
      .where(and(searchClause, eq(schema.libraryItems.tenantId, tenantId)))
      .limit(limit)
      .orderBy(desc(schema.libraryItems.viewCount));
  }

  // Assignments
  async createAssignment(assignmentData: InsertAssignment): Promise<Assignment> {
    const result = await this.db.insert(schema.assignments).values(assignmentData).returning();
    return result[0];
  }

  async getAssignments(
    tenantId: string,
    teacherId?: string,
    status?: string,
    limit = 50
  ): Promise<Assignment[]> {
    let whereClause = eq(schema.assignments.tenantId, tenantId);

    if (teacherId) {
      whereClause = and(whereClause, eq(schema.assignments.teacherId, teacherId));
    }
    if (status) {
      whereClause = and(whereClause, eq(schema.assignments.status, status));
    }

    return this.db
      .select()
      .from(schema.assignments)
      .where(whereClause)
      .orderBy(desc(schema.assignments.createdAt))
      .limit(limit);
  }

  async getAssignmentById(id: string): Promise<Assignment | null> {
    const result = await this.db
      .select()
      .from(schema.assignments)
      .where(eq(schema.assignments.id, id));
    return result[0] || null;
  }

  // Assignment Submissions
  async createSubmission(submissionData: InsertAssignmentSubmission): Promise<AssignmentSubmission> {
    const result = await this.db.insert(schema.assignmentSubmissions).values(submissionData).returning();
    return result[0];
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    return this.db
      .select()
      .from(schema.assignmentSubmissions)
      .where(eq(schema.assignmentSubmissions.assignmentId, assignmentId))
      .orderBy(desc(schema.assignmentSubmissions.submittedAt));
  }

  async getSubmissionsByStudent(studentId: string, limit = 20): Promise<AssignmentSubmission[]> {
    return this.db
      .select()
      .from(schema.assignmentSubmissions)
      .where(eq(schema.assignmentSubmissions.studentId, studentId))
      .orderBy(desc(schema.assignmentSubmissions.submittedAt))
      .limit(limit);
  }

  // Notebooks
  async createNotebook(notebookData: InsertNotebook): Promise<Notebook> {
    const result = await this.db.insert(schema.notebooks).values(notebookData).returning();
    return result[0];
  }

  async getNotebooks(ownerId: string, tenantId: string): Promise<Notebook[]> {
    return this.db
      .select()
      .from(schema.notebooks)
      .where(and(eq(schema.notebooks.ownerId, ownerId), eq(schema.notebooks.tenantId, tenantId)))
      .orderBy(desc(schema.notebooks.lastEditedAt));
  }

  async getNotebookById(id: string): Promise<Notebook | null> {
    const result = await this.db
      .select()
      .from(schema.notebooks)
      .where(eq(schema.notebooks.id, id));
    return result[0] || null;
  }

  // Notebook Sections
  async createNotebookSection(sectionData: InsertNotebookSection): Promise<NotebookSection> {
    const result = await this.db.insert(schema.notebookSections).values(sectionData).returning();
    return result[0];
  }

  async getNotebookSections(notebookId: string): Promise<NotebookSection[]> {
    return this.db
      .select()
      .from(schema.notebookSections)
      .where(eq(schema.notebookSections.notebookId, notebookId))
      .orderBy(asc(schema.notebookSections.order));
  }

  // Notebook Pages
  async createNotebookPage(pageData: InsertNotebookPage): Promise<NotebookPage> {
    const result = await this.db.insert(schema.notebookPages).values(pageData).returning();
    return result[0];
  }

  async getNotebookPages(notebookId: string, sectionId?: string): Promise<NotebookPage[]> {
    const whereClause = sectionId
      ? and(eq(schema.notebookPages.notebookId, notebookId), eq(schema.notebookPages.sectionId, sectionId))
      : eq(schema.notebookPages.notebookId, notebookId);

    return this.db
      .select()
      .from(schema.notebookPages)
      .where(whereClause)
      .orderBy(asc(schema.notebookPages.order));
  }

  // Locker Items
  async createLockerItem(itemData: InsertLockerItem): Promise<LockerItem> {
    const result = await this.db.insert(schema.lockerItems).values(itemData).returning();
    return result[0];
  }

  async getLockerItems(ownerId: string, tenantId: string, parentId?: string): Promise<LockerItem[]> {
    const whereClause = parentId
      ? and(
          eq(schema.lockerItems.ownerId, ownerId),
          eq(schema.lockerItems.tenantId, tenantId),
          eq(schema.lockerItems.parentId, parentId)
        )
      : and(
          eq(schema.lockerItems.ownerId, ownerId),
          eq(schema.lockerItems.tenantId, tenantId),
          isNull(schema.lockerItems.parentId)
        );

    return this.db
      .select()
      .from(schema.lockerItems)
      .where(whereClause)
      .orderBy(asc(schema.lockerItems.name));
  }

  async searchLockerItems(query: string, ownerId: string, tenantId: string): Promise<LockerItem[]> {
    const searchClause = or(
      ilike(schema.lockerItems.name, `%${query}%`),
      ilike(schema.lockerItems.description, `%${query}%`)
    );

    return this.db
      .select()
      .from(schema.lockerItems)
      .where(
        and(
          searchClause,
          eq(schema.lockerItems.ownerId, ownerId),
          eq(schema.lockerItems.tenantId, tenantId)
        )
      )
      .orderBy(desc(schema.lockerItems.lastAccessedAt));
  }
}