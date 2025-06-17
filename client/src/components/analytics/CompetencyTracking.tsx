import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, Target, TrendingUp, Award, Users, BookOpen, CheckCircle } from "lucide-react";
import { useState } from "react";

interface CompetencyTrackingProps {
  data: any;
}

export default function CompetencyTracking({ data }: CompetencyTrackingProps) {
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  const competencyProgress = data?.competencyProgress || [];

  const competencyData = [
    { name: 'Mathematics', current: 78, target: 85, students: 156 },
    { name: 'Science', current: 82, target: 80, students: 142 },
    { name: 'Language Arts', current: 75, target: 85, students: 168 },
    { name: 'Social Studies', current: 88, target: 85, students: 134 },
    { name: 'Critical Thinking', current: 72, target: 80, students: 129 },
    { name: 'Digital Literacy', current: 91, target: 85, students: 173 }
  ];

  const progressOverTime = [
    { month: 'Jan', math: 65, science: 70, language: 68, social: 72 },
    { month: 'Feb', math: 68, science: 73, language: 71, social: 75 },
    { month: 'Mar', math: 72, science: 76, language: 73, social: 78 },
    { month: 'Apr', math: 75, science: 79, language: 75, social: 82 },
    { month: 'May', math: 78, science: 82, language: 75, social: 85 },
    { month: 'Jun', math: 78, science: 82, language: 75, social: 88 }
  ];

  const radarData = competencyData.map(comp => ({
    subject: comp.name,
    current: comp.current,
    target: comp.target
  }));

  const getCompetencyStatus = (current: number, target: number) => {
    if (current >= target) return { status: 'achieved', color: 'bg-green-500' };
    if (current >= target * 0.9) return { status: 'close', color: 'bg-yellow-500' };
    return { status: 'needs-work', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-xl font-semibold">Competency Tracking</h2>
          <p className="text-muted-foreground">Monitor learning objectives and skill development</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="grade-6">Grade 6</SelectItem>
              <SelectItem value="grade-7">Grade 7</SelectItem>
              <SelectItem value="grade-8">Grade 8</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Competency Progress Over Time</CardTitle>
            <CardDescription>Skill development trends across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="math" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="science" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="language" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="social" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competency Radar</CardTitle>
            <CardDescription>Current vs target competency levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#ef4444" fill="transparent" strokeDasharray="5 5" />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Competencies</CardTitle>
          <CardDescription>Detailed breakdown of learning objectives by subject area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competencyData.map((competency, index) => {
              const status = getCompetencyStatus(competency.current, competency.target);
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold">{competency.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={status.color}>
                        {status.status === 'achieved' ? 'Target Achieved' : 
                         status.status === 'close' ? 'Close to Target' : 'Needs Improvement'}
                      </Badge>
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{competency.students}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{competency.current}%</div>
                      <div className="text-sm text-muted-foreground">Current Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{competency.target}%</div>
                      <div className="text-sm text-muted-foreground">Target Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {competency.current >= competency.target ? '+' : ''}{competency.current - competency.target}%
                      </div>
                      <div className="text-sm text-muted-foreground">Difference</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Target</span>
                      <span>{Math.min(100, (competency.current / competency.target) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(100, (competency.current / competency.target) * 100)} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-muted-foreground">
                      {competency.current >= competency.target ? 
                        'Target achieved! Consider setting higher goals.' :
                        `${competency.target - competency.current}% improvement needed to reach target.`
                      }
                    </div>
                    <Button variant="outline" size="sm">
                      <Target className="h-4 w-4 mr-1" />
                      Set Goals
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Students exceeding targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Emma Johnson', 'Michael Chen', 'Sarah Wilson'].map((student, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{student}</span>
                  <Badge variant="secondary">95%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Support</CardTitle>
            <CardDescription>Students below target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Alex Rodriguez', 'Jessica Lee', 'David Brown'].map((student, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{student}</span>
                  <Badge variant="destructive">62%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Latest competency milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Math proficiency target reached</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Science excellence award</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Digital literacy improvement</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}