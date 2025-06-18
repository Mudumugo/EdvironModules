import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  PenTool,
  BookOpen,
  Eye,
  Download,
  Star,
  DollarSign,
  TrendingUp,
  FileText,
  Video,
  Gamepad2,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Send,
  BarChart3
} from "lucide-react";

interface AuthoringStats {
  totalContent: number;
  published: number;
  inReview: number;
  drafts: number;
  viewsThisMonth: number;
  downloadsThisMonth: number;
  avgRating: number;
  revenue: number;
}

interface ContentItem {
  id: string;
  title: string;
  status: string;
  type: string;
  subject: string;
  grade: string;
  views: number;
  rating: number | null;
  lastModified: string;
  publishedDate?: string;
  submittedDate?: string;
}

export default function AuthoringDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/authoring/dashboard"],
    retry: false,
  }) as { data: { stats: AuthoringStats; recentContent: ContentItem[] } | undefined, isLoading: boolean };

  // Fetch taxonomy for content creation
  const { data: taxonomy } = useQuery({
    queryKey: ["/api/authoring/taxonomy"],
    retry: false,
  });

  const stats = dashboardData?.stats || {
    totalContent: 0,
    published: 0,
    inReview: 0,
    drafts: 0,
    viewsThisMonth: 0,
    downloadsThisMonth: 0,
    avgRating: 0,
    revenue: 0
  };

  const recentContent = dashboardData?.recentContent || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      in_review: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      draft: { variant: "outline" as const, icon: Edit, color: "text-gray-600" },
      rejected: { variant: "destructive" as const, icon: AlertCircle, color: "text-red-600" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getContentTypeIcon = (type: string) => {
    const icons = {
      textbook: BookOpen,
      video: Video,
      interactive: Gamepad2,
      simulation: BarChart3,
      assessment: FileText
    };
    
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authoring Dashboard</h1>
          <p className="text-gray-600">Create and manage educational content for the global library</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Content
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <span>{stats.published} published</span>
              <span>•</span>
              <span>{stats.drafts} drafts</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewsThisMonth.toLocaleString()}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}/5.0</div>
            <div className="text-xs text-gray-600">
              Based on user feedback
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <div className="text-xs text-green-600">
              {stats.downloadsThisMonth} downloads this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">My Content</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest published and in-progress content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getContentTypeIcon(content.type)}
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span>{content.subject}</span>
                          <span>•</span>
                          <span>{content.grade}</span>
                          {content.views > 0 && (
                            <>
                              <span>•</span>
                              <span>{content.views} views</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(content.status)}
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>Manage all your educational content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input placeholder="Search content..." className="flex-1" />
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {recentContent.map((content) => (
                  <Card key={content.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getContentTypeIcon(content.type)}
                          <div>
                            <h3 className="font-medium">{content.title}</h3>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <span>{content.subject} • {content.grade}</span>
                              {content.rating && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{content.rating}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(content.status)}
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create New Content Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>Add new educational resources to the global library</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Enter content title..." />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      placeholder="Describe your educational content..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {((taxonomy as any)?.subjects || []).map((subject: string) => (
                            <SelectItem key={subject} value={subject.toLowerCase()}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Grade Level</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {((taxonomy as any)?.gradelevels || []).map((grade: string) => (
                            <SelectItem key={grade} value={grade.toLowerCase()}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Content Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {((taxonomy as any)?.contentTypes || []).map((type: string) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Curriculum</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select curriculum" />
                      </SelectTrigger>
                      <SelectContent>
                        {((taxonomy as any)?.curricula || []).map((curriculum: string) => (
                          <SelectItem key={curriculum} value={curriculum.toLowerCase()}>
                            {curriculum}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Difficulty Level</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline">Save as Draft</Button>
                <Button>Continue to Editor</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Views</span>
                  <span className="font-bold">{stats.viewsThisMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Downloads</span>
                  <span className="font-bold">{stats.downloadsThisMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <span className="font-bold">{stats.avgRating}/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Revenue</span>
                  <span className="font-bold">${stats.revenue.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Published</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div 
                        className="h-full bg-green-500 rounded"
                        style={{ width: `${(stats.published / stats.totalContent) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{stats.published}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>In Review</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div 
                        className="h-full bg-yellow-500 rounded"
                        style={{ width: `${(stats.inReview / stats.totalContent) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{stats.inReview}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Drafts</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div 
                        className="h-full bg-gray-500 rounded"
                        style={{ width: `${(stats.drafts / stats.totalContent) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{stats.drafts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}