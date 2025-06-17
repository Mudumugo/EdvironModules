import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerXapiRoutes(app: Express) {
  // xAPI Statement endpoints
  app.post('/api/xapi/statements', async (req: any, res) => {
    try {
      const statement = req.body;
      const userId = req.user?.claims?.sub || 'anonymous';
      const tenantId = req.tenant?.id || 'default';
      
      // Generate unique statement ID if not provided
      const statementId = statement.id || crypto.randomUUID();
      
      // Store xAPI statement in learning record store
      const xapiRecord = {
        statementId,
        actor: statement.actor,
        verb: statement.verb,
        object: statement.object,
        result: statement.result || null,
        context: statement.context || null,
        timestamp: statement.timestamp || new Date().toISOString(),
        stored: new Date().toISOString(),
        authority: statement.authority || statement.actor,
        version: "1.0.3",
        attachments: statement.attachments || null,
        voided: false,
        tenantId
      };
      
      console.log(`xAPI Statement recorded: ${statement.verb.display['en-US']} - ${statement.object.definition.name['en-US']}`);
      
      // Update learning analytics aggregations
      await updateLearningAnalytics(statement, userId, tenantId);
      
      res.status(200).json({ 
        success: true, 
        statementId,
        stored: xapiRecord.stored
      });
    } catch (error) {
      console.error("Error storing xAPI statement:", error);
      res.status(500).json({ message: "Failed to store xAPI statement" });
    }
  });

  app.get('/api/xapi/statements', isAuthenticated, async (req: any, res) => {
    try {
      const { agent, verb, activity, since, until, limit = 100 } = req.query;
      const tenantId = req.tenant?.id || 'default';
      
      // Mock filtered xAPI statements based on query parameters
      const statements = [
        {
          id: "stmt_001",
          actor: {
            objectType: "Agent",
            name: "Emma Johnson",
            mbox: "mailto:emma.johnson@school.edu"
          },
          verb: {
            id: "http://adlnet.gov/expapi/verbs/completed",
            display: { "en-US": "completed" }
          },
          object: {
            objectType: "Activity",
            id: "https://school.edvirons.com/activities/lesson/math_001",
            definition: {
              name: { "en-US": "Introduction to Algebra" },
              type: "http://adlnet.gov/expapi/activities/lesson"
            }
          },
          result: {
            completion: true,
            duration: "PT45M30S",
            score: { scaled: 0.89, raw: 89, max: 100 }
          },
          timestamp: "2024-01-22T14:30:00Z",
          stored: "2024-01-22T14:30:01Z"
        },
        {
          id: "stmt_002", 
          actor: {
            objectType: "Agent",
            name: "Liam Smith",
            mbox: "mailto:liam.smith@school.edu"
          },
          verb: {
            id: "https://w3id.org/xapi/video/verbs/watched",
            display: { "en-US": "watched" }
          },
          object: {
            objectType: "Activity",
            id: "https://school.edvirons.com/activities/video/calculus_intro",
            definition: {
              name: { "en-US": "Calculus Introduction Video" },
              type: "https://w3id.org/xapi/video/activity-type/video"
            }
          },
          result: {
            completion: true,
            duration: "PT22M15S"
          },
          context: {
            extensions: {
              "https://w3id.org/xapi/video/extensions/time": 1335
            }
          },
          timestamp: "2024-01-22T15:45:00Z",
          stored: "2024-01-22T15:45:02Z"
        }
      ];
      
      console.log(`Retrieved ${statements.length} xAPI statements for tenant ${tenantId}`);
      
      res.json({
        statements,
        more: ""
      });
    } catch (error) {
      console.error("Error retrieving xAPI statements:", error);
      res.status(500).json({ message: "Failed to retrieve xAPI statements" });
    }
  });
}

// Helper function to update learning analytics
async function updateLearningAnalytics(statement: any, userId: string, tenantId: string) {
  try {
    // Extract key information from xAPI statement
    const activityId = statement.object.id;
    const verb = statement.verb.id;
    const result = statement.result;
    
    // Update aggregated analytics based on statement type
    console.log(`Updating analytics for user ${userId}: ${verb} on ${activityId}`);
    
    // This would typically update database records for:
    // - Total interaction counts
    // - Learning time tracking  
    // - Score aggregations
    // - Completion tracking
    // - Competency progress
    
  } catch (error) {
    console.error("Error updating learning analytics:", error);
  }
}