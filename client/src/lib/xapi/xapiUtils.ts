import { XapiCore } from "./xapiCore";
import { XAPI_VERBS, ACTIVITY_TYPES } from "./xapiVerbs";
import { XapiStatement, XapiResult } from "./xapiCore";

export class XapiUtils {
  private core: XapiCore;

  constructor(core: XapiCore) {
    this.core = core;
  }

  async trackContentAccess(contentId: string, contentName: string, contentType: string) {
    const statement: XapiStatement = {
      actor: this.core.createActor(),
      verb: XAPI_VERBS.EXPERIENCED,
      object: this.core.createActivity(
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

    await this.core.sendStatement(statement);
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
      actor: this.core.createActor(),
      verb,
      object: this.core.createActivity(
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

    await this.core.sendStatement(statement);
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
      actor: this.core.createActor(),
      verb: XAPI_VERBS.SUBMITTED,
      object: this.core.createActivity(
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

    await this.core.sendStatement(statement);
  }

  async trackQuizAttempt(quizId: string, quizName: string, score: number, maxScore: number, passed: boolean) {
    const statement: XapiStatement = {
      actor: this.core.createActor(),
      verb: passed ? XAPI_VERBS.PASSED : XAPI_VERBS.FAILED,
      object: this.core.createActivity(
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

    await this.core.sendStatement(statement);
  }

  async trackLessonCompletion(lessonId: string, lessonName: string, duration: number) {
    const statement: XapiStatement = {
      actor: this.core.createActor(),
      verb: XAPI_VERBS.COMPLETED,
      object: this.core.createActivity(
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

    await this.core.sendStatement(statement);
  }

  async trackDeviceInteraction(deviceId: string, action: string, details?: any) {
    const statement: XapiStatement = {
      actor: this.core.createActor(),
      verb: XAPI_VERBS.INTERACTED,
      object: this.core.createActivity(
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

    await this.core.sendStatement(statement);
  }

  async trackPageView(pageName: string, pageType: string) {
    const statement: XapiStatement = {
      actor: this.core.createActor(),
      verb: XAPI_VERBS.EXPERIENCED,
      object: this.core.createActivity(
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

    await this.core.sendStatement(statement);
  }
}