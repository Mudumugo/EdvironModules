// This file is deprecated - use the types from replitAuth.ts instead
import { Request } from 'express';
import { User } from '@shared/schema';

export interface AuthenticatedRequest extends Request {
  user?: User;
  tenant?: { id: string };
}