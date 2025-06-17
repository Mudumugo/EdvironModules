import { apiRequest } from "./queryClient";
import { getCurrentTenant } from "./tenantUtils";

// xAPI Verb definitions for educational interactions
export const XAPI_VERBS = {
  // Core learning verbs
  EXPERIENCED: {
    id: "http://adlnet.gov/expapi/verbs/experienced",
    display: { "en-US": "experienced" }
  },
  COMPLETED: {
    id: "http://adlnet.gov/expapi/verbs/completed", 
    display: { "en-US": "completed" }
  },
  PASSED: {
    id: "http://adlnet.gov/expapi/verbs/passed",
    display: { "en-US": "passed" }
  },
  FAILED: {
    id: "http://adlnet.gov/expapi/verbs/failed",
    display: { "en-US": "failed" }
  },
  ANSWERED: {
    id: "http://adlnet.gov/expapi/verbs/answered",
    display: { "en-US": "answered" }
  },
  ATTEMPTED: {
    id: "http://adlnet.gov/expapi/verbs/attempted",
    display: { "en-US": "attempted" }
  },
  ATTENDED: {
    id: "http://adlnet.gov/expapi/verbs/attended",
    display: { "en-US": "attended" }
  },
  INTERACTED: {
    id: "http://adlnet.gov/expapi/verbs/interacted",
    display: { "en-US": "interacted" }
  },
  // Educational specific verbs
  WATCHED: {
    id: "https://w3id.org/xapi/video/verbs/watched",
    display: { "en-US": "watched" }
  },
  PLAYED: {
    id: "https://w3id.org/xapi/video/verbs/played",
    display: { "en-US": "played" }
  },
  PAUSED: {
    id: "https://w3id.org/xapi/video/verbs/paused",
    display: { "en-US": "paused" }
  },
  DOWNLOADED: {
    id: "http://id.tincanapi.com/verb/downloaded",
    display: { "en-US": "downloaded" }
  },
  SUBMITTED: {
    id: "http://activitystrea.ms/schema/1.0/submit",
    display: { "en-US": "submitted" }
  },
  LOGGED_IN: {
    id: "https://brindlewaye.com/xAPITerms/verbs/loggedin/",
    display: { "en-US": "logged in" }
  },
  LOGGED_OUT: {
    id: "https://brindlewaye.com/xAPITerms/verbs/loggedout/",
    display: { "en-US": "logged out" }
  }
};

// Activity types for educational content
export const ACTIVITY_TYPES = {
  COURSE: "http://adlnet.gov/expapi/activities/course",
  LESSON: "http://adlnet.gov/expapi/activities/lesson", 
  ASSESSMENT: "http://adlnet.gov/expapi/activities/assessment",
  QUESTION: "http://adlnet.gov/expapi/activities/question",
  INTERACTION: "http://adlnet.gov/expapi/activities/interaction",
  MODULE: "http://adlnet.gov/expapi/activities/module",
  MEDIA: "http://adlnet.gov/expapi/activities/media",
  SIMULATION: "http://adlnet.gov/expapi/activities/simulation",
  VIDEO: "https://w3id.org/xapi/video/activity-type/video",
  DOCUMENT: "http://id.tincanapi.com/activitytype/document",
  EBOOK: "http://id.tincanapi.com/activitytype/ebook",
  ASSIGNMENT: "http://id.tincanapi.com/activitytype/assignment",
  DISCUSSION: "http://id.tincanapi.com/activitytype/discussion"
};

interface XapiActor {
  objectType: "Agent";
  name: string;
  mbox?: string;
  account?: {
    name: string;
    homePage: string;
  };
}

interface XapiObject {
  objectType: "Activity";
  id: string;
  definition: {
    name: { "en-US": string };
    description?: { "en-US": string };
    type: string;
    extensions?: Record<string, any>;
  };
}

interface XapiResult {
  score?: {
    scaled?: number;
    raw?: number;
    min?: number;
    max?: number;
  };
  success?: boolean;
  completion?: boolean;
  duration?: string; // ISO 8601 duration
  response?: string;
  extensions?: Record<string, any>;
}

interface XapiContext {
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

interface XapiStatement {
  actor: XapiActor;
  verb: typeof XAPI_VERBS[keyof typeof XAPI_VERBS];
  object: XapiObject;
  result?: XapiResult;
  context?: XapiContext;
  timestamp?: string;
  authority?: XapiActor;
}

class XapiTracker {
  private static instance: XapiTracker;
  private sessionStartTime: Date;
  private currentUser: any = null;
  private tenant: any = null;

  private constructor() {
    this.sessionStartTime = new Date();
    this.initializeTracking();
  }

  static getInstance(): XapiTracker {
    if (!XapiTracker.instance) {
      XapiTracker.instance = new XapiTracker();
    }
    return XapiTracker.instance;
  }

  private async initializeTracking() {
    try {
      this.tenant = getCurrentTenant();
      // Initialize session tracking
      this.trackSessionStart();
    } catch (error) {
      console.error("Failed to initialize xAPI tracking:", error);
    }
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  private createActor(): XapiActor {
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

  private createActivity(id: string, name: string, type: string, description?: string, extensions?: Record<string, any>): XapiObject {
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

  private async sendStatement(statement: XapiStatement): Promise<void> {
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

  // Core tracking methods
  async trackLogin() {
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.LOGGED_IN,
      object: this.createActivity(
        "platform",
        "Edvirons Learning Platform",
        ACTIVITY_TYPES.COURSE,
        "Educational technology platform for comprehensive learning management"
      ),
      context: {
        platform: "Edvirons",
        extensions: {
          "http://edvirons.com/extensions/session_id": crypto.randomUUID(),
          "http://edvirons.com/extensions/user_agent": navigator.userAgent
        }
      }
    };

    await this.sendStatement(statement);
  }

  async trackLogout() {
    const sessionDuration = new Date().getTime() - this.sessionStartTime.getTime();
    
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.LOGGED_OUT,
      object: this.createActivity(
        "platform",
        "Edvirons Learning Platform", 
        ACTIVITY_TYPES.COURSE
      ),
      result: {
        extensions: {
          "http://edvirons.com/extensions/session_duration": sessionDuration
        }
      },
      context: {
        platform: "Edvirons"
      }
    };

    await this.sendStatement(statement);
  }

  async trackPageView(pageName: string, pageType: string) {
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.EXPERIENCED,
      object: this.createActivity(
        `page/${pageName}`,
        pageName,
        ACTIVITY_TYPES.MODULE,
        `Viewed ${pageName} page in the learning platform`
      ),
      context: {
        platform: "Edvirons",
        extensions: {
          "http://edvirons.com/extensions/page_type": pageType,
          "http://edvirons.com/extensions/url": window.location.href
        }
      }
    };

    await this.sendStatement(statement);
  }

  async trackContentAccess(contentId: string, contentName: string, contentType: string) {
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.EXPERIENCED,
      object: this.createActivity(
        `content/${contentId}`,
        contentName,
        ACTIVITY_TYPES.MEDIA,
        `Accessed educational content: ${contentName}`
      ),
      context: {
        platform: "Edvirons",
        extensions: {
          "http://edvirons.com/extensions/content_type": contentType,
          "http://edvirons.com/extensions/access_time": new Date().toISOString()
        }
      }
    };

    await this.sendStatement(statement);
  }

  async trackVideoInteraction(videoId: string, videoName: string, action: "played" | "paused" | "completed", currentTime?: number, duration?: number) {
    let verb;
    switch (action) {
      case "played":
        verb = XAPI_VERBS.PLAYED;
        break;
      case "paused":
        verb = XAPI_VERBS.PAUSED;
        break;
      case "completed":
        verb = XAPI_VERBS.COMPLETED;
        break;
    }

    const result: XapiResult = {
      extensions: {
        "https://w3id.org/xapi/video/extensions/time": currentTime || 0
      }
    };

    if (action === "completed" && duration) {
      result.completion = true;
      result.duration = `PT${Math.round(duration)}S`;
    }

    const statement: XapiStatement = {
      actor: this.createActor(),
      verb,
      object: this.createActivity(
        `video/${videoId}`,
        videoName,
        ACTIVITY_TYPES.VIDEO,
        `Educational video: ${videoName}`
      ),
      result,
      context: {
        platform: "Edvirons",
        extensions: {
          "https://w3id.org/xapi/video/extensions/video-type": "educational"
        }
      }
    };

    await this.sendStatement(statement);
  }

  async trackAssignmentSubmission(assignmentId: string, assignmentName: string, score?: number, maxScore?: number) {
    const result: XapiResult = {
      completion: true
    };

    if (score !== undefined && maxScore !== undefined) {
      result.score = {
        raw: score,
        max: maxScore,
        scaled: score / maxScore
      };
      result.success = score >= (maxScore * 0.7); // 70% passing threshold
    }

    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.SUBMITTED,
      object: this.createActivity(
        `assignment/${assignmentId}`,
        assignmentName,
        ACTIVITY_TYPES.ASSIGNMENT,
        `Assignment submission: ${assignmentName}`
      ),
      result,
      context: {
        platform: "Edvirons"
      }
    };

    await this.sendStatement(statement);
  }

  async trackQuizAttempt(quizId: string, quizName: string, score: number, maxScore: number, passed: boolean) {
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: passed ? XAPI_VERBS.PASSED : XAPI_VERBS.FAILED,
      object: this.createActivity(
        `quiz/${quizId}`,
        quizName,
        ACTIVITY_TYPES.ASSESSMENT,
        `Quiz attempt: ${quizName}`
      ),
      result: {
        score: {
          raw: score,
          max: maxScore,
          scaled: score / maxScore
        },
        success: passed,
        completion: true
      },
      context: {
        platform: "Edvirons"
      }
    };

    await this.sendStatement(statement);
  }

  async trackLessonCompletion(lessonId: string, lessonName: string, duration: number) {
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.COMPLETED,
      object: this.createActivity(
        `lesson/${lessonId}`,
        lessonName,
        ACTIVITY_TYPES.LESSON,
        `Lesson completion: ${lessonName}`
      ),
      result: {
        completion: true,
        duration: `PT${Math.round(duration)}S`
      },
      context: {
        platform: "Edvirons"
      }
    };

    await this.sendStatement(statement);
  }

  async trackDeviceInteraction(deviceId: string, action: string, details?: any) {
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.INTERACTED,
      object: this.createActivity(
        `device/${deviceId}`,
        `Device ${deviceId}`,
        ACTIVITY_TYPES.INTERACTION,
        `Device management interaction: ${action}`
      ),
      context: {
        platform: "Edvirons",
        extensions: {
          "http://edvirons.com/extensions/device_action": action,
          "http://edvirons.com/extensions/device_details": details
        }
      }
    };

    await this.sendStatement(statement);
  }

  private async trackSessionStart() {
    const statement: XapiStatement = {
      actor: this.createActor(),
      verb: XAPI_VERBS.EXPERIENCED,
      object: this.createActivity(
        "session/start",
        "Learning Session",
        ACTIVITY_TYPES.INTERACTION,
        "Started a new learning session"
      ),
      context: {
        platform: "Edvirons",
        extensions: {
          "http://edvirons.com/extensions/session_start": this.sessionStartTime.toISOString()
        }
      }
    };

    await this.sendStatement(statement);
  }
}

// Export singleton instance
export const xapiTracker = XapiTracker.getInstance();

// Hook for automatic page tracking
import { useEffect } from "react";

export function useXapiPageTracking(pageName: string, pageType: string) {
  useEffect(() => {
    xapiTracker.trackPageView(pageName, pageType);
  }, [pageName, pageType]);
}

// Utility functions for common tracking scenarios
export const trackUserLogin = (user: any) => {
  xapiTracker.setCurrentUser(user);
  xapiTracker.trackLogin();
};

export const trackUserLogout = () => {
  xapiTracker.trackLogout();
};

export const trackContentInteraction = (contentId: string, contentName: string, contentType: string) => {
  xapiTracker.trackContentAccess(contentId, contentName, contentType);
};

export const trackVideoProgress = (videoId: string, videoName: string, action: "played" | "paused" | "completed", currentTime?: number, duration?: number) => {
  xapiTracker.trackVideoInteraction(videoId, videoName, action, currentTime, duration);
};

export const trackAssignment = (assignmentId: string, assignmentName: string, score?: number, maxScore?: number) => {
  xapiTracker.trackAssignmentSubmission(assignmentId, assignmentName, score, maxScore);
};

export const trackQuiz = (quizId: string, quizName: string, score: number, maxScore: number, passed: boolean) => {
  xapiTracker.trackQuizAttempt(quizId, quizName, score, maxScore, passed);
};

export const trackLesson = (lessonId: string, lessonName: string, duration: number) => {
  xapiTracker.trackLessonCompletion(lessonId, lessonName, duration);
};

export const trackDevice = (deviceId: string, action: string, details?: any) => {
  xapiTracker.trackDeviceInteraction(deviceId, action, details);
};