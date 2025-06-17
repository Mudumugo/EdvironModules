import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { format, parseISO } from "date-fns";
import { 
  Shield,
  Users,
  Clock,
  Activity,
  Target,
  Lock,
  Plus,
  BarChart3,
  PieChart,
  TrendingUp
} from "lucide-react";

// Hooks and components
import { useFamilyControls, childSchema, restrictionSchema } from "@/hooks/useFamilyControls";
import { useFormDialog } from "@/hooks/useFormDialog";
import { ChildProfileCard } from "@/components/family-controls/ChildProfileCard";
import { RestrictionCard } from "@/components/family-controls/RestrictionCard";
import { ActivityLogItem } from "@/components/family-controls/ActivityLogItem";

export default function FamilyControls() {
  const { 
    children, 
    restrictions, 
    activityLogs, 
    addChild, 
    addRestriction, 
    updateRestriction, 
    removeRestriction 
  } = useFamilyControls();

  // View states
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Form dialogs
  const childDialog = useFormDialog(childSchema, addChild, {
    firstName: "",
    lastName: "",
    grade: "",
    age: "",
    school: "",
  });

  const restrictionDialog = useFormDialog(restrictionSchema, addRestriction, {
    childId: "",
    type: "screen-time",
    value: "",
    description: "",
    isActive: true,
  });

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

  const handleRestrictionToggle = (id: string, isActive: boolean) => {
    updateRestriction(id, { isActive });
  };

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
          <Dialog open={restrictionDialog.isOpen} onOpenChange={(open) => open ? restrictionDialog.openDialog() : restrictionDialog.closeDialog()}>
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
              <Form {...restrictionDialog.form}>
                <form onSubmit={restrictionDialog.handleSubmit} className="space-y-4">
                  <FormField
                    control={restrictionDialog.form.control}
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
                      control={restrictionDialog.form.control}
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
                      control={restrictionDialog.form.control}
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
                    control={restrictionDialog.form.control}
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
                    control={restrictionDialog.form.control}
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

          <Dialog open={childDialog.isOpen} onOpenChange={(open) => open ? childDialog.openDialog() : childDialog.closeDialog()}>
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
              <Form {...childDialog.form}>
                <form onSubmit={childDialog.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={childDialog.form.control}
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
                      control={childDialog.form.control}
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
                      control={childDialog.form.control}
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
                      control={childDialog.form.control}
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
                    control={childDialog.form.control}
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
              <Clock className="h-4 w-4" />
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
              <ChildProfileCard 
                key={child.id} 
                child={child}
                onViewDetails={(childId) => console.log("View details for:", childId)}
                onSettings={(childId) => console.log("Settings for:", childId)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restrictions" className="space-y-6">
          <div className="space-y-4">
            {filteredRestrictions.map((restriction) => {
              const child = children.find(c => c.id === restriction.childId);
              return (
                <RestrictionCard 
                  key={restriction.id} 
                  restriction={restriction}
                  child={child}
                  onToggle={handleRestrictionToggle}
                  onDelete={removeRestriction}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="space-y-3">
            {filteredActivities.map((activity) => {
              const child = children.find(c => c.id === activity.childId);
              return (
                <ActivityLogItem 
                  key={activity.id} 
                  activity={activity}
                  child={child}
                />
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