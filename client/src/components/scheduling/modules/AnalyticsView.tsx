import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, CalendarDays } from "lucide-react";

interface AnalyticsViewProps {
  eventTypeCounts: {
    class: number;
    meeting: number;
    event: number;
    exam: number;
  };
}

export function AnalyticsView({ eventTypeCounts }: AnalyticsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Event Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Event Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(eventTypeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    type === 'class' ? 'bg-blue-500' :
                    type === 'meeting' ? 'bg-green-500' :
                    type === 'event' ? 'bg-purple-500' :
                    'bg-red-500'
                  }`} />
                  <span className="capitalize">{type}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Weekly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Classes</span>
              <span className="text-sm text-gray-600">{eventTypeCounts.class}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Meetings</span>
              <span className="text-sm text-gray-600">{eventTypeCounts.meeting}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Events</span>
              <span className="text-sm text-gray-600">{eventTypeCounts.event}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exams</span>
              <span className="text-sm text-gray-600">{eventTypeCounts.exam}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}