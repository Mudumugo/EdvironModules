import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link2, Shield, Edit, Trash2 } from "lucide-react";

export interface ParentChildRelationship {
  id: number;
  parentUserId: string;
  childUserId: string;
  relationship: string;
  isPrimary: boolean;
  canViewGrades: boolean;
  canViewAttendance: boolean;
  canReceiveNotifications: boolean;
  parent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface RelationshipTableProps {
  relationships: ParentChildRelationship[];
  onPermissionToggle: (relationship: ParentChildRelationship, field: string, value: boolean) => void;
  onEdit: (relationship: ParentChildRelationship) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function RelationshipTable({
  relationships,
  onPermissionToggle,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting
}: RelationshipTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Parent-Child Relationships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parent</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Primary</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationships.map((relationship) => (
              <TableRow key={relationship.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {relationship.parent.firstName} {relationship.parent.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{relationship.parent.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{relationship.childUserId}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={relationship.relationship === 'parent' ? 'default' : 'secondary'}>
                    {relationship.relationship.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {relationship.isPrimary && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Primary
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Switch
                      checked={relationship.canViewGrades}
                      onCheckedChange={(checked) => 
                        onPermissionToggle(relationship, 'canViewGrades', checked)
                      }
                      disabled={isUpdating}
                    />
                    <span className="text-xs">Grades</span>
                    <Switch
                      checked={relationship.canViewAttendance}
                      onCheckedChange={(checked) => 
                        onPermissionToggle(relationship, 'canViewAttendance', checked)
                      }
                      disabled={isUpdating}
                    />
                    <span className="text-xs">Attendance</span>
                    <Switch
                      checked={relationship.canReceiveNotifications}
                      onCheckedChange={(checked) => 
                        onPermissionToggle(relationship, 'canReceiveNotifications', checked)
                      }
                      disabled={isUpdating}
                    />
                    <span className="text-xs">Notifications</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(relationship)}
                      className="gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(relationship.id)}
                      disabled={isDeleting}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {relationships.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No parent-child relationships found
          </div>
        )}
      </CardContent>
    </Card>
  );
}