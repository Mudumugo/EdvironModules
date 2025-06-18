import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  GraduationCap, 
  Calendar, 
  MessageSquare, 
  Bell, 
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Mail
} from "lucide-react";

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  gradeLevel: string;
  profileImageUrl?: string;
}

interface ParentChildRelationship {
  id: number;
  parentUserId: string;
  childUserId: string;
  relationship: string;
  isPrimary: boolean;
  canViewGrades: boolean;
  canViewAttendance: boolean;
  canReceiveNotifications: boolean;
  child: Child;
}

export default function ParentPortal() {
  const { data: children = [], isLoading } = useQuery<ParentChildRelationship[]>({
    queryKey: ['/api/parent/children'],
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['/api/parent/announcements'],
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/parent/messages'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Portal</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay connected with your children's education
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Bell className="w-4 h-4" />
          View All Notifications
        </Button>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((relationship) => (
          <Card key={relationship.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={relationship.child.profileImageUrl} />
                  <AvatarFallback>
                    {relationship.child.firstName[0]}{relationship.child.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {relationship.child.firstName} {relationship.child.lastName}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    {relationship.child.gradeLevel || 'Grade 5'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Relationship:</span>
                <Badge variant={relationship.isPrimary ? "default" : "secondary"}>
                  {relationship.relationship}
                  {relationship.isPrimary && " (Primary)"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <ClipboardCheck className="w-3 h-3" />
                  <span className={relationship.canViewGrades ? "text-green-600" : "text-gray-400"}>
                    Grades
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className={relationship.canViewAttendance ? "text-green-600" : "text-gray-400"}>
                    Attendance
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <TrendingUp className="w-4 h-4" />
                  View Progress
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message Teachers
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Academic Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {children.map((relationship) => (
                  <div key={relationship.id} className="flex items-center justify-between">
                    <span className="text-sm">{relationship.child.firstName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">A-</Badge>
                      <span className="text-xs text-gray-500">Overall</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Math assignment submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Present in Science class</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Library book due soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <div className="font-medium">Parent-Teacher Conference</div>
                    <div className="text-gray-500">Tomorrow, 3:00 PM</div>
                  </div>
                  <div className="border-l-2 border-green-500 pl-3">
                    <div className="font-medium">Science Fair</div>
                    <div className="text-gray-500">Next Friday</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                School Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-medium">Important: Early Dismissal Friday</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    School will dismiss at 1:00 PM this Friday for teacher professional development.
                  </div>
                  <div className="text-xs text-gray-500 mt-2">2 hours ago</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="font-medium">Spring Concert - Save the Date</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Join us for our annual Spring Concert on March 15th at 7:00 PM in the school auditorium.
                  </div>
                  <div className="text-xs text-gray-500 mt-2">1 day ago</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="font-medium">Cafeteria Menu Updates</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    New healthy meal options available starting next Monday.
                  </div>
                  <div className="text-xs text-gray-500 mt-2">3 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Teacher Communications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Ms. Johnson - Math Teacher</div>
                    <div className="text-xs text-gray-500">Today, 10:30 AM</div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Alice is doing excellent work in algebra. She's showing great improvement in problem-solving skills.
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Reply
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Mr. Davis - Science Teacher</div>
                    <div className="text-xs text-gray-500">Yesterday, 2:15 PM</div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Reminder: Science project is due next Friday. Bob has chosen an interesting topic about renewable energy.
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learning Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {children.map((relationship) => (
                <div key={relationship.id} className="border rounded-lg p-4">
                  <div className="font-medium mb-3">
                    {relationship.child.firstName} {relationship.child.lastName}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Reading Progress</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Math Assignments</span>
                      <Badge variant="secondary">8/10 Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Library Books</span>
                      <Badge variant="outline">2 Currently Reading</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}