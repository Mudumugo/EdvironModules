import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Apps, Clock, Ban, Play } from "lucide-react";
import { InstalledApp, APP_CATEGORIES } from "./types";

interface AppListProps {
  apps: InstalledApp[];
  onLaunchApp: (appId: string) => void;
  onRequestUnblock: (appId: string) => void;
}

export function AppList({ apps, onLaunchApp, onRequestUnblock }: AppListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getCategoryInfo = (category: string) => {
    return APP_CATEGORIES.find(cat => cat.value === category) || APP_CATEGORIES[0];
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || app.category === filterCategory;
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "blocked" && app.isBlocked) ||
      (filterStatus === "available" && !app.isBlocked);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getUsageStats = () => {
    const available = apps.filter(app => !app.isBlocked).length;
    const blocked = apps.filter(app => app.isBlocked).length;
    const totalTime = apps.reduce((sum, app) => sum + app.timeUsed, 0);

    return { available, blocked, totalTime };
  };

  const stats = getUsageStats();

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-sm text-gray-600">Blocked</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatTime(stats.totalTime)}</div>
            <div className="text-sm text-gray-600">Total Usage</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apps className="h-5 w-5" />
            Applications ({filteredApps.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {APP_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* App Grid */}
      <Card>
        <CardContent className="p-6">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <Apps className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredApps.map((app) => {
                const categoryInfo = getCategoryInfo(app.category);
                
                return (
                  <div
                    key={app.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      app.isBlocked ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center space-y-3">
                      {/* App Icon */}
                      <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                        app.isBlocked ? 'bg-red-200' : `bg-${categoryInfo.color}-100`
                      }`}>
                        {app.icon ? (
                          <img src={app.icon} alt={app.name} className="w-8 h-8" />
                        ) : (
                          <Apps className={`h-6 w-6 ${
                            app.isBlocked ? 'text-red-600' : `text-${categoryInfo.color}-600`
                          }`} />
                        )}
                      </div>

                      {/* App Name */}
                      <div>
                        <h4 className={`font-medium text-sm ${
                          app.isBlocked ? 'text-red-900' : 'text-gray-900'
                        }`}>
                          {app.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 text-${categoryInfo.color}-700 bg-${categoryInfo.color}-100`}
                        >
                          {categoryInfo.label}
                        </Badge>
                      </div>

                      {/* Usage Info */}
                      {app.timeUsed > 0 && (
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          {formatTime(app.timeUsed)}
                        </div>
                      )}

                      {/* Action Button */}
                      <div>
                        {app.isBlocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRequestUnblock(app.id)}
                            className="w-full text-xs"
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Request Access
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => onLaunchApp(app.id)}
                            className="w-full text-xs"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Launch
                          </Button>
                        )}
                      </div>

                      {/* Last Used */}
                      {app.lastUsed && (
                        <div className="text-xs text-gray-500">
                          Last used: {new Date(app.lastUsed).toLocaleDateString()}
                        </div>
                      )}
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