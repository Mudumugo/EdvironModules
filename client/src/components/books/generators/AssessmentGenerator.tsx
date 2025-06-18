// Assessment and completion generators for educational books
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