import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Phone, PhoneIncoming, PhoneOutgoing, Clock, Download, Play } from "lucide-react";
import { CallLog } from "./types";

interface CallHistoryProps {
  callLogs: CallLog[];
  onPlayRecording: (recordingUrl: string) => void;
  onDownloadRecording: (recordingUrl: string, callId: string) => void;
  onCallBack: (number: string) => void;
}

export function CallHistory({ 
  callLogs, 
  onPlayRecording, 
  onDownloadRecording, 
  onCallBack 
}: CallHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming': return PhoneIncoming;
      case 'outgoing': return PhoneOutgoing;
      case 'internal': return Phone;
      default: return Phone;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'missed': return 'red';
      case 'busy': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

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

  const filteredLogs = callLogs.filter(log => {
    const matchesSearch = 
      log.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || log.type === filterType;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    
    // Simple date filtering - in real app would be more sophisticated
    let matchesDate = true;
    if (dateRange !== "all") {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      
      if (dateRange === "today") {
        matchesDate = logDate.toDateString() === today.toDateString();
      } else if (dateRange === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= weekAgo;
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const getCallStats = () => {
    const total = callLogs.length;
    const completed = callLogs.filter(log => log.status === 'completed').length;
    const missed = callLogs.filter(log => log.status === 'missed').length;
    const totalDuration = callLogs
      .filter(log => log.status === 'completed')
      .reduce((sum, log) => sum + log.duration, 0);

    return { total, completed, missed, totalDuration };
  };

  const stats = getCallStats();

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Calls</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.missed}</div>
            <div className="text-sm text-gray-600">Missed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatDuration(stats.totalDuration)}
            </div>
            <div className="text-sm text-gray-600">Total Duration</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Call History ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Call Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Call Log List */}
      <Card>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No call history found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredLogs.map((log) => {
                const CallIcon = getCallIcon(log.type);
                const statusColor = getStatusColor(log.status);
                const dateTime = formatDateTime(log.timestamp);
                
                return (
                  <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full bg-${statusColor}-100 flex items-center justify-center`}>
                          <CallIcon className={`h-4 w-4 text-${statusColor}-600`} />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {log.type === 'outgoing' ? log.to : log.from}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-${statusColor}-700 bg-${statusColor}-100`}
                            >
                              {log.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="capitalize">{log.type}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.status === 'completed' ? formatDuration(log.duration) : '0:00'}
                            </div>
                            <span>{dateTime.date} at {dateTime.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {log.recording && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onPlayRecording(log.recording!)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Play
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDownloadRecording(log.recording!, log.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={() => onCallBack(log.type === 'outgoing' ? log.to : log.from)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call Back
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