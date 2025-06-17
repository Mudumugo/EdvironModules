import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerAnalyticsRoutes(app: Express) {
  app.get('/api/learning-analytics/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeframe = '7d' } = req.query;
      
      const analytics = {
        overview: {
          totalLearningTime: 2847, // minutes
          activitiesCompleted: 23,
          averageScore: 87.3,
          streakDays: 5,
          competenciesAchieved: 8
        },
        recentActivity: [
          {
            date: "2024-01-22",
            activitiesCompleted: 4,
            learningTime: 185,
            averageScore: 89
          },
          {
            date: "2024-01-21", 
            activitiesCompleted: 3,
            learningTime: 142,
            averageScore: 91
          },
          {
            date: "2024-01-20",
            activitiesCompleted: 5,
            learningTime: 201,
            averageScore: 84
          }
        ],
        topActivities: [
          {
            activityId: "lesson_math_001",
            name: "Introduction to Algebra",
            type: "lesson",
            completions: 156,
            averageScore: 87.2,
            averageDuration: 2730 // seconds
          },
          {
            activityId: "video_calculus_intro",
            name: "Calculus Introduction",
            type: "video", 
            completions: 203,
            averageScore: 92.1,
            averageDuration: 1335
          }
        ],
        learningPaths: [
          {
            pathId: "path_mathematics",
            name: "Mathematics Mastery",
            progress: 67.5,
            completedActivities: 27,
            totalActivities: 40,
            estimatedCompletion: "2024-02-15"
          }
        ],
        competencyProgress: [
          {
            competencyId: "comp_algebra",
            name: "Algebraic Thinking",
            masteryLevel: 78.5,
            isAchieved: false,
            relatedActivities: 12
          },
          {
            competencyId: "comp_geometry",
            name: "Geometric Reasoning",
            masteryLevel: 92.3,
            isAchieved: true,
            relatedActivities: 8
          }
        ]
      };
      
      console.log(`Learning analytics retrieved for user ${userId} (${timeframe} timeframe)`);
      
      res.json(analytics);
    } catch (error) {
      console.error("Error retrieving learning analytics:", error);
      res.status(500).json({ message: "Failed to retrieve learning analytics" });
    }
  });

  app.get('/api/learning-analytics/competencies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const competencies = [
        {
          id: "comp_001",
          competencyId: "algebra_fundamentals",
          name: "Algebra Fundamentals",
          description: "Understanding basic algebraic concepts and operations",
          category: "Mathematics",
          level: "beginner",
          masteryThreshold: 80,
          currentMastery: 78.5,
          isAchieved: false,
          evidence: [
            {
              statementId: "stmt_algebra_001",
              activity: "Linear Equations Quiz",
              score: 85,
              timestamp: "2024-01-20T10:30:00Z"
            },
            {
              statementId: "stmt_algebra_002", 
              activity: "Polynomial Basics Test",
              score: 72,
              timestamp: "2024-01-21T14:15:00Z"
            }
          ],
          relatedActivities: [
            "lesson_linear_equations",
            "quiz_polynomial_basics",
            "assignment_algebra_practice"
          ]
        },
        {
          id: "comp_002",
          competencyId: "geometric_reasoning",
          name: "Geometric Reasoning",
          description: "Spatial reasoning and geometric problem solving",
          category: "Mathematics",
          level: "intermediate",
          masteryThreshold: 80,
          currentMastery: 92.3,
          isAchieved: true,
          achievedAt: "2024-01-18T16:45:00Z",
          evidence: [
            {
              statementId: "stmt_geometry_001",
              activity: "Triangle Properties Assessment",
              score: 94,
              timestamp: "2024-01-18T15:30:00Z"
            },
            {
              statementId: "stmt_geometry_002",
              activity: "Area and Perimeter Quiz", 
              score: 91,
              timestamp: "2024-01-19T11:20:00Z"
            }
          ],
          relatedActivities: [
            "lesson_triangle_properties",
            "interactive_area_calculator",
            "project_geometric_design"
          ]
        }
      ];
      
      console.log(`Retrieved ${competencies.length} competencies for user ${userId}`);
      
      res.json(competencies);
    } catch (error) {
      console.error("Error retrieving competencies:", error);
      res.status(500).json({ message: "Failed to retrieve competencies" });
    }
  });

  app.get('/api/learning-analytics/paths', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const learningPaths = [
        {
          id: "path_001",
          pathId: "mathematics_foundation",
          name: "Mathematics Foundation",
          description: "Core mathematical concepts for academic success",
          totalActivities: 25,
          completedActivities: 17,
          progress: 68.0,
          estimatedDuration: 1800, // minutes
          timeSpent: 1224, // minutes
          currentActivityIndex: 17,
          activities: [
            {
              activityId: "lesson_numbers",
              name: "Number Systems",
              type: "lesson",
              status: "completed",
              score: 89,
              completedAt: "2024-01-15T10:30:00Z"
            },
            {
              activityId: "quiz_arithmetic", 
              name: "Arithmetic Operations Quiz",
              type: "assessment",
              status: "completed",
              score: 92,
              completedAt: "2024-01-16T14:20:00Z"
            },
            {
              activityId: "lesson_algebra_intro",
              name: "Introduction to Algebra",
              type: "lesson", 
              status: "in_progress",
              score: null,
              startedAt: "2024-01-22T09:15:00Z"
            }
          ],
          nextRecommendation: {
            activityId: "lesson_algebra_intro",
            name: "Introduction to Algebra",
            estimatedDuration: 45
          }
        },
        {
          id: "path_002",
          pathId: "digital_literacy", 
          name: "Digital Literacy Essentials",
          description: "Essential digital skills for modern learning",
          totalActivities: 18,
          completedActivities: 5,
          progress: 27.8,
          estimatedDuration: 1200,
          timeSpent: 345,
          currentActivityIndex: 5,
          activities: [
            {
              activityId: "lesson_computer_basics",
              name: "Computer Fundamentals",
              type: "lesson",
              status: "completed", 
              score: 95,
              completedAt: "2024-01-18T11:30:00Z"
            },
            {
              activityId: "interactive_typing",
              name: "Typing Skills Practice",
              type: "interactive",
              status: "in_progress",
              score: null,
              startedAt: "2024-01-22T13:45:00Z"
            }
          ],
          nextRecommendation: {
            activityId: "interactive_typing",
            name: "Typing Skills Practice",
            estimatedDuration: 30
          }
        }
      ];
      
      console.log(`Retrieved ${learningPaths.length} learning paths for user ${userId}`);
      
      res.json(learningPaths);
    } catch (error) {
      console.error("Error retrieving learning paths:", error);
      res.status(500).json({ message: "Failed to retrieve learning paths" });
    }
  });
}