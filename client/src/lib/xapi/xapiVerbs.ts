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