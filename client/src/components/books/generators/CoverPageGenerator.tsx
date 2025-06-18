// Cover page generator for educational books
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