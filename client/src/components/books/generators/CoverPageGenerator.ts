export const generateCoverPage = (title: string, author: string, subject: string, grade: string, theme = 'default') => {
  const themes = {
    default: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: '#4ecdc4',
      textColor: 'white'
    },
    science: {
      background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      accent: '#4ecdc4',
      textColor: 'white'
    },
    math: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: '#ff6b6b',
      textColor: 'white'
    },
    literature: {
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      accent: '#ff8a80',
      textColor: '#333'
    },
    history: {
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      accent: '#ff6b6b',
      textColor: '#333'
    }
  };

  const selectedTheme = themes[theme] || themes.default;

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
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 30px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.3);
      padding: 80px 60px;
      text-align: center;
      max-width: 700px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .cover-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, ${selectedTheme.accent}, #45b7d1, ${selectedTheme.accent});
      border-radius: 30px 30px 0 0;
    }
    .cover-container::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: shimmer 6s ease-in-out infinite;
      pointer-events: none;
    }
    .title {
      font-size: 48px;
      font-weight: 900;
      margin-bottom: 25px;
      line-height: 1.2;
      text-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: titleGlow 4s ease-in-out infinite alternate;
      position: relative;
      z-index: 2;
    }
    .subtitle {
      font-size: 20px;
      margin-bottom: 40px;
      opacity: 0.9;
      font-weight: 300;
      letter-spacing: 1px;
      position: relative;
      z-index: 2;
    }
    .metadata {
      display: flex;
      justify-content: space-between;
      margin: 50px 0;
      position: relative;
      z-index: 2;
    }
    .metadata-item {
      background: rgba(255, 255, 255, 0.15);
      padding: 15px 25px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }
    .metadata-item:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
    .decorative-line {
      height: 2px;
      background: linear-gradient(90deg, transparent, ${selectedTheme.accent}, transparent);
      margin: 30px auto;
      width: 60%;
      border-radius: 2px;
      position: relative;
      z-index: 2;
    }
    .author-section {
      margin-top: 40px;
      position: relative;
      z-index: 2;
    }
    .author-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.7;
      margin-bottom: 8px;
    }
    .author-name {
      font-size: 24px;
      font-weight: 600;
      color: ${selectedTheme.accent};
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .grade-badge {
      position: absolute;
      top: 30px;
      right: 30px;
      background: ${selectedTheme.accent};
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
      animation: badgePulse 3s ease-in-out infinite;
    }
    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }
    .floating-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 8s ease-in-out infinite;
    }
    .floating-circle:nth-child(1) {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }
    .floating-circle:nth-child(2) {
      width: 120px;
      height: 120px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }
    .floating-circle:nth-child(3) {
      width: 60px;
      height: 60px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
    @keyframes titleGlow {
      0% { text-shadow: 0 4px 20px rgba(255,255,255,0.3); }
      100% { text-shadow: 0 4px 30px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.2); }
    }
    @keyframes shimmer {
      0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
      50% { transform: translate(-50%, -50%) rotate(180deg); }
    }
    @keyframes badgePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(90deg); }
      50% { transform: translateY(-10px) rotate(180deg); }
      75% { transform: translateY(-30px) rotate(270deg); }
    }
    @media (max-width: 768px) {
      .cover-container {
        padding: 60px 40px;
        margin: 20px;
      }
      .title {
        font-size: 36px;
      }
      .metadata {
        flex-direction: column;
        gap: 15px;
      }
      .grade-badge {
        position: static;
        margin-bottom: 20px;
        display: inline-block;
      }
    }
  </style>
</head>
<body>
  <div class="cover-container">
    <div class="grade-badge">Grade ${grade}</div>
    
    <div class="floating-elements">
      <div class="floating-circle"></div>
      <div class="floating-circle"></div>
      <div class="floating-circle"></div>
    </div>
    
    <h1 class="title">${title}</h1>
    <p class="subtitle">${subject}</p>
    
    <div class="decorative-line"></div>
    
    <div class="metadata">
      <div class="metadata-item">📚 ${subject}</div>
      <div class="metadata-item">🎓 Grade ${grade}</div>
      <div class="metadata-item">📅 ${new Date().getFullYear()}</div>
    </div>
    
    <div class="author-section">
      <div class="author-label">Author</div>
      <div class="author-name">${author}</div>
    </div>
  </div>
</body>
</html>`;
};

export const generateTableOfContentsPage = (title: string, chapters: any[]) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Table of Contents - ${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 40px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      color: #333;
    }
    .toc-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 50px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    .toc-title {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 40px;
      text-align: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .chapter-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .chapter-item {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      margin-bottom: 15px;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    .chapter-item:hover {
      transform: translateX(10px);
      border-color: #667eea;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
    }
    .chapter-link {
      display: flex;
      align-items: center;
      padding: 25px 30px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
    }
    .chapter-number {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      margin-right: 25px;
      flex-shrink: 0;
    }
    .chapter-content {
      flex: 1;
    }
    .chapter-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }
    .chapter-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    .chapter-page {
      font-size: 16px;
      color: #667eea;
      font-weight: 600;
      margin-left: 20px;
    }
    .progress-bar {
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 2px;
      margin: 30px 0;
      width: 60%;
    }
  </style>
</head>
<body>
  <div class="toc-container">
    <h1 class="toc-title">Table of Contents</h1>
    <div class="progress-bar"></div>
    
    <ul class="chapter-list">
      ${chapters.map((chapter, index) => `
        <li class="chapter-item">
          <a href="#chapter-${index + 1}" class="chapter-link">
            <div class="chapter-number">${index + 1}</div>
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

  <script>
    // Smooth scroll to chapters
    document.querySelectorAll('.chapter-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        // This would navigate to the actual chapter in a real implementation
        console.log('Navigating to:', this.getAttribute('href'));
      });
    });
  </script>
</body>
</html>`;
};