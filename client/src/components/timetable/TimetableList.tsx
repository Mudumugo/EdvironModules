import { Clock, Users, MapPin, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface TimetableListProps {
  displayEntries: TimetableEntry[];
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const DAYS_OF_WEEK = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' }
];

export function TimetableList({ displayEntries, onEdit, onDelete, isDeleting }: TimetableListProps) {
  return (
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
                  onClick={() => onEdit(entry)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(entry.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}