// General page generator for educational books
export const generateGeneralPage = (pageNum: number, title: string, grade: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Page ${pageNum}</title>
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
    .welcome-section {
      background: #f0f9ff;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      text-align: center;
      border: 2px solid #0ea5e9;
    }
    .welcome-title {
      font-size: 24px;
      font-weight: bold;
      color: #0369a1;
      margin-bottom: 15px;
    }
    .welcome-text {
      font-size: 16px;
      color: #0284c7;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .feature-card {
      background: #fef7ff;
      border: 2px solid #a855f7;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      transition: transform 0.3s;
    }
    .feature-card:hover {
      transform: translateY(-5px);
    }
    .feature-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    .feature-title {
      font-size: 18px;
      font-weight: bold;
      color: #7c3aed;
      margin-bottom: 10px;
    }
    .feature-description {
      font-size: 14px;
      color: #8b5cf6;
      line-height: 1.5;
    }
    .interactive-section {
      background: #fef3c7;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
      border: 2px solid #f59e0b;
    }
    .interactive-title {
      font-size: 20px;
      font-weight: bold;
      color: #d97706;
      margin-bottom: 20px;
      text-align: center;
    }
    .btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      margin: 8px;
      transition: all 0.3s;
      font-weight: 600;
    }
    .btn:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }
    .btn.secondary {
      background: #10b981;
    }
    .btn.secondary:hover {
      background: #059669;
    }
    .learning-tools {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 20px;
    }
    .number-button {
      background: #8b5cf6;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s;
      min-width: 50px;
    }
    .number-button:hover {
      background: #7c3aed;
      transform: scale(1.05);
    }
    .number-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }
    .number-button.correct {
      background: #10b981;
    }
    .feedback {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
      display: none;
    }
    .feedback.correct {
      background: #d1fae5;
      color: #065f46;
      border: 2px solid #10b981;
    }
    .footer-section {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 25px;
      margin-top: 30px;
      text-align: center;
      border: 1px solid #e5e7eb;
    }
    .page-number {
      font-size: 12px;
      color: #6b7280;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">${title}</div>
      <div class="page-info">Page ${pageNum} • Grade ${grade} • Interactive Learning</div>
    </div>
    
    <div class="content-area">
      <div class="welcome-section">
        <div class="welcome-title">🌟 Welcome to Interactive Learning! 🌟</div>
        <div class="welcome-text">
          This page introduces you to our interactive learning platform. Here you'll discover 
          how to make the most of your educational journey with engaging content, 
          interactive exercises, and personalized learning paths.
        </div>
        <button class="btn" onclick="startExploration()">Start Exploring</button>
      </div>
      
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <div class="feature-title">Interactive Content</div>
          <div class="feature-description">
            Engage with dynamic content that adapts to your learning style and pace.
          </div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <div class="feature-title">Practice Exercises</div>
          <div class="feature-description">
            Reinforce your learning with hands-on exercises and immediate feedback.
          </div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <div class="feature-title">Progress Tracking</div>
          <div class="feature-description">
            Monitor your progress and see how much you've learned along the way.
          </div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <div class="feature-title">Achievements</div>
          <div class="feature-description">
            Earn badges and certificates as you complete chapters and master topics.
          </div>
        </div>
      </div>
      
      <div class="interactive-section">
        <div class="interactive-title">🎮 Try Our Interactive Features</div>
        <p style="text-align: center; margin-bottom: 20px;">
          Click the buttons below to experience different types of interactive learning:
        </p>
        
        <div class="learning-tools">
          <button class="btn" onclick="startLearningMode()">Learning Mode</button>
          <button class="btn secondary" onclick="showProgress()">Show Progress</button>
          <button class="btn" onclick="takeQuickQuiz()">Quick Quiz</button>
        </div>
        
        <div style="margin-top: 30px;">
          <p style="text-align: center; font-weight: bold; color: #d97706;">
            🤔 Quick Question: What type of learning do you prefer?
          </p>
          <div class="learning-tools">
            <button class="number-button" onclick="checkLearningStyle('visual', this)">Visual</button>
            <button class="number-button" onclick="checkLearningStyle('hands-on', this)">Hands-on</button>
            <button class="number-button" onclick="checkLearningStyle('all', this)">All Types</button>
          </div>
          <div id="learningFeedback" class="feedback"></div>
        </div>
      </div>
      
      <div class="footer-section">
        <h3 style="color: #374151; margin-bottom: 15px;">Ready to Continue?</h3>
        <p style="color: #6b7280; margin-bottom: 20px;">
          You've learned about our interactive features. Let's move on to the next section!
        </p>
        <button class="btn" onclick="proceedToNext()">Continue Learning</button>
      </div>
      
      <div class="page-number">Page ${pageNum}</div>
    </div>
  </div>

  <script>
    function startExploration() {
      alert('🚀 Great choice! You are now ready to explore all the interactive features on this page.');
      
      // Track exploration start
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'exploration_started',
          pageNumber: ${pageNum},
          grade: '${grade}'
        }, '*');
      }
    }
    
    function showProgress() {
      alert('📊 Progress tracking helps you see how much you have learned. Keep up the great work!');
      
      // Track progress view
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'progress_viewed',
          pageNumber: ${pageNum},
          grade: '${grade}'
        }, '*');
      }
    }
    
    function takeQuickQuiz() {
      if (confirm('📝 Ready for a quick knowledge check? This will help reinforce what you have learned!')) {
        alert('Excellent! Quiz mode activated. Look for quiz questions throughout your learning journey.');
        
        // Track quiz activation
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'quiz_mode_activated',
            pageNumber: ${pageNum},
            grade: '${grade}'
          }, '*');
        }
      }
    }
    
    function proceedToNext() {
      alert('🎉 Wonderful! You are ready to continue your learning adventure. Keep up the excellent work!');
      
      // Track page completion
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'page_completed',
          pageNumber: ${pageNum},
          grade: '${grade}'
        }, '*');
      }
    }
    
    function startLearningMode() {
      alert('🚀 Interactive Learning Mode activated! You can now interact with all elements on this page.');
      document.body.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      
      // Track mode activation
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'learning_mode_activated',
          pageNumber: ${pageNum},
          grade: '${grade}'
        }, '*');
      }
    }
    
    function checkLearningStyle(style, button) {
      const feedback = document.getElementById('learningFeedback');
      const allButtons = button.parentNode.querySelectorAll('.number-button');
      
      // Disable all buttons
      allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
      });
      
      button.classList.add('correct');
      
      const responses = {
        'visual': 'Great choice! Visual learning helps many students understand concepts better.',
        'hands-on': 'Excellent! Hands-on practice is key to mastering new skills.',
        'all': 'Perfect answer! Different learning methods work best for different topics.'
      };
      
      feedback.textContent = '✅ ' + responses[style];
      feedback.className = 'feedback correct';
      feedback.style.display = 'block';
      
      // Track learning style preference
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'learning_style_selected',
          style: style,
          pageNumber: ${pageNum},
          grade: '${grade}'
        }, '*');
      }
    }
    
    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
      // Send page load tracking
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'page_loaded',
          pageNumber: ${pageNum},
          title: '${title}',
          grade: '${grade}'
        }, '*');
      }
    });
  </script>
</body>
</html>`;
};