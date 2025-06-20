import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Users, Calendar, TrendingUp, Eye } from "lucide-react";
import { Communication } from "./types";

interface CommunicationStatsProps {
  communications: Communication[];
}

export function CommunicationStats({ communications }: CommunicationStatsProps) {
  const stats = useMemo(() => {
    const total = communications.length;
    const drafts = communications.filter(c => c.status === 'draft').length;
    const scheduled = communications.filter(c => c.status === 'scheduled').length;
    const sent = communications.filter(c => c.status === 'sent').length;
    const archived = communications.filter(c => c.status === 'archived').length;

    const totalReach = communications
      .filter(c => c.totalRecipients)
      .reduce((sum, c) => sum + (c.totalRecipients || 0), 0);

    const totalReads = communications
      .filter(c => c.readCount)
      .reduce((sum, c) => sum + (c.readCount || 0), 0);

    const readRate = totalReach > 0 ? Math.round((totalReads / totalReach) * 100) : 0;

    const thisWeek = communications.filter(c => {
      const createdDate = new Date(c.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length;

    return {
      total,
      drafts,
      scheduled,
      sent,
      archived,
      totalReach,
      totalReads,
      readRate,
      thisWeek
    };
  }, [communications]);

  const statCards = [
    {
      title: "Total Communications",
      value: stats.total,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Sent This Week",
      value: stats.thisWeek,
      icon: Send,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Reach",
      value: stats.totalReach.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Read Rate",
      value: `${stats.readRate}%`,
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Communication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
              <Badge variant="secondary" className="mt-1">Draft</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
              <Badge className="mt-1 bg-blue-100 text-blue-800">Scheduled</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
              <Badge className="mt-1 bg-green-100 text-green-800">Sent</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.archived}</div>
              <Badge className="mt-1 bg-orange-100 text-orange-800">Archived</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      {stats.totalReach > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Recipients Reached</span>
                <span className="text-lg font-bold">{stats.totalReach.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Reads</span>
                <span className="text-lg font-bold">{stats.totalReads.toLocaleString()}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Overall Read Rate</span>
                  <span className="text-lg font-bold text-green-600">{stats.readRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.readRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}