// xAPI (Experience API) Tracker for Learning Analytics
export interface XAPIStatement {
  actor: {
    account?: {
      homePage: string;
      name: string;
    };
    name?: string;
  };
  verb: {
    id: string;
    display?: { [key: string]: string };
  };
  object: {
    id: string;
    definition: {
      name: { [key: string]: string };
      description?: { [key: string]: string };
      type?: string;
    };
  };
  result?: {
    completion?: boolean;
    success?: boolean;
    score?: {
      scaled?: number;
      raw?: number;
      min?: number;
      max?: number;
    };
    duration?: string;
    response?: string;
    extensions?: { [key: string]: any };
  };
  context?: {
    platform?: string;
    language?: string;
    parent?: Array<{
      id: string;
      definition: { name: { [key: string]: string } };
    }>;
    grouping?: Array<{
      id: string;
      definition: { name: { [key: string]: string } };
    }>;
    extensions?: { [key: string]: any };
  };
  timestamp?: string;
}

export class XAPITracker {
  private endpoint: string;
  private enabled: boolean;
  private sessionStartTime: Date;

  constructor(endpoint: string = '/api/xapi/statements', enabled: boolean = true) {
    this.endpoint = endpoint;
    this.enabled = enabled;
    this.sessionStartTime = new Date();
  }

  // Track general activity
  async trackActivity(statement: Partial<XAPIStatement>): Promise<void> {
    if (!this.enabled) return;

    const fullStatement: XAPIStatement = {
      actor: {
        account: {
          homePage: window.location.origin,
          name: 'current-user'
        }
      },
      ...statement,
      timestamp: new Date().toISOString()
    } as XAPIStatement;

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullStatement)
      });
    } catch (error) {
      console.error('xAPI tracking error:', error);
    }
  }

  // Track content access
  async trackAccessed(resourceId: string, title: string, type: string = 'lesson'): Promise<void> {
    return this.trackActivity({
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/experienced',
        display: { 'en-US': 'experienced' }
      },
      object: {
        id: `${window.location.origin}/resource/${resourceId}`,
        definition: {
          name: { 'en-US': title },
          type: `http://adlnet.gov/expapi/activities/${type}`
        }
      },
      context: {
        platform: 'Edvirons Digital Library'
      }
    });
  }

  // Track video/audio playback
  async trackMediaEvent(action: 'played' | 'paused' | 'seeked' | 'completed', 
                       resourceId: string, title: string, currentTime: number, duration: number): Promise<void> {
    const verbMap = {
      played: 'http://adlnet.gov/expapi/verbs/played',
      paused: 'http://adlnet.gov/expapi/verbs/paused',
      seeked: 'http://adlnet.gov/expapi/verbs/seeked',
      completed: 'http://adlnet.gov/expapi/verbs/completed'
    };

    return this.trackActivity({
      verb: {
        id: verbMap[action],
        display: { 'en-US': action }
      },
      object: {
        id: `${window.location.origin}/media/${resourceId}`,
        definition: {
          name: { 'en-US': title },
          type: 'http://adlnet.gov/expapi/activities/media'
        }
      },
      result: {
        completion: action === 'completed',
        extensions: {
          'http://adlnet.gov/expapi/activities/media/time': currentTime,
          'http://adlnet.gov/expapi/activities/media/length': duration,
          'http://adlnet.gov/expapi/activities/media/progress': Math.round((currentTime / duration) * 100)
        }
      }
    });
  }

  // Track interactive element engagement
  async trackInteraction(elementId: string, elementType: string, 
                        resourceId: string, resourceTitle: string, data?: any): Promise<void> {
    return this.trackActivity({
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/interacted',
        display: { 'en-US': 'interacted' }
      },
      object: {
        id: `${window.location.origin}/element/${elementId}`,
        definition: {
          name: { 'en-US': `Interactive ${elementType}` },
          type: `http://adlnet.gov/expapi/activities/${elementType}`
        }
      },
      context: {
        parent: [{
          id: `${window.location.origin}/resource/${resourceId}`,
          definition: { name: { 'en-US': resourceTitle } }
        }]
      },
      result: {
        extensions: data ? { 'http://adlnet.gov/expapi/activities/interaction/data': data } : undefined
      }
    });
  }

  // Track quiz/assessment completion
  async trackAssessment(assessmentId: string, title: string, score: number, 
                       maxScore: number, success: boolean, responses: any[]): Promise<void> {
    return this.trackActivity({
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/answered',
        display: { 'en-US': 'answered' }
      },
      object: {
        id: `${window.location.origin}/assessment/${assessmentId}`,
        definition: {
          name: { 'en-US': title },
          type: 'http://adlnet.gov/expapi/activities/assessment'
        }
      },
      result: {
        completion: true,
        success: success,
        score: {
          scaled: score / maxScore,
          raw: score,
          max: maxScore,
          min: 0
        },
        response: JSON.stringify(responses)
      }
    });
  }

  // Track reading progress
  async trackReadingProgress(resourceId: string, title: string, 
                           currentPage: number, totalPages: number, timeOnPage?: number): Promise<void> {
    return this.trackActivity({
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/progressed',
        display: { 'en-US': 'progressed' }
      },
      object: {
        id: `${window.location.origin}/book/${resourceId}`,
        definition: {
          name: { 'en-US': title },
          type: 'http://adlnet.gov/expapi/activities/book'
        }
      },
      result: {
        extensions: {
          'http://adlnet.gov/expapi/activities/book/page': currentPage,
          'http://adlnet.gov/expapi/activities/book/total-pages': totalPages,
          'http://adlnet.gov/expapi/activities/book/progress': Math.round((currentPage / totalPages) * 100),
          'http://adlnet.gov/expapi/activities/book/time-on-page': timeOnPage
        }
      }
    });
  }

  // Track session completion
  async trackSessionComplete(resourceId: string, title: string, timeSpent: number): Promise<void> {
    return this.trackActivity({
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/completed',
        display: { 'en-US': 'completed' }
      },
      object: {
        id: `${window.location.origin}/session/${resourceId}`,
        definition: {
          name: { 'en-US': `Learning Session: ${title}` },
          type: 'http://adlnet.gov/expapi/activities/lesson'
        }
      },
      result: {
        completion: true,
        duration: this.formatDuration(timeSpent)
      }
    });
  }

  // Track bookmark actions
  async trackBookmark(action: 'added' | 'removed', resourceId: string, 
                     title: string, page?: number): Promise<void> {
    return this.trackActivity({
      verb: {
        id: action === 'added' 
          ? 'http://adlnet.gov/expapi/verbs/bookmarked'
          : 'http://adlnet.gov/expapi/verbs/unbookmarked',
        display: { 'en-US': action === 'added' ? 'bookmarked' : 'unbookmarked' }
      },
      object: {
        id: `${window.location.origin}/bookmark/${resourceId}`,
        definition: {
          name: { 'en-US': title },
          type: 'http://adlnet.gov/expapi/activities/bookmark'
        }
      },
      result: {
        extensions: page ? { 'http://adlnet.gov/expapi/activities/bookmark/page': page } : undefined
      }
    });
  }

  // Format duration in ISO 8601 format
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `PT${hours > 0 ? `${hours}H` : ''}${minutes > 0 ? `${minutes}M` : ''}${secs}S`;
  }

  // Get session duration
  getSessionDuration(): number {
    return Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
  }

  // Enable/disable tracking
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Global tracker instance
export const xapiTracker = new XAPITracker();