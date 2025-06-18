// Table of contents generator for educational books
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