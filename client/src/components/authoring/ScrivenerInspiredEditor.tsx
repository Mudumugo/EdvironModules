import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  FolderOpen,
  FileText,
  Search,
  Target,
  BookmarkPlus,
  Tag,
  Eye,
  Edit3,
  Save,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Table,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Settings,
  Filter,
  Calendar,
  User,
  Zap,
  BookOpen,
  Archive
} from "lucide-react";

interface DocumentNode {
  id: string;
  title: string;
  type: 'folder' | 'chapter' | 'scene' | 'note' | 'character' | 'research';
  content?: string;
  children?: DocumentNode[];
  expanded?: boolean;
  wordCount?: number;
  target?: number;
  status?: 'draft' | 'first-edit' | 'final' | 'complete';
  labels?: string[];
  created?: Date;
  modified?: Date;
}

interface ResearchItem {
  id: string;
  title: string;
  type: 'web' | 'pdf' | 'image' | 'note' | 'reference';
  content: string;
  url?: string;
  tags: string[];
  created: Date;
}

interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  description: string;
  traits: string[];
  notes: string;
  avatar?: string;
}

export default function ScrivenerInspiredEditor() {
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'corkboard' | 'outline'>('editor');
  const [editorMode, setEditorMode] = useState<'compose' | 'edit'>('compose');
  const [splitView, setSplitView] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [project] = useState({
    title: "Advanced Chemistry Textbook",
    target: 50000,
    current: 12450,
    deadline: "2024-08-15"
  });

  const [documents, setDocuments] = useState<DocumentNode[]>([
    {
      id: 'manuscript',
      title: 'Manuscript',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: 'ch1',
          title: 'Chapter 1: Introduction to Chemistry',
          type: 'chapter',
          wordCount: 2500,
          target: 3000,
          status: 'draft',
          labels: ['intro', 'fundamentals'],
          children: [
            {
              id: 'scene1-1',
              title: 'What is Chemistry?',
              type: 'scene',
              wordCount: 850,
              status: 'complete',
              content: 'Chemistry is the scientific study of matter, its properties, and interactions...'
            },
            {
              id: 'scene1-2',
              title: 'Importance in Daily Life',
              type: 'scene',
              wordCount: 720,
              status: 'first-edit'
            }
          ]
        },
        {
          id: 'ch2',
          title: 'Chapter 2: Atomic Structure',
          type: 'chapter',
          wordCount: 3200,
          target: 4000,
          status: 'draft',
          children: [
            {
              id: 'scene2-1',
              title: 'Discovery of the Atom',
              type: 'scene',
              wordCount: 1100,
              status: 'draft'
            }
          ]
        }
      ]
    },
    {
      id: 'research',
      title: 'Research',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: 'ref1',
          title: 'IUPAC Nomenclature Guidelines',
          type: 'research',
          content: 'International Union of Pure and Applied Chemistry standards...'
        },
        {
          id: 'ref2',
          title: 'Laboratory Safety Protocols',
          type: 'research'
        }
      ]
    },
    {
      id: 'characters',
      title: 'Key Figures',
      type: 'folder',
      expanded: false,
      children: [
        {
          id: 'char1',
          title: 'Marie Curie',
          type: 'character',
          content: 'Pioneering researcher in radioactivity...'
        },
        {
          id: 'char2',
          title: 'Dmitri Mendeleev',
          type: 'character'
        }
      ]
    }
  ]);

  const [research] = useState<ResearchItem[]>([
    {
      id: 'res1',
      title: 'Chemical Bond Types',
      type: 'web',
      content: 'Comprehensive overview of ionic, covalent, and metallic bonds...',
      url: 'https://example.com/bonds',
      tags: ['bonding', 'fundamentals'],
      created: new Date('2024-06-01')
    },
    {
      id: 'res2', 
      title: 'Periodic Table Evolution',
      type: 'pdf',
      content: 'Historical development of the periodic table...',
      tags: ['history', 'periodic-table'],
      created: new Date('2024-06-02')
    }
  ]);

  const [characters] = useState<Character[]>([
    {
      id: 'char1',
      name: 'Dr. Sarah Chen',
      role: 'protagonist',
      description: 'Modern chemistry professor who guides students through complex concepts',
      traits: ['patient', 'innovative', 'encouraging'],
      notes: 'Uses real-world examples to make chemistry accessible'
    },
    {
      id: 'char2',
      name: 'Alex Rodriguez',
      role: 'supporting',
      description: 'Curious student who asks insightful questions',
      traits: ['inquisitive', 'analytical', 'determined'],
      notes: 'Represents the reader\'s perspective and common questions'
    }
  ]);

  const renderDocumentTree = (nodes: DocumentNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-1 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded ${
            activeDocument === node.id ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.children) {
              setDocuments(prev => 
                prev.map(doc => 
                  doc.id === node.id ? { ...doc, expanded: !doc.expanded } : doc
                )
              );
            } else {
              setActiveDocument(node.id);
            }
          }}
        >
          {node.children ? (
            node.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="w-4" />
          )}
          
          {node.type === 'folder' && <FolderOpen className="h-4 w-4 text-yellow-600" />}
          {node.type === 'chapter' && <BookOpen className="h-4 w-4 text-blue-600" />}
          {node.type === 'scene' && <FileText className="h-4 w-4 text-green-600" />}
          {node.type === 'research' && <Archive className="h-4 w-4 text-purple-600" />}
          {node.type === 'character' && <User className="h-4 w-4 text-orange-600" />}
          
          <span className="flex-1 truncate">{node.title}</span>
          
          {node.wordCount && (
            <span className="text-xs text-gray-500">{node.wordCount}</span>
          )}
          
          {node.status && (
            <Badge 
              variant={node.status === 'complete' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {node.status}
            </Badge>
          )}
        </div>
        
        {node.children && node.expanded && (
          <div>
            {renderDocumentTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getActiveDocumentContent = () => {
    const findDocument = (nodes: DocumentNode[]): DocumentNode | null => {
      for (const node of nodes) {
        if (node.id === activeDocument) return node;
        if (node.children) {
          const found = findDocument(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findDocument(documents);
  };

  const activeDoc = getActiveDocumentContent();

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Underline className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {project.current.toLocaleString()} / {project.target.toLocaleString()} words
          </div>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(project.current / project.target) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'editor' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('editor')}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'corkboard' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('corkboard')}
          >
            <Target className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'outline' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('outline')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={showInspector ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setShowInspector(!showInspector)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Binder (Document Tree) */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full border-r bg-white dark:bg-gray-800">
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm">{project.title}</h3>
                <Button variant="ghost" size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-100px)]">
              <div className="p-2">
                {renderDocumentTree(documents)}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Editor Area */}
        <ResizablePanel defaultSize={showInspector ? 55 : 80}>
          <div className="h-full flex flex-col">
            {activeDoc ? (
              <>
                {/* Document Header */}
                <div className="p-3 border-b bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">{activeDoc.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {activeDoc.wordCount && (
                          <span>{activeDoc.wordCount} words</span>
                        )}
                        {activeDoc.target && (
                          <span>Target: {activeDoc.target}</span>
                        )}
                        {activeDoc.status && (
                          <Badge variant="secondary">{activeDoc.status}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={editorMode === 'compose' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setEditorMode('compose')}
                      >
                        Compose
                      </Button>
                      <Button
                        variant={editorMode === 'edit' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setEditorMode('edit')}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 p-6 bg-white dark:bg-gray-900">
                  {viewMode === 'editor' && (
                    <div className="max-w-4xl mx-auto">
                      <Textarea
                        placeholder="Start writing..."
                        value={activeDoc.content || ''}
                        className="min-h-[500px] border-none resize-none text-base leading-relaxed focus:ring-0"
                        style={{
                          fontFamily: editorMode === 'compose' ? 'Georgia, serif' : 'system-ui, sans-serif',
                          fontSize: editorMode === 'compose' ? '18px' : '14px',
                          lineHeight: editorMode === 'compose' ? '1.8' : '1.6'
                        }}
                      />
                    </div>
                  )}

                  {viewMode === 'corkboard' && (
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {activeDoc.children?.map(child => (
                        <Card key={child.id} className="h-40 cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm truncate">{child.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4">
                              {child.content || 'No content yet...'}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{child.wordCount || 0} words</span>
                              {child.status && (
                                <Badge variant="secondary" className="text-xs">{child.status}</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {viewMode === 'outline' && (
                    <div className="p-4 space-y-2">
                      {activeDoc.children?.map(child => (
                        <div key={child.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          <div className="flex-1">
                            <div className="font-medium">{child.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {child.content || 'No content'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">{child.wordCount || 0}</div>
                          {child.status && (
                            <Badge variant="secondary">{child.status}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a document to start writing</p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Inspector Panel */}
        {showInspector && (
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full border-l bg-white dark:bg-gray-800">
              <Tabs defaultValue="document" className="h-full">
                <TabsList className="grid w-full grid-cols-3 m-2">
                  <TabsTrigger value="document">Document</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="characters">Characters</TabsTrigger>
                </TabsList>

                <TabsContent value="document" className="p-4 space-y-4">
                  {activeDoc && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <select className="w-full mt-1 p-2 border rounded">
                          <option value="draft">Draft</option>
                          <option value="first-edit">First Edit</option>
                          <option value="final">Final</option>
                          <option value="complete">Complete</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Labels</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activeDoc.labels?.map(label => (
                            <Badge key={label} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                          <Button variant="ghost" size="sm">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Word Target</label>
                        <Input 
                          type="number" 
                          value={activeDoc.target || ''} 
                          className="mt-1"
                          placeholder="Set word target..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea 
                          placeholder="Document notes..."
                          className="mt-1 h-32"
                        />
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="research" className="p-4">
                  <ScrollArea className="h-[calc(100%-40px)]">
                    <div className="space-y-3">
                      {research.map(item => (
                        <Card key={item.id} className="p-3 cursor-pointer hover:shadow-sm">
                          <div className="flex items-start gap-2">
                            <Archive className="h-4 w-4 text-purple-600 mt-1" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{item.title}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {item.content}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="characters" className="p-4">
                  <ScrollArea className="h-[calc(100%-40px)]">
                    <div className="space-y-3">
                      {characters.map(character => (
                        <Card key={character.id} className="p-3">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-orange-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{character.name}</h4>
                              <Badge variant="outline" className="text-xs mt-1">
                                {character.role}
                              </Badge>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                {character.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {character.traits.map(trait => (
                                  <Badge key={trait} variant="secondary" className="text-xs">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
}