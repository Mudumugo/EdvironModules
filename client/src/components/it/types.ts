export interface SystemMetrics {
  serverStatus: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
  };
  networkStatus: {
    bandwidth: number;
    latency: number;
    uptime: number;
    connectedDevices: number;
  };
  storage: {
    total: number;
    used: number;
    available: number;
    backupStatus: string;
  };
  security: {
    threats: number;
    updates: number;
    vulnerabilities: number;
    lastScan: string;
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLoad: number;
  };
}