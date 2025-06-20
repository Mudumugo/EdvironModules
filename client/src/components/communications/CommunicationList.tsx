import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Send, Archive, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Communication, COMMUNICATION_TYPES, PRIORITY_LEVELS } from "./types";

interface CommunicationListProps {
  communications: Communication[];
  view: "all" | "draft" | "scheduled" | "sent" | "archived";
  onView: (communication: Communication) => void;
  onEdit: (communication: Communication) => void;
  onSend: (communication: Communication) => void;
  onArchive: (communication: Communication) => void;
  onDelete: (communication: Communication) => void;
}

export function CommunicationList({
  communications,
  view,
  onView,
  onEdit,
  onSend,
  onArchive,
  onDelete
}: CommunicationListProps) {
  const filteredCommunications = useMemo(() => {
    if (view === "all") return communications;
    return communications.filter(comm => comm.status === view);
  }, [communications, view]);

  const getTypeInfo = (type: string) => {
    return COMMUNICATION_TYPES.find(t => t.value === type) || COMMUNICATION_TYPES[0];
  };

  const getPriorityInfo = (priority: string) => {
    return PRIORITY_LEVELS.find(p => p.value === priority) || PRIORITY_LEVELS[1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (filteredCommunications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No communications found</h3>
        <p className="text-gray-600">
          {view === "all" ? "Create your first communication to get started." : `No ${view} communications found.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredCommunications.map((communication) => {
        const typeInfo = getTypeInfo(communication.type);
        const priorityInfo = getPriorityInfo(communication.priority);

        return (
          <Card key={communication.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{typeInfo.icon}</span>
                    <CardTitle className="text-lg">{communication.title}</CardTitle>
                    <Badge className={getStatusBadgeColor(communication.status)}>
                      {communication.status}
                    </Badge>
                    <Badge variant="outline" className={`text-${priorityInfo.color}-600 border-${priorityInfo.color}-200`}>
                      {priorityInfo.label}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2">{communication.content}</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(communication)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {communication.status === 'draft' && (
                      <DropdownMenuItem onClick={() => onEdit(communication)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {(communication.status === 'draft' || communication.status === 'scheduled') && (
                      <DropdownMenuItem onClick={() => onSend(communication)}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Now
                      </DropdownMenuItem>
                    )}
                    {communication.status === 'sent' && (
                      <DropdownMenuItem onClick={() => onArchive(communication)}>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete(communication)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Created: {formatDate(communication.createdAt)}</span>
                  {communication.sentAt && (
                    <span>Sent: {formatDate(communication.sentAt)}</span>
                  )}
                  {communication.scheduledAt && (
                    <span>Scheduled: {formatDate(communication.scheduledAt)}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span>Channels:</span>
                    <div className="flex gap-1">
                      {communication.channels.map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel === 'email' && '✉️'}
                          {channel === 'sms' && '📱'}
                          {channel === 'app_notification' && '🔔'}
                          {channel === 'website' && '🌐'}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {communication.readCount !== undefined && communication.totalRecipients && (
                    <span>
                      Read: {communication.readCount}/{communication.totalRecipients}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Audience:</span>
                <div className="flex flex-wrap gap-1">
                  {communication.targetAudience.map((audience) => (
                    <Badge key={audience} variant="outline" className="text-xs">
                      {audience.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}