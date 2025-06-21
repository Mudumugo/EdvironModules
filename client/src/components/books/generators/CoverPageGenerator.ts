import { useBookGenerator, BOOK_THEMES } from "@/hooks/useBookGenerator";

export const generateCoverPage = (title: string, author: string, subject: string, grade: string, theme = 'default') => {
  const selectedTheme = BOOK_THEMES.find(t => t.id === theme) || BOOK_THEMES[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background: ${selectedTheme.background};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: ${selectedTheme.textColor};
    }
    .cover-container {
      text-align: center;
      padding: 40px;
      max-width: 600px;
      position: relative;
    }
    .title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      line-height: 1.2;
    }
    .author {
      font-size: 24px;
      margin-bottom: 40px;
      opacity: 0.9;
      font-weight: 300;
    }
    .subject-grade {
      font-size: 18px;
      opacity: 0.8;
      border: 2px solid ${selectedTheme.accent};
      padding: 10px 20px;
      border-radius: 25px;
      display: inline-block;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
    }
    .decorative-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      opacity: 0.1;
    }
    .circle {
      position: absolute;
      border-radius: 50%;
      background: ${selectedTheme.accent};
    }
    .circle-1 {
      width: 100px;
      height: 100px;
      top: 10%;
      right: 10%;
      animation: float 6s ease-in-out infinite;
    }
    .circle-2 {
      width: 60px;
      height: 60px;
      bottom: 15%;
      left: 15%;
      animation: float 4s ease-in-out infinite reverse;
    }
    .circle-3 {
      width: 80px;
      height: 80px;
      top: 60%;
      right: 20%;
      animation: float 5s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
  </style>
</head>
<body>
  <div class="cover-container">
    <div class="decorative-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    <h1 class="title">${title}</h1>
    <p class="author">by ${author}</p>
    <div class="subject-grade">${subject} - Grade ${grade}</div>
  </div>
</body>
</html>`;
};

// Export additional utility functions
export const generateTableOfContents = (chapters: Array<{title: string, description?: string, page?: number}>) => {
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
      ${chapters.map((chapter, index) => `
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