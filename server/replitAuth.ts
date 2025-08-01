import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler, Request, Response, NextFunction } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import type { SessionUser } from "./roleMiddleware";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl / 1000, // ttl expects seconds, not milliseconds
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'demo-session-secret-key',
    store: sessionStore,
    resave: true, // Force session save for Replit webview compatibility
    saveUninitialized: true, // Save uninitialized sessions
    rolling: false, // Don't reset session expiry on every request
    name: 'edvirons.sid', // Custom session name for better tracking
    cookie: {
      httpOnly: false, // Allow JavaScript access for webview compatibility
      secure: false, // Set to false for development
      maxAge: sessionTtl,
      sameSite: 'none', // Required for iframe/webview environments
      path: '/' // Explicit path for all routes
    },
  });
}

// Remove this function as we're handling user creation in verify function

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    tenantId: 'default-tenant',
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

// Re-export the isAuthenticated middleware for backward compatibility
export { isAuthenticated } from './roleMiddleware';

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const claims = tokens.claims();
    if (!claims) {
      return verified(new Error("Invalid claims"), false);
    }
    
    await upsertUser(claims);
    
    // Determine role based on email domain or specific emails
    let userRole = "student"; // Default role
    const email = String(claims["email"] || "");
    
    // EdVirons team email patterns
    if (email.endsWith("@edvirons.com")) {
      if (email.includes("admin") || email === "admin@edvirons.com") {
        userRole = "edvirons_admin";
      } else if (email.includes("support")) {
        userRole = "edvirons_support";
      } else if (email.includes("content")) {
        userRole = "edvirons_content_manager";
      } else if (email.includes("license")) {
        userRole = "edvirons_license_manager";
      } else if (email.includes("dev")) {
        userRole = "edvirons_developer";
      } else {
        userRole = "edvirons_admin"; // Default EdVirons team to admin
      }
    }
    // Demo accounts for testing
    else if (email === "demo.admin@edvirons.com") {
      userRole = "edvirons_admin";
    } else if (email === "demo.content@edvirons.com") {
      userRole = "edvirons_content_manager";
    } else if (email === "demo.support@edvirons.com") {
      userRole = "edvirons_support";
    }
    // School admin demo accounts
    else if (email === "demo.school@edvirons.com") {
      userRole = "school_admin";
    } else if (email === "demo.teacher@edvirons.com") {
      userRole = "teacher";
    }

    // Create SessionUser compatible object
    const sessionUser: SessionUser = {
      id: String(claims["sub"] || ""),
      email: email,
      role: userRole,
      tenantId: userRole.startsWith("edvirons_") ? "edvirons-global" : "default-tenant",
      firstName: String(claims["first_name"] || ""),
      lastName: String(claims["last_name"] || ""),
      profileImageUrl: String(claims["profile_image_url"] || ""),
      claims: claims
    };
    
    verified(null, sessionUser);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: SessionUser, cb) => cb(null, user));
  passport.deserializeUser((user: SessionUser, cb) => {
    // Update user session with latest database info
    if (user.id) {
      storage.getUser(user.id).then(dbUser => {
        if (dbUser) {
          const updatedUser: SessionUser = {
            ...user,
            role: dbUser.role || user.role,
            tenantId: dbUser.tenantId || user.tenantId,
            firstName: dbUser.firstName || user.firstName,
            lastName: dbUser.lastName || user.lastName,
            permissions: dbUser.permissions || []
          };
          cb(null, updatedUser);
        } else {
          cb(null, user);
        }
      }).catch(() => cb(null, user));
    } else {
      cb(null, user);
    }
  });

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

// Note: isAuthenticated middleware moved to roleMiddleware.ts to avoid conflicts
// This file only handles Replit OIDC setup, not authentication middleware;
