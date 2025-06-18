import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Search, X } from "lucide-react";

interface FilterState {
  search: string;
  type: string;
  status: string;
  location: string;
  dateRange: string;
}

interface ScheduleFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function ScheduleFilters({ 
  filters, 
  onFiltersChange, 
  activeFiltersCount,
  onClearFilters 
}: ScheduleFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeFiltersCount} active
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="h-7"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select 
            value={filters.type} 
            onValueChange={(value) => updateFilter('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.status} 
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />

          <Select 
            value={filters.dateRange} 
            onValueChange={(value) => updateFilter('dateRange', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="next-week">Next Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}