import { useGeneralPageGenerator } from "@/hooks/useGeneralPageGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Image, 
  PenTool, 
  Lightbulb, 
  StickyNote, 
  Play,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Eye
} from "lucide-react";

export default function GeneralPageGenerator() {
  const {
    pageContent,
    isGenerating,
    generatedHTML,
    sectionTypes,
    updatePageContent,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    duplicateSection,
    generatePageHTML,
    resetPage,
    hasContent,
    wordCount
  } = useGeneralPageGenerator();

  const getSectionIcon = (type: string) => {
    const icons = {
      text: FileText,
      image: Image,
      exercise: PenTool,
      example: Lightbulb,
      note: StickyNote,
      activity: Play,
    };
    const IconComponent = icons[type as keyof typeof icons] || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getSectionColor = (type: string) => {
    const colors = {
      text: 'bg-blue-50 border-blue-200',
      image: 'bg-purple-50 border-purple-200',
      exercise: 'bg-yellow-50 border-yellow-200',
      example: 'bg-green-50 border-green-200',
      note: 'bg-pink-50 border-pink-200',
      activity: 'bg-indigo-50 border-indigo-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">General Page Generator</h2>
          <p className="text-gray-600">Create educational content pages with multiple sections</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {wordCount} words
          </Badge>
          <Badge variant="outline">
            {pageContent.sections.length} sections
          </Badge>
        </div>
      </div>

      {/* Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={pageContent.title}
                onChange={(e) => updatePageContent({ title: e.target.value })}
                placeholder="Enter page title"
              />
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={pageContent.subject}
                onChange={(e) => updatePageContent({ subject: e.target.value })}
                placeholder="e.g., Mathematics"
              />
            </div>
            
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={pageContent.grade}
                onChange={(e) => updatePageContent({ grade: e.target.value })}
                placeholder="e.g., 8"
              />
            </div>
            
            <div>
              <Label htmlFor="pageNumber">Page Number</Label>
              <Input
                id="pageNumber"
                type="number"
                value={pageContent.pageNumber}
                onChange={(e) => updatePageContent({ pageNumber: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Sections</CardTitle>
          <Select onValueChange={(type) => addSection({ type: type as any, content: '' })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add section" />
            </SelectTrigger>
            <SelectContent>
              {sectionTypes.map(sectionType => (
                <SelectItem key={sectionType.value} value={sectionType.value}>
                  <div className="flex items-center space-x-2">
                    {getSectionIcon(sectionType.value)}
                    <span>{sectionType.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {pageContent.sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No sections added yet. Use the dropdown above to add content sections.</p>
            </div>
          ) : (
            pageContent.sections.map((section, index) => (
              <Card key={section.id} className={`border-2 ${getSectionColor(section.type)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getSectionIcon(section.type)}
                      <Badge variant="outline" className="text-xs">
                        {sectionTypes.find(t => t.value === section.type)?.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={index === pageContent.sections.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateSection(section.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(section.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor={`title-${section.id}`}>Section Title (Optional)</Label>
                    <Input
                      id={`title-${section.id}`}
                      value={section.title || ''}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      placeholder="Enter section title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`content-${section.id}`}
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      placeholder={`Enter ${section.type} content`}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={resetPage}>
          Reset Page
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={generatePageHTML}
            disabled={isGenerating || !pageContent.title}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate Page'}</span>
          </Button>
        </div>
      </div>

      {/* Preview */}
      {generatedHTML && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Page Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
              <iframe
                srcDoc={generatedHTML}
                className="w-full h-64 border-0"
                title="Page Preview"
              />
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([generatedHTML], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${pageContent.title || 'page'}-${pageContent.pageNumber}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download HTML
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedHTML);
                }}
              >
                Copy HTML
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}