// Utility functions to generate book pages
export const generateCoverPage = (title: string, author: string, subject: string, grade: string) => {
  const subjectColor = subject.includes('math') ? '#4f46e5' : 
                      subject.includes('science') ? '#059669' : 
                      subject.includes('language') ? '#d97706' : '#6b7280';
  
  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${subjectColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${subjectColor}88;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="600" fill="url(#coverGrad)"/>
    <rect x="30" y="100" width="340" height="400" fill="white" fill-opacity="0.95" rx="15"/>
    
    <!-- Subject Icon -->
    <circle cx="200" cy="150" r="25" fill="${subjectColor}" fill-opacity="0.2"/>
    <text x="200" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="${subjectColor}">
      ${subject.includes('math') ? '∑' : subject.includes('science') ? '⚗' : subject.includes('language') ? 'Aa' : '📖'}
    </text>
    
    <!-- Title -->
    <text x="200" y="230" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1f2937">${title}</text>
    
    <!-- Grade -->
    <text x="200" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">${grade} • ${subject}</text>
    
    <!-- Author -->
    <text x="200" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#374151">by ${author}</text>
    
    <!-- EdVirons Branding -->
    <text x="200" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${subjectColor}">EdVirons</text>
    <text x="200" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Educational Platform</text>
    
    <!-- Interactive Badge -->
    <rect x="150" y="460" width="100" height="30" fill="${subjectColor}" rx="15"/>
    <text x="200" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">Interactive Book</text>
    
    <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white">Click to start reading</text>
  </svg>`;
};

export const generateTableOfContents = (subject: string, grade: string) => {
  const chapters = subject.includes('math') ? [
    { title: "Introduction to Numbers", pages: "3-5" },
    { title: "Addition and Subtraction", pages: "6-9" },
    { title: "Shapes and Patterns", pages: "10-12" },
    { title: "Review and Assessment", pages: "13-15" }
  ] : subject.includes('science') ? [
    { title: "The Solar System", pages: "3-5" },
    { title: "Animal Habitats", pages: "6-8" },
    { title: "Weather and Climate", pages: "9-12" },
    { title: "Simple Machines", pages: "13-15" }
  ] : subject.includes('language') ? [
    { title: "Letters and Sounds", pages: "3-5" },
    { title: "Building Words", pages: "6-9" },
    { title: "Reading and Writing", pages: "10-13" }
  ] : [
    { title: "Introduction", pages: "3-5" },
    { title: "Core Concepts", pages: "6-9" },
    { title: "Advanced Topics", pages: "10-13" }
  ];

  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="600" fill="#fefefe"/>
    <rect x="20" y="20" width="360" height="560" fill="white" stroke="#e5e7eb" stroke-width="1" rx="10"/>
    
    <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#1f2937">Table of Contents</text>
    <line x1="60" y1="80" x2="340" y2="80" stroke="#d1d5db" stroke-width="2"/>
    
    ${chapters.map((chapter, i) => `
      <g>
        <text x="40" y="${120 + i * 50}" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#374151">Chapter ${i + 1}</text>
        <text x="40" y="${140 + i * 50}" font-family="Arial, sans-serif" font-size="14" fill="#4b5563">${chapter.title}</text>
        <text x="340" y="${140 + i * 50}" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Pages ${chapter.pages}</text>
        <line x1="40" y1="${145 + i * 50}" x2="340" y2="${145 + i * 50}" stroke="#f3f4f6" stroke-width="1"/>
      </g>
    `).join('')}
    
    <rect x="40" y="450" width="320" height="80" fill="#f8f9fa" stroke="#e5e7eb" rx="8"/>
    <text x="200" y="475" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151">How to Use This Book</text>
    <text x="50" y="495" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">📖 Read each chapter carefully</text>
    <text x="50" y="510" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">🎯 Complete practice exercises</text>
    <text x="50" y="525" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">📝 Take quizzes to test your knowledge</text>
    
    <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">Page 2</text>
  </svg>`;
};

export const generateChapterIntro = (chapterNum: string, chapterTitle: string, grade: string) => {
  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="600" fill="#fefefe"/>
    <rect x="20" y="20" width="360" height="560" fill="white" stroke="#e5e7eb" stroke-width="1" rx="10"/>
    
    <!-- Chapter Header -->
    <rect x="40" y="80" width="320" height="120" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" rx="12"/>
    <text x="200" y="115" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0369a1">${chapterNum}</text>
    <text x="200" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#0369a1">${chapterTitle}</text>
    <text x="200" y="165" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#0284c7">Grade ${grade}</text>
    <text x="200" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#0284c7">Interactive Learning Module</text>
    
    <!-- Learning Objectives -->
    <text x="40" y="240" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">Learning Objectives</text>
    <text x="50" y="265" font-family="Arial, sans-serif" font-size="13" fill="#4b5563">By the end of this chapter, you will be able to:</text>
    <text x="60" y="290" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">• Understand key concepts and terminology</text>
    <text x="60" y="310" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">• Apply new skills through practice exercises</text>
    <text x="60" y="330" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">• Demonstrate mastery in chapter quiz</text>
    
    <!-- What You'll Learn -->
    <rect x="40" y="360" width="320" height="120" fill="#fef7ff" stroke="#a855f7" stroke-width="1" rx="8"/>
    <text x="200" y="385" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#7c3aed">What You'll Learn</text>
    <text x="50" y="410" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">This chapter introduces fundamental concepts</text>
    <text x="50" y="430" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">with interactive examples and practice problems.</text>
    <text x="50" y="450" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">Complete all activities to master the material.</text>
    <text x="50" y="470" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">Take your time and ask for help when needed!</text>
    
    <!-- Ready to Start -->
    <rect x="140" y="510" width="120" height="35" fill="#10b981" rx="17"/>
    <text x="200" y="533" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="white" font-weight="bold">Ready to Start!</text>
    
    <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">Turn the page to begin</text>
  </svg>`;
};

export const generateQuizPage = (quizNum: number, subject: string, grade: string) => {
  const questions = subject === 'math' ? [
    { q: "What comes after 4?", options: ["A) 3", "B) 5", "C) 6"], answer: "B" },
    { q: "2 + 2 = ?", options: ["A) 3", "B) 4", "C) 5"], answer: "B" },
    { q: "Which is a circle?", options: ["A) ⬜", "B) ⭕", "C) 🔺"], answer: "B" }
  ] : subject === 'science' ? [
    { q: "How many planets are in our solar system?", options: ["A) 7", "B) 8", "C) 9"], answer: "B" },
    { q: "Where do fish live?", options: ["A) Desert", "B) Ocean", "C) Mountain"], answer: "B" },
    { q: "What do plants need to grow?", options: ["A) Water", "B) Ice", "C) Rocks"], answer: "A" }
  ] : subject === 'language' ? [
    { q: "What letter comes after A?", options: ["A) B", "B) C", "C) D"], answer: "A" },
    { q: "CAT has how many letters?", options: ["A) 2", "B) 3", "C) 4"], answer: "B" },
    { q: "Which is a complete sentence?", options: ["A) The dog", "B) Runs fast", "C) The dog runs"], answer: "C" }
  ] : [
    { q: "What is the main topic?", options: ["A) Math", "B) Science", "C) Learning"], answer: "C" },
    { q: "How many chapters are there?", options: ["A) 2", "B) 3", "C) 4"], answer: "B" },
    { q: "Why is practice important?", options: ["A) Fun", "B) Learning", "C) Time"], answer: "B" }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chapter ${quizNum} Quiz</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .quiz-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .quiz-header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .quiz-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .quiz-header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }
    .quiz-content {
      padding: 30px;
    }
    .instruction {
      background: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 15px;
      margin-bottom: 30px;
      border-radius: 0 8px 8px 0;
    }
    .question {
      margin-bottom: 30px;
      padding: 20px;
      border: 2px solid #f3f4f6;
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    .question:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }
    .question h3 {
      margin: 0 0 15px 0;
      color: #1f2937;
      font-size: 16px;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .option {
      display: flex;
      align-items: center;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #fafafa;
    }
    .option:hover {
      background: #f0f9ff;
      border-color: #3b82f6;
    }
    .option input[type="radio"] {
      margin-right: 12px;
      scale: 1.2;
    }
    .option.selected {
      background: #dbeafe;
      border-color: #3b82f6;
      color: #1d4ed8;
    }
    .option.correct {
      background: #dcfce7;
      border-color: #22c55e;
      color: #15803d;
    }
    .option.incorrect {
      background: #fee2e2;
      border-color: #ef4444;
      color: #dc2626;
    }
    .submit-btn {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s ease;
      margin-top: 20px;
    }
    .submit-btn:hover {
      transform: translateY(-2px);
    }
    .result {
      margin-top: 20px;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      font-weight: bold;
      display: none;
    }
    .result.show {
      display: block;
    }
    .result.excellent {
      background: #dcfce7;
      color: #15803d;
      border: 2px solid #22c55e;
    }
    .result.good {
      background: #fef3c7;
      color: #a16207;
      border: 2px solid #f59e0b;
    }
    .result.needs-work {
      background: #fee2e2;
      color: #dc2626;
      border: 2px solid #ef4444;
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0, -10px, 0); }
      70% { transform: translate3d(0, -5px, 0); }
      90% { transform: translate3d(0, -2px, 0); }
    }
    .animate-bounce {
      animation: bounce 1s ease infinite;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <div class="quiz-header">
      <h1>Chapter ${quizNum} Quiz</h1>
      <p>Test your knowledge • ${grade}</p>
    </div>
    
    <div class="quiz-content">
      <div class="instruction">
        <strong>Instructions:</strong> Choose the best answer for each question. Click Submit when you're done!
      </div>
      
      <form id="quizForm">
        ${questions.map((q, i) => `
          <div class="question" data-answer="${q.answer}">
            <h3>${i + 1}. ${q.q}</h3>
            <div class="options">
              ${q.options.map((option, j) => `
                <label class="option" data-value="${String.fromCharCode(65 + j)}">
                  <input type="radio" name="q${i}" value="${String.fromCharCode(65 + j)}">
                  ${option}
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
        
        <button type="submit" class="submit-btn">Submit Quiz</button>
      </form>
      
      <div id="result" class="result">
        <h3 id="resultTitle"></h3>
        <p id="resultMessage"></p>
        <p id="scoreDisplay"></p>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('quizForm');
      const result = document.getElementById('result');
      const resultTitle = document.getElementById('resultTitle');
      const resultMessage = document.getElementById('resultMessage');
      const scoreDisplay = document.getElementById('scoreDisplay');
      
      // Add click handlers for options
      document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
          const radio = this.querySelector('input[type="radio"]');
          radio.checked = true;
          
          // Remove selected class from siblings
          this.parentNode.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
          });
          
          // Add selected class to clicked option
          this.classList.add('selected');
        });
      });
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let score = 0;
        const totalQuestions = ${questions.length};
        
        document.querySelectorAll('.question').forEach((question, index) => {
          const correctAnswer = question.dataset.answer;
          const selectedOption = question.querySelector('input[type="radio"]:checked');
          
          if (selectedOption) {
            const selectedValue = selectedOption.value;
            const optionElements = question.querySelectorAll('.option');
            
            optionElements.forEach(opt => {
              const optValue = opt.dataset.value;
              if (optValue === correctAnswer) {
                opt.classList.add('correct');
              } else if (optValue === selectedValue && selectedValue !== correctAnswer) {
                opt.classList.add('incorrect');
              }
            });
            
            if (selectedValue === correctAnswer) {
              score++;
            }
          }
        });
        
        // Show results
        const percentage = Math.round((score / totalQuestions) * 100);
        scoreDisplay.textContent = \`Score: \${score}/\${totalQuestions} (\${percentage}%)\`;
        
        if (percentage >= 80) {
          result.className = 'result show excellent';
          resultTitle.textContent = '🎉 Excellent!';
          resultMessage.textContent = 'You have mastered this topic!';
        } else if (percentage >= 60) {
          result.className = 'result show good';
          resultTitle.textContent = '👏 Good job!';
          resultMessage.textContent = 'You\\'re doing well. Review the incorrect answers.';
        } else {
          result.className = 'result show needs-work';
          resultTitle.textContent = '📚 Keep studying!';
          resultMessage.textContent = 'Practice more and try again.';
        }
        
        // Scroll to results
        result.scrollIntoView({ behavior: 'smooth' });
        
        // Disable form
        form.style.opacity = '0.7';
        form.style.pointerEvents = 'none';
        
        // Send xAPI tracking data if available
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'quiz_completed',
            score: score,
            totalQuestions: totalQuestions,
            percentage: percentage,
            subject: '${subject}',
            grade: '${grade}',
            quizNumber: ${quizNum}
          }, '*');
        }
      });
    });
  </script>
</body>
</html>`;
};

export const generateFinalAssessment = (subject: string, grade: string) => {
  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="600" fill="#fefefe"/>
    <rect x="20" y="20" width="360" height="560" fill="white" stroke="#e5e7eb" stroke-width="1" rx="10"/>
    
    <!-- Assessment Header -->
    <rect x="40" y="40" width="320" height="80" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="2" rx="12"/>
    <text x="200" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#6b21a8">Final Assessment</text>
    <text x="200" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#7c3aed">${subject.charAt(0).toUpperCase() + subject.slice(1)} • ${grade}</text>
    <text x="200" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">Comprehensive Review</text>
    
    <!-- Congratulations -->
    <text x="200" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1f2937">🎉 Congratulations! 🎉</text>
    <text x="200" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#4b5563">You have completed all chapters in this book!</text>
    
    <!-- What You've Learned -->
    <rect x="40" y="210" width="320" height="150" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1" rx="8"/>
    <text x="200" y="235" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0369a1">What You've Accomplished</text>
    <text x="50" y="260" font-family="Arial, sans-serif" font-size="12" fill="#0284c7">✓ Completed all chapter readings</text>
    <text x="50" y="280" font-family="Arial, sans-serif" font-size="12" fill="#0284c7">✓ Practiced with interactive exercises</text>
    <text x="50" y="300" font-family="Arial, sans-serif" font-size="12" fill="#0284c7">✓ Took chapter quizzes</text>
    <text x="50" y="320" font-family="Arial, sans-serif" font-size="12" fill="#0284c7">✓ Mastered key concepts</text>
    <text x="50" y="340" font-family="Arial, sans-serif" font-size="12" fill="#0284c7">✓ Ready for next level!</text>
    
    <!-- Next Steps -->
    <rect x="40" y="380" width="320" height="100" fill="#fef7ff" stroke="#a855f7" stroke-width="1" rx="8"/>
    <text x="200" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#7c3aed">Next Steps</text>
    <text x="50" y="430" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">• Review any challenging topics</text>
    <text x="50" y="450" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">• Practice with additional exercises</text>
    <text x="50" y="470" font-family="Arial, sans-serif" font-size="12" fill="#8b5cf6">• Continue to the next book level</text>
    
    <!-- Certificate -->
    <rect x="100" y="500" width="200" height="50" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" rx="10"/>
    <text x="200" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#92400e">Certificate of Completion</text>
    <text x="200" y="535" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#a16207">You are a ${subject} champion!</text>
    
    <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">Final Page</text>
  </svg>`;
};

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
    .page-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .page-header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 40px;
    }
    .interactive-section {
      background: #f8fafc;
      border-radius: 12px;
      padding: 30px;
      margin: 20px 0;
      border-left: 5px solid #4f46e5;
    }
    .math-problem {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      padding: 20px;
      margin: 15px 0;
      transition: all 0.3s ease;
    }
    .math-problem:hover {
      border-color: #4f46e5;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
    }
    .number-button {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      margin: 5px;
      transition: all 0.2s ease;
      min-width: 60px;
    }
    .number-button:hover {
      background: #4338ca;
      transform: translateY(-2px);
    }
    .number-button.correct {
      background: #10b981;
      animation: bounce 0.6s ease;
    }
    .number-button.incorrect {
      background: #ef4444;
      animation: shake 0.6s ease;
    }
    .feedback {
      margin-top: 15px;
      padding: 15px;
      border-radius: 8px;
      font-weight: bold;
      text-align: center;
      display: none;
    }
    .feedback.correct {
      background: #d1fae5;
      color: #065f46;
      border: 2px solid #10b981;
    }
    .feedback.incorrect {
      background: #fee2e2;
      color: #991b1b;
      border: 2px solid #ef4444;
    }
    .progress-bar {
      background: #e5e7eb;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin: 20px 0;
    }
    .progress-fill {
      background: linear-gradient(90deg, #4f46e5, #10b981);
      height: 100%;
      width: 0%;
      transition: width 0.5s ease;
    }
    .learning-objective {
      background: #fff7ed;
      border: 2px solid #fb923c;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }
    .learning-objective h3 {
      color: #ea580c;
      margin: 0 0 15px 0;
    }
    .objective-item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .objective-item:hover {
      background: #fef3c7;
      transform: translateX(5px);
    }
    .objective-checkbox {
      margin-right: 15px;
      scale: 1.5;
    }
    .objective-item.completed {
      background: #dcfce7;
      text-decoration: line-through;
      opacity: 0.8;
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0, -10px, 0); }
      70% { transform: translate3d(0, -5px, 0); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .celebration {
      text-align: center;
      padding: 30px;
      display: none;
    }
    .celebration.show {
      display: block;
      animation: bounce 1s ease;
    }
    .interactive-element {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .interactive-element:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 25px rgba(251, 191, 36, 0.3);
    }
    .word-highlight {
      background: #fef3c7;
      padding: 2px 6px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .word-highlight:hover {
      background: #fbbf24;
      color: white;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="page-header">
      <h1>${title}</h1>
      <p>Page ${pageNum} • ${grade} • Interactive Learning</p>
    </div>
    
    <div class="content">
      <div class="learning-objective">
        <h3>📚 Learning Objectives</h3>
        <p>Check off each objective as you complete it:</p>
        
        <div class="objective-item" onclick="toggleObjective(this)">
          <input type="checkbox" class="objective-checkbox" />
          <span>Understand key concepts and definitions</span>
        </div>
        
        <div class="objective-item" onclick="toggleObjective(this)">
          <input type="checkbox" class="objective-checkbox" />
          <span>Practice new skills through interactive exercises</span>
        </div>
        
        <div class="objective-item" onclick="toggleObjective(this)">
          <input type="checkbox" class="objective-checkbox" />
          <span>Apply knowledge to real-world examples</span>
        </div>
        
        <div class="objective-item" onclick="toggleObjective(this)">
          <input type="checkbox" class="objective-checkbox" />
          <span>Complete assessment activities</span>
        </div>
      </div>

      <div class="interactive-section">
        <h2>🎯 Interactive Content</h2>
        <p>Welcome to <span class="word-highlight" onclick="showDefinition('textbook')">${title}</span>! 
        This is an interactive learning experience where you can <span class="word-highlight" onclick="showDefinition('engage')">engage</span> 
        with the content and track your progress.</p>
        
        <div class="interactive-element" onclick="startLearningMode()">
          <h3>🚀 Start Interactive Learning Mode</h3>
          <p>Click here to begin your personalized learning journey!</p>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" id="pageProgress"></div>
        </div>
        <p id="progressText">Page Progress: 0% complete</p>
      </div>

      <div class="interactive-section">
        <h2>💡 Quick Knowledge Check</h2>
        <p>Test your understanding with this quick question:</p>
        
        <div class="math-problem">
          <h3>What helps you learn best?</h3>
          <div class="button-group">
            <button class="number-button" onclick="checkLearningStyle('visual', this)">Visual aids</button>
            <button class="number-button" onclick="checkLearningStyle('hands-on', this)">Hands-on practice</button>
            <button class="number-button" onclick="checkLearningStyle('all', this)">All methods</button>
          </div>
          <div class="feedback" id="learningFeedback"></div>
        </div>
      </div>
      
      <div class="celebration" id="pageCelebration">
        <h2>🎉 Great Work!</h2>
        <p>You've completed this page successfully!</p>
        <p>Ready to move on to the next section?</p>
      </div>
    </div>
  </div>

  <script>
    let objectivesCompleted = 0;
    let totalObjectives = 4;
    let pageProgress = 0;
    
    function toggleObjective(element) {
      const checkbox = element.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      
      if (checkbox.checked) {
        element.classList.add('completed');
        objectivesCompleted++;
      } else {
        element.classList.remove('completed');
        objectivesCompleted--;
      }
      
      updateProgress();
      
      // Send tracking data
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'objective_completed',
          pageNumber: ${pageNum},
          objectivesCompleted: objectivesCompleted,
          totalObjectives: totalObjectives,
          grade: '${grade}'
        }, '*');
      }
    }
    
    function updateProgress() {
      const percentage = Math.min((objectivesCompleted / totalObjectives) * 100, 100);
      document.getElementById('pageProgress').style.width = percentage + '%';
      document.getElementById('progressText').textContent = \`Page Progress: \${Math.round(percentage)}% complete\`;
      
      if (percentage === 100) {
        setTimeout(() => {
          document.getElementById('pageCelebration').classList.add('show');
        }, 500);
      }
    }
    
    function showDefinition(word) {
      const definitions = {
        'textbook': 'A comprehensive learning resource designed to teach specific subjects',
        'engage': 'To actively participate and interact with learning materials'
      };
      
      alert('📖 Definition: ' + definitions[word]);
      
      // Track interaction
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'word_definition_viewed',
          word: word,
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