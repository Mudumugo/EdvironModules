import type { Express, Request, Response } from "express";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "../db";
import { 
  notebooks, 
  subjects, 
  chapters, 
  topics, 
  pages, 
  stickyNotes,
  libraryResources
} from "@shared/schema";
import { isAuthenticated } from "../replitAuth";

// Define locker items table since it's not in shared schema yet
import { pgTable, serial, varchar, text, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";

const lockerItems = pgTable("locker_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  originalResourceId: integer("original_resource_id"),
  content: text("content"),
  annotations: jsonb("annotations"),
  metadata: jsonb("metadata"),
  fileUrl: varchar("file_url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  tags: text("tags").array(),
  category: varchar("category", { length: 100 }),
  subject: varchar("subject", { length: 100 }),
  gradeLevel: varchar("grade_level", { length: 50 }),
  isPrivate: boolean("is_private").default(true),
  isOfflineAvailable: boolean("is_offline_available").default(false),
  sizeMb: decimal("size_mb", { precision: 10, scale: 2 }),
  views: integer("views").default(0),
  lastAccessed: timestamp("last_accessed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tenantId: varchar("tenant_id", { length: 255 }).default("default"),
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    claims?: any;
  };
  session?: any;
}

export function registerNotebookRoutes(app: Express) {
  // NOTEBOOK ROUTES
  
  // Get all notebooks for the authenticated user
  app.get('/api/notebooks', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userNotebooks = await db.select()
        .from(notebooks)
        .where(eq(notebooks.userId, userId))
        .orderBy(desc(notebooks.updatedAt));

      res.json(userNotebooks);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      res.status(500).json({ message: "Failed to fetch notebooks" });
    }
  });

  // Get a specific notebook with all its content
  app.get('/api/notebooks/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const notebook = await db.select()
        .from(notebooks)
        .where(and(
          eq(notebooks.id, parseInt(id)),
          eq(notebooks.userId, userId)
        ))
        .limit(1);

      if (!notebook.length) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      // Get subjects with their chapters, topics, and pages
      const notebookSubjects = await db.select()
        .from(subjects)
        .where(eq(subjects.notebookId, parseInt(id)))
        .orderBy(subjects.orderIndex, subjects.createdAt);

      const result = {
        ...notebook[0],
        subjects: []
      };

      for (const subject of notebookSubjects) {
        const subjectChapters = await db.select()
          .from(chapters)
          .where(eq(chapters.subjectId, subject.id))
          .orderBy(chapters.orderIndex, chapters.createdAt);

        const subjectData = {
          ...subject,
          chapters: []
        };

        for (const chapter of subjectChapters) {
          const chapterTopics = await db.select()
            .from(topics)
            .where(eq(topics.chapterId, chapter.id))
            .orderBy(topics.orderIndex, topics.createdAt);

          const chapterData = {
            ...chapter,
            topics: []
          };

          for (const topic of chapterTopics) {
            const topicPages = await db.select()
              .from(pages)
              .where(eq(pages.topicId, topic.id))
              .orderBy(pages.orderIndex, pages.createdAt);

            const topicData = {
              ...topic,
              pages: topicPages
            };

            chapterData.topics.push(topicData);
          }

          subjectData.chapters.push(chapterData);
        }

        result.subjects.push(subjectData);
      }

      res.json(result);
    } catch (error) {
      console.error("Error fetching notebook:", error);
      res.status(500).json({ message: "Failed to fetch notebook" });
    }
  });

  // Create a new notebook
  app.post('/api/notebooks', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { title, description, color } = req.body;

      const [newNotebook] = await db.insert(notebooks).values({
        title,
        description,
        color: color || "#3b82f6",
        userId,
        tenantId: "default"
      }).returning();

      res.status(201).json(newNotebook);
    } catch (error) {
      console.error("Error creating notebook:", error);
      res.status(500).json({ message: "Failed to create notebook" });
    }
  });

  // Update a notebook
  app.put('/api/notebooks/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { title, description, color, isShared, sharedWith } = req.body;

      const [updatedNotebook] = await db.update(notebooks)
        .set({
          title,
          description,
          color,
          isShared,
          sharedWith,
          updatedAt: new Date()
        })
        .where(and(
          eq(notebooks.id, parseInt(id)),
          eq(notebooks.userId, userId)
        ))
        .returning();

      if (!updatedNotebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      res.json(updatedNotebook);
    } catch (error) {
      console.error("Error updating notebook:", error);
      res.status(500).json({ message: "Failed to update notebook" });
    }
  });

  // Delete a notebook
  app.delete('/api/notebooks/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const [deletedNotebook] = await db.delete(notebooks)
        .where(and(
          eq(notebooks.id, parseInt(id)),
          eq(notebooks.userId, userId)
        ))
        .returning();

      if (!deletedNotebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      res.json({ message: "Notebook deleted successfully" });
    } catch (error) {
      console.error("Error deleting notebook:", error);
      res.status(500).json({ message: "Failed to delete notebook" });
    }
  });

  // SUBJECT ROUTES

  // Create a new subject
  app.post('/api/notebooks/:notebookId/subjects', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { notebookId } = req.params;
      const { name, description, color, orderIndex } = req.body;

      const [newSubject] = await db.insert(subjects).values({
        notebookId: parseInt(notebookId),
        name,
        description,
        color: color || "#3b82f6",
        orderIndex: orderIndex || 0
      }).returning();

      res.status(201).json(newSubject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  // Update a subject
  app.put('/api/subjects/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, color, orderIndex } = req.body;

      const [updatedSubject] = await db.update(subjects)
        .set({
          name,
          description,
          color,
          orderIndex,
          updatedAt: new Date()
        })
        .where(eq(subjects.id, parseInt(id)))
        .returning();

      if (!updatedSubject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.json(updatedSubject);
    } catch (error) {
      console.error("Error updating subject:", error);
      res.status(500).json({ message: "Failed to update subject" });
    }
  });

  // Delete a subject
  app.delete('/api/subjects/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const [deletedSubject] = await db.delete(subjects)
        .where(eq(subjects.id, parseInt(id)))
        .returning();

      if (!deletedSubject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.json({ message: "Subject deleted successfully" });
    } catch (error) {
      console.error("Error deleting subject:", error);
      res.status(500).json({ message: "Failed to delete subject" });
    }
  });

  // CHAPTER ROUTES

  // Create a new chapter
  app.post('/api/subjects/:subjectId/chapters', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { subjectId } = req.params;
      const { name, description, orderIndex } = req.body;

      const [newChapter] = await db.insert(chapters).values({
        subjectId: parseInt(subjectId),
        name,
        description,
        orderIndex: orderIndex || 0
      }).returning();

      res.status(201).json(newChapter);
    } catch (error) {
      console.error("Error creating chapter:", error);
      res.status(500).json({ message: "Failed to create chapter" });
    }
  });

  // Update a chapter
  app.put('/api/chapters/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, orderIndex } = req.body;

      const [updatedChapter] = await db.update(chapters)
        .set({
          name,
          description,
          orderIndex,
          updatedAt: new Date()
        })
        .where(eq(chapters.id, parseInt(id)))
        .returning();

      if (!updatedChapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      res.json(updatedChapter);
    } catch (error) {
      console.error("Error updating chapter:", error);
      res.status(500).json({ message: "Failed to update chapter" });
    }
  });

  // Delete a chapter
  app.delete('/api/chapters/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const [deletedChapter] = await db.delete(chapters)
        .where(eq(chapters.id, parseInt(id)))
        .returning();

      if (!deletedChapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      res.json({ message: "Chapter deleted successfully" });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      res.status(500).json({ message: "Failed to delete chapter" });
    }
  });

  // TOPIC ROUTES

  // Create a new topic
  app.post('/api/chapters/:chapterId/topics', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { chapterId } = req.params;
      const { name, description, orderIndex } = req.body;

      const [newTopic] = await db.insert(topics).values({
        chapterId: parseInt(chapterId),
        name,
        description,
        orderIndex: orderIndex || 0
      }).returning();

      res.status(201).json(newTopic);
    } catch (error) {
      console.error("Error creating topic:", error);
      res.status(500).json({ message: "Failed to create topic" });
    }
  });

  // Update a topic
  app.put('/api/topics/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, orderIndex } = req.body;

      const [updatedTopic] = await db.update(topics)
        .set({
          name,
          description,
          orderIndex,
          updatedAt: new Date()
        })
        .where(eq(topics.id, parseInt(id)))
        .returning();

      if (!updatedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json(updatedTopic);
    } catch (error) {
      console.error("Error updating topic:", error);
      res.status(500).json({ message: "Failed to update topic" });
    }
  });

  // Delete a topic
  app.delete('/api/topics/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const [deletedTopic] = await db.delete(topics)
        .where(eq(topics.id, parseInt(id)))
        .returning();

      if (!deletedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json({ message: "Topic deleted successfully" });
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).json({ message: "Failed to delete topic" });
    }
  });

  // PAGE ROUTES

  // Get a specific page with sticky notes
  app.get('/api/pages/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const [page] = await db.select()
        .from(pages)
        .where(eq(pages.id, parseInt(id)))
        .limit(1);

      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      const pageStickies = await db.select()
        .from(stickyNotes)
        .where(eq(stickyNotes.pageId, parseInt(id)))
        .orderBy(stickyNotes.createdAt);

      res.json({
        ...page,
        stickyNotes: pageStickies
      });
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Create a new page
  app.post('/api/topics/:topicId/pages', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { topicId } = req.params;
      const { title, content, contentType, orderIndex } = req.body;

      const [newPage] = await db.insert(pages).values({
        topicId: parseInt(topicId),
        title,
        content: content || "",
        contentType: contentType || "richtext",
        orderIndex: orderIndex || 0
      }).returning();

      res.status(201).json(newPage);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  // Update a page
  app.put('/api/pages/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content, contentType, orderIndex } = req.body;

      const [updatedPage] = await db.update(pages)
        .set({
          title,
          content,
          contentType,
          orderIndex,
          updatedAt: new Date()
        })
        .where(eq(pages.id, parseInt(id)))
        .returning();

      if (!updatedPage) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json(updatedPage);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  // Delete a page
  app.delete('/api/pages/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;

      const [deletedPage] = await db.delete(pages)
        .where(eq(pages.id, parseInt(id)))
        .returning();

      if (!deletedPage) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // STICKY NOTES ROUTES

  // Create a new sticky note
  app.post('/api/pages/:pageId/sticky-notes', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { pageId } = req.params;
      const userId = req.user?.id;
      const { content, color, positionX, positionY, width, height } = req.body;

      const [newStickyNote] = await db.insert(stickyNotes).values({
        pageId: parseInt(pageId),
        content,
        color: color || "#fbbf24",
        positionX: positionX || 0,
        positionY: positionY || 0,
        width: width || 200,
        height: height || 150,
        userId: userId!
      }).returning();

      res.status(201).json(newStickyNote);
    } catch (error) {
      console.error("Error creating sticky note:", error);
      res.status(500).json({ message: "Failed to create sticky note" });
    }
  });

  // Update a sticky note
  app.put('/api/sticky-notes/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { content, color, positionX, positionY, width, height } = req.body;

      const [updatedStickyNote] = await db.update(stickyNotes)
        .set({
          content,
          color,
          positionX,
          positionY,
          width,
          height,
          updatedAt: new Date()
        })
        .where(and(
          eq(stickyNotes.id, parseInt(id)),
          eq(stickyNotes.userId, userId!)
        ))
        .returning();

      if (!updatedStickyNote) {
        return res.status(404).json({ message: "Sticky note not found" });
      }

      res.json(updatedStickyNote);
    } catch (error) {
      console.error("Error updating sticky note:", error);
      res.status(500).json({ message: "Failed to update sticky note" });
    }
  });

  // Delete a sticky note
  app.delete('/api/sticky-notes/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const [deletedStickyNote] = await db.delete(stickyNotes)
        .where(and(
          eq(stickyNotes.id, parseInt(id)),
          eq(stickyNotes.userId, userId!)
        ))
        .returning();

      if (!deletedStickyNote) {
        return res.status(404).json({ message: "Sticky note not found" });
      }

      res.json({ message: "Sticky note deleted successfully" });
    } catch (error) {
      console.error("Error deleting sticky note:", error);
      res.status(500).json({ message: "Failed to delete sticky note" });
    }
  });

  // LOCKER ITEMS ROUTES (for saved library resources with annotations)

  // Get all locker items for the authenticated user
  app.get('/api/locker/items', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { type, category, search } = req.query;

      // Build query conditions
      const conditions = [eq(lockerItems.userId, userId)];
      
      if (type && type !== 'all') {
        conditions.push(eq(lockerItems.itemType, type as string));
      }
      
      if (category && category !== 'all') {
        conditions.push(eq(lockerItems.category, category as string));
      }

      let items = await db.select()
        .from(lockerItems)
        .where(and(...conditions))
        .orderBy(desc(lockerItems.updatedAt));

      // Apply search filter if provided
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        items = items.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      res.json(items);
    } catch (error) {
      console.error("Error fetching locker items:", error);
      res.status(500).json({ message: "Failed to fetch locker items" });
    }
  });

  // Save an annotated library resource to locker
  app.post('/api/locker/save-resource', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { 
        resourceId, 
        annotations, 
        notes, 
        title, 
        description,
        tags,
        isPrivate = true,
        makeOfflineAvailable = false
      } = req.body;

      // Get the original resource details
      const [originalResource] = await db.select()
        .from(libraryResources)
        .where(eq(libraryResources.id, resourceId))
        .limit(1);

      if (!originalResource) {
        return res.status(404).json({ message: "Original resource not found" });
      }

      // Check if this resource is already saved by the user
      const existingItem = await db.select()
        .from(lockerItems)
        .where(and(
          eq(lockerItems.userId, userId),
          eq(lockerItems.originalResourceId, resourceId)
        ))
        .limit(1);

      if (existingItem.length > 0) {
        // Update existing item with new annotations
        const [updatedItem] = await db.update(lockerItems)
          .set({
            annotations,
            content: notes,
            tags: tags || [],
            isPrivate,
            isOfflineAvailable: makeOfflineAvailable,
            updatedAt: new Date(),
            lastAccessed: new Date(),
            views: existingItem[0].views + 1
          })
          .where(eq(lockerItems.id, existingItem[0].id))
          .returning();

        return res.json(updatedItem);
      }

      // Create new locker item
      const [newItem] = await db.insert(lockerItems).values({
        userId,
        itemType: 'resource',
        title: title || originalResource.title,
        description: description || originalResource.description,
        originalResourceId: resourceId,
        content: notes || '',
        annotations,
        metadata: {
          originalTitle: originalResource.title,
          originalAuthor: originalResource.author,
          resourceType: originalResource.type,
          isbn: originalResource.isbn,
          curriculum: originalResource.curriculum,
          gradeLevel: originalResource.grade
        },
        fileUrl: originalResource.file_url,
        thumbnailUrl: originalResource.thumbnail_url,
        tags: tags || [],
        category: originalResource.type || 'resource',
        subject: originalResource.subject,
        gradeLevel: originalResource.grade,
        isPrivate,
        isOfflineAvailable: makeOfflineAvailable,
        sizeMb: originalResource.size ? parseFloat(originalResource.size) : 0,
        views: 1,
        lastAccessed: new Date(),
        tenantId: 'default'
      }).returning();

      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error saving resource to locker:", error);
      res.status(500).json({ message: "Failed to save resource to locker" });
    }
  });

  // Update locker item
  app.put('/api/locker/items/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { title, description, content, annotations, tags, isPrivate, isOfflineAvailable } = req.body;

      const [updatedItem] = await db.update(lockerItems)
        .set({
          title,
          description,
          content,
          annotations,
          tags,
          isPrivate,
          isOfflineAvailable,
          updatedAt: new Date()
        })
        .where(and(
          eq(lockerItems.id, parseInt(id)),
          eq(lockerItems.userId, userId!)
        ))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Locker item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating locker item:", error);
      res.status(500).json({ message: "Failed to update locker item" });
    }
  });

  // Delete locker item
  app.delete('/api/locker/items/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const [deletedItem] = await db.delete(lockerItems)
        .where(and(
          eq(lockerItems.id, parseInt(id)),
          eq(lockerItems.userId, userId!)
        ))
        .returning();

      if (!deletedItem) {
        return res.status(404).json({ message: "Locker item not found" });
      }

      res.json({ message: "Item removed from locker successfully" });
    } catch (error) {
      console.error("Error deleting locker item:", error);
      res.status(500).json({ message: "Failed to remove item from locker" });
    }
  });

  // Update access tracking
  app.post('/api/locker/items/:id/access', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      await db.update(lockerItems)
        .set({
          views: sql`${lockerItems.views} + 1`,
          lastAccessed: new Date()
        })
        .where(and(
          eq(lockerItems.id, parseInt(id)),
          eq(lockerItems.userId, userId!)
        ));

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating access:", error);
      res.status(500).json({ message: "Failed to update access" });
    }
  });
}