import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Archive, 
  Trash2, 
  Mail, 
  MailOpen,
  Download,
  Forward,
  Flag
} from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onExport: () => void;
  onForward: () => void;
  onFlag: () => void;
  isLoading?: boolean;
}

export function BulkActions({
  selectedCount,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
  onExport,
  onForward,
  onFlag,
  isLoading = false
}: BulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  const actions = [
    {
      id: 'mark-read',
      label: 'Mark as Read',
      icon: MailOpen,
      onClick: onMarkAsRead,
      variant: 'default' as const
    },
    {
      id: 'mark-unread',
      label: 'Mark as Unread',
      icon: Mail,
      onClick: onMarkAsUnread,
      variant: 'outline' as const
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      onClick: onArchive,
      variant: 'outline' as const
    },
    {
      id: 'flag',
      label: 'Flag',
      icon: Flag,
      onClick: onFlag,
      variant: 'outline' as const
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: Forward,
      onClick: onForward,
      variant: 'outline' as const
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      onClick: onExport,
      variant: 'outline' as const
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: onDelete,
      variant: 'destructive' as const
    }
  ];

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Bulk Actions
          <Badge variant="secondary">{selectedCount} selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                onClick={action.onClick}
                disabled={isLoading}
                className="justify-start"
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <CheckCircle className="h-4 w-4" />
            <span>
              {selectedCount} notification{selectedCount !== 1 ? 's' : ''} selected. 
              Choose an action to apply to all selected items.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}