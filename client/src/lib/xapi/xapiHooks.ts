import { useEffect } from "react";
import { XapiCore } from "./xapiCore";
import { XapiUtils } from "./xapiUtils";
import { XAPI_VERBS, ACTIVITY_TYPES } from "./xapiVerbs";

// Create singleton instances
const xapiCore = new XapiCore();
const xapiUtils = new XapiUtils(xapiCore);

export { xapiCore, xapiUtils };

// Hook for automatic page tracking
export function useXapiPageTracking(pageName: string, pageType: string) {
  useEffect(() => {
    xapiUtils.trackPageView(pageName, pageType);
  }, [pageName, pageType]);
}

// Utility functions for common tracking scenarios
export const trackUserLogin = (user: any) => {
  xapiCore.setCurrentUser(user);
  
  const statement = {
    actor: xapiCore.createActor(),
    verb: XAPI_VERBS.LOGGED_IN,
    object: xapiCore.createActivity(
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

  xapiCore.sendStatement(statement);
};

export const trackUserLogout = () => {
  const statement = {
    actor: xapiCore.createActor(),
    verb: XAPI_VERBS.LOGGED_OUT,
    object: xapiCore.createActivity(
      "platform",
      "Edvirons Learning Platform", 
      ACTIVITY_TYPES.COURSE
    ),
    context: {
      platform: "Edvirons"
    }
  };

  xapiCore.sendStatement(statement);
};

export const trackContentInteraction = (contentId: string, contentName: string, contentType: string) => {
  xapiUtils.trackContentAccess(contentId, contentName, contentType);
};

export const trackVideoProgress = (videoId: string, videoName: string, action: "played" | "paused" | "completed", currentTime?: number, duration?: number) => {
  xapiUtils.trackVideoInteraction(videoId, videoName, action, currentTime, duration);
};

export const trackAssignment = (assignmentId: string, assignmentName: string, score?: number, maxScore?: number) => {
  xapiUtils.trackAssignmentSubmission(assignmentId, assignmentName, score, maxScore);
};

export const trackQuiz = (quizId: string, quizName: string, score: number, maxScore: number, passed: boolean) => {
  xapiUtils.trackQuizAttempt(quizId, quizName, score, maxScore, passed);
};

export const trackLesson = (lessonId: string, lessonName: string, duration: number) => {
  xapiUtils.trackLessonCompletion(lessonId, lessonName, duration);
};

export const trackDevice = (deviceId: string, action: string, details?: any) => {
  xapiUtils.trackDeviceInteraction(deviceId, action, details);
};