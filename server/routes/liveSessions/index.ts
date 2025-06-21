import type { Express } from "express";
import type { Server } from "http";
import { setupWebSocketServer } from "./core";
import { registerLiveSessionAPIRoutes } from "./api";

export function registerLiveSessionRoutes(app: Express, httpServer: Server) {
  // Setup WebSocket server
  setupWebSocketServer(httpServer);
  
  // Register API routes
  registerLiveSessionAPIRoutes(app);
}