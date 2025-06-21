import { useState } from "react";

export interface PageContent {
  title: string;
  grade: string;
  subject: string;
  pageNumber: number;
  sections: PageSection[];
}

export interface PageSection {
  id: string;
  type: 'text' | 'image' | 'exercise' | 'example' | 'note' | 'activity';
  title?: string;
  content: string;
  metadata?: Record<string, any>;
}

export const PAGE_SECTION_TYPES = [
  { value: 'text', label: 'Text Content', icon: 'FileText' },
  { value: 'image', label: 'Image', icon: 'Image' },
  { value: 'exercise', label: 'Exercise', icon: 'PenTool' },
  { value: 'example', label: 'Example', icon: 'Lightbulb' },
  { value: 'note', label: 'Note', icon: 'Sticky' },
  { value: 'activity', label: 'Activity', icon: 'Play' },
];

export function useGeneralPageGenerator() {
  const [pageContent, setPageContent] = useState<PageContent>({
    title: '',
    grade: '',
    subject: '',
    pageNumber: 1,
    sections: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState<string>('');

  const updatePageContent = (updates: Partial<PageContent>) => {
    setPageContent(prev => ({ ...prev, ...updates }));
  };

  const addSection = (section: Omit<PageSection, 'id'>) => {
    const newSection: PageSection = {
      ...section,
      id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setPageContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    setPageContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const removeSection = (sectionId: string) => {
    setPageContent(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setPageContent(prev => {
      const sections = [...prev.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= sections.length) return prev;
      
      // Swap sections
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      
      return { ...prev, sections };
    });
  };

  const generatePageHTML = () => {
    setIsGenerating(true);
    
    try {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageContent.title} - Page ${pageContent.pageNumber}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .page-header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .page-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .page-info {
      font-size: 14px;
      opacity: 0.9;
    }
    .content-area {
      padding: 40px;
    }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      border-radius: 12px;
    }
    .section-text {
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
    }
    .section-exercise {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
    }
    .section-example {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
    }
    .section-note {
      background: #fce7f3;
      border-left: 4px solid #ec4899;
    }
    .section-activity {
      background: #e0e7ff;
      border-left: 4px solid #6366f1;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #1f2937;
    }
    .section-content {
      line-height: 1.6;
      color: #374151;
    }
    .footer {
      background: #f1f5f9;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
    .interactive-element {
      background: #dbeafe;
      border: 2px dashed #3b82f6;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .interactive-element:hover {
      background: #bfdbfe;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">${pageContent.title}</div>
      <div class="page-info">
        ${pageContent.subject} • Grade ${pageContent.grade} • Page ${pageContent.pageNumber}
      </div>
    </div>
    
    <div class="content-area">
      ${pageContent.sections.map(section => `
        <div class="section section-${section.type}">
          ${section.title ? `<div class="section-title">${section.title}</div>` : ''}
          <div class="section-content">
            ${section.type === 'activity' ? 
              `<div class="interactive-element">
                <strong>Interactive Activity:</strong><br>
                ${section.content}
              </div>` :
              section.content
            }
          </div>
        </div>
      `).join('')}
      
      ${pageContent.sections.length === 0 ? `
        <div class="section section-text">
          <div class="section-title">Welcome to ${pageContent.title}</div>
          <div class="section-content">
            <p>This is your educational content page. Add sections above to build your lesson!</p>
            <p>You can include text, images, exercises, examples, notes, and interactive activities.</p>
          </div>
        </div>
      ` : ''}
    </div>
    
    <div class="footer">
      Page ${pageContent.pageNumber} • Generated for ${pageContent.subject} - Grade ${pageContent.grade}
    </div>
  </div>

  <script>
    // Add interactivity to activity elements
    document.querySelectorAll('.interactive-element').forEach(element => {
      element.addEventListener('click', function() {
        this.style.background = '#93c5fd';
        setTimeout(() => {
          this.style.background = '#dbeafe';
        }, 300);
      });
    });
  </script>
</body>
</html>`;

      setGeneratedHTML(html);
      return html;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPage = () => {
    setPageContent({
      title: '',
      grade: '',
      subject: '',
      pageNumber: 1,
      sections: []
    });
    setGeneratedHTML('');
  };

  const duplicateSection = (sectionId: string) => {
    const section = pageContent.sections.find(s => s.id === sectionId);
    if (section) {
      addSection({
        type: section.type,
        title: `${section.title} (Copy)`,
        content: section.content,
        metadata: section.metadata
      });
    }
  };

  return {
    pageContent,
    isGenerating,
    generatedHTML,
    sectionTypes: PAGE_SECTION_TYPES,
    
    // Actions
    updatePageContent,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    duplicateSection,
    generatePageHTML,
    resetPage,
    
    // Computed
    hasContent: pageContent.sections.length > 0,
    wordCount: pageContent.sections.reduce((count, section) => 
      count + (section.content?.split(' ').length || 0), 0
    ),
  };
}