import { Request } from 'express';
import { UserRole, Permission } from '@shared/schema';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: UserRole;
    permissions?: Permission[];
    tenantId?: string;
    claims?: any;
  };
}