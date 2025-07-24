import NodeCache from 'node-cache';

// Multi-level caching system
export class PerformanceCache {
  private static instance: PerformanceCache;
  private shortCache: NodeCache; // 5 minutes
  private mediumCache: NodeCache; // 30 minutes
  private longCache: NodeCache; // 24 hours

  private constructor() {
    this.shortCache = new NodeCache({ 
      stdTTL: 300, // 5 minutes
      checkperiod: 60, // Check every minute
      useClones: false // Performance optimization
    });
    
    this.mediumCache = new NodeCache({ 
      stdTTL: 1800, // 30 minutes
      checkperiod: 300, // Check every 5 minutes
      useClones: false
    });
    
    this.longCache = new NodeCache({ 
      stdTTL: 86400, // 24 hours
      checkperiod: 3600, // Check every hour
      useClones: false
    });
  }

  public static getInstance(): PerformanceCache {
    if (!PerformanceCache.instance) {
      PerformanceCache.instance = new PerformanceCache();
    }
    return PerformanceCache.instance;
  }

  // Short-term cache (5 minutes) - for frequent queries
  public setShort(key: string, value: any): boolean {
    return this.shortCache.set(key, value);
  }

  public getShort<T>(key: string): T | undefined {
    return this.shortCache.get<T>(key);
  }

  // Medium-term cache (30 minutes) - for user sessions
  public setMedium(key: string, value: any): boolean {
    return this.mediumCache.set(key, value);
  }

  public getMedium<T>(key: string): T | undefined {
    return this.mediumCache.get<T>(key);
  }

  // Long-term cache (24 hours) - for static data
  public setLong(key: string, value: any): boolean {
    return this.longCache.set(key, value);
  }

  public getLong<T>(key: string): T | undefined {
    return this.longCache.get<T>(key);
  }

  // Cache invalidation
  public invalidate(pattern: string): void {
    const keys = [
      ...this.shortCache.keys(),
      ...this.mediumCache.keys(),
      ...this.longCache.keys()
    ].filter(key => key.includes(pattern));

    keys.forEach(key => {
      this.shortCache.del(key);
      this.mediumCache.del(key);
      this.longCache.del(key);
    });
  }

  // Cache statistics
  public getStats() {
    return {
      short: this.shortCache.getStats(),
      medium: this.mediumCache.getStats(),
      long: this.longCache.getStats()
    };
  }

  // Clear all caches
  public clearAll(): void {
    this.shortCache.flushAll();
    this.mediumCache.flushAll();
    this.longCache.flushAll();
  }
}

export const cache = PerformanceCache.getInstance();