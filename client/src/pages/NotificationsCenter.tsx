import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { NotificationList } from "@/components/notifications/NotificationList";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationStats } from "@/components/notifications/NotificationStats";
import { BulkActions } from "@/components/notifications/BulkActions";
import { Notification, NotificationFilter, NotificationStats as StatsType } from "@/components/notifications/types";

export default function NotificationsCenter() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<NotificationFilter>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['/api/notifications'],
  });

  const { data: statsData } = useQuery({
    queryKey: ['/api/notifications/stats'],
  });

  // Mutations
  const updateNotificationsMutation = useMutation({
    mutationFn: async (action: { type: string; notificationIds: string[]; data?: any }) => {
      return apiRequest('/api/notifications/bulk-action', {
        method: 'POST',
        body: action
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/stats'] });
      setSelectedIds([]);
    },
    onError: () => {
      toast({ title: "Action failed", variant: "destructive" });
    }
  });

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (!notificationsData?.notifications) return [];

    let filtered = notificationsData.notifications as Notification[];

    // Apply tab filter
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead);
        break;
      case 'urgent':
        filtered = filtered.filter(n => n.priority === 'urgent');
        break;
      case 'archived':
        filtered = filtered.filter(n => n.isArchived);
        break;
      case 'all':
      default:
        filtered = filtered.filter(n => !n.isArchived);
        break;
    }

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }
    if (filters.priority) {
      filtered = filtered.filter(n => n.priority === filters.priority);
    }
    if (filters.category) {
      filtered = filtered.filter(n => n.category === filters.category);
    }
    if (filters.isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === filters.isRead);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term) ||
        (n.senderName && n.senderName.toLowerCase().includes(term))
      );
    }
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(n => {
        const date = new Date(n.timestamp);
        return date >= start && date <= end;
      });
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notificationsData?.notifications, activeTab, filters]);

  // Generate stats
  const stats: StatsType = useMemo(() => {
    if (!notificationsData?.notifications) {
      return {
        total: 0,
        unread: 0,
        urgent: 0,
        archived: 0,
        byCategory: {},
        byType: {}
      };
    }

    const notifications = notificationsData.notifications as Notification[];
    const byCategory: { [key: string]: number } = {};
    const byType: { [key: string]: number } = {};

    notifications.forEach(n => {
      byCategory[n.category] = (byCategory[n.category] || 0) + 1;
      byType[n.type] = (byType[n.type] || 0) + 1;
    });

    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
      archived: notifications.filter(n => n.isArchived).length,
      byCategory,
      byType
    };
  }, [notificationsData?.notifications]);

  // Handlers
  const handleMarkAsRead = (notificationIds: string[]) => {
    updateNotificationsMutation.mutate({ type: 'mark-read', notificationIds });
    toast({ title: "Marked as read" });
  };

  const handleMarkAsUnread = (notificationIds: string[]) => {
    updateNotificationsMutation.mutate({ type: 'mark-unread', notificationIds });
    toast({ title: "Marked as unread" });
  };

  const handleArchive = (notificationIds: string[]) => {
    updateNotificationsMutation.mutate({ type: 'archive', notificationIds });
    toast({ title: "Archived notifications" });
  };

  const handleDelete = (notificationIds: string[]) => {
    updateNotificationsMutation.mutate({ type: 'delete', notificationIds });
    toast({ title: "Deleted notifications" });
  };

  const handleExport = () => {
    // Implementation for export functionality
    toast({ title: "Export feature coming soon" });
  };

  const handleForward = () => {
    // Implementation for forward functionality
    toast({ title: "Forward feature coming soon" });
  };

  const handleFlag = () => {
    updateNotificationsMutation.mutate({ type: 'flag', notificationIds: selectedIds });
    toast({ title: "Flagged notifications" });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead([notification.id]);
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important information and announcements
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <NotificationStats stats={stats} />
          <NotificationFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          <BulkActions
            selectedCount={selectedIds.length}
            onMarkAsRead={() => handleMarkAsRead(selectedIds)}
            onMarkAsUnread={() => handleMarkAsUnread(selectedIds)}
            onArchive={() => handleArchive(selectedIds)}
            onDelete={() => handleDelete(selectedIds)}
            onExport={handleExport}
            onForward={handleForward}
            onFlag={handleFlag}
            isLoading={updateNotificationsMutation.isPending}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                All ({stats.total - stats.archived})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({stats.unread})
              </TabsTrigger>
              <TabsTrigger value="urgent">
                Urgent ({stats.urgent})
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived ({stats.archived})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <NotificationList
                notifications={filteredNotifications}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onMarkAsRead={handleMarkAsRead}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onNotificationClick={handleNotificationClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}