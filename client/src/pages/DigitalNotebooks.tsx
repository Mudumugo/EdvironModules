import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Star, 
  MoreHorizontal,
  FolderOpen,
  FileText,
  Users,
  Share2,
  Settings,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Clock,
  Tag,
  Grid3X3,
  List
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notebook {
  id: number;
  title: string;
  color: string;
  sections: Section[];
  isShared: boolean;
  isFavorite: boolean;
  lastModified: string;
  collaborators: number;
}

interface Section {
  id: number;
  title: string;
  pages: Page[];
  isExpanded: boolean;
}

interface Page {
  id: number;
  title: string;
  preview: string;
  lastModified: string;
}

const mockNotebooks: Notebook[] = [
  {
    id: 1,
    title: "Mathematics Notes",
    color: "bg-blue-500",
    isShared: false,
    isFavorite: true,
    lastModified: "2 hours ago",
    collaborators: 0,
    sections: [
      {
        id: 1,
        title: "Algebra",
        isExpanded: true,
        pages: [
          { id: 1, title: "Linear Equations", preview: "Solving equations with one variable...", lastModified: "2 hours ago" },
          { id: 2, title: "Quadratic Functions", preview: "Graphing parabolas and finding roots...", lastModified: "1 day ago" }
        ]
      },
      {
        id: 2,
        title: "Geometry",
        isExpanded: false,
        pages: [
          { id: 3, title: "Triangle Properties", preview: "Angles, sides, and area calculations...", lastModified: "3 days ago" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Science Lab",
    color: "bg-green-500",
    isShared: true,
    isFavorite: false,
    lastModified: "1 day ago",
    collaborators: 3,
    sections: [
      {
        id: 3,
        title: "Chemistry",
        isExpanded: true,
        pages: [
          { id: 4, title: "Periodic Table", preview: "Elements and their properties...", lastModified: "1 day ago" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "History Timeline",
    color: "bg-purple-500",
    isShared: false,
    isFavorite: false,
    lastModified: "3 days ago",
    collaborators: 0,
    sections: [
      {
        id: 4,
        title: "World War II",
        isExpanded: false,
        pages: [
          { id: 5, title: "Key Events", preview: "Major battles and turning points...", lastModified: "3 days ago" }
        ]
      }
    ]
  }
];

export default function DigitalNotebooks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch notebooks from API
  const { data: notebooks, isLoading } = useQuery({
    queryKey: ['/api/notebooks'],
    select: (data) => data || []
  });

  const filteredNotebooks = (notebooks || []).filter((notebook: any) => 
    notebook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNotebook = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create notebook');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      toast({
        title: "Notebook Created",
        description: "Your new notebook has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create notebook. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateNotebook = () => {
    createNotebook.mutate({
      title: "New Notebook",
      color: "#8B5CF6"
    });
  };

  const handleNotebookSelect = (notebook: Notebook) => {
    setSelectedNotebook(notebook);
    setSelectedSection(null);
    setSelectedPage(null);
  };

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    setSelectedPage(null);
  };

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page);
  };

  const toggleSectionExpand = (sectionId: number) => {
    if (selectedNotebook) {
      const updatedSections = selectedNotebook.sections.map(section =>
        section.id === sectionId 
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      );
      setSelectedNotebook({ ...selectedNotebook, sections: updatedSections });
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Digital Notebooks</h1>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notebooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Button onClick={handleCreateNotebook} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Notebook
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Notebooks List */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Notebooks</h2>
              <Badge variant="secondary">{filteredNotebooks.length}</Badge>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotebooks.map((notebook: any) => (
                <Card 
                  key={notebook.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedNotebook?.id === notebook.id ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                  onClick={() => handleNotebookSelect(notebook)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded ${notebook.color} flex-shrink-0 mt-1`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {notebook.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            {notebook.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            {notebook.isShared && <Users className="h-3 w-3 text-blue-500" />}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  {notebook.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Settings
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{notebook.lastModified}</span>
                          {notebook.collaborators > 0 && (
                            <>
                              <span>•</span>
                              <span>{notebook.collaborators} collaborators</span>
                            </>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                          {notebook.pageCount || 0} pages
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Panel - Sections and Pages */}
        {selectedNotebook && (
          <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded ${selectedNotebook.color}`} />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {selectedNotebook.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  New Section
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {selectedNotebook.sections.map((section) => (
                  <div key={section.id}>
                    <div 
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        selectedSection?.id === section.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                      onClick={() => handleSectionSelect(section)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionExpand(section.id);
                        }}
                      >
                        {section.isExpanded ? 
                          <ChevronDown className="h-3 w-3" /> : 
                          <ChevronRight className="h-3 w-3" />
                        }
                      </Button>
                      <FolderOpen className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">{section.title}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {section.pages.length}
                      </Badge>
                    </div>
                    
                    {section.isExpanded && (
                      <div className="ml-6 space-y-1 mt-1">
                        {section.pages.map((page) => (
                          <div
                            key={page.id}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              selectedPage?.id === page.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                            }`}
                            onClick={() => handlePageSelect(page)}
                          >
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{page.title}</div>
                              <div className="text-xs text-gray-500 truncate">{page.preview}</div>
                            </div>
                          </div>
                        ))}
                        <div 
                          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="text-sm">Add page</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area - Page Editor */}
        <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col">
          {selectedPage ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPage.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>Last modified {selectedPage.lastModified}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </Button>
                    <Button variant="outline" size="sm">
                      <Tag className="h-4 w-4 mr-2" />
                      Tag
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 min-h-96 p-6">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <h3>Welcome to your digital notebook</h3>
                      <p>This is where you can write, draw, and organize your thoughts. The rich text editor supports:</p>
                      <ul>
                        <li>Formatting options (bold, italic, lists)</li>
                        <li>Mathematical equations</li>
                        <li>Images and drawings</li>
                        <li>Tables and charts</li>
                        <li>Collaborative editing</li>
                      </ul>
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        Rich text editor integration will be implemented with Microsoft OneNote-style functionality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : selectedNotebook ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Select a page to start editing
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Choose a page from the sections on the left, or create a new one.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Page
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Welcome to Digital Notebooks
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select a notebook from the left panel to get started, or create a new one.
                </p>
                <Button onClick={handleCreateNotebook} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Notebook
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}