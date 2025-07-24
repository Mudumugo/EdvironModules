import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, getIsLoggingOut } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Bell, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star,
  ChevronRight,
  User,
  GraduationCap
} from "lucide-react";
import { format } from "date-fns";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  progress?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'assignment';
  timestamp: string;
  isRead: boolean;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  location?: string;
  type: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'book' | 'video' | 'article' | 'interactive';
  subject: string;
  rating: number;
  isNew: boolean;
  description?: string;
}

export function AssignmentStatusCard() {
  const { isAuthenticated } = useAuth();
  const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
    queryKey: ['/api/assignments/status'],
    enabled: isAuthenticated && !getIsLoggingOut(),
    retry: false,
  });

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const overdueAssignments = assignments.filter(a => a.status === 'overdue');
  const completedAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'graded');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'graded': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Status
          </div>
          <Badge variant={overdueAssignments.length > 0 ? "destructive" : "secondary"}>
            {pendingAssignments.length + overdueAssignments.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{completedAssignments.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{pendingAssignments.length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{overdueAssignments.length}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
        </div>

        {assignments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Assignments</h4>
            {assignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(assignment.priority)}
                  <div>
                    <div className="text-sm font-medium">{assignment.title}</div>
                    <div className="text-xs text-muted-foreground">{assignment.subject}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-xs ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Due {format(new Date(assignment.dueDate), 'MMM d')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full">
          View All Assignments
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function NotificationsCard() {
  const { isAuthenticated } = useAuth();
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    enabled: isAuthenticated,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No new notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 4).map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                  notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                }`}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full">
          View All Notifications
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function NextEventCard() {
  const { isAuthenticated } = useAuth();
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/calendar/upcoming'],
    enabled: isAuthenticated && !getIsLoggingOut(),
    retry: false,
  });

  const nextEvent = events[0];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Next Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nextEvent ? (
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">{nextEvent.title}</h4>
              {nextEvent.description && (
                <p className="text-sm text-muted-foreground">{nextEvent.description}</p>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(nextEvent.startDateTime), 'MMM d, yyyy • h:mm a')}</span>
              </div>
              
              {nextEvent.location && (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-muted-foreground">📍</div>
                  <span>{nextEvent.location}</span>
                </div>
              )}
            </div>

            <Badge variant="outline" className="text-xs">
              {nextEvent.type}
            </Badge>

            <Button variant="outline" size="sm" className="w-full">
              View Calendar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming events</p>
            <Button variant="outline" size="sm" className="mt-2">
              View Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LibraryRecommendationsCard() {
  const { isAuthenticated } = useAuth();
  const { data: recommendations = [], isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/library/recommendations'],
    enabled: isAuthenticated && !getIsLoggingOut(),
    retry: false,
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'video': return <div className="h-4 w-4 text-red-500">🎥</div>;
      case 'article': return <FileText className="h-4 w-4 text-green-500" />;
      case 'interactive': return <Star className="h-4 w-4 text-purple-500" />;
      default: return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Library Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Library Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recommendations available</p>
            <Button variant="outline" size="sm" className="mt-2">
              Browse Library
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((resource) => (
              <div key={resource.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium truncate">{resource.title}</h4>
                    {resource.isNew && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.subject}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(resource.rating)}
                    <span className="text-xs text-muted-foreground ml-1">({resource.rating})</span>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm" className="w-full">
              Browse Library
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}