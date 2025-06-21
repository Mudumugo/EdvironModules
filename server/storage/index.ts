import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../../shared/schema";
import { CoreStorage } from "./core";
import { ContentStorage } from "./content";
import { SystemStorage } from "./system";

// Main storage class that combines all storage modules
export class Storage {
  private db: ReturnType<typeof drizzle>;
  public core: CoreStorage;
  public content: ContentStorage;
  public system: SystemStorage;

  constructor(pool: Pool) {
    this.db = drizzle(pool, { schema });
    this.core = new CoreStorage(this.db);
    this.content = new ContentStorage(this.db);
    this.system = new SystemStorage(this.db);
  }

  // Provide direct access to the database for complex queries
  get database() {
    return this.db;
  }

  // Transaction support
  async transaction<T>(callback: (tx: typeof this.db) => Promise<T>): Promise<T> {
    return this.db.transaction(callback);
  }
}

// Create and export storage instance
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const storage = new Storage(pool);

// Legacy interface support (for backward compatibility)
export interface IStorage {
  // Core methods
  createUser(userData: any): Promise<any>;
  getUserById(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  updateUser(id: string, userData: any): Promise<any>;
  
  // Content methods
  createLibraryItem(itemData: any): Promise<any>;
  getLibraryItems(tenantId: string, filters?: any): Promise<any>;
  createAssignment(assignmentData: any): Promise<any>;
  getAssignments(tenantId: string, teacherId?: string): Promise<any>;
  
  // System methods
  createNotification(notificationData: any): Promise<any>;
  getNotifications(userId: string, options?: any): Promise<any>;
}

// Legacy storage implementation
export const legacyStorage: IStorage = {
  createUser: storage.core.createUser.bind(storage.core),
  getUserById: storage.core.getUserById.bind(storage.core),
  getUserByEmail: storage.core.getUserByEmail.bind(storage.core),
  updateUser: storage.core.updateUser.bind(storage.core),
  createLibraryItem: storage.content.createLibraryItem.bind(storage.content),
  getLibraryItems: storage.content.getLibraryItems.bind(storage.content),
  createAssignment: storage.content.createAssignment.bind(storage.content),
  getAssignments: storage.content.getAssignments.bind(storage.content),
  createNotification: storage.system.createNotification.bind(storage.system),
  getNotifications: storage.system.getNotifications.bind(storage.system),
};

export default storage;