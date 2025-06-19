import { Request, Response, NextFunction } from 'express';
import { validationPatterns } from './config.js';

// Validation middleware factory
export function validateInput(schema: Record<string, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      // Check required fields
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip validation if field is not required and empty
      if (!rules.required && (!value || value.toString().trim() === '')) {
        continue;
      }
      
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
        continue;
      }
      
      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
        continue;
      }
      
      // Length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters long`);
        continue;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters long`);
        continue;
      }
      
      // Custom validation
      if (rules.validate && !rules.validate(value)) {
        errors.push(`${field} validation failed`);
        continue;
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }
    
    next();
  };
}

// Common validation schemas
export const validationSchemas = {
  login: {
    email: {
      required: true,
      type: 'string',
      pattern: validationPatterns.email
    },
    password: {
      required: true,
      type: 'string',
      minLength: 1
    }
  },
  
  signup: {
    email: {
      required: true,
      type: 'string',
      pattern: validationPatterns.email
    },
    password: {
      required: true,
      type: 'string',
      pattern: validationPatterns.password
    },
    firstName: {
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 50
    },
    lastName: {
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 50
    }
  },
  
  changePassword: {
    currentPassword: {
      required: true,
      type: 'string',
      minLength: 1
    },
    newPassword: {
      required: true,
      type: 'string',
      pattern: validationPatterns.password
    }
  },
  
  userProfile: {
    firstName: {
      required: false,
      type: 'string',
      maxLength: 50
    },
    lastName: {
      required: false,
      type: 'string',
      maxLength: 50
    },
    phoneNumber: {
      required: false,
      type: 'string',
      pattern: validationPatterns.phoneNumber
    }
  },
  
  fileUpload: {
    filename: {
      required: true,
      type: 'string',
      pattern: validationPatterns.filename,
      maxLength: 255
    }
  }
};

// Specific validation functions
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateEmail(email: string): boolean {
  return validationPatterns.email.test(email);
}

export function validateUUID(uuid: string): boolean {
  return validationPatterns.uuid.test(uuid);
}