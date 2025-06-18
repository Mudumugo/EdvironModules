import { Calendar, Download, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface TimetableHeaderProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export function TimetableHeader({ isCreateDialogOpen, setIsCreateDialogOpen, children }: TimetableHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
          <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Timetable Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Digital lesson scheduling and management</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          {children}
        </Dialog>
      </div>
    </div>
  );
}