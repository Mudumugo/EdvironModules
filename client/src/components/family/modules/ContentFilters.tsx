import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Shield, Edit, Trash2, Globe } from "lucide-react";
import { ContentFilter, Device, ContentFilterFormType } from "../types";

interface ContentFiltersProps {
  filters: ContentFilter[];
  devices: Device[];
  onAdd: (filter: ContentFilterFormType) => void;
  onUpdate: (id: string, filter: Partial<ContentFilterFormType>) => void;
  onDelete: (id: string) => void;
}

export function ContentFilters({ 
  filters, 
  devices, 
  onAdd, 
  onUpdate, 
  onDelete 
}: ContentFiltersProps) {
  const getDeviceName = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    return device?.name || 'Unknown Device';
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'social': return '👥';
      case 'games': return '🎮';
      case 'entertainment': return '🎬';
      case 'news': return '📰';
      case 'shopping': return '🛒';
      case 'adult': return '🔞';
      default: return '🌐';
    }
  };

  const getCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getAgeRatingColor = (rating?: string) => {
    if (!rating) return "bg-gray-500";
    if (rating.includes('E')) return "bg-green-500";
    if (rating.includes('T') || rating.includes('13')) return "bg-yellow-500";
    if (rating.includes('M') || rating.includes('17')) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Content Filters
          </span>
          <Button size="sm" onClick={() => {
            console.log("Add content filter");
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Filter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No content filters configured</p>
            <p className="text-sm">Add filters to control content access</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filters.map(filter => (
              <div key={filter.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-lg">
                      {getCategoryIcon(filter.category)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {getCategoryName(filter.category)}
                        {filter.ageRating && (
                          <Badge 
                            className="text-xs text-white"
                            style={{ backgroundColor: getAgeRatingColor(filter.ageRating) }}
                          >
                            {filter.ageRating}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getDeviceName(filter.deviceId)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={filter.isBlocked ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {filter.isBlocked ? "Blocked" : "Allowed"}
                    </Badge>
                    <Switch
                      checked={!filter.isBlocked}
                      onCheckedChange={(checked) => 
                        onUpdate(filter.id, { isBlocked: !checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <span>
                      {filter.isBlocked 
                        ? `All ${filter.category} content blocked`
                        : `${getCategoryName(filter.category)} content allowed`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(filter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}