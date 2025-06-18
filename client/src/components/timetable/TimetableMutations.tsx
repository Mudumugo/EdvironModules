import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import { z } from 'zod';

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

export { timetableEntrySchema };

export function useTimetableMutations(
  setIsCreateDialogOpen: (open: boolean) => void,
  setEditingEntry: (entry: any) => void,
  form: any
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUnauthorized = () => {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
  };

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
        handleUnauthorized();
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create timetable entry",
        variant: "destructive",
      });
    },
  });

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
        handleUnauthorized();
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update timetable entry",
        variant: "destructive",
      });
    },
  });

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
        handleUnauthorized();
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete timetable entry",
        variant: "destructive",
      });
    },
  });

  return {
    createEntryMutation,
    updateEntryMutation,
    deleteEntryMutation,
  };
}