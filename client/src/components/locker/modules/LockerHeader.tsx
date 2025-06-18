import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search, Filter } from "lucide-react";

interface LockerHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function LockerHeader({ searchTerm, onSearchChange }: LockerHeaderProps) {
  return (
    <>
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            My Locker
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your digital notebooks and saved library resources
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your locker..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}