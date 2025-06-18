import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, Users, Phone, Mail, MessageSquare, Eye, Edit } from "lucide-react";
import type { Parent } from "./ParentTypes";

interface ParentCardProps {
  parent: Parent;
  onViewDetails?: (parentId: string) => void;
  onEditParent?: (parentId: string) => void;
  onSendMessage?: (parentId: string) => void;
  onCallParent?: (parentId: string) => void;
}

export default function ParentCard({ 
  parent, 
  onViewDetails, 
  onEditParent, 
  onSendMessage, 
  onCallParent 
}: ParentCardProps) {
  const getStatusBadge = () => {
    const isRecentlyActive = new Date(parent.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    if (isRecentlyActive) {
      return { text: "Active", class: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" };
    }
    
    const lastActiveDate = new Date(parent.lastActive);
    const daysSince = Math.floor((Date.now() - lastActiveDate.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysSince <= 7) {
      return { text: "Recent", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" };
    }
    
    return { text: "Inactive", class: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400" };
  };

  const statusBadge = getStatusBadge();

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={parent.avatar} alt={parent.name} />
              <AvatarFallback>{parent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                {parent.name}
                {parent.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">{parent.email}</p>
            </div>
          </div>
          <Badge className={`text-xs ${statusBadge.class}`}>
            {statusBadge.text}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {parent.children.length} {parent.children.length === 1 ? 'child' : 'children'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {parent.children.slice(0, 3).map((child, index) => (
            <Badge key={child.id} variant="outline" className="text-xs">
              {child.name} ({child.grade})
            </Badge>
          ))}
          {parent.children.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{parent.children.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Phone:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{parent.phone}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Joined:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(parent.joinDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Last Active:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(parent.lastActive).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCallParent?.(parent.id)}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onSendMessage?.(parent.id)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEditParent?.(parent.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onViewDetails?.(parent.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}