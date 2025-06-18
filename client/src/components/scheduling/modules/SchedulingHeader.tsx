import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SchedulingHeaderProps {
  onCreateEvent: () => void;
}

export function SchedulingHeader({ onCreateEvent }: SchedulingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scheduling System</h1>
        <p className="text-gray-600 mt-1">Manage events, classes, and appointments</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateEvent}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
    </div>
  );
}