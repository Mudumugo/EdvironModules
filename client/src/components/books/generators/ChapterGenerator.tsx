// Chapter introduction and content generators for educational books
export const generateChapterIntro = (chapterNum: string, chapterTitle: string, grade: string) => {
  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="600" fill="#fefefe"/>
    <rect x="20" y="20" width="360" height="560" fill="white" stroke="#e5e7eb" stroke-width="1" rx="10"/>
    
    <!-- Chapter Header -->
    <rect x="40" y="80" width="320" height="120" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" rx="12"/>
    <text x="200" y="115" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0369a1">${chapterNum}</text>
    <text x="200" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#0369a1">${chapterTitle}</text>
    <text x="200" y="165" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#0284c7">Grade ${grade}</text>
    <text x="200" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#0284c7">Click to begin your journey</text>
    
    <!-- Learning Objectives -->
    <rect x="40" y="220" width="320" height="120" fill="#ecfdf5" stroke="#10b981" stroke-width="1" rx="8"/>
    <text x="200" y="245" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#065f46">Learning Objectives</text>
    <text x="50" y="270" font-family="Arial, sans-serif" font-size="12" fill="#047857">🎯 Understand key concepts</text>
    <text x="50" y="290" font-family="Arial, sans-serif" font-size="12" fill="#047857">🧠 Practice problem-solving skills</text>
    <text x="50" y="310" font-family="Arial, sans-serif" font-size="12" fill="#047857">📝 Complete interactive exercises</text>
    <text x="50" y="330" font-family="Arial, sans-serif" font-size="12" fill="#047857">✅ Master chapter topics</text>
    
    <!-- Interactive Elements -->
    <rect x="40" y="360" width="150" height="40" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="1" rx="8"/>
    <text x="115" y="385" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b21a8">Interactive Content</text>
    
    <rect x="210" y="360" width="150" height="40" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" rx="8"/>
    <text x="285" y="385" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#92400e">Practice Exercises</text>
    
    <!-- Progress Indicator -->
    <rect x="40" y="420" width="320" height="60" fill="#f9fafb" stroke="#d1d5db" stroke-width="1" rx="8"/>
    <text x="200" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">Chapter Progress</text>
    <rect x="60" y="450" width="280" height="8" fill="#e5e7eb" rx="4"/>
    <rect x="60" y="450" width="28" height="8" fill="#10b981" rx="4"/>
    <text x="200" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">10% Complete</text>
    
    <!-- Start Button -->
    <rect x="150" y="500" width="100" height="35" fill="#3b82f6" stroke="#2563eb" stroke-width="2" rx="18"/>
    <text x="200" y="523" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">Start Chapter</text>
    
    <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">Page 3</text>
  </svg>`;
};

export const generateChapterContent = (chapterNum: string, chapterTitle: string, content: string, grade: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chapterTitle} - Chapter ${chapterNum}</title>
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
    .chapter-header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .chapter-number {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .chapter-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .grade-info {
      font-size: 14px;
      opacity: 0.9;
    }
    .content-area {
      padding: 40px;
      line-height: 1.8;
    }
    .content-text {
      font-size: 16px;
      margin-bottom: 25px;
      text-align: justify;
    }
    .highlight-box {
      background: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    .interactive-element {
      background: #fef7ff;
      border: 2px solid #a855f7;
      border-radius: 12px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    .btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin: 5px;
      transition: all 0.3s;
    }
    .btn:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }
    .progress-bar {
      background: #e5e7eb;
      height: 8px;
      border-radius: 4px;
      margin: 20px 0;
      overflow: hidden;
    }
    .progress-fill {
      background: #10b981;
      height: 100%;
      width: 30%;
      border-radius: 4px;
      transition: width 0.5s;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="chapter-header">
      <div class="chapter-number">Chapter ${chapterNum}</div>
      <div class="chapter-title">${chapterTitle}</div>
      <div class="grade-info">Grade ${grade} • Interactive Learning</div>
    </div>
    
    <div class="content-area">
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      
      <div class="content-text">
        ${content}
      </div>
      
      <div class="highlight-box">
        <strong>💡 Key Concept:</strong> This chapter introduces fundamental concepts that will be used throughout your learning journey. Take your time to understand each section.
      </div>
      
      <div class="interactive-element">
        <h3>🎯 Interactive Learning Check</h3>
        <p>Test your understanding with these quick questions:</p>
        <button class="btn" onclick="showQuestion(1)">Question 1</button>
        <button class="btn" onclick="showQuestion(2)">Question 2</button>
        <button class="btn" onclick="showQuestion(3)">Question 3</button>
        <div id="questionArea" style="margin-top: 20px; min-height: 50px;"></div>
      </div>
      
      <div style="text-align: center; margin-top: 40px;">
        <button class="btn" onclick="completeChapter()">Complete Chapter</button>
      </div>
    </div>
  </div>

  <script>
    function showQuestion(num) {
      const questions = {
        1: "What is the main topic of this chapter?",
        2: "How does this concept relate to real life?",
        3: "What will you learn next?"
      };
      
      document.getElementById('questionArea').innerHTML = 
        '<p><strong>Question ' + num + ':</strong> ' + questions[num] + '</p>' +
        '<input type="text" placeholder="Type your answer..." style="width: 300px; padding: 8px; margin: 10px; border-radius: 4px; border: 1px solid #ccc;">' +
        '<br><button class="btn" onclick="submitAnswer(' + num + ')">Submit Answer</button>';
    }
    
    function submitAnswer(num) {
      alert('Great job! Your answer has been recorded. Keep up the excellent work!');
      // Track answer submission
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'answer_submitted',
          question: num,
          chapter: '${chapterNum}',
          grade: '${grade}'
        }, '*');
      }
    }
    
    function completeChapter() {
      if (confirm('Mark this chapter as complete? You can always come back to review.')) {
        alert('🎉 Chapter completed! Great work! You can now proceed to the next chapter.');
        // Track chapter completion
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'chapter_completed',
            chapter: '${chapterNum}',
            title: '${chapterTitle}',
            grade: '${grade}'
          }, '*');
        }
      }
    }
    
    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
      // Animate progress bar
      setTimeout(() => {
        document.querySelector('.progress-fill').style.width = '60%';
      }, 1000);
      
      // Track page load
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'chapter_page_loaded',
          chapter: '${chapterNum}',
          title: '${chapterTitle}',
          grade: '${grade}'
        }, '*');
      }
    });
  </script>
</body>
</html>`;
};