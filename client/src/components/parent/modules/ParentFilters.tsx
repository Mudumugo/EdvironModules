import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, UserCheck, Clock, Users, AlertTriangle } from "lucide-react";

interface ParentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  verificationFilter: string;
  setVerificationFilter: (filter: string) => void;
  activityFilter: string;
  setActivityFilter: (filter: string) => void;
  grades: string[];
}

export default function ParentFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedGrade,
  setSelectedGrade,
  verificationFilter,
  setVerificationFilter,
  activityFilter,
  setActivityFilter,
  grades
}: ParentFiltersProps) {
  const statusOptions = [
    { label: "All Status", value: "all", icon: Users },
    { label: "Active", value: "active", icon: UserCheck },
    { label: "Inactive", value: "inactive", icon: Clock },
    { label: "Pending", value: "pending", icon: AlertTriangle }
  ];

  const verificationOptions = [
    { label: "All", value: "all" },
    { label: "Verified", value: "verified" },
    { label: "Unverified", value: "unverified" }
  ];

  const activityOptions = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Filter Parents</h3>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or child name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Grade Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Child's Grade
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        {/* Verification Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <UserCheck className="inline h-4 w-4 mr-1" />
            Verification
          </label>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {verificationOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Activity Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Last Activity
          </label>
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {activityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Quick Filters
          </label>
          <div className="flex flex-wrap gap-1">
            <Badge 
              variant={verificationFilter === "unverified" ? "default" : "outline"} 
              className="cursor-pointer text-xs"
              onClick={() => setVerificationFilter(verificationFilter === "unverified" ? "all" : "unverified")}
            >
              Needs Verification
            </Badge>
            <Badge 
              variant={activityFilter === "today" ? "default" : "outline"} 
              className="cursor-pointer text-xs"
              onClick={() => setActivityFilter(activityFilter === "today" ? "all" : "today")}
            >
              Active Today
            </Badge>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedStatus !== "all" || selectedGrade !== "all" || verificationFilter !== "all" || activityFilter !== "all") && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStatus !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedStatus("all")}>
                Status: {statusOptions.find(s => s.value === selectedStatus)?.label} ×
              </Badge>
            )}
            {selectedGrade !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedGrade("all")}>
                Grade: {selectedGrade} ×
              </Badge>
            )}
            {verificationFilter !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setVerificationFilter("all")}>
                {verificationOptions.find(v => v.value === verificationFilter)?.label} ×
              </Badge>
            )}
            {activityFilter !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setActivityFilter("all")}>
                {activityOptions.find(a => a.value === activityFilter)?.label} ×
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}