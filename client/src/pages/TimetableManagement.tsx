import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, Filter, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';

interface TimetableEntry {
  id: string;
  subjectName: string;
  teacherName: string;
  teacherId: string;
  className: string;
  classId: string;
  room: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  duration: number;
  semester: string;
  academicYear: string;
  notes?: string;
  isActive: boolean;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  period: number;
}

const timetableEntrySchema = z.object({
  subjectName: z.string().min(1, 'Subject name is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  classId: z.string().min(1, 'Class is required'),
  room: z.string().min(1, 'Room is required'),
  dayOfWeek: z.string().min(1, 'Day of week is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  semester: z.string().min(1, 'Semester is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  notes: z.string().optional(),
});

const DAYS_OF_WEEK = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' }
];

const TIME_SLOTS = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' }
];

export default function TimetableManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  // Fetch timetable entries
  const { data: timetableEntries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['/api/timetable/entries', selectedSemester, selectedClass],
    retry: false,
  });

  // Fetch teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ['/api/users/teachers'],
    retry: false,
  });

  // Fetch classes
  const { data: classes = [] } = useQuery({
    queryKey: ['/api/classes'],
    retry: false,
  });

  // Form setup
  const form = useForm<z.infer<typeof timetableEntrySchema>>({
    resolver: zodResolver(timetableEntrySchema),
    defaultValues: {
      subjectName: '',
      teacherId: '',
      classId: '',
      room: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      semester: selectedSemester,
      academicYear: '2024-2025',
      notes: '',
    },
  });

  // Create mutation
  const createEntryMutation = useMutation({
    mutationFn: async (entryData: z.infer<typeof timetableEntrySchema>) => {
      return apiRequest("POST", "/api/timetable/entries", entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timetable/entries'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Timetable entry created successfully",
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
        description: "Failed to create timetable entry",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, ...entryData }: { id: string } & z.infer<typeof timetableEntrySchema>) => {
      return apiRequest("PUT", `/api/timetable/entries/${id}`, entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timetable/entries'] });
      setEditingEntry(null);
      form.reset();
      toast({
        title: "Success",
        description: "Timetable entry updated successfully",
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
        description: "Failed to update timetable entry",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/timetable/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timetable/entries'] });
      toast({
        title: "Success",
        description: "Timetable entry deleted successfully",
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
        description: "Failed to delete timetable entry",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof timetableEntrySchema>) => {
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, ...data });
    } else {
      createEntryMutation.mutate(data);
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    form.reset({
      subjectName: entry.subjectName,
      teacherId: entry.teacherId,
      classId: entry.classId,
      room: entry.room,
      dayOfWeek: entry.dayOfWeek.toString(),
      startTime: entry.startTime,
      endTime: entry.endTime,
      semester: entry.semester,
      academicYear: entry.academicYear,
      notes: entry.notes || '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      deleteEntryMutation.mutate(id);
    }
  };

  // Mock data for demonstration
  const mockEntries: TimetableEntry[] = [
    {
      id: '1',
      subjectName: 'Mathematics',
      teacherName: 'Dr. Sarah Johnson',
      teacherId: 'teacher1',
      className: 'Grade 10A',
      classId: 'class1',
      room: 'Room 101',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      notes: 'Algebra focus',
      isActive: true
    },
    {
      id: '2',
      subjectName: 'English Literature',
      teacherName: 'Ms. Emily Davis',
      teacherId: 'teacher2',
      className: 'Grade 10A',
      classId: 'class1',
      room: 'Room 205',
      dayOfWeek: 1,
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      isActive: true
    },
    {
      id: '3',
      subjectName: 'Science',
      teacherName: 'Mr. Robert Chen',
      teacherId: 'teacher3',
      className: 'Grade 10A',
      classId: 'class1',
      room: 'Lab 1',
      dayOfWeek: 2,
      startTime: '09:00',
      endTime: '10:30',
      duration: 90,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      notes: 'Chemistry lab session',
      isActive: true
    }
  ];

  const mockTeachers = [
    { id: 'teacher1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@school.edu' },
    { id: 'teacher2', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@school.edu' },
    { id: 'teacher3', firstName: 'Robert', lastName: 'Chen', email: 'robert.chen@school.edu' }
  ];

  const mockClasses = [
    { id: 'class1', name: 'Grade 10A', capacity: 30 },
    { id: 'class2', name: 'Grade 10B', capacity: 28 },
    { id: 'class3', name: 'Grade 11A', capacity: 25 }
  ];

  const displayEntries = timetableEntries.length > 0 ? timetableEntries : mockEntries;
  const displayTeachers = teachers.length > 0 ? teachers : mockTeachers;
  const displayClasses = classes.length > 0 ? classes : mockClasses;

  // Generate weekly timetable grid
  const generateWeeklyGrid = () => {
    const grid: { [key: string]: TimetableEntry[] } = {};
    
    // Initialize grid
    for (let day = 0; day < 7; day++) {
      for (let hour = 8; hour < 18; hour++) {
        const key = `${day}-${hour}`;
        grid[key] = [];
      }
    }

    // Fill grid with entries
    displayEntries.forEach(entry => {
      const startHour = parseInt(entry.startTime.split(':')[0]);
      const endHour = parseInt(entry.endTime.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        const key = `${entry.dayOfWeek}-${hour}`;
        if (grid[key]) {
          grid[key].push(entry);
        }
      }
    });

    return grid;
  };

  const weeklyGrid = generateWeeklyGrid();

  if (entriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Timetable Management</h1>
              <p className="text-gray-600 dark:text-gray-300">Digital lesson scheduling and management</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingEntry ? 'Edit' : 'Create'} Timetable Entry</DialogTitle>
                  <DialogDescription>
                    {editingEntry ? 'Update the timetable entry details' : 'Add a new lesson to the timetable'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="subjectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Mathematics" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teacherId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teacher</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select teacher" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {displayTeachers.map((teacher) => (
                                  <SelectItem key={teacher.id} value={teacher.id}>
                                    {teacher.firstName} {teacher.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="classId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {displayClasses.map((cls) => (
                                  <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="room"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Room 101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="dayOfWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day of Week</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DAYS_OF_WEEK.map((day) => (
                                  <SelectItem key={day.value} value={day.value}>
                                    {day.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Start time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_SLOTS.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="End time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_SLOTS.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="semester"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Semester</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Fall 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="academicYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2024-2025" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsCreateDialogOpen(false);
                        setEditingEntry(null);
                        form.reset();
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createEntryMutation.isPending || updateEntryMutation.isPending}>
                        {createEntryMutation.isPending || updateEntryMutation.isPending ? 'Saving...' : (editingEntry ? 'Update' : 'Create')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Semester</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                    <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {displayClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="grid" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-800">
            <TabsTrigger value="grid">Weekly Grid</TabsTrigger>
            <TabsTrigger value="list">Entry List</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-6">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Weekly Timetable</CardTitle>
                <CardDescription>Visual representation of the weekly schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-8 gap-2 min-w-[800px]">
                    {/* Header */}
                    <div className="font-medium text-center p-2">Time</div>
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="font-medium text-center p-2">
                        {day.label}
                      </div>
                    ))}

                    {/* Time slots */}
                    {Array.from({ length: 10 }, (_, index) => {
                      const hour = 8 + index;
                      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
                      
                      return (
                        <div key={hour} className="contents">
                          <div className="text-sm text-gray-500 text-center p-2 border-r">
                            {timeLabel}
                          </div>
                          {DAYS_OF_WEEK.map((day) => {
                            const key = `${day.value}-${hour}`;
                            const entries = weeklyGrid[key] || [];
                            
                            return (
                              <div key={`${day.value}-${hour}`} className="min-h-[60px] border border-gray-200 dark:border-slate-600 p-1">
                                {entries.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded text-xs mb-1 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                                    onClick={() => handleEdit(entry)}
                                  >
                                    <div className="font-medium truncate">{entry.subjectName}</div>
                                    <div className="truncate">{entry.teacherName}</div>
                                    <div className="truncate">{entry.room}</div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Timetable Entries</CardTitle>
                <CardDescription>List of all scheduled lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{entry.subjectName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {entry.teacherName}
                            </span>
                            <span>{entry.className}</span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {entry.room}
                            </span>
                            <span>{DAYS_OF_WEEK.find(d => d.value === entry.dayOfWeek.toString())?.label}</span>
                            <span>{entry.startTime} - {entry.endTime}</span>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={entry.isActive ? "default" : "secondary"}>
                          {entry.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleteEntryMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}