import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Star,
  BookOpen,
  Target
} from "lucide-react";

interface Grade {
  subject: string;
  currentGrade: number;
  previousGrade?: number;
  maxPoints: number;
  letterGrade: string;
  trend: 'up' | 'down' | 'stable';
  assignments: number;
  lastUpdated: string;
}

interface GradeStatusCardProps {
  grades: Grade[];
  gpa: number;
  targetGPA?: number;
  loading?: boolean;
  onViewTranscript?: () => void;
  onViewSubject?: (subject: string) => void;
}

export function GradeStatusCard({ 
  grades, 
  gpa, 
  targetGPA, 
  loading = false, 
  onViewTranscript, 
  onViewSubject 
}: GradeStatusCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLetterGradeColor = (letterGrade: string) => {
    switch (letterGrade) {
      case 'A':
      case 'A+':
      case 'A-':
        return 'bg-green-100 text-green-800';
      case 'B':
      case 'B+':
      case 'B-':
        return 'bg-blue-100 text-blue-800';
      case 'C':
      case 'C+':
      case 'C-':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
      case 'D+':
      case 'D-':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const averageGrade = grades.length > 0 
    ? grades.reduce((sum, grade) => sum + (grade.currentGrade / grade.maxPoints * 100), 0) / grades.length
    : 0;

  const totalAssignments = grades.reduce((sum, grade) => sum + grade.assignments, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Grades
          </CardTitle>
          {onViewTranscript && (
            <Button variant="ghost" size="sm" onClick={onViewTranscript}>
              View Transcript
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getGradeColor(averageGrade)}`}>
              {averageGrade.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Average Grade</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{gpa.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Current GPA</div>
          </div>
        </div>
        
        {targetGPA && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>GPA Progress</span>
              <span>{gpa.toFixed(2)} / {targetGPA.toFixed(2)}</span>
            </div>
            <Progress value={(gpa / targetGPA) * 100} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {grades.slice(0, 4).map((grade, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => onViewSubject?.(grade.subject)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{grade.subject}</h4>
                  <Badge className={getLetterGradeColor(grade.letterGrade)}>
                    {grade.letterGrade}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{grade.currentGrade}/{grade.maxPoints} points</span>
                  <span>{grade.assignments} assignments</span>
                  <span>Updated {new Date(grade.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-3">
                <div className={`text-sm font-medium ${getGradeColor((grade.currentGrade / grade.maxPoints) * 100)}`}>
                  {((grade.currentGrade / grade.maxPoints) * 100).toFixed(1)}%
                </div>
                {getTrendIcon(grade.trend)}
              </div>
            </div>
          ))}
          
          {grades.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No grades available</p>
            </div>
          )}
          
          {grades.length > 4 && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" onClick={onViewTranscript}>
                View {grades.length - 4} more subjects
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Academic Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-blue-600 font-medium">{grades.length}</div>
              <div className="text-blue-700">Active Courses</div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">{totalAssignments}</div>
              <div className="text-blue-700">Total Assignments</div>
            </div>
          </div>
        </div>

        {gpa < 2.0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Academic Alert</span>
            </div>
            <p className="text-xs text-red-700 mt-1">
              GPA is below 2.0. Consider meeting with academic advisor for support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}