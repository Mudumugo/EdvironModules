import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, CalendarIcon } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon2, 
  User, 
  Building, 
  MapPin, 
  Clock,
  Filter,
  Download,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  DollarSign,
  Target
} from "lucide-react";
import type { Lead, LeadActivity, DemoRequest } from "@shared/schema";

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800", 
  qualified: "bg-green-100 text-green-800",
  converted: "bg-purple-100 text-purple-800",
  lost: "bg-red-100 text-red-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

const accountTypeIcons = {
  individual: User,
  family: Users,
  school: Building,
};

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: "",
    subject: "",
    description: "",
    outcome: "",
    scheduledDate: null as Date | null,
  });

  const queryClient = useQueryClient();

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/crm/leads"],
  });

  // Fetch demo requests
  const { data: demoRequests = [], isLoading: demosLoading } = useQuery({
    queryKey: ["/api/crm/demo-requests"],
  });

  // Fetch lead activities
  const { data: activities = [] } = useQuery({
    queryKey: ["/api/crm/activities", selectedLead?.id],
    enabled: !!selectedLead,
  });

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Lead> }) => {
      return apiRequest(`/api/crm/leads/${data.id}`, {
        method: "PATCH",
        body: data.updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      toast({
        title: "Success",
        description: "Lead updated successfully", 
      });
    },
  });

  // Add activity mutation
  const addActivityMutation = useMutation({
    mutationFn: async (activity: any) => {
      return apiRequest("/api/crm/activities", {
        method: "POST",
        body: activity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/activities"] });
      setIsActivityDialogOpen(false);
      setNewActivity({
        type: "",
        subject: "",
        description: "",
        outcome: "",
        scheduledDate: null,
      });
      toast({
        title: "Success", 
        description: "Activity added successfully",
      });
    },
  });

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead: Lead) => {
      const matchesSearch = 
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [leads, searchTerm, statusFilter, priorityFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((l: Lead) => l.status === "new").length;
    const qualifiedLeads = leads.filter((l: Lead) => l.status === "qualified").length;
    const convertedLeads = leads.filter((l: Lead) => l.status === "converted").length;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";

    return {
      totalLeads,
      newLeads, 
      qualifiedLeads,
      convertedLeads,
      conversionRate,
    };
  }, [leads]);

  const handleStatusChange = (leadId: number, newStatus: string) => {
    updateLeadMutation.mutate({
      id: leadId,
      updates: { 
        status: newStatus,
        updatedAt: new Date(),
        ...(newStatus === "converted" && { convertedAt: new Date() })
      },
    });
  };

  const handlePriorityChange = (leadId: number, newPriority: string) => {
    updateLeadMutation.mutate({
      id: leadId,
      updates: { priority: newPriority, updatedAt: new Date() },
    });
  };

  const handleAddActivity = () => {
    if (!selectedLead || !newActivity.type || !newActivity.subject) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    addActivityMutation.mutate({
      leadId: selectedLead.id,
      type: newActivity.type,
      subject: newActivity.subject,
      description: newActivity.description,
      outcome: newActivity.outcome,
      scheduledDate: newActivity.scheduledDate,
      tenantId: "default",
      createdBy: "current-user", // This would come from auth context
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-gray-600">Manage leads, signups, and demo requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.newLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.qualifiedLeads}</div>
          </CardContent>
        </Card>
        <Card>  
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.convertedLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="demos">Demo Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Leads ({filteredLeads.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="text-center py-8">Loading leads...</div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No leads found</div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead: Lead) => {
                    const AccountIcon = accountTypeIcons[lead.accountType as keyof typeof accountTypeIcons] || User;
                    return (
                      <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <AccountIcon className="w-8 h-8 text-gray-400" />
                            <div>
                              <h3 className="font-semibold">
                                {lead.firstName} {lead.lastName}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                {lead.email}
                                {lead.phone && (
                                  <>
                                    <Phone className="w-4 h-4 ml-2" />
                                    {lead.phone}
                                  </>
                                )}
                              </div>
                              {lead.location && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <MapPin className="w-4 h-4" />
                                  {JSON.parse(lead.location as string).county}, Kenya
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={priorityColors[lead.priority as keyof typeof priorityColors]}>
                              {lead.priority}
                            </Badge>
                            <Select
                              value={lead.status}
                              onValueChange={(value) => handleStatusChange(lead.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                                  {lead.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsLeadDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>Account Type: {lead.accountType}</span>
                            {lead.age && <span>Age: {lead.age}</span>}
                            <span>Source: {lead.source}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Created {format(new Date(lead.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demo Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {demosLoading ? (
                <div className="text-center py-8">Loading demo requests...</div>
              ) : demoRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No demo requests found</div>
              ) : (
                <div className="space-y-4">
                  {demoRequests.map((demo: DemoRequest) => (
                    <div key={demo.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {demo.firstName} {demo.lastName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {demo.email}
                            {demo.phone && (
                              <>
                                <Phone className="w-4 h-4 ml-2" />
                                {demo.phone}
                              </>
                            )}
                          </div>
                          {demo.organization && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Building className="w-4 h-4" />
                              {demo.organization} - {demo.role}
                            </div>
                          )}
                        </div>
                        <Badge className={
                          demo.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          demo.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                          demo.status === "completed" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {demo.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {demo.numberOfStudents && (
                              <span>Students: {demo.numberOfStudents}</span>
                            )}
                            {demo.preferredDate && (
                              <span>Preferred: {format(new Date(demo.preferredDate), "MMM d, yyyy")}</span>
                            )}
                          </div>
                          <span>Requested {format(new Date(demo.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        {demo.message && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            {demo.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Details Dialog */}
      <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLead && `${selectedLead.firstName} ${selectedLead.lastName}`}
            </DialogTitle>
            <DialogDescription>Lead details and activity history</DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Information</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedLead.email}
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedLead.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Account Details</Label>
                  <div className="space-y-2 text-sm">
                    <div>Type: {selectedLead.accountType}</div>
                    {selectedLead.age && <div>Age: {selectedLead.age}</div>}
                    <div>Source: {selectedLead.source}</div>
                  </div>
                </div>
              </div>

              {/* Priority and Status Controls */}
              <div className="flex gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={selectedLead.priority}
                    onValueChange={(value) => handlePriorityChange(selectedLead.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) => handleStatusChange(selectedLead.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Activities */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Activities</Label>
                  <Button
                    size="sm"
                    onClick={() => setIsActivityDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activities.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No activities yet</div>
                  ) : (
                    activities.map((activity: LeadActivity) => (
                      <div key={activity.id} className="border rounded p-3 text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{activity.subject}</div>
                            <div className="text-gray-600">{activity.description}</div>
                            {activity.outcome && (
                              <div className="text-green-600">Outcome: {activity.outcome}</div>
                            )}
                          </div>
                          <Badge variant="outline">{activity.type}</Badge>
                        </div>
                        <div className="mt-2 text-gray-500">
                          {format(new Date(activity.createdAt), "MMM d, yyyy HH:mm")}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>Record a new interaction with this lead</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={newActivity.type} onValueChange={(value) => setNewActivity({...newActivity, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="status_change">Status Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Subject</Label>
              <Input
                value={newActivity.subject}
                onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
                placeholder="Brief subject line"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={newActivity.description}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                placeholder="Detailed description of the activity"
              />
            </div>
            
            <div>
              <Label>Outcome</Label>
              <Input
                value={newActivity.outcome}
                onChange={(e) => setNewActivity({...newActivity, outcome: e.target.value})}
                placeholder="Result or outcome (optional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddActivity} disabled={addActivityMutation.isPending}>
              {addActivityMutation.isPending ? "Adding..." : "Add Activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}