import { useState } from "react";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  grade: string;
  subject: string;
  type: 'cover' | 'content' | 'activity' | 'assessment';
}

export interface GeneratedPage {
  id: string;
  title: string;
  content: string;
  type: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "basic-cover",
    name: "Basic Cover Page",
    description: "Simple cover page with title and author",
    category: "cover",
    grade: "all",
    subject: "all",
    type: "cover"
  },
  {
    id: "science-experiment",
    name: "Science Experiment",
    description: "Structured experiment page with materials and procedure",
    category: "science",
    grade: "6-8",
    subject: "science",
    type: "content"
  },
  {
    id: "math-problem-set",
    name: "Math Problem Set",
    description: "Problem solving page with examples and exercises",
    category: "mathematics",
    grade: "4-8",
    subject: "mathematics",
    type: "activity"
  },
  {
    id: "reading-comprehension",
    name: "Reading Comprehension",
    description: "Text passage with comprehension questions",
    category: "language",
    grade: "3-7",
    subject: "english",
    type: "assessment"
  },
  {
    id: "history-timeline",
    name: "History Timeline",
    description: "Interactive timeline for historical events",
    category: "social-studies",
    grade: "5-8",
    subject: "history",
    type: "content"
  }
];

export const PAGE_CATEGORIES = [
  { id: "cover", name: "Cover Pages", icon: "BookOpen" },
  { id: "content", name: "Content Pages", icon: "FileText" },
  { id: "activity", name: "Activities", icon: "Play" },
  { id: "assessment", name: "Assessments", icon: "CheckCircle" },
  { id: "interactive", name: "Interactive", icon: "MousePointer" }
];

export function usePageGenerators() {
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const selectTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
  };

  const generatePage = async (template: PageTemplate, pageData: any) => {
    setIsGenerating(true);
    
    try {
      let content = "";
      
      switch (template.type) {
        case "cover":
          content = generateCoverPageHTML(pageData);
          break;
        case "content":
          content = generateContentPageHTML(pageData);
          break;
        case "activity":
          content = generateActivityPageHTML(pageData);
          break;
        case "assessment":
          content = generateAssessmentPageHTML(pageData);
          break;
        default:
          content = generateBasicPageHTML(pageData);
      }

      const newPage: GeneratedPage = {
        id: `page_${Date.now()}`,
        title: pageData.title || template.name,
        content,
        type: template.type,
        metadata: {
          template: template.id,
          grade: pageData.grade || template.grade,
          subject: pageData.subject || template.subject,
          ...pageData
        },
        createdAt: new Date()
      };

      setGeneratedPages(prev => [newPage, ...prev]);
      return newPage;
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteGeneratedPage = (pageId: string) => {
    setGeneratedPages(prev => prev.filter(page => page.id !== pageId));
  };

  const duplicateGeneratedPage = (pageId: string) => {
    const page = generatedPages.find(p => p.id === pageId);
    if (page) {
      const duplicatedPage: GeneratedPage = {
        ...page,
        id: `page_${Date.now()}`,
        title: `${page.title} (Copy)`,
        createdAt: new Date()
      };
      setGeneratedPages(prev => [duplicatedPage, ...prev]);
    }
  };

  const filterTemplates = (category: string, grade?: string, subject?: string) => {
    return PAGE_TEMPLATES.filter(template => {
      if (category !== "all" && template.category !== category) return false;
      if (grade && template.grade !== "all" && !template.grade.includes(grade)) return false;
      if (subject && template.subject !== "all" && template.subject !== subject) return false;
      return true;
    });
  };

  const getTemplatesByCategory = (category: string) => {
    return PAGE_TEMPLATES.filter(template => template.category === category);
  };

  const exportPage = (page: GeneratedPage, format: 'html' | 'pdf' = 'html') => {
    if (format === 'html') {
      const blob = new Blob([page.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${page.title}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return {
    // State
    selectedTemplate,
    generatedPages,
    isGenerating,
    activeCategory,
    
    // Data
    templates: PAGE_TEMPLATES,
    categories: PAGE_CATEGORIES,
    
    // Actions
    selectTemplate,
    clearTemplate,
    generatePage,
    deleteGeneratedPage,
    duplicateGeneratedPage,
    exportPage,
    setActiveCategory,
    
    // Utilities
    filterTemplates,
    getTemplatesByCategory,
    
    // Computed
    filteredTemplates: filterTemplates(activeCategory),
    recentPages: generatedPages.slice(0, 5),
  };
}

// Helper functions for generating different types of pages
function generateCoverPageHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .cover-container {
      text-align: center;
      padding: 40px;
      max-width: 600px;
    }
    .title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .author {
      font-size: 24px;
      margin-bottom: 40px;
      opacity: 0.9;
    }
    .subject-grade {
      font-size: 18px;
      border: 2px solid #4ecdc4;
      padding: 10px 20px;
      border-radius: 25px;
      display: inline-block;
      background: rgba(255,255,255,0.1);
    }
  </style>
</head>
<body>
  <div class="cover-container">
    <h1 class="title">${data.title}</h1>
    <p class="author">by ${data.author || 'Author'}</p>
    <div class="subject-grade">${data.subject} - Grade ${data.grade}</div>
  </div>
</body>
</html>`;
}

function generateContentPageHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f8fafc;
      min-height: 100vh;
      color: #333;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .page-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #1e293b;
    }
    .content {
      line-height: 1.6;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <h1 class="page-title">${data.title}</h1>
    <div class="content">
      ${data.content || '<p>Content goes here...</p>'}
    </div>
  </div>
</body>
</html>`;
}

function generateActivityPageHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
      min-height: 100vh;
      color: #333;
    }
    .activity-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .activity-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #4f46e5;
    }
    .activity-section {
      margin: 20px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 10px;
      border-left: 4px solid #4f46e5;
    }
  </style>
</head>
<body>
  <div class="activity-container">
    <h1 class="activity-title">${data.title}</h1>
    <div class="activity-section">
      <h3>Instructions</h3>
      <p>${data.instructions || 'Activity instructions go here...'}</p>
    </div>
    <div class="activity-section">
      <h3>Activity</h3>
      <p>${data.activity || 'Activity content goes here...'}</p>
    </div>
  </div>
</body>
</html>`;
}

function generateAssessmentPageHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
      min-height: 100vh;
      color: #333;
    }
    .assessment-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .assessment-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #d97706;
    }
    .question {
      margin: 20px 0;
      padding: 15px;
      background: #fef3c7;
      border-radius: 10px;
      border-left: 4px solid #d97706;
    }
  </style>
</head>
<body>
  <div class="assessment-container">
    <h1 class="assessment-title">${data.title}</h1>
    <div class="question">
      <p><strong>Question 1:</strong> ${data.question1 || 'Sample question goes here?'}</p>
    </div>
    <div class="question">
      <p><strong>Question 2:</strong> ${data.question2 || 'Another question goes here?'}</p>
    </div>
  </div>
</body>
</html>`;
}

function generateBasicPageHTML(data: any): string {
  return generateContentPageHTML(data);
}