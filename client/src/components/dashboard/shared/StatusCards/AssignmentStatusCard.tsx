import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  TrendingUp
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  grade?: number;
  maxPoints?: number;
}

interface AssignmentStatusCardProps {
  assignments: Assignment[];
  loading?: boolean;
  onViewAll?: () => void;
  onViewAssignment?: (assignment: Assignment) => void;
}

export function AssignmentStatusCard({ 
  assignments, 
  loading = false, 
  onViewAll, 
  onViewAssignment 
}: AssignmentStatusCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const overdueAssignments = assignments.filter(a => {
    return a.status === 'pending' && new Date(a.dueDate) < new Date();
  });
  const completedAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'graded');
  
  const completionRate = assignments.length > 0 
    ? Math.round((completedAssignments.length / assignments.length) * 100)
    : 0;

  const getStatusBadge = (assignment: Assignment) => {
    const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === 'pending';
    
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    switch (assignment.status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'graded':
        return <Badge variant="default">Graded</Badge>;
      default:
        return null;
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 0) return `Due in ${diffDays} days`;
    if (diffDays === -1) return 'Due yesterday';
    return `${Math.abs(diffDays)} days overdue`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignments
          </CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingAssignments.length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{overdueAssignments.length}</div>
            <div className="text-sm text-gray-500">Overdue</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Completion Rate</span>
            <span>{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {assignments.slice(0, 3).map((assignment) => (
            <div 
              key={assignment.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => onViewAssignment?.(assignment)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{assignment.title}</h4>
                  {getStatusBadge(assignment)}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{assignment.subject}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDueDate(assignment.dueDate)}
                  </span>
                  {assignment.grade && assignment.maxPoints && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {assignment.grade}/{assignment.maxPoints}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-3">
                {assignment.status === 'pending' && new Date(assignment.dueDate) < new Date() ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : assignment.status === 'graded' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          ))}
          
          {assignments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No assignments available</p>
            </div>
          )}
          
          {assignments.length > 3 && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" onClick={onViewAll}>
                View {assignments.length - 3} more assignments
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}