import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  User
} from "lucide-react";

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  notes?: string;
}

interface AttendanceStatusCardProps {
  attendanceRecords: AttendanceRecord[];
  totalDays: number;
  loading?: boolean;
  onViewDetails?: () => void;
}

export function AttendanceStatusCard({ 
  attendanceRecords, 
  totalDays, 
  loading = false, 
  onViewDetails 
}: AttendanceStatusCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const excusedDays = attendanceRecords.filter(r => r.status === 'excused').length;
  
  const attendanceRate = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0;
  const punctualityRate = (presentDays + lateDays) > 0 ? Math.round((presentDays / (presentDays + lateDays)) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'excused':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-100 text-green-800">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case 'excused':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Excused</Badge>;
      default:
        return null;
    }
  };

  const recentRecords = attendanceRecords.slice(-5).reverse();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance
          </CardTitle>
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{attendanceRate}%</div>
            <div className="text-sm text-gray-500">Attendance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{punctualityRate}%</div>
            <div className="text-sm text-gray-500">Punctuality</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Days Present</span>
            <span>{presentDays + lateDays}/{totalDays}</span>
          </div>
          <Progress value={attendanceRate} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">{presentDays}</div>
            <div className="text-xs text-gray-500">Present</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">{lateDays}</div>
            <div className="text-xs text-gray-500">Late</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">{absentDays}</div>
            <div className="text-xs text-gray-500">Absent</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">{excusedDays}</div>
            <div className="text-xs text-gray-500">Excused</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Activity</h4>
          {recentRecords.length > 0 ? (
            recentRecords.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  {record.checkInTime && (
                    <span className="text-gray-500">@ {record.checkInTime}</span>
                  )}
                </div>
                {getStatusBadge(record.status)}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No attendance records</p>
            </div>
          )}
        </div>

        {attendanceRate < 90 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Attendance Alert</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Attendance rate is below 90%. Consider improving attendance for better academic performance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}