import { apiRequest } from "../queryClient";
import { getCurrentTenant } from "../tenantUtils";

export interface XapiActor {
  objectType: "Agent";
  name: string;
  mbox?: string;
  account?: {
    name: string;
    homePage: string;
  };
}

export interface XapiObject {
  objectType: "Activity";
  id: string;
  definition: {
    name: { "en-US": string };
    description?: { "en-US": string };
    type: string;
    extensions?: Record<string, any>;
  };
}

export interface XapiResult {
  score?: {
    scaled?: number;
    raw?: number;
    min?: number;
    max?: number;
  };
  success?: boolean;
  completion?: boolean;
  duration?: string;
  response?: string;
  extensions?: Record<string, any>;
}

export interface XapiContext {
  instructor?: XapiActor;
  team?: XapiActor;
  contextActivities?: {
    parent?: XapiObject[];
    grouping?: XapiObject[];
    category?: XapiObject[];
    other?: XapiObject[];
  };
  revision?: string;
  platform?: string;
  language?: string;
  statement?: {
    objectType: "StatementRef";
    id: string;
  };
  extensions?: Record<string, any>;
}

export interface XapiStatement {
  actor: XapiActor;
  verb: any;
  object: XapiObject;
  result?: XapiResult;
  context?: XapiContext;
  timestamp?: string;
  authority?: XapiActor;
}

export class XapiCore {
  private currentUser: any = null;
  private tenant: any = null;

  constructor() {
    this.tenant = getCurrentTenant();
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  createActor(): XapiActor {
    if (!this.currentUser) {
      return {
        objectType: "Agent",
        name: "Anonymous User"
      };
    }

    const actor: XapiActor = {
      objectType: "Agent",
      name: `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim() || this.currentUser.email || "Unknown User"
    };

    if (this.currentUser.email) {
      actor.mbox = `mailto:${this.currentUser.email}`;
    }

    if (this.tenant) {
      actor.account = {
        name: this.currentUser.id,
        homePage: `https://${this.tenant.subdomain}.edvirons.com`
      };
    }

    return actor;
  }

  createActivity(id: string, name: string, type: string, description?: string, extensions?: Record<string, any>): XapiObject {
    const baseUrl = this.tenant ? `https://${this.tenant.subdomain}.edvirons.com` : "https://edvirons.com";
    
    return {
      objectType: "Activity",
      id: `${baseUrl}/activities/${id}`,
      definition: {
        name: { "en-US": name },
        description: description ? { "en-US": description } : undefined,
        type,
        extensions
      }
    };
  }

  async sendStatement(statement: XapiStatement): Promise<void> {
    try {
      const fullStatement = {
        ...statement,
        timestamp: statement.timestamp || new Date().toISOString(),
        authority: this.createActor()
      };

      await apiRequest("POST", "/api/xapi/statements", fullStatement);
    } catch (error) {
      console.error("Failed to send xAPI statement:", error);
    }
  }
}