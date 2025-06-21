import { useState } from "react";

export interface BookTheme {
  id: string;
  name: string;
  background: string;
  accent: string;
  textColor: string;
}

export interface GeneratorConfig {
  title: string;
  author: string;
  subject: string;
  grade: string;
  theme: string;
  chapters: Array<{
    title: string;
    description: string;
    page?: number;
  }>;
}

export const BOOK_THEMES: BookTheme[] = [
  {
    id: 'default',
    name: 'Default',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#4ecdc4',
    textColor: 'white'
  },
  {
    id: 'science',
    name: 'Science',
    background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    accent: '#4ecdc4',
    textColor: 'white'
  },
  {
    id: 'math',
    name: 'Mathematics',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: '#ff6b6b',
    textColor: 'white'
  },
  {
    id: 'literature',
    name: 'Literature',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    accent: '#ff8a80',
    textColor: '#333'
  },
  {
    id: 'history',
    name: 'History',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    accent: '#ff6b6b',
    textColor: '#333'
  }
];

export function useBookGenerator() {
  const [config, setConfig] = useState<GeneratorConfig>({
    title: '',
    author: '',
    subject: '',
    grade: '',
    theme: 'default',
    chapters: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const updateConfig = (updates: Partial<GeneratorConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const addChapter = (chapter: { title: string; description: string }) => {
    setConfig(prev => ({
      ...prev,
      chapters: [...prev.chapters, { ...chapter, page: (prev.chapters.length + 1) * 10 }]
    }));
  };

  const removeChapter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index)
    }));
  };

  const updateChapter = (index: number, updates: Partial<typeof config.chapters[0]>) => {
    setConfig(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => 
        i === index ? { ...chapter, ...updates } : chapter
      )
    }));
  };

  const generateCoverPage = () => {
    const theme = BOOK_THEMES.find(t => t.id === config.theme) || BOOK_THEMES[0];
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background: ${theme.background};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: ${theme.textColor};
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
      opacity: 0.8;
      border: 2px solid ${theme.accent};
      padding: 10px 20px;
      border-radius: 25px;
      display: inline-block;
      background: rgba(255,255,255,0.1);
    }
  </style>
</head>
<body>
  <div class="cover-container">
    <h1 class="title">${config.title}</h1>
    <p class="author">by ${config.author}</p>
    <div class="subject-grade">${config.subject} - Grade ${config.grade}</div>
  </div>
</body>
</html>`;
  };

  const generateTableOfContents = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Table of Contents</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 40px;
      background: #f8fafc;
      min-height: 100vh;
    }
    .toc-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 40px;
    }
    .toc-title {
      font-size: 36px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 40px;
      color: #1e293b;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
    }
    .chapter-list {
      list-style: none;
      padding: 0;
    }
    .chapter-item {
      margin-bottom: 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    .chapter-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      text-decoration: none;
      color: #374151;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    .chapter-link:hover {
      background: #f3f4f6;
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .chapter-content {
      flex: 1;
    }
    .chapter-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .chapter-description {
      font-size: 14px;
      color: #6b7280;
    }
    .chapter-page {
      font-size: 16px;
      font-weight: 500;
      color: #3b82f6;
    }
  </style>
</head>
<body>
  <div class="toc-container">
    <h1 class="toc-title">Table of Contents</h1>
    <ul class="chapter-list">
      ${config.chapters.map((chapter, index) => `
        <li class="chapter-item">
          <a href="#chapter-${index + 1}" class="chapter-link">
            <div class="chapter-content">
              <div class="chapter-title">${chapter.title}</div>
              ${chapter.description ? `<div class="chapter-description">${chapter.description}</div>` : ''}
            </div>
            <div class="chapter-page">Page ${chapter.page || (index + 1) * 10}</div>
          </a>
        </li>
      `).join('')}
    </ul>
  </div>
</body>
</html>`;
  };

  const generateFullBook = async () => {
    setIsGenerating(true);
    try {
      const coverPage = generateCoverPage();
      const tocPage = generateTableOfContents();
      
      // Combine pages
      const fullContent = {
        cover: coverPage,
        tableOfContents: tocPage,
        chapters: config.chapters
      };
      
      setGeneratedContent(JSON.stringify(fullContent, null, 2));
      return fullContent;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetConfig = () => {
    setConfig({
      title: '',
      author: '',
      subject: '',
      grade: '',
      theme: 'default',
      chapters: []
    });
    setGeneratedContent('');
  };

  return {
    config,
    isGenerating,
    generatedContent,
    themes: BOOK_THEMES,
    updateConfig,
    addChapter,
    removeChapter,
    updateChapter,
    generateCoverPage,
    generateTableOfContents,
    generateFullBook,
    resetConfig
  };
}