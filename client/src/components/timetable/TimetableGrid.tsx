import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

interface TimetableGridProps {
  displayEntries: TimetableEntry[];
  onEntryClick: (entry: TimetableEntry) => void;
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

export function TimetableGrid({ displayEntries, onEntryClick }: TimetableGridProps) {
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

  return (
    <Card className="bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
        <CardDescription>Visual calendar view of all scheduled lessons</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-1 min-w-[800px]">
            {/* Header row */}
            <div className="p-2 font-medium text-center border-b">Time</div>
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.value} className="p-2 font-medium text-center border-b">
                {day.label}
              </div>
            ))}
            
            {/* Time slots */}
            {Array.from({ length: 10 }, (_, hourIndex) => {
              const hour = hourIndex + 8;
              const timeDisplay = `${hour.toString().padStart(2, '0')}:00`;
              
              return (
                <div key={hour} className="contents">
                  <div className="p-2 text-sm font-medium bg-gray-50 dark:bg-slate-700 border-r">
                    {timeDisplay}
                  </div>
                  {DAYS_OF_WEEK.map((day) => {
                    const entries = weeklyGrid[`${day.value}-${hour}`] || [];
                    
                    return (
                      <div key={`${day.value}-${hour}`} className="min-h-[60px] border border-gray-200 dark:border-slate-600 p-1">
                        {entries.map((entry) => (
                          <div
                            key={entry.id}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded text-xs mb-1 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                            onClick={() => onEntryClick(entry)}
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
  );
}