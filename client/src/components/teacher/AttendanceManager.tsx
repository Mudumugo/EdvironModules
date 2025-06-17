import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, X, Clock, Calendar as CalendarIcon, Users, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AttendanceManager() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['/api/teacher/attendance', selectedClass, selectedDate],
    enabled: !!selectedClass
  });

  const { data: classes } = useQuery({
    queryKey: ['/api/teacher/classes']
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ studentId, status }: { studentId: string; status: string }) => {
      return await apiRequest("POST", "/api/teacher/attendance", {
        studentId,
        status,
        date: selectedDate.toISOString(),
        classId: selectedClass
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/attendance'] });
      toast({
        title: "Attendance Updated",
        description: "Student attendance has been recorded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAttendanceUpdate = (studentId: string, status: string) => {
    updateAttendanceMutation.mutate({ studentId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'late': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      case 'excused': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return Check;
      case 'late': return Clock;
      case 'absent': return X;
      default: return Clock;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Attendance Manager</CardTitle>
            <CardDescription>Track and manage student attendance</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
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
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {selectedClass && (
          <div className="space-y-4">
            {attendanceLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Attendance for {format(selectedDate, "MMMM d, yyyy")}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{attendanceData?.length || 0} students</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  {attendanceData?.map((student: any) => {
                    const StatusIcon = getStatusIcon(student.attendanceStatus);
                    
                    return (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="font-medium text-sm">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.studentId} • {student.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(student.attendanceStatus)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {student.attendanceStatus}
                          </Badge>
                          
                          <div className="flex gap-1">
                            <Button
                              variant={student.attendanceStatus === 'present' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleAttendanceUpdate(student.id, 'present')}
                              disabled={updateAttendanceMutation.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={student.attendanceStatus === 'late' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleAttendanceUpdate(student.id, 'late')}
                              disabled={updateAttendanceMutation.isPending}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={student.attendanceStatus === 'absent' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleAttendanceUpdate(student.id, 'absent')}
                              disabled={updateAttendanceMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Array.isArray(attendanceData?.students) && attendanceData.students.length > 0 && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Attendance Summary</h4>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Present</div>
                        <div className="font-medium text-green-600">
                          {Array.isArray(attendanceData?.students) ? attendanceData.students.filter((s: any) => s.attendanceStatus === 'present').length : 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Late</div>
                        <div className="font-medium text-yellow-600">
                          {attendanceData?.filter((s: any) => s.attendanceStatus === 'late').length || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Absent</div>
                        <div className="font-medium text-red-600">
                          {attendanceData?.filter((s: any) => s.attendanceStatus === 'absent').length || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Rate</div>
                        <div className="font-medium">
                          {Math.round(((attendanceData?.filter((s: any) => s.attendanceStatus === 'present').length || 0) / (attendanceData?.length || 1)) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!selectedClass && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a class to view and manage attendance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}