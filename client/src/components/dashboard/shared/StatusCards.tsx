import { useStatusCards } from "@/hooks/useStatusCards";
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

// Legacy exports - these are now moved to separate component files
export { AssignmentStatusCard } from './StatusCards/AssignmentStatusCard';
export { AttendanceStatusCard } from './StatusCards/AttendanceStatusCard';
export { GradeStatusCard } from './StatusCards/GradeStatusCard';
export { LibraryStatusCard } from './StatusCards/LibraryStatusCard';

// Aliases for backward compatibility
export { LibraryStatusCard as LibraryRecommendationsCard } from './StatusCards/LibraryStatusCard';

// Legacy placeholder exports - add to index file for proper exports
export { PerformanceStatusCard } from './StatusCards/PerformanceStatusCard';
export { ProgressStatusCard } from './StatusCards/ProgressStatusCard';

// TODO: create dedicated components for these
export function NextEventCard() {
  return <div>Next Event Card</div>;
}

export function NotificationsCard() {
  return <div>Notifications Card</div>;
}

export default function StatusCards() {
  const {
    activeCard,
    setActiveCard,
    assignments,
    notifications,
    events,
    resources,
    achievements,
    assignmentsLoading,
    notificationsLoading,
    eventsLoading,
    resourcesLoading,
    achievementsLoading,
    getAssignmentStatusColor,
    getPriorityColor,
    getNotificationTypeColor,
    unreadNotifications,
    pendingAssignments,
    overdueAssignments,
    upcomingEvents,
    recentAchievements,
    assignmentStats,
    notificationStats
  } = useStatusCards();

  const getResourceTypeIcon = (type: string) => {
    const icons = {
      document: FileText,
      video: 'Play',
      link: 'ExternalLink',
      book: BookOpen,
    };
    const IconComponent = icons[type as keyof typeof icons] || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  if (assignmentsLoading || notificationsLoading || eventsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Assignments Card */}
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          activeCard === 'assignments' ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setActiveCard(activeCard === 'assignments' ? null : 'assignments')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assignments</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{assignmentStats.total}</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {assignmentStats.pending} pending
                </div>
                {assignmentStats.overdue > 0 && (
                  <div className="text-sm text-red-600">
                    {assignmentStats.overdue} overdue
                  </div>
                )}
              </div>
            </div>
            
            <Progress value={assignmentStats.completionRate} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {assignmentStats.completionRate}% completion rate
            </p>

            {activeCard === 'assignments' && (
              <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
                {assignments.slice(0, 3).map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{assignment.title}</div>
                      <div className="text-xs text-gray-600">{assignment.subject}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getAssignmentStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </Badge>
                      <div className={`text-xs ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          activeCard === 'notifications' ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setActiveCard(activeCard === 'notifications' ? null : 'notifications')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <div className="relative">
            <Bell className="h-4 w-4 text-muted-foreground" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{notifications.length}</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {unreadNotifications.length} unread
                </div>
              </div>
            </div>

            {activeCard === 'notifications' && (
              <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
                {notifications.slice(0, 3).map(notification => (
                  <div key={notification.id} className="p-2 bg-gray-50 rounded">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{notification.title}</div>
                        <div className="text-xs text-gray-600 line-clamp-2">{notification.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                        </div>
                      </div>
                      <Badge className={`text-xs ml-2 ${getNotificationTypeColor(notification.type)}`}>
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events Card */}
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          activeCard === 'events' ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setActiveCard(activeCard === 'events' ? null : 'events')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{upcomingEvents.length}</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Next 7 days
                </div>
              </div>
            </div>

            {activeCard === 'events' && (
              <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="p-2 bg-gray-50 rounded">
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-xs text-gray-600">
                      {format(new Date(event.startDateTime), 'MMM d, h:mm a')}
                    </div>
                    {event.location && (
                      <div className="text-xs text-gray-500">{event.location}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Resources Card */}
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          activeCard === 'resources' ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setActiveCard(activeCard === 'resources' ? null : 'resources')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Resources</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{resources.length}</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Accessed today
                </div>
              </div>
            </div>

            {activeCard === 'resources' && (
              <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
                {resources.slice(0, 3).map(resource => (
                  <div key={resource.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    {getResourceTypeIcon(resource.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{resource.title}</div>
                      <div className="text-xs text-gray-600">{resource.subject}</div>
                    </div>
                    {resource.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{resource.rating}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements Card */}
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          activeCard === 'achievements' ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setActiveCard(activeCard === 'achievements' ? null : 'achievements')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{achievements.length}</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  This month
                </div>
              </div>
            </div>

            {activeCard === 'achievements' && (
              <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
                {recentAchievements.slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(achievement.earnedDate), 'MMM d')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">New Assignment</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Schedule Event</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Browse Library</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <User className="h-4 w-4" />
              <span className="text-xs">View Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}