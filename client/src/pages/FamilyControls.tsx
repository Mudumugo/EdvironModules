import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO, subDays, subWeeks } from "date-fns";
import { 
  Shield,
  Users,
  Clock,
  Eye,
  EyeOff,
  Calendar,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  User,
  Plus,
  Settings,
  Bell,
  Lock,
  Unlock,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Home,
  School,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  MessageSquare,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  Download
} from "lucide-react";

// Form schemas
const childSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  grade: z.string().min(1, "Grade is required"),
  age: z.string().min(1, "Age is required"),
  school: z.string().optional(),
});

const restrictionSchema = z.object({
  childId: z.string().min(1, "Child is required"),
  type: z.string().min(1, "Restriction type is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default function FamilyControls() {
  const { toast } = useToast();
  
  // Dialog states
  const [isChildDialogOpen, setIsChildDialogOpen] = useState(false);
  const [isRestrictionDialogOpen, setIsRestrictionDialogOpen] = useState(false);
  
  // View states
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Sample data for demonstration
  const [children, setChildren] = useState([
    {
      id: "1",
      firstName: "Emma",
      lastName: "Johnson",
      grade: "8th Grade",
      age: "13",
      school: "Lincoln Middle School",
      avatar: "👧",
      status: "online",
      totalScreenTime: 4.5,
      weeklyGoal: 20,
      lastActive: "2024-01-15T14:30:00Z",
      weeklyProgress: {
        math: 85,
        science: 92,
        english: 78,
        history: 88
      }
    },
    {
      id: "2",
      firstName: "Alex",
      lastName: "Johnson",
      grade: "5th Grade",
      age: "10",
      school: "Sunshine Elementary",
      avatar: "👦",
      status: "offline",
      totalScreenTime: 2.8,
      weeklyGoal: 15,
      lastActive: "2024-01-15T16:45:00Z",
      weeklyProgress: {
        math: 90,
        science: 85,
        reading: 95,
        spelling: 80
      }
    }
  ]);

  const [restrictions, setRestrictions] = useState([
    {
      id: "1",
      childId: "1",
      type: "screen-time",
      value: "3",
      description: "Maximum 3 hours of screen time per day",
      isActive: true,
      category: "Time Management"
    },
    {
      id: "2",
      childId: "1",
      type: "content-filter",
      value: "educational-only",
      description: "Access only educational content during study hours",
      isActive: true,
      category: "Content Control"
    },
    {
      id: "3",
      childId: "2",
      type: "bedtime",
      value: "20:00",
      description: "No device access after 8 PM on school days",
      isActive: true,
      category: "Sleep Schedule"
    },
    {
      id: "4",
      childId: "2",
      type: "app-restriction",
      value: "games",
      description: "Gaming apps restricted during homework hours",
      isActive: true,
      category: "App Control"
    }
  ]);

  const [activityLogs, setActivityLogs] = useState([
    {
      id: "1",
      childId: "1",
      activity: "Completed Math Assignment",
      type: "achievement",
      timestamp: "2024-01-15T10:30:00Z",
      duration: 45,
      subject: "Mathematics",
      score: 92,
      device: "tablet"
    },
    {
      id: "2",
      childId: "1",
      activity: "Watched Science Video",
      type: "learning",
      timestamp: "2024-01-15T14:15:00Z",
      duration: 25,
      subject: "Science",
      score: null,
      device: "computer"
    },
    {
      id: "3",
      childId: "2",
      activity: "Reading Session",
      type: "learning",
      timestamp: "2024-01-15T16:00:00Z",
      duration: 30,
      subject: "English",
      score: null,
      device: "tablet"
    },
    {
      id: "4",
      childId: "1",
      activity: "Screen Time Limit Reached",
      type: "restriction",
      timestamp: "2024-01-15T17:00:00Z",
      duration: 0,
      subject: "System",
      score: null,
      device: "all"
    }
  ]);

  // Forms
  const childForm = useForm({
    resolver: zodResolver(childSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      grade: "",
      age: "",
      school: "",
    },
  });

  const restrictionForm = useForm({
    resolver: zodResolver(restrictionSchema),
    defaultValues: {
      childId: "",
      type: "screen-time",
      value: "",
      description: "",
      isActive: true,
    },
  });

  // Handle form submissions
  const handleCreateChild = (data: z.infer<typeof childSchema>) => {
    const newChild = {
      ...data,
      id: String(children.length + 1),
      school: data.school || "",
      avatar: data.firstName.toLowerCase().includes('a') ? "👧" : "👦",
      status: "offline" as const,
      totalScreenTime: 0,
      weeklyGoal: 15,
      lastActive: new Date().toISOString(),
      weeklyProgress: {
        math: 0,
        science: 0,
        english: 0,
        reading: 0,
        spelling: 0,
        history: 0
      }
    };
    setChildren([...children, newChild]);
    setIsChildDialogOpen(false);
    childForm.reset();
    toast({
      title: "Success",
      description: "Child profile created successfully",
    });
  };

  const handleCreateRestriction = (data: z.infer<typeof restrictionSchema>) => {
    const newRestriction = {
      ...data,
      id: String(restrictions.length + 1),
      description: data.description || "",
      category: getRestrictionCategory(data.type)
    };
    setRestrictions([...restrictions, newRestriction]);
    setIsRestrictionDialogOpen(false);
    restrictionForm.reset();
    toast({
      title: "Success",
      description: "Restriction applied successfully",
    });
  };

  // Helper functions
  const getRestrictionCategory = (type: string) => {
    switch (type) {
      case "screen-time": return "Time Management";
      case "content-filter": return "Content Control";
      case "bedtime": return "Sleep Schedule";
      case "app-restriction": return "App Control";
      case "website-block": return "Web Control";
      default: return "General";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "achievement": return <Award className="h-4 w-4 text-yellow-600" />;
      case "learning": return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "restriction": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "computer": return <Monitor className="h-4 w-4" />;
      case "tablet": return <Tablet className="h-4 w-4" />;
      case "phone": return <Smartphone className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter functions
  const filteredChildren = selectedChild === "all" ? children : children.filter(child => child.id === selectedChild);
  const filteredActivities = selectedChild === "all" ? activityLogs : activityLogs.filter(log => log.childId === selectedChild);
  const filteredRestrictions = selectedChild === "all" ? restrictions : restrictions.filter(restriction => restriction.childId === selectedChild);

  // Statistics
  const totalChildren = children.length;
  const activeRestrictions = restrictions.filter(r => r.isActive).length;
  const todayActivities = activityLogs.filter(log => 
    format(parseISO(log.timestamp), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;
  const averageScreenTime = children.reduce((acc, child) => acc + child.totalScreenTime, 0) / children.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Family Controls
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your children's educational activities with comprehensive parental controls
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isRestrictionDialogOpen} onOpenChange={setIsRestrictionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Lock className="h-4 w-4 mr-2" />
                Add Restriction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Restriction</DialogTitle>
              </DialogHeader>
              <Form {...restrictionForm}>
                <form onSubmit={restrictionForm.handleSubmit(handleCreateRestriction)} className="space-y-4">
                  <FormField
                    control={restrictionForm.control}
                    name="childId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select child" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {children.map((child) => (
                              <SelectItem key={child.id} value={child.id}>
                                {child.firstName} {child.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={restrictionForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restriction Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="screen-time">Screen Time Limit</SelectItem>
                              <SelectItem value="content-filter">Content Filter</SelectItem>
                              <SelectItem value="bedtime">Bedtime Schedule</SelectItem>
                              <SelectItem value="app-restriction">App Restriction</SelectItem>
                              <SelectItem value="website-block">Website Block</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={restrictionForm.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 3 (hours), 20:00 (time)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={restrictionForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe the restriction..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={restrictionForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Active restriction</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Apply Restriction
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isChildDialogOpen} onOpenChange={setIsChildDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Child
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Child Profile</DialogTitle>
              </DialogHeader>
              <Form {...childForm}>
                <form onSubmit={childForm.handleSubmit(handleCreateChild)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={childForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter first name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={childForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter last name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={childForm.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="K">Kindergarten</SelectItem>
                              <SelectItem value="1st Grade">1st Grade</SelectItem>
                              <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                              <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                              <SelectItem value="4th Grade">4th Grade</SelectItem>
                              <SelectItem value="5th Grade">5th Grade</SelectItem>
                              <SelectItem value="6th Grade">6th Grade</SelectItem>
                              <SelectItem value="7th Grade">7th Grade</SelectItem>
                              <SelectItem value="8th Grade">8th Grade</SelectItem>
                              <SelectItem value="9th Grade">9th Grade</SelectItem>
                              <SelectItem value="10th Grade">10th Grade</SelectItem>
                              <SelectItem value="11th Grade">11th Grade</SelectItem>
                              <SelectItem value="12th Grade">12th Grade</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={childForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter age" type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={childForm.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter school name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Add Child Profile
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChildren}</div>
            <p className="text-xs text-muted-foreground">Managed profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Active Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRestrictions}</div>
            <p className="text-xs text-muted-foreground">Current controls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Today's Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayActivities}</div>
            <p className="text-xs text-muted-foreground">Learning sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Avg Screen Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScreenTime.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Daily average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>View Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="w-64">
              <Label htmlFor="child-filter">Filter by Child</Label>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="All Children" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="children" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="children">Children ({filteredChildren.length})</TabsTrigger>
          <TabsTrigger value="restrictions">Restrictions ({filteredRestrictions.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity Log ({filteredActivities.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="children" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChildren.map((child) => (
              <Card key={child.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{child.avatar}</div>
                      <div>
                        <CardTitle className="text-lg">{child.firstName} {child.lastName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{child.grade} • {child.school}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(child.status)}>
                      {child.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Weekly Screen Time</span>
                      <span>{child.totalScreenTime}h / {child.weeklyGoal}h</span>
                    </div>
                    <Progress 
                      value={(child.totalScreenTime / child.weeklyGoal) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Subject Progress</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(child.weeklyProgress).map(([subject, progress]) => (
                        <div key={subject} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="capitalize">{subject}</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Last active: {format(parseISO(child.lastActive), "MMM d, HH:mm")}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restrictions" className="space-y-6">
          <div className="space-y-4">
            {filteredRestrictions.map((restriction) => {
              const child = children.find(c => c.id === restriction.childId);
              return (
                <Card key={restriction.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5" />
                        <div>
                          <CardTitle className="text-lg">{restriction.category}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            For {child?.firstName} {child?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={restriction.isActive ? "default" : "secondary"}>
                          {restriction.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Switch checked={restriction.isActive} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Type:</span>
                        <span className="text-sm capitalize">{restriction.type.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Value:</span>
                        <span className="text-sm">{restriction.value}</span>
                      </div>
                      {restriction.description && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">{restriction.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="space-y-3">
            {filteredActivities.map((activity) => {
              const child = children.find(c => c.id === activity.childId);
              return (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <div className="font-medium">{activity.activity}</div>
                          <div className="text-sm text-muted-foreground">
                            {child?.firstName} {child?.lastName} • {activity.subject}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {activity.score && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{activity.score}%</span>
                          </div>
                        )}
                        {activity.duration > 0 && (
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            <span>{activity.duration}m</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {getDeviceIcon(activity.device)}
                          <span className="capitalize">{activity.device}</span>
                        </div>
                        <span>{format(parseISO(activity.timestamp), "MMM d, HH:mm")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Screen Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{child.firstName}</span>
                        <span className="text-sm">{child.totalScreenTime}h / {child.weeklyGoal}h</span>
                      </div>
                      <Progress 
                        value={(child.totalScreenTime / child.weeklyGoal) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="space-y-2">
                      <h4 className="font-medium">{child.firstName}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(child.weeklyProgress).map(([subject, progress]) => (
                          <div key={subject} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{subject}</span>
                            <span>{progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Learning Sessions</span>
                    <span className="font-medium">{activityLogs.filter(log => log.type === 'learning').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Achievements Earned</span>
                    <span className="font-medium">{activityLogs.filter(log => log.type === 'achievement').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Restrictions Triggered</span>
                    <span className="font-medium">{activityLogs.filter(log => log.type === 'restriction').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals & Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Goal Progress</span>
                    <span className="font-medium">
                      {Math.round((children.reduce((acc, child) => acc + (child.totalScreenTime / child.weeklyGoal), 0) / children.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Study Score</span>
                    <span className="font-medium">
                      {Math.round(activityLogs.filter(log => log.score).reduce((acc, log) => acc + log.score!, 0) / activityLogs.filter(log => log.score).length)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}