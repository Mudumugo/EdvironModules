import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  BookOpen, 
  FileText, 
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  StickyNote,
  Save,
  X,
  Folder,
  Archive,
  Search,
  Filter,
  Star,
  FolderOpen,
  User,
  Calendar,
  Clock,
  BookmarkPlus,
  Eye,
  Download,
  Video,
  Music,
  Image
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Notebook, Subject, Chapter, Topic, Page, StickyNote as StickyNoteType } from "@shared/schema";

// Form schemas
const notebookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  color: z.string().default("#3b82f6"),
});

const subjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().default("#3b82f6"),
});

const chapterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const topicSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  contentType: z.string().default("richtext"),
});

const stickyNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  color: z.string().default("#fbbf24"),
  positionX: z.number().default(0),
  positionY: z.number().default(0),
  width: z.number().default(200),
  height: z.number().default(150),
});

interface NotebookWithContent extends Notebook {
  subjects: (Subject & {
    chapters: (Chapter & {
      topics: (Topic & {
        pages: Page[];
      })[];
    })[];
  })[];
}

interface PageWithStickies extends Page {
  stickyNotes: StickyNoteType[];
}

interface LockerItem {
  id: number;
  userId: string;
  itemType: 'notebook' | 'resource' | 'bookmark';
  title: string;
  description?: string;
  originalResourceId?: number;
  content?: string;
  annotations?: any;
  metadata?: any;
  fileUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  category?: string;
  subject?: string;
  gradeLevel?: string;
  isPrivate: boolean;
  isOfflineAvailable: boolean;
  sizeMb?: number;
  views: number;
  lastAccessed?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyLocker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("notebooks");
  
  // Dialog states
  const [isNotebookDialogOpen, setIsNotebookDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isStickyDialogOpen, setIsStickyDialogOpen] = useState(false);
  const [selectedLockerItem, setSelectedLockerItem] = useState<LockerItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Current context states
  const [selectedNotebook, setSelectedNotebook] = useState<NotebookWithContent | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedPage, setSelectedPage] = useState<PageWithStickies | null>(null);
  
  // UI states
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageContent, setPageContent] = useState("");

  // Fetch notebooks
  const { data: notebooks = [], isLoading: isLoadingNotebooks } = useQuery({
    queryKey: ['/api/notebooks'],
  });

  // Fetch locker items (saved resources)
  const { data: lockerItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['/api/locker/items'],
  });

  // Fetch selected notebook details
  const { data: notebookDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['/api/notebooks', selectedNotebook?.id],
    enabled: !!selectedNotebook?.id,
  });

  // Fetch page details with sticky notes
  const { data: pageDetails, isLoading: isLoadingPage } = useQuery({
    queryKey: ['/api/pages', selectedPage?.id],
    enabled: !!selectedPage?.id,
  });

  // Forms
  const notebookForm = useForm({
    resolver: zodResolver(notebookSchema),
    defaultValues: { title: "", description: "", color: "#3b82f6" },
  });

  const subjectForm = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: "", description: "", color: "#3b82f6" },
  });

  const chapterForm = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: { name: "", description: "" },
  });

  const topicForm = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: { name: "", description: "" },
  });

  const pageForm = useForm({
    resolver: zodResolver(pageSchema),
    defaultValues: { title: "", content: "", contentType: "richtext" },
  });

  const stickyForm = useForm({
    resolver: zodResolver(stickyNoteSchema),
    defaultValues: { 
      content: "", 
      color: "#fbbf24", 
      positionX: 0, 
      positionY: 0, 
      width: 200, 
      height: 150 
    },
  });

  // Mutations
  const createNotebookMutation = useMutation({
    mutationFn: (data: z.infer<typeof notebookSchema>) => 
      apiRequest("POST", "/api/notebooks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      setIsNotebookDialogOpen(false);
      notebookForm.reset();
      toast({ title: "Success", description: "Notebook created successfully" });
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: (data: z.infer<typeof subjectSchema> & { notebookId: number }) => 
      apiRequest("POST", `/api/notebooks/${data.notebookId}/subjects`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks', selectedNotebook?.id] });
      setIsSubjectDialogOpen(false);
      subjectForm.reset();
      toast({ title: "Success", description: "Subject created successfully" });
    },
  });

  const createChapterMutation = useMutation({
    mutationFn: (data: z.infer<typeof chapterSchema> & { subjectId: number }) => 
      apiRequest("POST", `/api/subjects/${data.subjectId}/chapters`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks', selectedNotebook?.id] });
      setIsChapterDialogOpen(false);
      chapterForm.reset();
      toast({ title: "Success", description: "Chapter created successfully" });
    },
  });

  const createTopicMutation = useMutation({
    mutationFn: (data: z.infer<typeof topicSchema> & { chapterId: number }) => 
      apiRequest("POST", `/api/chapters/${data.chapterId}/topics`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks', selectedNotebook?.id] });
      setIsTopicDialogOpen(false);
      topicForm.reset();
      toast({ title: "Success", description: "Topic created successfully" });
    },
  });

  const createPageMutation = useMutation({
    mutationFn: (data: z.infer<typeof pageSchema> & { topicId: number }) => 
      apiRequest("POST", `/api/topics/${data.topicId}/pages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks', selectedNotebook?.id] });
      setIsPageDialogOpen(false);
      pageForm.reset();
      toast({ title: "Success", description: "Page created successfully" });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: (data: { id: number; content: string }) => 
      apiRequest("PUT", `/api/pages/${data.id}`, { content: data.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages', selectedPage?.id] });
      setEditingPage(null);
      toast({ title: "Success", description: "Page saved successfully" });
    },
  });

  const createStickyMutation = useMutation({
    mutationFn: (data: z.infer<typeof stickyNoteSchema> & { pageId: number }) => 
      apiRequest("POST", `/api/pages/${data.pageId}/sticky-notes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages', selectedPage?.id] });
      setIsStickyDialogOpen(false);
      stickyForm.reset();
      toast({ title: "Success", description: "Sticky note added successfully" });
    },
  });

  // Update selected notebook when details are fetched
  useEffect(() => {
    if (notebookDetails) {
      setSelectedNotebook(notebookDetails);
    }
  }, [notebookDetails]);

  // Update selected page when details are fetched
  useEffect(() => {
    if (pageDetails) {
      setSelectedPage(pageDetails);
      setPageContent(pageDetails.content || "");
    }
  }, [pageDetails]);

  // Handle form submissions
  const handleCreateNotebook = (data: z.infer<typeof notebookSchema>) => {
    createNotebookMutation.mutate(data);
  };

  const handleCreateSubject = (data: z.infer<typeof subjectSchema>) => {
    if (!selectedNotebook) return;
    createSubjectMutation.mutate({ ...data, notebookId: selectedNotebook.id });
  };

  const handleCreateChapter = (data: z.infer<typeof chapterSchema>) => {
    if (!selectedSubject) return;
    createChapterMutation.mutate({ ...data, subjectId: selectedSubject.id });
  };

  const handleCreateTopic = (data: z.infer<typeof topicSchema>) => {
    if (!selectedChapter) return;
    createTopicMutation.mutate({ ...data, chapterId: selectedChapter.id });
  };

  const handleCreatePage = (data: z.infer<typeof pageSchema>) => {
    if (!selectedTopic) return;
    createPageMutation.mutate({ ...data, topicId: selectedTopic.id });
  };

  const handleCreateSticky = (data: z.infer<typeof stickyNoteSchema>) => {
    if (!selectedPage) return;
    createStickyMutation.mutate({ ...data, pageId: selectedPage.id });
  };

  const handleSavePage = () => {
    if (!selectedPage) return;
    updatePageMutation.mutate({ id: selectedPage.id, content: pageContent });
  };

  // Toggle expansion
  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Navigation breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [];
    if (selectedNotebook) crumbs.push(selectedNotebook.title);
    if (selectedSubject) crumbs.push(selectedSubject.name);
    if (selectedChapter) crumbs.push(selectedChapter.name);
    if (selectedTopic) crumbs.push(selectedTopic.name);
    if (selectedPage) crumbs.push(selectedPage.title);
    return crumbs;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            My Digital Notebook
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and organize your study notes with subjects, chapters, topics, and pages
          </p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isNotebookDialogOpen} onOpenChange={setIsNotebookDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Notebook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Notebook</DialogTitle>
                <DialogDescription>
                  Create a new notebook to organize your study materials
                </DialogDescription>
              </DialogHeader>
              <Form {...notebookForm}>
                <form onSubmit={notebookForm.handleSubmit(handleCreateNotebook)} className="space-y-4">
                  <FormField
                    control={notebookForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notebook Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Mathematics Grade 12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notebookForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your notebook..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createNotebookMutation.isPending}>
                    Create Notebook
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumbs */}
      {getBreadcrumbs().length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          {getBreadcrumbs().map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
              <span>{crumb}</span>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notebook Navigator */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Notebooks</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsNotebookDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingNotebooks ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {notebooks.map((notebook: Notebook) => (
                    <div key={notebook.id} className="space-y-1">
                      <Button
                        variant={selectedNotebook?.id === notebook.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedNotebook(notebook as NotebookWithContent)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" style={{ color: notebook.color }} />
                        {notebook.title}
                      </Button>
                      
                      {selectedNotebook?.id === notebook.id && selectedNotebook.subjects && (
                        <div className="ml-4 space-y-1">
                          {selectedNotebook.subjects.map((subject) => (
                            <Collapsible key={subject.id}>
                              <div className="flex items-center">
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-auto"
                                    onClick={() => toggleExpanded(`subject-${subject.id}`)}
                                  >
                                    {expandedItems[`subject-${subject.id}`] ? 
                                      <ChevronDown className="h-3 w-3" /> : 
                                      <ChevronRight className="h-3 w-3" />
                                    }
                                  </Button>
                                </CollapsibleTrigger>
                                <Button
                                  variant={selectedSubject?.id === subject.id ? "secondary" : "ghost"}
                                  size="sm"
                                  className="flex-1 justify-start"
                                  onClick={() => setSelectedSubject(subject)}
                                >
                                  <Folder className="h-3 w-3 mr-1" style={{ color: subject.color }} />
                                  {subject.name}
                                </Button>
                              </div>
                              <CollapsibleContent className="ml-4">
                                {subject.chapters?.map((chapter) => (
                                  <Collapsible key={chapter.id}>
                                    <div className="flex items-center">
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-1 h-auto"
                                          onClick={() => toggleExpanded(`chapter-${chapter.id}`)}
                                        >
                                          {expandedItems[`chapter-${chapter.id}`] ? 
                                            <ChevronDown className="h-3 w-3" /> : 
                                            <ChevronRight className="h-3 w-3" />
                                          }
                                        </Button>
                                      </CollapsibleTrigger>
                                      <Button
                                        variant={selectedChapter?.id === chapter.id ? "secondary" : "ghost"}
                                        size="sm"
                                        className="flex-1 justify-start"
                                        onClick={() => setSelectedChapter(chapter)}
                                      >
                                        <FolderOpen className="h-3 w-3 mr-1" />
                                        {chapter.name}
                                      </Button>
                                    </div>
                                    <CollapsibleContent className="ml-4">
                                      {chapter.topics?.map((topic) => (
                                        <Collapsible key={topic.id}>
                                          <div className="flex items-center">
                                            <CollapsibleTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-1 h-auto"
                                                onClick={() => toggleExpanded(`topic-${topic.id}`)}
                                              >
                                                {expandedItems[`topic-${topic.id}`] ? 
                                                  <ChevronDown className="h-3 w-3" /> : 
                                                  <ChevronRight className="h-3 w-3" />
                                                }
                                              </Button>
                                            </CollapsibleTrigger>
                                            <Button
                                              variant={selectedTopic?.id === topic.id ? "secondary" : "ghost"}
                                              size="sm"
                                              className="flex-1 justify-start"
                                              onClick={() => setSelectedTopic(topic)}
                                            >
                                              <FileText className="h-3 w-3 mr-1" />
                                              {topic.name}
                                            </Button>
                                          </div>
                                          <CollapsibleContent className="ml-4">
                                            {topic.pages?.map((page) => (
                                              <Button
                                                key={page.id}
                                                variant={selectedPage?.id === page.id ? "secondary" : "ghost"}
                                                size="sm"
                                                className="w-full justify-start ml-2"
                                                onClick={() => setSelectedPage(page as PageWithStickies)}
                                              >
                                                <FileText className="h-3 w-3 mr-1" />
                                                {page.title}
                                              </Button>
                                            ))}
                                          </CollapsibleContent>
                                        </Collapsible>
                                      ))}
                                    </CollapsibleContent>
                                  </Collapsible>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {!selectedNotebook ? (
            // Welcome screen
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Welcome to Your Digital Notebook</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first notebook to start organizing your study materials
                </p>
                <Button onClick={() => setIsNotebookDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Notebook
                </Button>
              </CardContent>
            </Card>
          ) : selectedPage ? (
            // Page editor
            <Card className="h-[600px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedPage.title}</CardTitle>
                  <CardDescription>
                    Last updated: {new Date(selectedPage.updatedAt!).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsStickyDialogOpen(true)}
                  >
                    <StickyNote className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                  {editingPage ? (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleSavePage}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setEditingPage(selectedPage)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="h-[500px] overflow-y-auto">
                {editingPage ? (
                  <Textarea
                    value={pageContent}
                    onChange={(e) => setPageContent(e.target.value)}
                    placeholder="Start writing your notes..."
                    className="min-h-[400px] resize-none"
                  />
                ) : (
                  <div className="relative">
                    <div className="prose max-w-none">
                      {selectedPage.content ? (
                        <div className="whitespace-pre-wrap">{selectedPage.content}</div>
                      ) : (
                        <div className="text-muted-foreground italic">
                          This page is empty. Click Edit to start writing.
                        </div>
                      )}
                    </div>
                    
                    {/* Sticky Notes */}
                    {pageDetails?.stickyNotes?.map((sticky) => (
                      <div
                        key={sticky.id}
                        className="absolute p-2 rounded shadow-lg border"
                        style={{
                          left: sticky.positionX,
                          top: sticky.positionY,
                          width: sticky.width,
                          height: sticky.height,
                          backgroundColor: sticky.color,
                          transform: 'rotate(-2deg)'
                        }}
                      >
                        <div className="text-xs font-medium mb-1">Sticky Note</div>
                        <div className="text-sm">{sticky.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            // Structure management
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>
                  {selectedNotebook.title}
                  {selectedSubject && ` > ${selectedSubject.name}`}
                  {selectedChapter && ` > ${selectedChapter.name}`}
                  {selectedTopic && ` > ${selectedTopic.name}`}
                </CardTitle>
                <CardDescription>{selectedNotebook.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  {!selectedSubject && (
                    <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Subject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Subject</DialogTitle>
                        </DialogHeader>
                        <Form {...subjectForm}>
                          <form onSubmit={subjectForm.handleSubmit(handleCreateSubject)} className="space-y-4">
                            <FormField
                              control={subjectForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Algebra" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={subjectForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Describe the subject..." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full">Add Subject</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {selectedSubject && !selectedChapter && (
                    <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Chapter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Chapter to {selectedSubject.name}</DialogTitle>
                        </DialogHeader>
                        <Form {...chapterForm}>
                          <form onSubmit={chapterForm.handleSubmit(handleCreateChapter)} className="space-y-4">
                            <FormField
                              control={chapterForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Chapter Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Linear Equations" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={chapterForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Describe the chapter..." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full">Add Chapter</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {selectedChapter && !selectedTopic && (
                    <Dialog open={isTopicDialogOpen} onOpenChange={setIsTopicDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Topic
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Topic to {selectedChapter.name}</DialogTitle>
                        </DialogHeader>
                        <Form {...topicForm}>
                          <form onSubmit={topicForm.handleSubmit(handleCreateTopic)} className="space-y-4">
                            <FormField
                              control={topicForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Topic Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Solving Linear Equations" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={topicForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Describe the topic..." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full">Add Topic</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {selectedTopic && (
                    <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Page
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Page to {selectedTopic.name}</DialogTitle>
                        </DialogHeader>
                        <Form {...pageForm}>
                          <form onSubmit={pageForm.handleSubmit(handleCreatePage)} className="space-y-4">
                            <FormField
                              control={pageForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Page Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Practice Problems" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={pageForm.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Initial Content</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Start writing..." rows={5} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full">Add Page</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                {/* Content display based on selection */}
                <div className="text-center text-muted-foreground mt-8">
                  {!selectedSubject && "Select a subject or create a new one to start organizing your notes"}
                  {selectedSubject && !selectedChapter && "Select a chapter or create a new one to continue"}
                  {selectedChapter && !selectedTopic && "Select a topic or create a new one to continue"}
                  {selectedTopic && "Select a page or create a new one to start writing"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sticky Note Dialog */}
      <Dialog open={isStickyDialogOpen} onOpenChange={setIsStickyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sticky Note</DialogTitle>
            <DialogDescription>
              Add a sticky note to this page for quick reminders
            </DialogDescription>
          </DialogHeader>
          <Form {...stickyForm}>
            <form onSubmit={stickyForm.handleSubmit(handleCreateSticky)} className="space-y-4">
              <FormField
                control={stickyForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Write your note..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stickyForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="#fbbf24">Yellow</SelectItem>
                        <SelectItem value="#f87171">Red</SelectItem>
                        <SelectItem value="#60a5fa">Blue</SelectItem>
                        <SelectItem value="#34d399">Green</SelectItem>
                        <SelectItem value="#a78bfa">Purple</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Add Sticky Note</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}