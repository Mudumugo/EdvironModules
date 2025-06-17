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
import { Plus, Calendar, Clock, BookOpen, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LessonManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['/api/teacher/lessons']
  });

  const { data: classes } = useQuery({
    queryKey: ['/api/teacher/classes']
  });

  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      return await apiRequest("POST", "/api/teacher/lessons", lessonData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/lessons'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Lesson Created",
        description: "Your lesson plan has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create lesson plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    classId: '',
    objectives: '',
    materials: '',
    duration: 60,
    scheduledDate: ''
  });

  const handleCreateLesson = () => {
    createLessonMutation.mutate(newLesson);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (lessonsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lesson Management</CardTitle>
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
            <CardTitle>Lesson Management</CardTitle>
            <CardDescription>Plan and track your lesson progress</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Lesson</DialogTitle>
                <DialogDescription>
                  Plan your lesson with objectives, materials, and scheduling details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      placeholder="Enter lesson title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select 
                      value={newLesson.classId} 
                      onValueChange={(value) => setNewLesson({ ...newLesson, classId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(classes) && classes.map((cls: any) => (
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
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                    placeholder="Brief description of the lesson"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Learning Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={newLesson.objectives}
                    onChange={(e) => setNewLesson({ ...newLesson, objectives: e.target.value })}
                    placeholder="What will students learn from this lesson?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materials">Required Materials</Label>
                  <Textarea
                    id="materials"
                    value={newLesson.materials}
                    onChange={(e) => setNewLesson({ ...newLesson, materials: e.target.value })}
                    placeholder="List materials needed for the lesson"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) })}
                      min={15}
                      max={180}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={newLesson.scheduledDate}
                      onChange={(e) => setNewLesson({ ...newLesson, scheduledDate: e.target.value })}
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
                  onClick={handleCreateLesson}
                  disabled={createLessonMutation.isPending}
                >
                  {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons?.map((lesson: any) => (
            <div key={lesson.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{lesson.title}</h3>
                    <Badge className={getStatusColor(lesson.status)}>
                      {lesson.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{lesson.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{lesson.className}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(lesson.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.duration} minutes</span>
                    </div>
                  </div>
                  {lesson.objectives && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-1">Learning Objectives:</h4>
                      <p className="text-sm text-muted-foreground">{lesson.objectives}</p>
                    </div>
                  )}
                  {lesson.materials && (
                    <div className="mt-2">
                      <h4 className="font-medium text-sm mb-1">Materials:</h4>
                      <p className="text-sm text-muted-foreground">{lesson.materials}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}