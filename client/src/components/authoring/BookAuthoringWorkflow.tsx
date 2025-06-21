import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ScrivenerInspiredEditor from "./ScrivenerInspiredEditor";
import {
  BookOpen,
  FileText,
  Target,
  Calendar,
  Users,
  Archive,
  Settings,
  Play,
  Save,
  Share,
  Eye,
  Edit3,
  Layers,
  Bookmark,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface BookProject {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  targetWords: number;
  currentWords: number;
  deadline?: Date;
  status: 'planning' | 'writing' | 'editing' | 'review' | 'complete';
  chaptersCount: number;
  collaborators: string[];
  created: Date;
  modified: Date;
}

interface BookTemplate {
  id: string;
  name: string;
  description: string;
  structure: string[];
  targetAudience: string;
  estimatedPages: number;
}

export default function BookAuthoringWorkflow() {
  const [showEditor, setShowEditor] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    targetWords: '',
    description: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch book projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<BookProject[]>({
    queryKey: ['/api/authoring/book-projects'],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch book templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery<BookTemplate[]>({
    queryKey: ['/api/authoring/book-templates'],
    staleTime: 10 * 60 * 1000,
  });

  // Create new book project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      return apiRequest('/api/authoring/book-projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/book-projects'] });
      toast({
        title: "Book Project Created",
        description: `"${newProject.title}" has been created successfully.`,
      });
      setShowNewProjectDialog(false);
      setFormData({ title: '', subject: '', gradeLevel: '', targetWords: '', description: '' });
      setSelectedTemplate(null);
      setShowEditor(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create book project. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateProject = () => {
    if (!selectedTemplate || !formData.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a template and enter a book title.",
        variant: "destructive",
      });
      return;
    }

    const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
    createProjectMutation.mutate({
      ...formData,
      templateId: selectedTemplate,
      targetWords: parseInt(formData.targetWords) || selectedTemplateData?.estimatedPages * 250 || 25000,
      chaptersCount: selectedTemplateData?.structure.length || 8
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'editing': return 'bg-yellow-100 text-yellow-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'editing': return <Edit3 className="h-4 w-4" />;
      case 'writing': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const [projects] = useState<BookProject[]>([
    {
      id: 'proj1',
      title: 'Advanced Chemistry Textbook',
      description: 'Comprehensive chemistry textbook for Grade 11-12 students',
      subject: 'Chemistry',
      gradeLevel: 'Grade 11-12',
      targetWords: 50000,
      currentWords: 12450,
      deadline: new Date('2024-08-15'),
      status: 'writing',
      chaptersCount: 15,
      collaborators: ['Dr. Sarah Chen', 'Prof. Mike Johnson'],
      created: new Date('2024-05-01'),
      modified: new Date('2024-06-18')
    },
    {
      id: 'proj2',
      title: 'Introduction to Biology',
      description: 'Interactive biology textbook with multimedia content',
      subject: 'Biology',
      gradeLevel: 'Grade 9-10',
      targetWords: 35000,
      currentWords: 8200,
      status: 'planning',
      chaptersCount: 12,
      collaborators: ['Dr. Lisa Wang'],
      created: new Date('2024-06-10'),
      modified: new Date('2024-06-17')
    }
  ]);

  const [templates] = useState<BookTemplate[]>([
    {
      id: 'science-textbook',
      name: 'Science Textbook',
      description: 'Structured for scientific concepts with experiments and examples',
      structure: [
        'Introduction & Learning Objectives',
        'Theoretical Concepts',
        'Practical Applications',
        'Laboratory Experiments',
        'Real-world Examples',
        'Assessment & Review',
        'Further Reading'
      ],
      targetAudience: 'High School Students',
      estimatedPages: 200
    },
    {
      id: 'interactive-guide',
      name: 'Interactive Learning Guide',
      description: 'Multimedia-rich guide with interactive elements',
      structure: [
        'Welcome & Navigation',
        'Core Concepts',
        'Interactive Activities',
        'Case Studies',
        'Practice Exercises',
        'Progress Assessment',
        'Resources & References'
      ],
      targetAudience: 'Middle School Students',
      estimatedPages: 150
    },
    {
      id: 'research-handbook',
      name: 'Research Handbook',
      description: 'Comprehensive guide for research and reference',
      structure: [
        'Overview & Methodology',
        'Literature Review',
        'Research Findings',
        'Data Analysis',
        'Conclusions',
        'Appendices',
        'Bibliography'
      ],
      targetAudience: 'College Students',
      estimatedPages: 300
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'editing': return 'bg-yellow-100 text-yellow-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'planning': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'editing': return <Edit3 className="h-4 w-4" />;
      case 'writing': return <FileText className="h-4 w-4" />;
      case 'planning': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (showEditor) {
    return (
      <div className="h-screen">
        <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowEditor(false)}
            >
              ← Back to Projects
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold">Advanced Chemistry Textbook</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        <ScrivenerInspiredEditor />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Book Authoring Studio</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create comprehensive educational books with Scrivener-inspired tools
          </p>
        </div>
        <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
          <DialogTrigger asChild>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              New Book Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Book Project</DialogTitle>
              <DialogDescription>
                Choose a template and configure your book project settings
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="text-sm font-medium">Choose Template</label>
                <div className="grid gap-3 mt-2">
                  {templates.map(template => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all ${
                        selectedTemplate === template.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{template.targetAudience}</span>
                              <span>~{template.estimatedPages} pages</span>
                              <span>{template.structure.length} sections</span>
                            </div>
                          </div>
                          {selectedTemplate === template.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Book Title</label>
                  <Input 
                    placeholder="Enter book title..." 
                    className="mt-1"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Grade Level</label>
                  <Select value={formData.gradeLevel} onValueChange={(value) => setFormData({...formData, gradeLevel: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary (K-5)</SelectItem>
                      <SelectItem value="middle">Middle School (6-8)</SelectItem>
                      <SelectItem value="high">High School (9-12)</SelectItem>
                      <SelectItem value="college">College/University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Word Count</label>
                  <Input 
                    type="number" 
                    placeholder="e.g., 50000" 
                    className="mt-1"
                    value={formData.targetWords}
                    onChange={(e) => setFormData({...formData, targetWords: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Describe the book's content and objectives..."
                  className="mt-1 h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {selectedTemplate && (
                <div>
                  <label className="text-sm font-medium">Book Structure Preview</label>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      {templates.find(t => t.id === selectedTemplate)?.name} Structure:
                    </div>
                    <div className="space-y-1">
                      {templates.find(t => t.id === selectedTemplate)?.structure.map((section, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">{index + 1}.</span>
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateProject}
                  className="flex-1"
                  disabled={!selectedTemplate || !formData.title.trim() || createProjectMutation.isPending}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {createProjectMutation.isPending ? 'Creating...' : 'Create & Open Editor'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewProjectDialog(false);
                    setFormData({ title: '', subject: '', gradeLevel: '', targetWords: '', description: '' });
                    setSelectedTemplate(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {projectsLoading && (
        <div className="flex justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading book projects...</p>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!projectsLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {project.description}
                  </p>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between items-center text-sm">
                  <span>Progress</span>
                  <span>{project.currentWords.toLocaleString()} / {project.targetWords.toLocaleString()} words</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min((project.currentWords / project.targetWords) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Subject:</span>
                  <div className="font-medium">{project.subject}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                  <div className="font-medium">{project.gradeLevel}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Chapters:</span>
                  <div className="font-medium">{project.chaptersCount}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Contributors:</span>
                  <div className="font-medium">{project.collaborators.length}</div>
                </div>
              </div>

              {/* Deadline */}
              {project.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Due: {project.deadline.toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1"
                  onClick={() => setShowEditor(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Open Editor
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!projectsLoading && projects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No book projects yet</h3>
          <p className="text-gray-600 mb-6">Create your first book project to get started with authoring.</p>
          <Button onClick={() => setShowNewProjectDialog(true)}>
            <BookOpen className="h-4 w-4 mr-2" />
            Create Your First Book
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.currentWords, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {new Set(projects.flatMap(p => p.collaborators)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Collaborators</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    projects.reduce((sum, p) => sum + (p.currentWords / p.targetWords), 0) / projects.length * 100
                  )}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}