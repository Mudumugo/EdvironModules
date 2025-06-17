import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Users, Clock, TrendingUp, Eye, CheckCircle, ArrowRight } from "lucide-react";

interface LearningPathsAnalysisProps {
  data: any;
}

export default function LearningPathsAnalysis({ data }: LearningPathsAnalysisProps) {
  const learningPaths = data?.learningPaths || [];

  const pathCompletionData = [
    { name: 'Mathematics Foundation', completed: 145, enrolled: 180, rate: 81 },
    { name: 'Science Exploration', completed: 128, enrolled: 165, rate: 78 },
    { name: 'Digital Literacy', completed: 156, enrolled: 170, rate: 92 },
    { name: 'Critical Thinking', completed: 98, enrolled: 140, rate: 70 }
  ];

  const progressDistribution = [
    { name: 'Completed', value: 42, color: '#22c55e' },
    { name: 'In Progress', value: 38, color: '#3b82f6' },
    { name: 'Not Started', value: 15, color: '#94a3b8' },
    { name: 'Dropped', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Path Completion Rates</CardTitle>
            <CardDescription>Student progress across different learning trajectories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pathCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Distribution</CardTitle>
            <CardDescription>Overall student progress across all paths</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={progressDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {progressDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Path Performance</CardTitle>
          <CardDescription>Detailed analytics for each learning trajectory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pathCompletionData.map((path, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{path.name}</h3>
                  <Badge variant={path.rate >= 80 ? 'default' : path.rate >= 70 ? 'secondary' : 'destructive'}>
                    {path.rate}% completion
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{path.enrolled} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{path.completed} completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>{path.enrolled - path.completed} in progress</span>
                  </div>
                </div>

                <Progress value={path.rate} className="h-2" />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Average completion time: 4.2 weeks
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>Data-driven suggestions to improve learning outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-blue-900">Boost Critical Thinking Path</div>
                <div className="text-sm text-blue-700">
                  70% completion rate is below target. Consider adding interactive content and peer discussions.
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-green-900">Replicate Digital Literacy Success</div>
                <div className="text-sm text-green-700">
                  92% completion rate is excellent. Apply similar strategies to other paths.
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border border-orange-200 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-orange-900">Reduce Dropout Rate</div>
                <div className="text-sm text-orange-700">
                  5% dropout rate can be improved with better progress tracking and intervention strategies.
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}