// Enhanced debugging tools for book viewer
export class BookViewerDebugger {
  private logs: Array<{
    timestamp: number;
    level: 'info' | 'warn' | 'error' | 'debug';
    category: string;
    message: string;
    data?: any;
  }> = [];
  
  private maxLogs = 500;
  private isEnabled = true;
  private categories = new Set<string>();

  // Enable/disable debugging
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Log with different levels
  info(category: string, message: string, data?: any): void {
    this.log('info', category, message, data);
  }

  warn(category: string, message: string, data?: any): void {
    this.log('warn', category, message, data);
    console.warn(`[BookViewer:${category}] ${message}`, data);
  }

  error(category: string, message: string, data?: any): void {
    this.log('error', category, message, data);
    console.error(`[BookViewer:${category}] ${message}`, data);
  }

  debug(category: string, message: string, data?: any): void {
    this.log('debug', category, message, data);
  }

  private log(level: string, category: string, message: string, data?: any): void {
    if (!this.isEnabled) return;

    this.categories.add(category);
    this.logs.push({
      timestamp: Date.now(),
      level: level as any,
      category,
      message,
      data
    });

    // Maintain log size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const prefix = `[BookViewer:${category}]`;
      switch (level) {
        case 'error':
          console.error(prefix, message, data);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'info':
          console.info(prefix, message, data);
          break;
        case 'debug':
          console.debug(prefix, message, data);
          break;
      }
    }
  }

  // Get filtered logs
  getLogs(options?: {
    level?: string;
    category?: string;
    since?: number;
    limit?: number;
  }): Array<any> {
    let filteredLogs = [...this.logs];

    if (options?.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }

    if (options?.category) {
      filteredLogs = filteredLogs.filter(log => log.category === options.category);
    }

    if (options?.since) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= options.since);
    }

    if (options?.limit) {
      filteredLogs = filteredLogs.slice(-options.limit);
    }

    return filteredLogs.map(log => ({
      ...log,
      timestamp: new Date(log.timestamp).toISOString()
    }));
  }

  // Get available categories
  getCategories(): string[] {
    return Array.from(this.categories).sort();
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
    this.categories.clear();
  }

  // Export logs for analysis
  exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }

  // Get debug summary
  getSummary(): {
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    categories: string[];
    recentErrors: Array<any>;
  } {
    const errorLogs = this.logs.filter(log => log.level === 'error');
    const warningLogs = this.logs.filter(log => log.level === 'warn');
    const recentErrors = errorLogs.slice(-5).map(log => ({
      timestamp: new Date(log.timestamp).toISOString(),
      category: log.category,
      message: log.message,
      data: log.data
    }));

    return {
      totalLogs: this.logs.length,
      errorCount: errorLogs.length,
      warningCount: warningLogs.length,
      categories: this.getCategories(),
      recentErrors
    };
  }
}

// Performance profiler for book viewer
export class BookViewerProfiler {
  private profiles: Map<string, {
    startTime: number;
    endTime?: number;
    duration?: number;
    metadata?: any;
  }> = new Map();

  private completedProfiles: Array<{
    name: string;
    duration: number;
    startTime: number;
    endTime: number;
    metadata?: any;
  }> = [];

  // Start profiling an operation
  start(name: string, metadata?: any): void {
    this.profiles.set(name, {
      startTime: performance.now(),
      metadata
    });
  }

  // End profiling an operation
  end(name: string): number {
    const profile = this.profiles.get(name);
    if (!profile) {
      console.warn(`[Profiler] No profile found for: ${name}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - profile.startTime;

    profile.endTime = endTime;
    profile.duration = duration;

    // Move to completed profiles
    this.completedProfiles.push({
      name,
      duration,
      startTime: profile.startTime,
      endTime,
      metadata: profile.metadata
    });

    this.profiles.delete(name);

    // Keep only last 100 profiles
    if (this.completedProfiles.length > 100) {
      this.completedProfiles.shift();
    }

    return duration;
  }

  // Get performance statistics
  getStats(operationName?: string): {
    average: number;
    min: number;
    max: number;
    count: number;
    total: number;
  } {
    let profiles = this.completedProfiles;
    
    if (operationName) {
      profiles = profiles.filter(p => p.name === operationName);
    }

    if (profiles.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0, total: 0 };
    }

    const durations = profiles.map(p => p.duration);
    const total = durations.reduce((sum, d) => sum + d, 0);

    return {
      average: total / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      count: durations.length,
      total
    };
  }

  // Get recent profiles
  getRecentProfiles(limit = 10): Array<any> {
    return this.completedProfiles
      .slice(-limit)
      .map(profile => ({
        ...profile,
        startTime: new Date(performance.timeOrigin + profile.startTime).toISOString(),
        endTime: new Date(performance.timeOrigin + profile.endTime).toISOString()
      }));
  }

  // Clear all profiles
  clear(): void {
    this.profiles.clear();
    this.completedProfiles = [];
  }
}

// Memory monitor for book viewer
export class BookViewerMemoryMonitor {
  private snapshots: Array<{
    timestamp: number;
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  }> = [];

  private interval: NodeJS.Timeout | null = null;

  // Start monitoring memory usage
  startMonitoring(intervalMs = 5000): void {
    if (this.interval) {
      this.stopMonitoring();
    }

    this.takeSnapshot();
    this.interval = setInterval(() => {
      this.takeSnapshot();
    }, intervalMs);
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Take a memory snapshot
  takeSnapshot(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.snapshots.push({
        timestamp: Date.now(),
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      });

      // Keep only last 100 snapshots
      if (this.snapshots.length > 100) {
        this.snapshots.shift();
      }
    }
  }

  // Get memory statistics
  getMemoryStats(): {
    current: any;
    peak: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    if (this.snapshots.length === 0) {
      return {
        current: null,
        peak: 0,
        average: 0,
        trend: 'stable'
      };
    }

    const current = this.snapshots[this.snapshots.length - 1];
    const usedSizes = this.snapshots.map(s => s.usedJSHeapSize);
    const peak = Math.max(...usedSizes);
    const average = usedSizes.reduce((sum, size) => sum + size, 0) / usedSizes.length;

    // Calculate trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (this.snapshots.length >= 5) {
      const recent = this.snapshots.slice(-5);
      const firstRecent = recent[0].usedJSHeapSize;
      const lastRecent = recent[recent.length - 1].usedJSHeapSize;
      const change = (lastRecent - firstRecent) / firstRecent;

      if (change > 0.1) trend = 'increasing';
      else if (change < -0.1) trend = 'decreasing';
    }

    return {
      current: {
        ...current,
        usedMB: Math.round(current.usedJSHeapSize / 1024 / 1024),
        totalMB: Math.round(current.totalJSHeapSize / 1024 / 1024),
        limitMB: Math.round(current.jsHeapSizeLimit / 1024 / 1024)
      },
      peak: Math.round(peak / 1024 / 1024),
      average: Math.round(average / 1024 / 1024),
      trend
    };
  }

  // Get memory snapshots for charting
  getSnapshots(): Array<any> {
    return this.snapshots.map(snapshot => ({
      timestamp: new Date(snapshot.timestamp).toISOString(),
      usedMB: Math.round(snapshot.usedJSHeapSize / 1024 / 1024),
      totalMB: Math.round(snapshot.totalJSHeapSize / 1024 / 1024)
    }));
  }

  // Clear snapshots
  clear(): void {
    this.snapshots = [];
  }
}

// Global debug instances
export const bookViewerDebugger = new BookViewerDebugger();
export const bookViewerProfiler = new BookViewerProfiler();
export const bookViewerMemoryMonitor = new BookViewerMemoryMonitor();

// Initialize in development
if (process.env.NODE_ENV === 'development') {
  // Make debugging tools available globally
  (window as any).bookViewerDebug = {
    debugger: bookViewerDebugger,
    profiler: bookViewerProfiler,
    memoryMonitor: bookViewerMemoryMonitor
  };

  // Start memory monitoring in development
  bookViewerMemoryMonitor.startMonitoring(10000);
}