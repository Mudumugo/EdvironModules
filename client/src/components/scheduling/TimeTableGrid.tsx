import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";

interface TimetableEntry {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  color?: string;
  type?: string;
}

interface TimeTableGridProps {
  entries: TimetableEntry[];
  onEditEntry?: (entryId: number) => void;
  onDeleteEntry?: (entryId: number) => void;
  viewMode: 'week' | 'day';
}

export function TimeTableGrid({ entries, onEditEntry, onDeleteEntry, viewMode }: TimeTableGridProps) {
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getEntryForSlot = (day: string, time: string) => {
    return entries.find(entry => 
      entry.dayOfWeek === day && 
      entry.startTime <= time && 
      entry.endTime > time
    );
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Physics': 'bg-purple-100 text-purple-800 border-purple-200',
      'Chemistry': 'bg-green-100 text-green-800 border-green-200',
      'Biology': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'English': 'bg-orange-100 text-orange-800 border-orange-200',
      'History': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Geography': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (viewMode === 'day') {
    return (
      <div className="space-y-4">
        {timeSlots.map((time, index) => {
          const nextTime = timeSlots[index + 1] || "18:00";
          const dayEntries = daysOfWeek.map(day => getEntryForSlot(day, time)).filter(Boolean);
          
          return (
            <div key={time} className="grid grid-cols-6 gap-4 min-h-[100px]">
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
                <div className="font-semibold text-lg">{formatTime(time)}</div>
                <div className="text-sm text-muted-foreground">-</div>
                <div className="text-sm text-muted-foreground">{formatTime(nextTime)}</div>
              </div>
              
              {daysOfWeek.map(day => {
                const entry = getEntryForSlot(day, time);
                
                return (
                  <div key={`${day}-${time}`} className="min-h-[100px]">
                    {entry ? (
                      <Card className={`h-full ${getSubjectColor(entry.subject)} border-l-4`}>
                        <CardContent className="p-3 h-full flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{entry.title}</h4>
                            <p className="text-xs opacity-80">{entry.subject}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                              <Users className="h-3 w-3" />
                              <span>{entry.teacher}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-70">
                              <MapPin className="h-3 w-3" />
                              <span>{entry.room}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 mt-2">
                            {onEditEntry && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => onEditEntry(entry.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            {onDeleteEntry && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => onDeleteEntry(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        <span className="text-xs">Free</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-6 gap-2 min-w-[800px]">
        {/* Header */}
        <div className="p-3 text-center font-semibold bg-gray-50 rounded-lg">
          Time
        </div>
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center font-semibold bg-gray-50 rounded-lg">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {timeSlots.map((time, index) => {
          const nextTime = timeSlots[index + 1] || "18:00";
          
          return (
            <>
              <div key={`time-${time}`} className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg min-h-[120px]">
                <div className="font-semibold">{formatTime(time)}</div>
                <div className="text-xs text-muted-foreground">-</div>
                <div className="text-xs text-muted-foreground">{formatTime(nextTime)}</div>
              </div>
              
              {daysOfWeek.map(day => {
                const entry = getEntryForSlot(day, time);
                
                return (
                  <div key={`${day}-${time}`} className="min-h-[120px]">
                    {entry ? (
                      <Card className={`h-full ${getSubjectColor(entry.subject)} border-l-4`}>
                        <CardContent className="p-3 h-full flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{entry.title}</h4>
                            <p className="text-xs opacity-80 mb-1">{entry.subject}</p>
                            <div className="space-y-1 text-xs opacity-70">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{entry.teacher}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{entry.room}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(entry.startTime)}-{formatTime(entry.endTime)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 mt-2">
                            {onEditEntry && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => onEditEntry(entry.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            {onDeleteEntry && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => onDeleteEntry(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        <span className="text-xs">Free</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
}