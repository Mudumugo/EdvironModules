import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Filter,
  Search,
  Users,
  MapPin,
  Calendar,
  X,
  Settings
} from "lucide-react";

interface ScheduleFiltersProps {
  onFilterChange: (filters: any) => void;
  availableRooms: string[];
  availableParticipants: string[];
}

export function ScheduleFilters({
  onFilterChange,
  availableRooms,
  availableParticipants
}: ScheduleFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    eventType: 'all',
    room: 'all',
    participant: 'all',
    dateRange: 'week',
    showConflicts: false,
    showAvailableSlots: false
  });

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange({
      ...updatedFilters,
      participants: selectedParticipants
    });
  };

  const addParticipant = (participant: string) => {
    if (!selectedParticipants.includes(participant)) {
      const newParticipants = [...selectedParticipants, participant];
      setSelectedParticipants(newParticipants);
      updateFilters({ participants: newParticipants });
    }
  };

  const removeParticipant = (participant: string) => {
    const newParticipants = selectedParticipants.filter(p => p !== participant);
    setSelectedParticipants(newParticipants);
    updateFilters({ participants: newParticipants });
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      search: '',
      eventType: 'all',
      room: 'all',
      participant: 'all',
      dateRange: 'week',
      showConflicts: false,
      showAvailableSlots: false
    };
    setFilters(defaultFilters);
    setSelectedParticipants([]);
    onFilterChange({ ...defaultFilters, participants: [] });
  };

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'class', label: 'Classes' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'event', label: 'Events' },
    { value: 'exam', label: 'Exams' }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Schedule Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Events</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              className="pl-8"
              placeholder="Search by title, description..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Event Type */}
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select
              value={filters.eventType}
              onValueChange={(value) => updateFilters({ eventType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Filter */}
          <div className="space-y-2">
            <Label>Room</Label>
            <Select
              value={filters.room}
              onValueChange={(value) => updateFilters({ room: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {availableRooms.map((room) => (
                  <SelectItem key={room} value={room}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {room}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => updateFilters({ dateRange: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {range.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Participant Filter */}
          <div className="space-y-2">
            <Label>Add Participant</Label>
            <Select onValueChange={addParticipant}>
              <SelectTrigger>
                <SelectValue placeholder="Select participant" />
              </SelectTrigger>
              <SelectContent>
                {availableParticipants
                  .filter(p => !selectedParticipants.includes(p))
                  .map((participant) => (
                    <SelectItem key={participant} value={participant}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {participant}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Participants */}
        {selectedParticipants.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Participants</Label>
            <div className="flex flex-wrap gap-2">
              {selectedParticipants.map((participant) => (
                <Badge key={participant} variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {participant}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeParticipant(participant)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Options */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showConflicts">Show Conflicts</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight scheduling conflicts
                </p>
              </div>
              <Switch
                id="showConflicts"
                checked={filters.showConflicts}
                onCheckedChange={(checked) => updateFilters({ showConflicts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showAvailableSlots">Show Available Slots</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight available time slots
                </p>
              </div>
              <Switch
                id="showAvailableSlots"
                checked={filters.showAvailableSlots}
                onCheckedChange={(checked) => updateFilters({ showAvailableSlots: checked })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}