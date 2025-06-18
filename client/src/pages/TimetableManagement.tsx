import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  // Queries
  const { data: timetableEntries = [], isLoading: isLoadingEntries } = useQuery({
    queryKey: ['/api/timetable/entries'],
    retry: false,
  });

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ['/api/staff/teachers'],
    retry: false,
  });

  const { data: classes = [], isLoading: isLoadingClasses } = useQuery({
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
      semester: '',
      academicYear: '',
      notes: '',
    },
  });

  // Mutations
  const { createEntryMutation, updateEntryMutation, deleteEntryMutation } = useTimetableMutations(
    setIsCreateDialogOpen,
    setEditingEntry,
    form
  );

  // Transform data for display
  const displayEntries: TimetableEntry[] = Array.isArray(timetableEntries) ? timetableEntries : [];
  const displayTeachers = Array.isArray(teachers) ? teachers : [];
  const displayClasses = Array.isArray(classes) ? classes : [];

  // Handle entry edit with form reset
  const handleEditEntry = (entry: TimetableEntry) => {
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

  // Handle form submission
  const onSubmit = (data: z.infer<typeof timetableEntrySchema>) => {
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, ...data });
    } else {
      createEntryMutation.mutate(data);
    }
  };

  const isLoading = isLoadingEntries || isLoadingTeachers || isLoadingClasses;
  const isMutating = createEntryMutation.isPending || updateEntryMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
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
            onSubmit={onSubmit}
            isLoading={isMutating}
          />
        </TimetableHeader>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            <TimetableGrid
              displayEntries={displayEntries}
              onEntryClick={handleEditEntry}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <TimetableList
              displayEntries={displayEntries}
              onEdit={handleEditEntry}
              onDelete={(id) => deleteEntryMutation.mutate(id)}
              isDeleting={deleteEntryMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}