import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Calendar, Target, Phone } from "lucide-react";
import { Lead, Activity, LEAD_STATUSES } from "./types";

interface CRMStatsProps {
  leads: Lead[];
  activities: Activity[];
}

export function CRMStats({ leads, activities }: CRMStatsProps) {
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
    const closedWon = leads.filter(l => l.status === 'closed_won').length;
    const closedLost = leads.filter(l => l.status === 'closed_lost').length;
    
    const totalValue = leads
      .filter(l => l.estimatedValue && l.status !== 'closed_lost')
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    
    const wonValue = leads
      .filter(l => l.estimatedValue && l.status === 'closed_won')
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    
    const conversionRate = totalLeads > 0 ? Math.round((closedWon / totalLeads) * 100) : 0;
    
    const thisWeekActivities = activities.filter(a => {
      const activityDate = new Date(a.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    }).length;

    const upcomingFollowUps = leads.filter(l => {
      if (!l.nextFollowUp) return false;
      const followUpDate = new Date(l.nextFollowUp);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return followUpDate <= nextWeek && followUpDate >= new Date();
    }).length;

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      closedWon,
      closedLost,
      totalValue,
      wonValue,
      conversionRate,
      thisWeekActivities,
      upcomingFollowUps
    };
  }, [leads, activities]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pipeline Value",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "This Week Activities",
      value: stats.thisWeekActivities,
      icon: Phone,
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

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Sales Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LEAD_STATUSES.slice(0, 4).map((status) => {
              const count = leads.filter(l => l.status === status.value).length;
              return (
                <div key={status.value} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <Badge className={`mt-1 bg-${status.color}-100 text-${status.color}-800`}>
                    {status.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Won Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.closedWon}</div>
            <p className="text-sm text-gray-600">Value: {formatCurrency(stats.wonValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lost Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.closedLost}</div>
            <p className="text-sm text-gray-600">Win rate: {stats.conversionRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.upcomingFollowUps}</div>
            <p className="text-sm text-gray-600">Next 7 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}