import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";

interface ClassManagementProps {
  classes: any[];
  filteredClasses: any[];
  onEditClass?: (classId: number) => void;
  onDeleteClass?: (classId: number) => void;
}

export function ClassManagement({
  classes,
  filteredClasses,
  onEditClass,
  onDeleteClass
}: ClassManagementProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Classes</h3>
        <span className="text-sm text-muted-foreground">
          {filteredClasses.length} of {classes.length} classes
        </span>
      </div>

      <div className="grid gap-4">
        {filteredClasses.map((classItem) => {
          const startDateTime = formatDateTime(classItem.startDate, classItem.startTime);
          const endDateTime = formatDateTime(classItem.endDate, classItem.endTime);

          return (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{classItem.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{classItem.subject}</Badge>
                      <Badge className={getStatusColor(classItem.status)}>
                        {classItem.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {onEditClass && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditClass(classItem.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDeleteClass && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClass(classItem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {classItem.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {classItem.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{startDateTime.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{startDateTime.time} - {endDateTime.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.location || "Online"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.enrolled}/{classItem.studentLimit} students</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredClasses.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No classes found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}