import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock, Users, Calendar } from "lucide-react";

interface SessionStatsProps {
  sessions: any[];
}

export function SessionStats({ sessions }: SessionStatsProps) {
  const stats = {
    total: sessions.length,
    live: sessions.filter(s => s.status === 'live').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    ended: sessions.filter(s => s.status === 'ended').length,
    totalDuration: sessions.reduce((acc, s) => acc + (s.duration || 0), 0),
    totalParticipants: sessions.reduce((acc, s) => acc + (s.participants || 0), 0)
  };

  const statCards = [
    {
      title: "Total Sessions",
      value: stats.total,
      icon: Video,
      color: "text-blue-600"
    },
    {
      title: "Live Now",
      value: stats.live,
      icon: Users,
      color: "text-red-600"
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Total Hours",
      value: Math.round(stats.totalDuration / 60),
      icon: Clock,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}