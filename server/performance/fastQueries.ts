import { cache } from './cache';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { users } from '@shared/schema';
import { assessmentBooks, assessmentEntries } from '@shared/schemas/education.schema';

// Fast user queries with caching
export class FastQueries {
  
  // Get user with caching
  static async getUser(userId: string) {
    const cacheKey = `user:${userId}`;
    const cached = cache.getMedium(cacheKey);
    if (cached) return cached;

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const result = user[0] || null;
    
    if (result) {
      cache.setMedium(cacheKey, result);
    }
    
    return result;
  }

  // Get users by tenant with caching
  static async getUsersByTenant(tenantId: string) {
    const cacheKey = `users:tenant:${tenantId}`;
    const cached = cache.getShort(cacheKey);
    if (cached) return cached;

    const result = await db.select().from(users).where(eq(users.tenantId, tenantId));
    
    cache.setShort(cacheKey, result);
    return result;
  }

  // Get assessment books with caching
  static async getAssessmentBooks(tenantId: string, gradeLevel?: string) {
    const cacheKey = `assessment-books:${tenantId}:${gradeLevel || 'all'}`;
    const cached = cache.getShort(cacheKey);
    if (cached) return cached;

    let query = db.select().from(assessmentBooks).where(eq(assessmentBooks.tenantId, tenantId));
    
    if (gradeLevel) {
      query = query.where(eq(assessmentBooks.gradeLevel, gradeLevel));
    }

    const result = await query;
    cache.setShort(cacheKey, result);
    return result;
  }

  // Get assessment entries with caching
  static async getAssessmentEntries(bookId: number) {
    const cacheKey = `assessment-entries:${bookId}`;
    const cached = cache.getShort(cacheKey);
    if (cached) return cached;

    const result = await db.select().from(assessmentEntries).where(eq(assessmentEntries.assessmentBookId, bookId));
    
    cache.setShort(cacheKey, result);
    return result;
  }

  // Invalidate cache for specific patterns
  static invalidateUserCache(userId?: string, tenantId?: string) {
    if (userId) {
      cache.invalidate(`user:${userId}`);
    }
    if (tenantId) {
      cache.invalidate(`users:tenant:${tenantId}`);
      cache.invalidate(`assessment-books:${tenantId}`);
    }
  }

  // Invalidate assessment cache
  static invalidateAssessmentCache(tenantId: string, bookId?: number) {
    cache.invalidate(`assessment-books:${tenantId}`);
    if (bookId) {
      cache.invalidate(`assessment-entries:${bookId}`);
    }
  }
}