import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Clock, LogOut, User, Phone, Mail, Building, IdCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VisitorRegistration {
  id: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail: string;
  visitPurpose: string;
  hostName: string;
  hostDepartment: string;
  checkInTime: string;
  checkOutTime?: string;
  expectedDuration: number;
  status: string;
  idType: string;
  idNumber: string;
  badgeNumber: string;
  gateUsed: string;
  securityNotes?: string;
}

interface VisitorManagementProps {
  visitors: VisitorRegistration[];
  onRegisterVisitor?: (data: any) => void;
  onCheckoutVisitor?: (visitorId: string) => void;
}

export default function VisitorManagement({ visitors, onRegisterVisitor, onCheckoutVisitor }: VisitorManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorPhone: "",
    visitorEmail: "",
    visitPurpose: "",
    hostName: "",
    hostDepartment: "",
    expectedDuration: 60,
    idType: "",
    idNumber: "",
    gateUsed: "Main Gate",
    securityNotes: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterVisitor?.(formData);
    setIsDialogOpen(false);
    setFormData({
      visitorName: "",
      visitorPhone: "",
      visitorEmail: "",
      visitPurpose: "",
      hostName: "",
      hostDepartment: "",
      expectedDuration: 60,
      idType: "",
      idNumber: "",
      gateUsed: "Main Gate",
      securityNotes: "",
    });
    toast({
      title: "Visitor Registered",
      description: "Visitor has been successfully registered and checked in.",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const checkInTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const statusColors = {
    checked_in: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    checked_out: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    overstayed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Header with Register Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Visitor Management</h3>
          <p className="text-sm text-muted-foreground">Register and manage visitor access</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Register Visitor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register New Visitor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitorName">Visitor Name *</Label>
                  <Input
                    id="visitorName"
                    value={formData.visitorName}
                    onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitorPhone">Phone Number</Label>
                  <Input
                    id="visitorPhone"
                    value={formData.visitorPhone}
                    onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitorEmail">Email Address</Label>
                  <Input
                    id="visitorEmail"
                    type="email"
                    value={formData.visitorEmail}
                    onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitPurpose">Visit Purpose *</Label>
                  <Input
                    id="visitPurpose"
                    value={formData.visitPurpose}
                    onChange={(e) => setFormData({ ...formData, visitPurpose: e.target.value })}
                    placeholder="e.g., Parent Meeting, Maintenance"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostName">Host Name *</Label>
                  <Input
                    id="hostName"
                    value={formData.hostName}
                    onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostDepartment">Host Department</Label>
                  <Input
                    id="hostDepartment"
                    value={formData.hostDepartment}
                    onChange={(e) => setFormData({ ...formData, hostDepartment: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <Select value={formData.idType} onValueChange={(value) => setFormData({ ...formData, idType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="company_id">Company ID</SelectItem>
                      <SelectItem value="national_id">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedDuration">Expected Duration (minutes)</Label>
                  <Input
                    id="expectedDuration"
                    type="number"
                    value={formData.expectedDuration}
                    onChange={(e) => setFormData({ ...formData, expectedDuration: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gateUsed">Gate Used</Label>
                  <Select value={formData.gateUsed} onValueChange={(value) => setFormData({ ...formData, gateUsed: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Gate">Main Gate</SelectItem>
                      <SelectItem value="Service Gate">Service Gate</SelectItem>
                      <SelectItem value="Staff Gate">Staff Gate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityNotes">Security Notes</Label>
                <Textarea
                  id="securityNotes"
                  value={formData.securityNotes}
                  onChange={(e) => setFormData({ ...formData, securityNotes: e.target.value })}
                  placeholder="Additional security information or special instructions"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register Visitor</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Visitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visitors.map((visitor) => (
          <Card key={visitor.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{visitor.visitorName}</CardTitle>
                <Badge className={`${statusColors[visitor.status as keyof typeof statusColors]}`}>
                  {visitor.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <IdCard className="h-3 w-3 mr-1" />
                  {visitor.badgeNumber}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {getTimeAgo(visitor.checkInTime)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span>{visitor.hostName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-3 w-3 text-muted-foreground" />
                  <span>{visitor.hostDepartment || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{visitor.visitorPhone || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{visitor.visitorEmail || "N/A"}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium">Purpose: {visitor.visitPurpose}</p>
                <p className="text-xs text-muted-foreground">Gate: {visitor.gateUsed}</p>
                {visitor.securityNotes && (
                  <p className="text-xs text-muted-foreground mt-1">Notes: {visitor.securityNotes}</p>
                )}
              </div>

              {visitor.status === 'checked_in' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onCheckoutVisitor?.(visitor.id)}
                >
                  <LogOut className="h-3 w-3 mr-2" />
                  Check Out
                </Button>
              )}

              {visitor.checkOutTime && (
                <p className="text-xs text-muted-foreground">
                  Checked out: {new Date(visitor.checkOutTime).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {visitors.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No visitors registered today</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}