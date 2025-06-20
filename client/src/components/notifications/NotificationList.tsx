import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Megaphone,
  Clock,
  ExternalLink,
  Archive,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Notification, NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES, NOTIFICATION_CATEGORIES } from "./types";

interface NotificationListProps {
  notifications: Notification[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onMarkAsRead: (notificationIds: string[]) => void;
  onArchive: (notificationIds: string[]) => void;
  onDelete: (notificationIds: string[]) => void;
  onNotificationClick: (notification: Notification) => void;
}

export function NotificationList({
  notifications,
  selectedIds,
  onSelectionChange,
  onMarkAsRead,
  onArchive,
  onDelete,
  onNotificationClick
}: NotificationListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return Info;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'announcement': return Megaphone;
      default: return Info;
    }
  };

  const getTypeInfo = (type: string) => {
    return NOTIFICATION_TYPES.find(t => t.value === type) || NOTIFICATION_TYPES[0];
  };

  const getPriorityInfo = (priority: string) => {
    return NOTIFICATION_PRIORITIES.find(p => p.value === priority) || NOTIFICATION_PRIORITIES[0];
  };

  const getCategoryInfo = (category: string) => {
    return NOTIFICATION_CATEGORIES.find(c => c.value === category) || NOTIFICATION_CATEGORIES[0];
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(notifications.map(n => n.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectNotification = (notificationId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, notificationId]);
    } else {
      onSelectionChange(selectedIds.filter(id => id !== notificationId));
    }
  };

  const isAllSelected = notifications.length > 0 && selectedIds.length === notifications.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < notifications.length;

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up! No new notifications to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notifications ({notifications.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isPartiallySelected;
              }}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select all'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.map((notification) => {
            const TypeIcon = getTypeIcon(notification.type);
            const typeInfo = getTypeInfo(notification.type);
            const priorityInfo = getPriorityInfo(notification.priority);
            const categoryInfo = getCategoryInfo(notification.category);
            const isSelected = selectedIds.includes(notification.id);
            const isExpired = notification.expiresAt && new Date(notification.expiresAt) < new Date();

            return (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                  isSelected ? 'bg-blue-50 border-blue-200' : 
                  !notification.isRead ? 'bg-gray-50 border-l-4 border-l-blue-500' : 
                  'hover:bg-gray-50'
                } ${isExpired ? 'opacity-60' : ''}`}
                onClick={() => onNotificationClick(notification)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    checked && handleSelectNotification(notification.id, checked as boolean);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${typeInfo.color}-100 flex items-center justify-center`}>
                  <TypeIcon className={`h-4 w-4 text-${typeInfo.color}-600`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={`bg-${priorityInfo.color}-100 text-${priorityInfo.color}-700`}>
                        {priorityInfo.label}
                      </Badge>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <Badge variant="outline" className="text-xs">
                        {categoryInfo.label}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(notification.timestamp)}
                      </div>
                      {notification.senderName && (
                        <span>From: {notification.senderName}</span>
                      )}
                      {isExpired && (
                        <Badge variant="outline" className="text-red-600">
                          Expired
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {notification.actionRequired && (
                        <Badge variant="default" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                      
                      {notification.actionUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(notification.actionUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {notification.actionText || 'View'}
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.isRead && (
                            <DropdownMenuItem onClick={() => onMarkAsRead([notification.id])}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onArchive([notification.id])}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete([notification.id])}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {notification.attachments && notification.attachments.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {notification.attachments.length} attachment{notification.attachments.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}