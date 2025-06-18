export const generateMultimediaCoverPage = (title: string, author: string, subject: string, grade: string) => {
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .cover-container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 60px;
      text-align: center;
      max-width: 600px;
      position: relative;
      overflow: hidden;
    }
    .cover-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
    }
    .title {
      font-size: 3em;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .author {
      font-size: 1.5em;
      color: #7f8c8d;
      margin-bottom: 30px;
    }
    .subject-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-weight: 600;
      margin: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .grade-badge {
      display: inline-block;
      background: linear-gradient(135deg, #f093fb, #f5576c);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-weight: 600;
      margin: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .decoration {
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
    }
    .decoration-1 { top: -50px; right: -50px; }
    .decoration-2 { bottom: -50px; left: -50px; }
  </style>
</head>
<body>
  <div class="cover-container">
    <div class="decoration decoration-1"></div>
    <div class="decoration decoration-2"></div>
    <h1 class="title">${title}</h1>
    <p class="author">by ${author}</p>
    <div class="subject-badge">${subject}</div>
    <div class="grade-badge">Grade ${grade}</div>
  </div>
</body>
</html>`;
};

export const generateSimpleCoverPage = (title: string, author: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: Georgia, serif;
      margin: 0;
      padding: 60px;
      background: #f8f9fa;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cover-container {
      background: white;
      border: 2px solid #333;
      padding: 80px 60px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 2.5em;
      font-weight: bold;
      color: #333;
      margin-bottom: 40px;
      line-height: 1.2;
    }
    .author {
      font-size: 1.2em;
      color: #666;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="cover-container">
    <h1 class="title">${title}</h1>
    <p class="author">${author}</p>
  </div>
</body>
</html>`;
};