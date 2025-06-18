import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users } from "lucide-react";

interface RelationshipSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  relationshipCount: number;
}

export function RelationshipSearch({
  searchTerm,
  onSearchChange,
  relationshipCount
}: RelationshipSearchProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by parent name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {relationshipCount} relationships
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}