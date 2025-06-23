import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Ticket, Clock, AlertCircle, CheckCircle, Users } from "lucide-react";

export default function GlobalSupport() {
  const [tickets] = useState([
    {
      id: "TICK-001",
      tenantId: "school-001",
      tenantName: "Greenwood High School",
      subject: "Unable to access Khan Academy",
      category: "apps",
      priority: "high",
      status: "open",
      submittedBy: "john.teacher@greenwood.edu",
      submittedAt: "2025-06-23T10:30:00Z",
      description: "Students are getting error 403 when trying to access Khan Academy. This is affecting our math classes."
    },
    {
      id: "TICK-002", 
      tenantId: "school-002",
      tenantName: "Riverside Elementary",
      subject: "License quota exceeded",
      category: "licensing",
      priority: "medium",
      status: "in_progress",
      submittedBy: "admin@riverside.edu",
      submittedAt: "2025-06-23T09:15:00Z",
      description: "We've reached our user limit but need to add 5 more teachers for the new semester."
    },
    {
      id: "TICK-003",
      tenantId: "school-003", 
      tenantName: "Metro College Prep",
      subject: "Slow application performance",
      category: "technical",
      priority: "low",
      status: "resolved",
      submittedBy: "it@metrocollege.edu",
      submittedAt: "2025-06-22T14:20:00Z",
      description: "Applications are loading slowly during peak hours (8-10 AM)."
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "in_progress": return "default";
      case "resolved": return "secondary";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Headphones className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Global Support Center</h1>
          <p className="text-muted-foreground">Manage support tickets and tenant issues across all schools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Schools with tickets</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">All Tickets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Input placeholder="Search tickets..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTicket(ticket)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{ticket.id}</Badge>
                      <Badge variant={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      <Badge variant={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(ticket.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.tenantName}</span>
                      <span>•</span>
                      <span>{ticket.submittedBy}</span>
                      <span>•</span>
                      <span className="capitalize">{ticket.category}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Technical Issues</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>App Problems</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Licensing</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>General</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Average First Response</span>
                    <span className="font-medium">2.5 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Resolution</span>
                    <span className="font-medium">18 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>App Access Problems</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Issues</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License Requests</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Login Problems</span>
                    <span className="font-medium">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Management</CardTitle>
              <CardDescription>Create and manage support articles for common issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>Create New Article</Button>
                <div className="grid gap-2">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">App Access Troubleshooting Guide</h4>
                    <p className="text-sm text-muted-foreground">Step-by-step guide for resolving app access issues</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">License Management FAQ</h4>
                    <p className="text-sm text-muted-foreground">Common questions about license allocation and usage</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Performance Optimization Tips</h4>
                    <p className="text-sm text-muted-foreground">Best practices for improving application performance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
             onClick={() => setSelectedTicket(null)}>
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{selectedTicket.id}</Badge>
                  <Badge variant={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
                  <Badge variant={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
                  Close
                </Button>
              </div>
              <CardTitle>{selectedTicket.subject}</CardTitle>
              <CardDescription>
                <div className="space-y-1">
                  <div>Tenant: {selectedTicket.tenantName}</div>
                  <div>Submitted by: {selectedTicket.submittedBy}</div>
                  <div>Date: {new Date(selectedTicket.submittedAt).toLocaleString()}</div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm">{selectedTicket.description}</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Actions</h4>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assign To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support1">Alex Support</SelectItem>
                      <SelectItem value="support2">Maria Support</SelectItem>
                      <SelectItem value="tech1">John Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Response</label>
                  <Textarea placeholder="Type your response to the customer..." />
                  <div className="flex gap-2">
                    <Button size="sm">Send Response</Button>
                    <Button size="sm" variant="outline">Add Internal Note</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}