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
import ScrivenerInspiredEditor from "./ScrivenerInspiredEditor";
import {
  BookOpen,
  FileText,
  Target,
  Calendar,
  Users,
  Settings,
  Eye,
  Edit3,
  CheckCircle,
  Clock,
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewProject, setPreviewProject] = useState<any>(null);
  const [currentPreviewPage, setCurrentPreviewPage] = useState(1);
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
    if (!selectedTemplate || !formData.title.trim() || !formData.subject || !formData.gradeLevel) {
      toast({
        title: "Missing Information",
        description: "Please select a template, enter a book title, subject, and grade level.",
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

  const handlePreviewBook = (project: any) => {
    setPreviewProject(project);
    setCurrentPreviewPage(1);
    setShowPreview(true);
  };

  const generatePreviewContent = (project: any) => {
    const totalPages = 15;
    const pages = [];

    // Cover page (HTML format like digital library)
    pages.push(`
      <div class="p-6 text-center">
        <h1 class="text-4xl font-bold mb-4 text-gray-800">${project.title}</h1>
        <p class="text-xl text-gray-600 mb-6">by Digital Learning Team</p>
        <div class="mb-8">
          <div class="mx-auto max-w-xs h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg shadow-lg flex items-center justify-center">
            <div class="text-center">
              <div class="text-6xl mb-2">📚</div>
              <p class="text-sm text-gray-600">${project.subject}</p>
            </div>
          </div>
        </div>
        <p class="text-gray-700">${project.description || `A comprehensive ${project.subject} textbook for ${project.gradeLevel} students`}</p>
        <div class="text-sm text-gray-500 mt-8">Page 1 of ${totalPages}</div>
      </div>
    `);

    // Table of contents (HTML format)
    pages.push(`
      <div class="p-6">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Table of Contents</h2>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-lg">Chapter 1: Introduction to ${project.subject}</span>
            <span class="text-gray-500">Page 3</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-lg">Chapter 2: Fundamental Concepts</span>
            <span class="text-gray-500">Page 5</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-lg">Chapter 3: Advanced Applications</span>
            <span class="text-gray-500">Page 8</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-lg">Interactive Exercises</span>
            <span class="text-gray-500">Page 11</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-lg">Practice Problems</span>
            <span class="text-gray-500">Page 13</span>
          </div>
        </div>
        <div class="text-sm text-gray-500 mt-8">Page 2 of ${totalPages}</div>
      </div>
    `);

    // Interactive content page
    pages.push(`
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-indigo-600">Chapter 1: Introduction to ${project.subject}</h2>
        <div class="mb-6">
          <p class="text-base leading-relaxed mb-4">
            Welcome to your journey in ${project.subject}. This subject is fundamental to understanding
            many concepts in modern education and real-world applications.
          </p>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 class="font-semibold text-blue-800 mb-3">📖 Key Definition</h3>
            <p class="text-blue-700">
              ${project.subject} encompasses the study and application of core principles that help us
              understand and solve complex problems in this field.
            </p>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 class="font-semibold text-green-800 mb-3">💡 Interactive Example</h3>
            <p class="text-green-700 mb-3">Try this interactive element:</p>
            <div class="flex items-center space-x-3">
              <input type="text" placeholder="Enter your answer" class="flex-1 p-2 border border-gray-300 rounded">
              <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Check</button>
            </div>
          </div>
        </div>
        <div class="text-sm text-gray-500">Page 3 of ${totalPages}</div>
      </div>
    `);

    // Video/multimedia page
    pages.push(`
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-purple-600">Interactive Learning Resources</h2>
        <div class="mb-6">
          <div class="bg-gray-100 rounded-lg p-8 text-center mb-6">
            <div class="bg-purple-500 text-white p-4 rounded-full inline-block mb-4">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5-7-5z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">Interactive Video: ${project.subject} Explained</h3>
            <p class="text-gray-600 mb-4">Watch this educational video to understand key concepts</p>
            <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">
              ▶ Play Video
            </button>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="font-semibold text-yellow-800 mb-3">🎯 Learning Outcomes</h3>
            <ul class="text-yellow-700 space-y-1">
              <li>• Understand core principles of ${project.subject}</li>
              <li>• Apply knowledge to practical scenarios</li>
              <li>• Develop problem-solving skills</li>
            </ul>
          </div>
        </div>
        <div class="text-sm text-gray-500">Page 4 of ${totalPages}</div>
      </div>
    `);

    // Quiz page
    pages.push(`
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6 text-purple-600">Chapter Quiz</h2>
        <p class="text-gray-600 mb-6">Test your understanding with these interactive questions.</p>
        
        <div class="space-y-6">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 class="font-semibold text-purple-800 mb-3">Question 1: What is the main focus of ${project.subject}?</h3>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="q1" class="mr-3">
                <span>Theoretical concepts only</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="q1" class="mr-3">
                <span>Practical applications and understanding</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="q1" class="mr-3">
                <span>Memorization of facts</span>
              </label>
            </div>
          </div>
          
          <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 w-full">
            Submit Quiz
          </button>
        </div>
        
        <div class="text-sm text-gray-500 mt-8">Page 5 of ${totalPages}</div>
      </div>
    `);

    return pages;
  };

  if (showEditor) {
    return <ScrivenerInspiredEditor />;
  }

  if (showPreview && previewProject) {
    const previewPages = generatePreviewContent(previewProject);
    const totalPages = previewPages.length;
    
    const renderPreviewPage = () => {
      const pageContent = previewPages[currentPreviewPage - 1];
      
      if (pageContent) {
        return (
          <div className="h-full overflow-auto bg-white dark:bg-gray-900">
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </div>
        );
      }
      
      return (
        <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Page not found</p>
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Book Preview</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{previewProject.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Monitor className="h-4 w-4" />
                <span>HTML5 Interactive Format</span>
                <span>•</span>
                <span>Page {currentPreviewPage} of {totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 relative">
            {renderPreviewPage()}
          </div>

          {/* Preview Navigation */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setCurrentPreviewPage(Math.max(1, currentPreviewPage - 1))}
              disabled={currentPreviewPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPreviewPage(i + 1)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    currentPreviewPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPreviewPage(Math.min(totalPages, currentPreviewPage + 1))}
              disabled={currentPreviewPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
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
                  disabled={!selectedTemplate || !formData.title.trim() || !formData.subject || !formData.gradeLevel || createProjectMutation.isPending}
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
                      Due: {new Date(project.deadline).toLocaleDateString()}
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
                  {projects.length > 0 ? Math.round(
                    projects.reduce((sum, p) => sum + (p.currentWords / p.targetWords), 0) / projects.length * 100
                  ) : 0}%
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