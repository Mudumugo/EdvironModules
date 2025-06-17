import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { 
  libraryResources, 
  libraryBorrowings, 
  libraryReservations, 
  libraryReviews,
  libraryCategories,
  libraryCollections
} from "@shared/schemas/education.schema";
import { db } from "../db";
import { eq, and, desc, asc, sql, like, or, isNull, gte, lte } from "drizzle-orm";

export function registerLibraryRoutes(app: Express) {
  // Get all library resources with advanced filtering
  app.get('/api/library/resources', async (req: any, res) => {
    try {
      const { 
        grade, 
        curriculum, 
        type, 
        difficulty,
        subject,
        author,
        search,
        page = 1,
        limit = 20,
        sortBy = 'title',
        sortOrder = 'asc',
        featured,
        available
      } = req.query;

      // Apply filters using existing schema
      const conditions = [eq(libraryResources.isDigital, true)];
      
      if (grade) conditions.push(eq(libraryResources.grade, grade));
      if (curriculum) conditions.push(eq(libraryResources.curriculum, curriculum));
      if (type) conditions.push(eq(libraryResources.type, type));
      if (difficulty) conditions.push(eq(libraryResources.difficulty, difficulty));
      if (author) conditions.push(eq(libraryResources.author, author));
      
      if (search) {
        conditions.push(
          or(
            ilike(libraryResources.title, `%${search}%`),
            ilike(libraryResources.description, `%${search}%`),
            ilike(libraryResources.subject, `%${search}%`)
          )
        );
      }

      const resources = await db
        .select()
        .from(libraryResources)
        .where(and(...conditions))
        .orderBy(
          sortOrder === 'desc' 
            ? desc(libraryResources.title)
            : asc(libraryResources.title)
        )
        .limit(parseInt(limit))
        .offset((parseInt(page) - 1) * parseInt(limit));

      // Get total count for pagination
      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(libraryResources)
        .where(and(...conditions));

      res.json({
        resources,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount[0].count,
          pages: Math.ceil(totalCount[0].count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error("Error fetching library resources:", error);
      res.status(500).json({ message: "Failed to fetch library resources" });
    }
  });

  // Get single resource with detailed information
  app.get('/api/library/resources/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const [resource] = await db
        .select()
        .from(libraryResources)
        .where(eq(libraryResources.id, parseInt(id)));

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Increment view count
      await db
        .update(libraryResources)
        .set({ viewCount: sql`${libraryResources.viewCount} + 1` })
        .where(eq(libraryResources.id, parseInt(id)));

      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  // Borrow a resource
  app.post('/api/library/resources/:id/borrow', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { dueDate } = req.body;
      const userId = req.user.claims.sub;

      // Check if resource exists and is available
      const [resource] = await db
        .select()
        .from(libraryResources)
        .where(eq(libraryResources.id, parseInt(id)));

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      if ((resource.availableCopies || 0) <= 0) {
        return res.status(400).json({ message: "No copies available for borrowing" });
      }

      // Check if user already has this resource borrowed
      const [existingBorrowing] = await db
        .select()
        .from(libraryBorrowings)
        .where(
          and(
            eq(libraryBorrowings.resourceId, parseInt(id)),
            eq(libraryBorrowings.borrowerId, userId),
            eq(libraryBorrowings.status, 'active')
          )
        );

      if (existingBorrowing) {
        return res.status(400).json({ message: "You have already borrowed this resource" });
      }

      // Create borrowing record
      const [borrowing] = await db
        .insert(libraryBorrowings)
        .values({
          resourceId: parseInt(id),
          borrowerId: userId,
          dueDate: new Date(dueDate || Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 2 weeks
          tenantId: 'demo-school'
        })
        .returning();

      // Update available copies
      await db
        .update(libraryResources)
        .set({ availableCopies: sql`${libraryResources.availableCopies} - 1` })
        .where(eq(libraryResources.id, parseInt(id)));

      res.json(borrowing);
    } catch (error) {
      console.error("Error borrowing resource:", error);
      res.status(500).json({ message: "Failed to borrow resource" });
    }
  });

  // Return a resource
  app.post('/api/library/resources/:id/return', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;

      // Find active borrowing
      const [borrowing] = await db
        .select()
        .from(libraryBorrowings)
        .where(
          and(
            eq(libraryBorrowings.resourceId, parseInt(id)),
            eq(libraryBorrowings.borrowerId, userId),
            eq(libraryBorrowings.status, 'active')
          )
        );

      if (!borrowing) {
        return res.status(404).json({ message: "No active borrowing found for this resource" });
      }

      // Update borrowing record
      await db
        .update(libraryBorrowings)
        .set({ 
          status: 'returned',
          returnedAt: new Date()
        })
        .where(eq(libraryBorrowings.id, borrowing.id));

      // Update available copies
      await db
        .update(libraryResources)
        .set({ availableCopies: sql`${libraryResources.availableCopies} + 1` })
        .where(eq(libraryResources.id, parseInt(id)));

      res.json({ message: "Resource returned successfully" });
    } catch (error) {
      console.error("Error returning resource:", error);
      res.status(500).json({ message: "Failed to return resource" });
    }
  });

  // Reserve a resource
  app.post('/api/library/resources/:id/reserve', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;

      // Check if resource exists
      const [resource] = await db
        .select()
        .from(libraryResources)
        .where(eq(libraryResources.id, parseInt(id)));

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Check if user already has a reservation
      const [existingReservation] = await db
        .select()
        .from(libraryReservations)
        .where(
          and(
            eq(libraryReservations.resourceId, parseInt(id)),
            eq(libraryReservations.userId, userId),
            or(
              eq(libraryReservations.status, 'pending'),
              eq(libraryReservations.status, 'ready')
            )
          )
        );

      if (existingReservation) {
        return res.status(400).json({ message: "You already have a reservation for this resource" });
      }

      // Get next priority number
      const [priorityResult] = await db
        .select({ maxPriority: sql<number>`COALESCE(MAX(priority), 0)` })
        .from(libraryReservations)
        .where(
          and(
            eq(libraryReservations.resourceId, parseInt(id)),
            eq(libraryReservations.status, 'pending')
          )
        );

      const nextPriority = (priorityResult.maxPriority || 0) + 1;

      // Create reservation
      const [reservation] = await db
        .insert(libraryReservations)
        .values({
          resourceId: parseInt(id),
          userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
          priority: nextPriority,
          tenantId: 'demo-school'
        })
        .returning();

      res.json(reservation);
    } catch (error) {
      console.error("Error reserving resource:", error);
      res.status(500).json({ message: "Failed to reserve resource" });
    }
  });

  // Get user's borrowings
  app.get('/api/library/my-borrowings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status = 'active' } = req.query;

      const borrowings = await db
        .select({
          id: libraryBorrowings.id,
          borrowedAt: libraryBorrowings.borrowedAt,
          dueDate: libraryBorrowings.dueDate,
          returnedAt: libraryBorrowings.returnedAt,
          status: libraryBorrowings.status,
          renewalCount: libraryBorrowings.renewalCount,
          maxRenewals: libraryBorrowings.maxRenewals,
          resource: {
            id: libraryResources.id,
            title: libraryResources.title,
            author: libraryResources.author,
            type: libraryResources.type,
            thumbnailUrl: libraryResources.thumbnailUrl
          }
        })
        .from(libraryBorrowings)
        .innerJoin(libraryResources, eq(libraryBorrowings.resourceId, libraryResources.id))
        .where(
          and(
            eq(libraryBorrowings.borrowerId, userId),
            status === 'all' ? undefined : eq(libraryBorrowings.status, status)
          )
        )
        .orderBy(desc(libraryBorrowings.borrowedAt));

      res.json(borrowings);
    } catch (error) {
      console.error("Error fetching borrowings:", error);
      res.status(500).json({ message: "Failed to fetch borrowings" });
    }
  });

  // Get user's reservations
  app.get('/api/library/my-reservations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      const reservations = await db
        .select({
          id: libraryReservations.id,
          reservedAt: libraryReservations.reservedAt,
          expiresAt: libraryReservations.expiresAt,
          status: libraryReservations.status,
          priority: libraryReservations.priority,
          resource: {
            id: libraryResources.id,
            title: libraryResources.title,
            author: libraryResources.author,
            type: libraryResources.type,
            thumbnailUrl: libraryResources.thumbnailUrl,
            availableCopies: libraryResources.availableCopies
          }
        })
        .from(libraryReservations)
        .innerJoin(libraryResources, eq(libraryReservations.resourceId, libraryResources.id))
        .where(eq(libraryReservations.userId, userId))
        .orderBy(asc(libraryReservations.priority));

      res.json(reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Add a review
  app.post('/api/library/resources/:id/review', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { rating, review, isRecommended } = req.body;
      const userId = req.user.claims.sub;

      // Check if user has borrowed this resource
      const [borrowing] = await db
        .select()
        .from(libraryBorrowings)
        .where(
          and(
            eq(libraryBorrowings.resourceId, parseInt(id)),
            eq(libraryBorrowings.borrowerId, userId)
          )
        );

      if (!borrowing) {
        return res.status(400).json({ message: "You must borrow this resource before reviewing it" });
      }

      // Check for existing review
      const [existingReview] = await db
        .select()
        .from(libraryReviews)
        .where(
          and(
            eq(libraryReviews.resourceId, parseInt(id)),
            eq(libraryReviews.userId, userId)
          )
        );

      if (existingReview) {
        // Update existing review
        const [updatedReview] = await db
          .update(libraryReviews)
          .set({ rating, review, isRecommended })
          .where(eq(libraryReviews.id, existingReview.id))
          .returning();

        res.json(updatedReview);
      } else {
        // Create new review
        const [newReview] = await db
          .insert(libraryReviews)
          .values({
            resourceId: parseInt(id),
            userId,
            rating,
            review,
            isRecommended,
            tenantId: 'demo-school'
          })
          .returning();

        res.json(newReview);
      }

      // Update resource rating
      const [avgRating] = await db
        .select({ 
          avgRating: sql<number>`AVG(rating)`,
          count: sql<number>`COUNT(*)`
        })
        .from(libraryReviews)
        .where(eq(libraryReviews.resourceId, parseInt(id)));

      if (avgRating.avgRating) {
        await db
          .update(libraryResources)
          .set({ rating: avgRating.avgRating.toString() })
          .where(eq(libraryResources.id, parseInt(id)));
      }

    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Failed to add review" });
    }
  });

  // Get categories
  app.get('/api/library/categories', async (req: any, res) => {
    try {
      const categories = await db
        .select()
        .from(libraryCategories)
        .where(eq(libraryCategories.isActive, true))
        .orderBy(asc(libraryCategories.displayOrder), asc(libraryCategories.name));

      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get featured resources
  app.get('/api/library/featured', async (req: any, res) => {
    try {
      const featured = await db
        .select()
        .from(libraryResources)
        .where(
          eq(libraryResources.isFeatured, true)
        )
        .orderBy(desc(libraryResources.rating))
        .limit(10);

      res.json(featured);
    } catch (error) {
      console.error("Error fetching featured resources:", error);
      res.status(500).json({ message: "Failed to fetch featured resources" });
    }
  });

  // Get library statistics
  app.get('/api/library/stats', async (req: any, res) => {
    try {
      const [totalResources] = await db
        .select({ count: sql<number>`count(*)` })
        .from(libraryResources)
        .where(eq(libraryResources.isDigital, true));

      const [totalViews] = await db
        .select({ total: sql<number>`SUM(${libraryResources.totalCopies})` })
        .from(libraryResources)
        .where(eq(libraryResources.isDigital, true));

      const [averageRating] = await db
        .select({ avg: sql<number>`AVG(${libraryResources.rating})` })
        .from(libraryResources)
        .where(eq(libraryResources.isDigital, true));

      const [availableResources] = await db
        .select({ count: sql<number>`count(*)` })
        .from(libraryResources)
        .where(eq(libraryResources.isDigital, true));

      res.json({
        totalResources: totalResources.count,
        totalViews: totalViews.total || 0,
        averageRating: Number((averageRating.avg || 0).toFixed(1)),
        availableResources: availableResources.count
      });
    } catch (error) {
      console.error("Error fetching library stats:", error);
      res.status(500).json({ message: "Failed to fetch library statistics" });
    }
  });
}