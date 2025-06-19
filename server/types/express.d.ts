import { SessionUser } from "../roleMiddleware";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string | null;
      role: string;
      tenantId: string;
      firstName?: string | null;
      lastName?: string | null;
      permissions?: string[];
      profileImageUrl?: string;
      claims?: any;
    }
  }
}

export {};