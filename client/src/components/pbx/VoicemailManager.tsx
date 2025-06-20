import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Voicemail, Play, Pause, Download, Trash2, Phone, Clock, AlertCircle } from "lucide-react";
import { VoicemailMessage } from "./types";

interface VoicemailManagerProps {
  voicemails: VoicemailMessage[];
  onPlayVoicemail: (voicemailId: string) => void;
  onDeleteVoicemail: (voicemailId: string) => void;
  onMarkAsRead: (voicemailId: string) => void;
  onCallBack: (number: string) => void;
  onDownloadVoicemail: (audioUrl: string, voicemailId: string) => void;
}

export function VoicemailManager({
  voicemails,
  onPlayVoicemail,
  onDeleteVoicemail,
  onMarkAsRead,
  onCallBack,
  onDownloadVoicemail
}: VoicemailManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredVoicemails = voicemails.filter(vm => {
    const matchesSearch = 
      vm.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vm.transcription && vm.transcription.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "unread" && !vm.isRead) ||
      (filterStatus === "read" && vm.isRead) ||
      (filterStatus === "urgent" && vm.priority === "urgent");

    return matchesSearch && matchesStatus;
  });

  const unreadCount = voicemails.filter(vm => !vm.isRead).length;
  const urgentCount = voicemails.filter(vm => vm.priority === "urgent").length;

  const handlePlayToggle = (voicemailId: string) => {
    if (playingId === voicemailId) {
      setPlayingId(null);
    } else {
      setPlayingId(voicemailId);
      onPlayVoicemail(voicemailId);
      
      // Mark as read when played
      const voicemail = voicemails.find(vm => vm.id === voicemailId);
      if (voicemail && !voicemail.isRead) {
        onMarkAsRead(voicemailId);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{voicemails.length}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{urgentCount}</div>
            <div className="text-sm text-gray-600">Urgent</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Voicemail className="h-5 w-5" />
            Voicemail Messages ({filteredVoicemails.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search voicemails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="urgent">Urgent Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Voicemail List */}
      <Card>
        <CardContent className="p-0">
          {filteredVoicemails.length === 0 ? (
            <div className="text-center py-12">
              <Voicemail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No voicemails found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria." : "You have no voicemail messages."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredVoicemails.map((voicemail) => {
                const dateTime = formatDateTime(voicemail.timestamp);
                const isPlaying = playingId === voicemail.id;
                
                return (
                  <div 
                    key={voicemail.id} 
                    className={`p-4 transition-colors ${
                      !voicemail.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayToggle(voicemail.id)}
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-medium ${!voicemail.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                              From: {voicemail.from}
                            </span>
                            
                            {voicemail.priority === 'urgent' && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Urgent
                              </Badge>
                            )}
                            
                            {!voicemail.isRead && (
                              <Badge variant="default">New</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(voicemail.duration)}
                            </div>
                            <span>{dateTime.date} at {dateTime.time}</span>
                          </div>
                          
                          {voicemail.transcription && (
                            <div className="bg-gray-100 p-3 rounded-lg text-sm">
                              <div className="font-medium text-gray-700 mb-1">Transcription:</div>
                              <p className="text-gray-600">{voicemail.transcription}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCallBack(voicemail.from)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call Back
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownloadVoicemail(voicemail.audioUrl, voicemail.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        {!voicemail.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onMarkAsRead(voicemail.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteVoicemail(voicemail.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}