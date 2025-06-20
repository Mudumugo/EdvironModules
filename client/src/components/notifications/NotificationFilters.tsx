import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { NotificationFilter, NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES, NOTIFICATION_CATEGORIES } from "./types";

interface NotificationFiltersProps {
  filters: NotificationFilter;
  onFiltersChange: (filters: NotificationFilter) => void;
  onClearFilters: () => void;
}

export function NotificationFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: NotificationFiltersProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const updateFilter = (key: keyof NotificationFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    setSelectedDateRange(range);
    if (range.from && range.to) {
      updateFilter('dateRange', {
        start: range.from.toISOString(),
        end: range.to.toISOString()
      });
      setDatePickerOpen(false);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type) count++;
    if (filters.priority) count++;
    if (filters.category) count++;
    if (filters.isRead !== undefined) count++;
    if (filters.dateRange) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary">{getActiveFilterCount()}</Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search notifications..."
              value={filters.searchTerm || ''}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={filters.type || ''}
            onValueChange={(value) => updateFilter('type', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {NOTIFICATION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={filters.priority || ''}
            onValueChange={(value) => updateFilter('priority', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All priorities</SelectItem>
              {NOTIFICATION_PRIORITIES.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category || ''}
            onValueChange={(value) => updateFilter('category', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {NOTIFICATION_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Read Status Filter */}
        <div>
          <Label htmlFor="readStatus">Read Status</Label>
          <Select
            value={filters.isRead === undefined ? '' : filters.isRead.toString()}
            onValueChange={(value) => {
              if (value === '') {
                updateFilter('isRead', undefined);
              } else {
                updateFilter('isRead', value === 'true');
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All notifications</SelectItem>
              <SelectItem value="false">Unread only</SelectItem>
              <SelectItem value="true">Read only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <Label>Date Range</Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange ? (
                  <>
                    {new Date(filters.dateRange.start).toLocaleDateString()} -{' '}
                    {new Date(filters.dateRange.end).toLocaleDateString()}
                  </>
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={selectedDateRange.from}
                selected={selectedDateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {filters.dateRange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                updateFilter('dateRange', undefined);
                setSelectedDateRange({});
              }}
              className="mt-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear date range
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div>
          <Label>Quick Filters</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              variant={filters.isRead === false ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('isRead', filters.isRead === false ? undefined : false)}
            >
              Unread
            </Button>
            <Button
              variant={filters.priority === 'urgent' ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('priority', filters.priority === 'urgent' ? undefined : 'urgent')}
            >
              Urgent
            </Button>
            <Button
              variant={filters.category === 'emergency' ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('category', filters.category === 'emergency' ? undefined : 'emergency')}
            >
              Emergency
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}