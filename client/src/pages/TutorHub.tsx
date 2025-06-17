import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  BookOpen,
  Plus,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function TutorHub() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ['/api/schedules'],
    retry: false,
  });

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/students'],
    retry: false,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: any) => {
      await apiRequest("POST", "/api/schedules", scheduleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: "Success",
        description: "Class scheduled successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to schedule class",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const upcomingClasses = schedules?.filter((schedule: any) => 
    new Date(schedule.startTime) > new Date()
  ).slice(0, 5) || [];

  const totalStudents = students?.length || 0;
  const completedClasses = schedules?.filter((schedule: any) => 
    schedule.status === 'completed'
  ).length || 0;

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tutor Hub</h1>
          <p className="text-gray-600 mt-1">
            Personalized workspace for tutors: schedule classes, track learner progress, and share resources
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              createScheduleMutation.mutate({
                title: formData.get('title'),
                description: formData.get('description'),
                type: 'class',
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                location: formData.get('location'),
              });
            }} className="space-y-4">
              <div>
                <Label htmlFor="title">Class Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" name="startTime" type="datetime-local" required />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" name="endTime" type="datetime-local" required />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Room 101 or Online" />
              </div>
              <Button type="submit" disabled={createScheduleMutation.isPending}>
                {createScheduleMutation.isPending ? "Scheduling..." : "Schedule Class"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <Users className="text-primary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">Active learners</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Classes</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingClasses.length}</p>
              </div>
              <div className="bg-secondary-50 p-3 rounded-lg">
                <Calendar className="text-secondary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500 font-medium">This week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Classes</p>
                <p className="text-2xl font-bold text-gray-900">{completedClasses}</p>
              </div>
              <div className="bg-accent-50 p-3 rounded-lg">
                <CheckCircle className="text-accent-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">This month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <TrendingUp className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">Student feedback</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Classes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  {schedulesLoading ? (
                    <div>Loading schedule...</div>
                  ) : upcomingClasses.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingClasses.map((schedule: any) => (
                        <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary-50 p-2 rounded-lg">
                              <Clock className="text-primary-600 h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{schedule.title}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(schedule.startTime).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                Duration: {Math.round((new Date(schedule.endTime).getTime() - new Date(schedule.startTime).getTime()) / (1000 * 60))} minutes
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{schedule.status}</Badge>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming classes</h3>
                      <p>Schedule your first class to get started.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start h-auto p-3">
                      <div className="bg-primary-50 p-2 rounded-lg mr-3">
                        <Plus className="text-primary-600 h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">Schedule Class</div>
                        <div className="text-xs text-gray-500">Create new session</div>
                      </div>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start h-auto p-3">
                      <div className="bg-accent-50 p-2 rounded-lg mr-3">
                        <BookOpen className="text-accent-600 h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">Create Resource</div>
                        <div className="text-xs text-gray-500">Add learning material</div>
                      </div>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start h-auto p-3">
                      <div className="bg-secondary-50 p-2 rounded-lg mr-3">
                        <TrendingUp className="text-secondary-600 h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">View Analytics</div>
                        <div className="text-xs text-gray-500">Student performance</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div>Loading students...</div>
              ) : students && students.length > 0 ? (
                <div className="space-y-4">
                  {students.slice(0, 10).map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-50 p-2 rounded-lg">
                          <GraduationCap className="text-primary-600 h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Student ID: {student.studentId}</p>
                          <p className="text-sm text-gray-500">
                            Grade: {student.grade} | Progress: 85%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students enrolled</h3>
                  <p>Students will appear here once they enroll in your classes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">92%</div>
                    <div className="text-sm text-gray-600">Assignment Completion</div>
                    <Progress value={92} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">87%</div>
                    <div className="text-sm text-gray-600">Class Attendance</div>
                    <Progress value={87} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">4.6</div>
                    <div className="text-sm text-gray-600">Average Grade</div>
                    <Progress value={76} className="mt-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Teaching Resources</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
                <p>Create and share learning materials with your students.</p>
                <Button className="mt-4">
                  Create First Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
