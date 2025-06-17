// Legacy xAPI tracker - now redirects to modular system
// This file maintains backward compatibility while using the new architecture

// Re-export from modular system for backward compatibility
export { XAPI_VERBS, ACTIVITY_TYPES } from "./xapi/xapiVerbs";
export { xapiCore, xapiUtils } from "./xapi/xapiHooks";

// Import the modular system
import { 
  trackContentInteraction as trackContentInteractionNew, 
  trackAssignment as trackAssignmentNew, 
  trackQuiz as trackQuizNew, 
  trackLesson as trackLessonNew, 
  trackDevice as trackDeviceNew,
  trackUserLogin as trackUserLoginNew,
  trackUserLogout as trackUserLogoutNew,
  xapiUtils 
} from "./xapi/xapiHooks";

class XapiTracker {
  private static instance: XapiTracker;
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): XapiTracker {
    if (!XapiTracker.instance) {
      XapiTracker.instance = new XapiTracker();
    }
    return XapiTracker.instance;
  }

  setCurrentUser(user: any) {
    // Delegate to modular system
    import("./xapi/xapiHooks").then(({ xapiCore }) => {
      xapiCore.setCurrentUser(user);
    });
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Legacy methods now use modular system
  async trackLogin(user?: any) {
    if (!this.isEnabled) return;
    if (user) this.setCurrentUser(user);
    trackUserLoginNew(user);
  }

  async trackLogout() {
    if (!this.isEnabled) return;
    trackUserLogoutNew();
  }

  async trackPageView(pageName: string, pageType?: string) {
    if (!this.isEnabled) return;
    await xapiUtils.trackPageView(pageName, pageType || "page");
  }

  async trackContentAccess(contentId: string, contentName: string, contentType: string) {
    if (!this.isEnabled) return;
    trackContentInteractionNew(contentId, contentName, contentType);
  }

  async trackVideoInteraction(videoId: string, videoName: string, action: "played" | "paused" | "completed", currentTime?: number, duration?: number) {
    if (!this.isEnabled) return;
    await xapiUtils.trackVideoInteraction(videoId, videoName, action, currentTime, duration);
  }

  async trackAssignmentSubmission(assignmentId: string, assignmentName: string, score?: number, maxScore?: number) {
    if (!this.isEnabled) return;
    trackAssignmentNew(assignmentId, assignmentName, score, maxScore);
  }

  async trackQuizAttempt(quizId: string, quizName: string, score: number, maxScore: number, passed: boolean) {
    if (!this.isEnabled) return;
    trackQuizNew(quizId, quizName, score, maxScore, passed);
  }

  async trackLessonCompletion(lessonId: string, lessonName: string, duration: number) {
    if (!this.isEnabled) return;
    trackLessonNew(lessonId, lessonName, duration);
  }

  async trackDeviceInteraction(deviceId: string, action: string, details?: any) {
    if (!this.isEnabled) return;
    trackDeviceNew(deviceId, action, details);
  }
}

// Export singleton for backward compatibility
export const xapiTracker = XapiTracker.getInstance();

// Re-export everything from the modular system with different names to avoid conflicts
export { 
  useXapiPageTracking,
  trackUserLogin,
  trackUserLogout,
  trackContentInteraction,
  trackVideoProgress,
  trackAssignment,
  trackQuiz,
  trackLesson,
  trackDevice
} from "./xapi/xapiHooks";