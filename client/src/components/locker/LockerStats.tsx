import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, NotebookPen, Star, Archive, TrendingUp } from "lucide-react";
import { LockerStats as StatsType } from "./LockerTypes";

interface LockerStatsProps {
  stats: StatsType;
}

export default function LockerStats({ stats }: LockerStatsProps) {
  const storagePercentage = (parseFloat(stats.storageUsed) / parseFloat(stats.storageLimit)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalItems}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{stats.notebooks} Notes</Badge>
            <Badge variant="outline">{stats.resources} Resources</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.storageUsed}GB</div>
          <Progress value={storagePercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            of {stats.storageLimit}GB limit
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Grade Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.gradeProgression.slice(0, 2).map((grade) => (
              <div key={grade.grade} className="flex items-center justify-between">
                <span className="text-sm">{grade.grade}</span>
                <div className="flex items-center gap-2">
                  <Progress value={grade.completionRate} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground">
                    {grade.itemCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.bookmarks}</div>
          <p className="text-xs text-muted-foreground">Saved resources</p>
        </CardContent>
      </Card>
    </div>
  );
}