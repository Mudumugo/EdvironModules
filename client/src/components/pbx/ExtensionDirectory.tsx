import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Search, Users, MapPin } from "lucide-react";
import { Extension, EXTENSION_STATUSES } from "./types";

interface ExtensionDirectoryProps {
  extensions: Extension[];
  onCallExtension: (extension: string) => void;
  onExtensionDetails: (extension: Extension) => void;
}

export function ExtensionDirectory({ 
  extensions, 
  onCallExtension, 
  onExtensionDetails 
}: ExtensionDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const departments = Array.from(new Set(extensions.map(ext => ext.department)));

  const filteredExtensions = extensions.filter(extension => {
    const matchesSearch = 
      extension.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extension.number.includes(searchTerm) ||
      extension.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      filterDepartment === "all" || extension.department === filterDepartment;

    return matchesSearch && matchesDepartment;
  });

  const getStatusInfo = (status: string) => {
    return EXTENSION_STATUSES.find(s => s.value === status) || EXTENSION_STATUSES[0];
  };

  const getStatusCount = (status: string) => {
    return extensions.filter(ext => ext.status === status).length;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Extension Directory ({filteredExtensions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search extensions, names, or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EXTENSION_STATUSES.map(status => (
              <div key={status.value} className="text-center">
                <div className={`text-2xl font-bold text-${status.color}-600`}>
                  {getStatusCount(status.value)}
                </div>
                <div className="text-sm text-gray-600">{status.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Extension List */}
      <Card>
        <CardContent className="p-0">
          {filteredExtensions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No extensions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredExtensions.map((extension) => {
                const statusInfo = getStatusInfo(extension.status);
                
                return (
                  <div 
                    key={extension.id} 
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onExtensionDetails(extension)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full bg-${statusInfo.color}-500`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{extension.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              Ext. {extension.number}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{extension.department}</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {extension.location}
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`text-${statusInfo.color}-700 bg-${statusInfo.color}-100`}
                            >
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">
                          Last active: {new Date(extension.lastActivity).toLocaleDateString()}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCallExtension(extension.number);
                          }}
                          disabled={extension.status === 'offline'}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
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