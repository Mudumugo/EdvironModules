import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  tenantId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  tenant?: { id: string };
}