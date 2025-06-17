import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface DeviceFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export default function DeviceFilters({ onFiltersChange }: DeviceFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const updateFilters = (key: string, value: string) => {
    const filters = {
      search: searchTerm,
      status: statusFilter,
      type: typeFilter,
      location: locationFilter,
      [key]: value
    };

    // Update active filters for display
    const active = [];
    if (filters.search) active.push(`Search: ${filters.search}`);
    if (filters.status !== "all") active.push(`Status: ${filters.status}`);
    if (filters.type !== "all") active.push(`Type: ${filters.type}`);
    if (filters.location !== "all") active.push(`Location: ${filters.location}`);
    
    setActiveFilters(active);
    onFiltersChange(filters);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters('search', value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    updateFilters('status', value);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    updateFilters('type', value);
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    updateFilters('location', value);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setLocationFilter("all");
    setActiveFilters([]);
    onFiltersChange({
      search: "",
      status: "all",
      type: "all",
      location: "all"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices by name, ID, or user..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="smartphone">Smartphone</SelectItem>
              <SelectItem value="chromebook">Chromebook</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="classroom-a">Classroom A</SelectItem>
              <SelectItem value="classroom-b">Classroom B</SelectItem>
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="computer-lab">Computer Lab</SelectItem>
              <SelectItem value="home">Home</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}