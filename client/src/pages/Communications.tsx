import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CommunicationForm } from "@/components/communications/CommunicationForm";
import { CommunicationList } from "@/components/communications/CommunicationList";
import { CommunicationStats } from "@/components/communications/CommunicationStats";
import { CommunicationDetails } from "@/components/communications/CommunicationDetails";
import { Communication, CommunicationFormData } from "@/components/communications/types";

export default function CommunicationsPage() {
  const [activeView, setActiveView] = useState<"all" | "draft" | "scheduled" | "sent" | "archived">("all");
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch communications
  const { data: communications = [], isLoading } = useQuery<Communication[]>({
    queryKey: ['/api/communications'],
    queryFn: () => apiRequest('GET', '/api/communications'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Filter communications
  const filteredCommunications = useMemo(() => {
    if (!Array.isArray(communications)) return [];
    return communications.filter(comm => {
      const matchesType = filterType === 'all' || comm.type === filterType;
      const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
      const matchesSearch = !searchTerm || 
        comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [communications, filterType, filterStatus, searchTerm]);

  // Group communications by status
  const communicationsByStatus = useMemo(() => {
    if (!Array.isArray(filteredCommunications)) {
      return { draft: [], scheduled: [], sent: [], archived: [] };
    }
    const grouped = {
      draft: filteredCommunications.filter(c => c.status === 'draft'),
      scheduled: filteredCommunications.filter(c => c.status === 'scheduled'),
      sent: filteredCommunications.filter(c => c.status === 'sent'),
      archived: filteredCommunications.filter(c => c.status === 'archived')
    };
    return grouped;
  }, [filteredCommunications]);

  // Create/update communication mutation
  const createCommunicationMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/communications', data),
    onSuccess: () => {
      toast({ title: "Communication created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      setShowCreateDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating communication",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Send communication mutation
  const sendCommunicationMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/communications/${id}/send`),
    onSuccess: () => {
      toast({ title: "Communication sent successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending communication",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete communication mutation
  const deleteCommunicationMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/communications/${id}`),
    onSuccess: () => {
      toast({ title: "Communication deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting communication",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCommunicationClick = (communication: Communication) => {
    setSelectedCommunication(communication);
    setShowDetailsDialog(true);
  };

  const handleSendCommunication = (id: string) => {
    sendCommunicationMutation.mutate(id);
  };

  const handleDeleteCommunication = (id: string) => {
    if (confirm('Are you sure you want to delete this communication?')) {
      deleteCommunicationMutation.mutate(id);
    }
  };

  const getCommunicationTypeStyle = (type: string) => {
    const commType = communicationTypes.find(t => t.id === type);
    return commType || communicationTypes[0];
  };

  const getPriorityBadgeVariant = (priority: string) => {
    const variants = {
      urgent: 'destructive',
      high: 'default',
      normal: 'secondary',
      low: 'outline'
    };
    return variants[priority as keyof typeof variants] || 'secondary';
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants = {
      draft: 'outline',
      scheduled: 'secondary',
      sent: 'default',
      archived: 'secondary'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">School Communications</h1>
            <p className="text-muted-foreground">
              Manage announcements, newsletters, and school-wide communications
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Communication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Communication</DialogTitle>
                </DialogHeader>
                <CreateCommunicationForm 
                  onSubmit={(data) => createCommunicationMutation.mutate(data)}
                  isLoading={createCommunicationMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {communicationTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Communications Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              All ({filteredCommunications.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Drafts ({communicationsByStatus.draft.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Scheduled ({communicationsByStatus.scheduled.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Sent ({communicationsByStatus.sent.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            <CommunicationsList 
              communications={filteredCommunications}
              onCommunicationClick={handleCommunicationClick}
              onSend={handleSendCommunication}
              onDelete={handleDeleteCommunication}
            />
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <CommunicationsList 
              communications={communicationsByStatus.draft}
              onCommunicationClick={handleCommunicationClick}
              onSend={handleSendCommunication}
              onDelete={handleDeleteCommunication}
            />
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <CommunicationsList 
              communications={communicationsByStatus.scheduled}
              onCommunicationClick={handleCommunicationClick}
              onSend={handleSendCommunication}
              onDelete={handleDeleteCommunication}
            />
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            <CommunicationsList 
              communications={communicationsByStatus.sent}
              onCommunicationClick={handleCommunicationClick}
              onSend={handleSendCommunication}
              onDelete={handleDeleteCommunication}
            />
          </TabsContent>
        </Tabs>

        {/* Communication Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Communication Details</DialogTitle>
            </DialogHeader>
            {selectedCommunication && (
              <CommunicationDetailsView 
                communication={selectedCommunication}
                onSend={handleSendCommunication}
                onDelete={handleDeleteCommunication}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Communications List Component
function CommunicationsList({ 
  communications, 
  onCommunicationClick, 
  onSend, 
  onDelete 
}: {
  communications: Communication[];
  onCommunicationClick: (comm: Communication) => void;
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const getCommunicationTypeStyle = (type: string) => {
    return communicationTypes.find(t => t.id === type) || communicationTypes[0];
  };

  const getPriorityBadgeVariant = (priority: string) => {
    const variants = {
      urgent: 'destructive',
      high: 'default',
      normal: 'secondary',
      low: 'outline'
    };
    return variants[priority as keyof typeof variants] || 'secondary';
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants = {
      draft: 'outline',
      scheduled: 'secondary',
      sent: 'default',
      archived: 'secondary'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  if (communications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No communications found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {communications.map((communication) => {
        const typeStyle = getCommunicationTypeStyle(communication.type);
        const TypeIcon = typeStyle.icon;
        
        return (
          <Card key={communication.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${typeStyle.color} bg-opacity-10`}>
                  <TypeIcon className={`h-5 w-5 text-${typeStyle.color.replace('bg-', '')}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 
                        className="font-semibold text-lg cursor-pointer hover:text-primary"
                        onClick={() => onCommunicationClick(communication)}
                      >
                        {communication.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {communication.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {communication.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => onSend(communication.id)}
                          className="flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" />
                          Send
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onCommunicationClick(communication)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDelete(communication.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(communication.createdAt), 'MMM d, yyyy HH:mm')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {communication.targetAudience.join(', ')}
                    </span>
                    {communication.totalRecipients && (
                      <span>{communication.totalRecipients} recipients</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(communication.status)}>
                      {communication.status}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(communication.priority)}>
                      {communication.priority}
                    </Badge>
                    <Badge variant="outline">
                      {typeStyle.label}
                    </Badge>
                    {communication.readCount && communication.totalRecipients && (
                      <Badge variant="secondary">
                        {Math.round((communication.readCount / communication.totalRecipients) * 100)}% read
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Create Communication Form Component
function CreateCommunicationForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'normal',
    targetAudience: [] as string[],
    channels: [] as string[],
    scheduledAt: '',
    status: 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: checked 
        ? [...prev.targetAudience, audienceId]
        : prev.targetAudience.filter(id => id !== audienceId)
    }));
  };

  const handleChannelChange = (channelId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      channels: checked 
        ? [...prev.channels, channelId]
        : prev.channels.filter(id => id !== channelId)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="type">Communication Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {communicationTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="scheduledAt">Schedule for Later (Optional)</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label>Target Audience</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {audienceTypes.map(audience => {
            const Icon = audience.icon;
            return (
              <div key={audience.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`audience-${audience.id}`}
                  checked={formData.targetAudience.includes(audience.id)}
                  onCheckedChange={(checked) => handleAudienceChange(audience.id, checked as boolean)}
                />
                <label 
                  htmlFor={`audience-${audience.id}`} 
                  className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Icon className="h-4 w-4" />
                  {audience.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Communication Channels</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {communicationChannels.map(channel => {
            const Icon = channel.icon;
            return (
              <div key={channel.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`channel-${channel.id}`}
                  checked={formData.channels.includes(channel.id)}
                  onCheckedChange={(checked) => handleChannelChange(channel.id, checked as boolean)}
                />
                <label 
                  htmlFor={`channel-${channel.id}`} 
                  className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Icon className="h-4 w-4" />
                  {channel.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={isLoading}
          onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
        >
          Save as Draft
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          onClick={() => setFormData(prev => ({ ...prev, status: 'sent' }))}
        >
          Send Now
        </Button>
        {formData.scheduledAt && (
          <Button 
            type="submit" 
            disabled={isLoading}
            variant="outline"
            onClick={() => setFormData(prev => ({ ...prev, status: 'scheduled' }))}
          >
            Schedule
          </Button>
        )}
      </div>
    </form>
  );
}

// Communication Details View Component
function CommunicationDetailsView({ 
  communication, 
  onSend, 
  onDelete 
}: {
  communication: Communication;
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const typeStyle = communicationTypes.find(t => t.id === communication.type) || communicationTypes[0];
  const TypeIcon = typeStyle.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${typeStyle.color} bg-opacity-10`}>
          <TypeIcon className={`h-6 w-6 text-${typeStyle.color.replace('bg-', '')}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{communication.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{typeStyle.label}</Badge>
            <Badge variant="outline">{communication.priority}</Badge>
            <Badge variant="outline">{communication.status}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {communication.status === 'draft' && (
            <Button onClick={() => onSend(communication.id)}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          )}
          <Button variant="outline" onClick={() => onDelete(communication.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Content</h4>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{communication.content}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Target Audience</h4>
          <div className="space-y-1">
            {communication.targetAudience.map(audience => (
              <Badge key={audience} variant="outline">{audience}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Communication Channels</h4>
          <div className="space-y-1">
            {communication.channels.map(channel => (
              <Badge key={channel} variant="outline">{channel}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-medium mb-1">Created</h4>
          <p className="text-sm text-muted-foreground">
            {format(parseISO(communication.createdAt), 'MMM d, yyyy HH:mm')}
          </p>
        </div>
        
        {communication.scheduledAt && (
          <div>
            <h4 className="font-medium mb-1">Scheduled</h4>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(communication.scheduledAt), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
        )}
        
        {communication.sentAt && (
          <div>
            <h4 className="font-medium mb-1">Sent</h4>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(communication.sentAt), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
        )}
      </div>

      {communication.readCount && communication.totalRecipients && (
        <div>
          <h4 className="font-medium mb-2">Delivery Statistics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{communication.totalRecipients}</div>
              <div className="text-sm text-muted-foreground">Total Recipients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{communication.readCount}</div>
              <div className="text-sm text-muted-foreground">Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round((communication.readCount / communication.totalRecipients) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Read Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}