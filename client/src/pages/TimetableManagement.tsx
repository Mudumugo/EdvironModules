import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  TimetableHeader, 
  TimetableForm, 
  TimetableGrid, 
  TimetableList, 
  useTimetableMutations, 
  timetableEntrySchema 
} from '@/components/timetable';

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

export default function TimetableManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [activeTab, setActiveTab] = useState('grid');

  // Fetch timetable entries
  const { data: timetableEntries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['/api/timetable/entries'],
    retry: false,
  });

  // Fetch teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ['/api/teachers'],
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

  // Mutations
  const { createEntryMutation, updateEntryMutation, deleteEntryMutation } = useTimetableMutations(
    setIsCreateDialogOpen,
    setEditingEntry,
    form
  );

  // Mock data for demo purposes
  const mockEntries = [
    {
      id: 'mock1',
      subjectName: 'Mathematics',
      teacherName: 'Sarah Johnson',
      teacherId: 'teacher1',
      className: 'Grade 10A',
      classId: 'class1',
      room: 'Room 101',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '09:30',
      duration: 90,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      notes: 'Algebra and geometry concepts',
      isActive: true
    },
    {
      id: 'mock2',
      subjectName: 'Physics',
      teacherName: 'Robert Chen',
      teacherId: 'teacher3',
      className: 'Grade 11A',
      classId: 'class3',
      room: 'Lab 201',
      dayOfWeek: 2,
      startTime: '10:00',
      endTime: '11:30',
      duration: 90,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      notes: 'Mechanics and thermodynamics',
      isActive: true
    },
    {
      id: 'mock3',
      subjectName: 'Chemistry',
      teacherName: 'Emily Davis',
      teacherId: 'teacher2',
      className: 'Grade 10B',
      classId: 'class2',
      room: 'Lab 102',
      dayOfWeek: 3,
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

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof timetableEntrySchema>) => {
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, ...data });
    } else {
      createEntryMutation.mutate(data);
    }
  };

  // Handle edit
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

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      deleteEntryMutation.mutate(id);
    }
  };

  // Update form semester when selected semester changes
  useEffect(() => {
    form.setValue('semester', selectedSemester);
  }, [selectedSemester, form]);

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
        <TimetableHeader
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        >
          <TimetableForm
            form={form}
            editingEntry={editingEntry}
            displayTeachers={displayTeachers}
            displayClasses={displayClasses}
            onSubmit={handleSubmit}
            isLoading={createEntryMutation.isPending || updateEntryMutation.isPending}
          />
        </TimetableHeader>

        {/* Filters */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                <SelectItem value="Summer 2025">Summer 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-6">
            <TimetableGrid displayEntries={displayEntries} onEntryClick={handleEdit} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <TimetableList
              displayEntries={displayEntries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deleteEntryMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}