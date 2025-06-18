import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Calendar, Grid, List, Users, BookOpen } from "lucide-react";

interface ScheduleFiltersProps {
  selectedClass: string;
  onClassChange: (value: string) => void;
  selectedTeacher: string;
  onTeacherChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedWeek: string;
  onWeekChange: (value: string) => void;
  viewMode: 'week' | 'day';
  onViewModeChange: (value: 'week' | 'day') => void;
  classes: any[];
  teachers: any[];
}

export function ScheduleFilters({
  selectedClass,
  onClassChange,
  selectedTeacher,
  onTeacherChange,
  selectedSubject,
  onSubjectChange,
  selectedWeek,
  onWeekChange,
  viewMode,
  onViewModeChange,
  classes,
  teachers
}: ScheduleFiltersProps) {
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'English', 'History', 'Geography', 'Computer Science',
    'Physical Education', 'Art', 'Music'
  ];

  const weeks = [
    { value: 'current', label: 'Current Week' },
    { value: 'next', label: 'Next Week' },
    { value: 'week-1', label: 'Week 1' },
    { value: 'week-2', label: 'Week 2' },
    { value: 'week-3', label: 'Week 3' },
    { value: 'week-4', label: 'Week 4' },
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedClass !== 'all') count++;
    if (selectedTeacher !== 'all') count++;
    if (selectedSubject !== 'all') count++;
    return count;
  };

  const clearAllFilters = () => {
    onClassChange('all');
    onTeacherChange('all');
    onSubjectChange('all');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Schedule Filters
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Select value={selectedClass} onValueChange={onClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="All classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name} - {cls.grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Teacher</label>
            <Select value={selectedTeacher} onValueChange={onTeacherChange}>
              <SelectTrigger>
                <SelectValue placeholder="All teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select value={selectedSubject} onValueChange={onSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Week</label>
            <Select value={selectedWeek} onValueChange={onWeekChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                {weeks.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("week")}
            >
              <Grid className="h-4 w-4 mr-2" />
              Week
            </Button>
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("day")}
            >
              <List className="h-4 w-4 mr-2" />
              Day
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm font-medium">Active filters:</span>
            {selectedClass !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Class: {classes.find(c => c.id.toString() === selectedClass)?.name}
              </Badge>
            )}
            {selectedTeacher !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Teacher: {teachers.find(t => t.id === selectedTeacher)?.firstName}
              </Badge>
            )}
            {selectedSubject !== 'all' && (
              <Badge variant="outline">
                Subject: {selectedSubject}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}