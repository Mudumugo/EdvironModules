import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Send, Eye, Archive, Trash2 } from "lucide-react";
import { Communication, COMMUNICATION_TYPES, PRIORITY_LEVELS, TARGET_AUDIENCES, DELIVERY_CHANNELS } from "./types";

interface CommunicationDetailsProps {
  communication: Communication | null;
  isOpen: boolean;
  onClose: () => void;
  onSend?: (communication: Communication) => void;
  onArchive?: (communication: Communication) => void;
  onDelete?: (communication: Communication) => void;
}

export function CommunicationDetails({ 
  communication, 
  isOpen, 
  onClose, 
  onSend, 
  onArchive, 
  onDelete 
}: CommunicationDetailsProps) {
  if (!communication) return null;

  const typeInfo = COMMUNICATION_TYPES.find(t => t.value === communication.type);
  const priorityInfo = PRIORITY_LEVELS.find(p => p.value === communication.priority);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span>{typeInfo?.icon}</span>
              {communication.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(communication.status)}>
                {communication.status}
              </Badge>
              <Badge variant="outline" className={`text-${priorityInfo?.color}-600`}>
                {priorityInfo?.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            {(communication.status === 'draft' || communication.status === 'scheduled') && onSend && (
              <Button onClick={() => onSend(communication)}>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            )}
            {communication.status === 'sent' && onArchive && (
              <Button variant="outline" onClick={() => onArchive(communication)}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" onClick={() => onDelete(communication)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Message Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{communication.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-600">Created</div>
                  <div className="text-sm">{formatDate(communication.createdAt)}</div>
                </div>
                
                {communication.scheduledAt && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Scheduled</div>
                    <div className="text-sm">{formatDate(communication.scheduledAt)}</div>
                  </div>
                )}
                
                {communication.sentAt && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Sent</div>
                    <div className="text-sm">{formatDate(communication.sentAt)}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Engagement */}
            {communication.readCount !== undefined && communication.totalRecipients && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Total Recipients</div>
                    <div className="text-sm">{communication.totalRecipients}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600">Reads</div>
                    <div className="text-sm">{communication.readCount}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600">Read Rate</div>
                    <div className="text-sm">
                      {Math.round((communication.readCount / communication.totalRecipients) * 100)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {communication.targetAudience.map((audienceId) => {
                  const audience = TARGET_AUDIENCES.find(a => a.value === audienceId);
                  return audience ? (
                    <Badge key={audienceId} variant="secondary">
                      {audience.icon} {audience.label}
                    </Badge>
                  ) : (
                    <Badge key={audienceId} variant="secondary">
                      {audienceId.replace('_', ' ')}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Channels */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {communication.channels.map((channelId) => {
                  const channel = DELIVERY_CHANNELS.find(c => c.value === channelId);
                  return channel ? (
                    <div key={channelId} className="flex items-center gap-2 p-2 border rounded">
                      <span>{channel.icon}</span>
                      <div>
                        <div className="font-medium">{channel.label}</div>
                        <div className="text-xs text-gray-500">{channel.description}</div>
                      </div>
                    </div>
                  ) : (
                    <Badge key={channelId} variant="outline">
                      {channelId}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}