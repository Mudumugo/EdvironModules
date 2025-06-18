// Quiz and assessment generators for educational books
export const generateQuizPage = (quizNum: number, subject: string, grade: string) => {
  const questions = subject.includes('math') ? [
    { q: "What is 5 + 3?", options: ["6", "7", "8", "9"], correct: 2 },
    { q: "Which shape has 4 equal sides?", options: ["Triangle", "Circle", "Square", "Rectangle"], correct: 2 },
    { q: "What is 10 - 4?", options: ["5", "6", "7", "8"], correct: 1 }
  ] : subject.includes('science') ? [
    { q: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correct: 1 },
    { q: "What do plants need to grow?", options: ["Only water", "Only sunlight", "Water and sunlight", "Nothing"], correct: 2 },
    { q: "Which is the largest ocean?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 1 }
  ] : [
    { q: "What is the first letter of the alphabet?", options: ["B", "A", "C", "D"], correct: 1 },
    { q: "How many letters are in 'CAT'?", options: ["2", "3", "4", "5"], correct: 1 },
    { q: "What comes after 'B'?", options: ["A", "C", "D", "E"], correct: 1 }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz ${quizNum} - ${subject}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
    }
    .quiz-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .quiz-header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .quiz-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .quiz-info {
      font-size: 14px;
      opacity: 0.9;
    }
    .quiz-content {
      padding: 40px;
    }
    .question {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      border-left: 5px solid #f59e0b;
    }
    .question-number {
      font-weight: bold;
      color: #d97706;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .question-text {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #374151;
    }
    .options {
      display: grid;
      gap: 12px;
    }
    .option {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
    }
    .option:hover {
      border-color: #f59e0b;
      transform: translateX(5px);
    }
    .option.selected {
      border-color: #f59e0b;
      background: #fef3c7;
    }
    .option.correct {
      border-color: #10b981;
      background: #d1fae5;
    }
    .option.incorrect {
      border-color: #ef4444;
      background: #fee2e2;
    }
    .option-letter {
      background: #f59e0b;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 15px;
      font-size: 14px;
    }
    .submit-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      width: 100%;
      margin-top: 30px;
      transition: all 0.3s;
    }
    .submit-btn:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }
    .submit-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }
    .result {
      margin-top: 30px;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      display: none;
    }
    .result.show {
      display: block;
    }
    .result.excellent {
      background: #d1fae5;
      border: 2px solid #10b981;
      color: #065f46;
    }
    .result.good {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      color: #92400e;
    }
    .result.needs-work {
      background: #fee2e2;
      border: 2px solid #ef4444;
      color: #991b1b;
    }
    .result-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .result-score {
      font-size: 36px;
      font-weight: bold;
      margin: 15px 0;
    }
    .result-message {
      font-size: 16px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <div class="quiz-header">
      <div class="quiz-title">Quiz ${quizNum}</div>
      <div class="quiz-info">${subject.charAt(0).toUpperCase() + subject.slice(1)} • Grade ${grade}</div>
    </div>
    
    <div class="quiz-content">
      <form id="quizForm">
        ${questions.map((q, i) => `
          <div class="question">
            <div class="question-number">Question ${i + 1} of ${questions.length}</div>
            <div class="question-text">${q.q}</div>
            <div class="options">
              ${q.options.map((option, j) => `
                <label class="option" for="q${i}_${j}">
                  <input type="radio" name="q${i}" value="${j}" id="q${i}_${j}" style="display: none;">
                  <div class="option-letter">${String.fromCharCode(65 + j)}</div>
                  <span>${option}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
        
        <button type="submit" class="submit-btn">Submit Quiz</button>
      </form>
      
      <div id="result" class="result">
        <div class="result-title" id="resultTitle"></div>
        <div class="result-score" id="resultScore"></div>
        <div class="result-message" id="resultMessage"></div>
      </div>
    </div>
  </div>

  <script>
    const questions = ${JSON.stringify(questions)};
    const form = document.getElementById('quizForm');
    const result = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const resultScore = document.getElementById('resultScore');
    const resultMessage = document.getElementById('resultMessage');
    
    // Handle option selection
    document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', function() {
        const input = this.querySelector('input[type="radio"]');
        input.checked = true;
        
        // Remove selected class from siblings
        this.parentNode.querySelectorAll('.option').forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        this.classList.add('selected');
      });
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let score = 0;
      const totalQuestions = questions.length;
      
      // Check answers
      questions.forEach((q, i) => {
        const selectedValue = form.querySelector(\`input[name="q\${i}"]:checked\`)?.value;
        const questionDiv = form.querySelectorAll('.question')[i];
        const options = questionDiv.querySelectorAll('.option');
        
        options.forEach((option, j) => {
          if (j == q.correct) {
            option.classList.add('correct');
          } else if (selectedValue == j) {
            option.classList.add('incorrect');
          }
        });
        
        if (selectedValue == q.correct) {
          score++;
        }
      });
      
      // Calculate percentage
      const percentage = Math.round((score / totalQuestions) * 100);
      
      // Show results
      resultScore.textContent = \`\${score}/\${totalQuestions} (\${percentage}%)\`;
      
      if (percentage >= 80) {
        result.className = 'result show excellent';
        resultTitle.textContent = '🌟 Excellent work!';
        resultMessage.textContent = 'You have mastered this topic. Outstanding job!';
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
  </script>
</body>
</html>`;
};