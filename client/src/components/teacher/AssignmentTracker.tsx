import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar, FileText, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AssignmentTracker() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/teacher/assignments']
  });

  const { data: classes } = useQuery({
    queryKey: ['/api/teacher/classes']
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: any) => {
      return await apiRequest("POST", "/api/teacher/assignments", assignmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/assignments'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Assignment Created",
        description: "Your assignment has been successfully created and distributed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    instructions: '',
    classId: '',
    assignmentType: 'homework',
    totalPoints: 100,
    dueDate: ''
  });

  const handleCreateAssignment = () => {
    createAssignmentMutation.mutate(newAssignment);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-500';
      case 'quiz': return 'bg-orange-500';
      case 'project': return 'bg-purple-500';
      case 'homework': return 'bg-blue-500';
      case 'lab': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSubmissionStatus = (assignment: any) => {
    const submissionRate = (assignment.submissionsReceived / assignment.totalStudents) * 100;
    if (submissionRate >= 90) return { status: 'excellent', color: 'text-green-600', icon: CheckCircle };
    if (submissionRate >= 70) return { status: 'good', color: 'text-blue-600', icon: Clock };
    return { status: 'needs-attention', color: 'text-red-600', icon: AlertCircle };
  };

  if (assignmentsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignment Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Assignment Tracker</CardTitle>
            <CardDescription>Create, distribute, and track assignment submissions</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Create and distribute a new assignment to your students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input
                      id="title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      placeholder="Enter assignment title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select 
                      value={newAssignment.classId} 
                      onValueChange={(value) => setNewAssignment({ ...newAssignment, classId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes?.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} - {cls.grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    placeholder="Brief description of the assignment"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={newAssignment.instructions}
                    onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
                    placeholder="Detailed instructions for students"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Assignment Type</Label>
                    <Select 
                      value={newAssignment.assignmentType} 
                      onValueChange={(value) => setNewAssignment({ ...newAssignment, assignmentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homework">Homework</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Total Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={newAssignment.totalPoints}
                      onChange={(e) => setNewAssignment({ ...newAssignment, totalPoints: parseInt(e.target.value) })}
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date & Time</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAssignment}
                  disabled={createAssignmentMutation.isPending}
                >
                  {createAssignmentMutation.isPending ? "Creating..." : "Create Assignment"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments?.map((assignment: any) => {
            const submissionRate = (assignment.submissionsReceived / assignment.totalStudents) * 100;
            const gradingProgress = (assignment.graded / assignment.submissionsReceived) * 100;
            const statusInfo = getSubmissionStatus(assignment);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={assignment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      <Badge className={getTypeColor(assignment.assignmentType)}>
                        {assignment.assignmentType}
                      </Badge>
                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                    </div>
                    <p className="text-muted-foreground mb-3">{assignment.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Due</div>
                    <div className="font-medium">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{assignment.className}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{assignment.totalPoints} points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {assignment.submissionsReceived}/{assignment.totalStudents} submitted
                    </span>
                  </div>
                  {assignment.averageScore > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Avg: {assignment.averageScore}%</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Submission Progress</span>
                      <span>{Math.round(submissionRate)}%</span>
                    </div>
                    <Progress value={submissionRate} className="h-2" />
                  </div>
                  
                  {assignment.submissionsReceived > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Grading Progress</span>
                        <span>{assignment.graded}/{assignment.submissionsReceived} graded</span>
                      </div>
                      <Progress value={gradingProgress} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Submissions
                  </Button>
                  <Button variant="outline" size="sm">
                    Grade
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Reminder
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}