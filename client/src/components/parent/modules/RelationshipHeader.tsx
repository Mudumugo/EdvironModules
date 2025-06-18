import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface RelationshipHeaderProps {
  onCreateClick: () => void;
}

export function RelationshipHeader({ onCreateClick }: RelationshipHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Portal Administration</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage parent-child relationships and portal access permissions
        </p>
      </div>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="w-4 h-4" />
        Create Relationship
      </Button>
    </div>
  );
}