import { Request } from "express";
import { User } from "@shared/schema";

export interface AuthenticatedRequest extends Request {
  user?: User & {
    claims?: {
      sub: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      profile_image_url?: string;
    };
  };
}