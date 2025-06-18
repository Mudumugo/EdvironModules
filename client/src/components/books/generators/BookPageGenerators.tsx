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

  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="600" fill="#fefefe"/>
    <rect x="20" y="20" width="360" height="560" fill="white" stroke="#e5e7eb" stroke-width="1" rx="10"/>
    
    <!-- Quiz Header -->
    <rect x="40" y="40" width="320" height="60" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="10"/>
    <text x="200" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#92400e">Chapter ${quizNum} Quiz</text>
    <text x="200" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#a16207">Test your knowledge • ${grade}</text>
    
    <!-- Instructions -->
    <text x="40" y="130" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#374151">Instructions:</text>
    <text x="40" y="150" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">Choose the best answer for each question. Circle your choice.</text>
    
    ${questions.map((q, i) => `
      <g>
        <!-- Question -->
        <text x="40" y="${180 + i * 100}" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#1f2937">${i + 1}. ${q.q}</text>
        
        <!-- Options -->
        ${q.options.map((option, j) => `
          <g>
            <circle cx="50" cy="${195 + i * 100 + j * 20}" r="6" fill="none" stroke="#9ca3af" stroke-width="1"/>
            <text x="65" y="${200 + i * 100 + j * 20}" font-family="Arial, sans-serif" font-size="11" fill="#4b5563">${option}</text>
          </g>
        `).join('')}
        
        <!-- Answer Key (hidden) -->
        <text x="320" y="${180 + i * 100}" font-family="Arial, sans-serif" font-size="8" fill="#d1d5db">Answer: ${q.answer}</text>
      </g>
    `).join('')}
    
    <!-- Quiz Footer -->
    <rect x="40" y="520" width="320" height="40" fill="#f0fdf4" stroke="#22c55e" stroke-width="1" rx="6"/>
    <text x="200" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#15803d">Great job! Check your answers with your teacher.</text>
    <text x="200" y="555" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#16a34a">Score: ___/3</text>
    
    <text x="200" y="580" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">Quiz ${quizNum}</text>
  </svg>`;
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
  const content = [
    `Welcome to ${title}`,
    "",
    `This is page ${pageNum} of your textbook.`,
    "",
    "Learning objectives:",
    "• Understand key concepts",
    "• Practice new skills",
    "• Apply knowledge",
    "",
    "Take your time to read and understand.",
    "Ask questions if you need help!",
    "",
    "Interactive elements coming soon..."
  ];

  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="600" fill="#f8f9fa"/>
    <rect x="20" y="20" width="360" height="560" fill="white" stroke="#e5e7eb" stroke-width="1" rx="10"/>
    
    <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#1f2937">${title}</text>
    <text x="200" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">${grade} • Page ${pageNum}</text>
    <line x1="40" y1="100" x2="360" y2="100" stroke="#e5e7eb" stroke-width="2"/>
    
    ${content.map((line, i) => `
      <text x="40" y="${130 + i * 25}" font-family="Arial, sans-serif" font-size="14" fill="#374151">${line}</text>
    `).join('')}
    
    <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af">Page ${pageNum}</text>
  </svg>`;
};