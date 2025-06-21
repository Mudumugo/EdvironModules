import type { LibraryResource } from "@/pages/DigitalLibraryNew";

export interface BookConfig {
  id: number;
  title: string;
  author: string;
  pages: string[];
  totalPages: number;
  thumbnailUrl?: string;
  description: string;
  grade: string;
  subject: string;
  language: string;
  type: string;
  isInteractive: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  xapiEnabled: boolean;
  content: string;
  mediaAssets: any[];
  interactiveElements: any[];
  trackingConfig: {
    trackPageViews: boolean;
    trackReadingTime: boolean;
    trackCompletionRate: boolean;
  };
}

// Resource types that should use the enhanced BookViewer
export const BOOK_VIEWER_TYPES = [
  'book',
  'ebook',
  'textbook',
  'storybook',
  'interactive_book',
  'flipbook',
  'digital_book',
  'reading_material'
];

// Resource types that should use the WorksheetViewer
export const WORKSHEET_VIEWER_TYPES = [
  'worksheet',
  'workbook',
  'exercise',
  'practice',
  'assignment',
  'activity',
  'quiz',
  'test'
];

// Check if a resource should use the enhanced BookViewer
export function shouldUseBookViewer(resource: any): boolean {
  const resourceType = resource.resourceType || resource.type || '';
  return BOOK_VIEWER_TYPES.includes(resourceType.toLowerCase());
}

// Check if a resource should use the WorksheetViewer
export function shouldUseWorksheetViewer(resource: any): boolean {
  const resourceType = resource.resourceType || resource.type || '';
  return WORKSHEET_VIEWER_TYPES.includes(resourceType.toLowerCase());
}

// Convert a resource to BookConfig format
export function convertResourceToBookConfig(resource: any): BookConfig {
  return {
    id: parseInt(resource.id.replace('lib_', '')) || 1,
    title: resource.title || 'Untitled',
    author: resource.author || 'Digital Learning Team',
    pages: generateBookPages(resource),
    totalPages: 15, // Updated to match new content
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description || '',
    grade: resource.grade || '',
    subject: resource.subject || '',
    language: resource.language || 'English',
    type: resource.resourceType || resource.type || 'book',
    isInteractive: true, // Enable interactive features
    hasVideo: true, // Include video content
    hasAudio: true, // Include audio elements
    xapiEnabled: true, // Enable learning analytics
    content: resource.content || generateBookContent(resource),
    mediaAssets: [
      {
        id: 'video_limits',
        type: 'video',
        title: 'Understanding Limits',
        url: '/demo/calculus-limits.mp4',
        duration: 330,
        thumbnail: '/demo/limits-thumb.jpg'
      },
      {
        id: 'audio_pronunciation',
        type: 'audio', 
        title: 'Mathematical Terms Pronunciation',
        url: '/demo/math-pronunciation.mp3',
        duration: 180
      }
    ],
    interactiveElements: [
      {
        id: 'graph_plotter',
        type: 'widget',
        title: 'Interactive Function Grapher',
        page: 4,
        config: { allowDragging: true, showGrid: true }
      },
      {
        id: 'limit_calculator',
        type: 'calculator',
        title: 'Limit Calculator',
        page: 6,
        config: { stepByStep: true, showWork: true }
      },
      {
        id: 'quiz_limits',
        type: 'assessment',
        title: 'Limits Quiz',
        page: 7,
        config: { questions: 2, timeLimit: 300, showFeedback: true }
      }
    ],
    trackingConfig: {
      trackPageViews: true,
      trackReadingTime: true,
      trackCompletionRate: true,
    }
  };
}

// Generate sample book pages for demo with interactive content
function generateBookPages(resource: any): string[] {
  const pages = [];
  const totalPages = 15;
  
  // Cover page
  pages.push(`
    <div class="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 h-full flex flex-col justify-center">
      <div class="mb-8">
        <div class="w-24 h-24 mx-auto mb-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold mb-4 text-gray-800">${resource.title}</h1>
        <p class="text-lg text-gray-600 mb-8">${resource.description}</p>
        <div class="flex justify-center space-x-4">
          <span class="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">Grade ${resource.grade}</span>
          <span class="px-3 py-1 bg-green-500 text-white rounded-full text-sm">${resource.subject}</span>
        </div>
      </div>
      <div class="text-sm text-gray-500">
        <p>Interactive Digital Edition</p>
        <p>Tap anywhere to begin</p>
      </div>
    </div>
  `);

  // Table of Contents
  pages.push(`
    <div class="p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Table of Contents</h2>
      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="font-semibold">Chapter 1: Introduction to Functions</span>
          <span class="text-blue-500">Page 3</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="font-semibold">Chapter 2: Limits and Continuity</span>
          <span class="text-blue-500">Page 5</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="font-semibold">Chapter 3: Derivatives</span>
          <span class="text-blue-500">Page 8</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="font-semibold">Chapter 4: Integration</span>
          <span class="text-blue-500">Page 11</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="font-semibold">Practice Problems</span>
          <span class="text-blue-500">Page 14</span>
        </div>
      </div>
    </div>
  `);

  // Chapter 1: Introduction with interactive elements
  pages.push(`
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-blue-600">Chapter 1: Introduction to Functions</h2>
      
      <div class="mb-6">
        <p class="text-base leading-relaxed mb-4">
          A function is a mathematical relationship between two sets of numbers, where each input value 
          corresponds to exactly one output value.
        </p>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
          <h3 class="font-semibold text-blue-800 mb-2">💡 Interactive Definition</h3>
          <p class="text-blue-700">Click the examples below to see how functions work:</p>
          
          <div class="mt-4 space-y-2">
            <div class="bg-white p-3 rounded cursor-pointer hover:bg-blue-100 border border-blue-200">
              <strong>f(x) = 2x + 1</strong> - Linear function
            </div>
            <div class="bg-white p-3 rounded cursor-pointer hover:bg-blue-100 border border-blue-200">
              <strong>g(x) = x²</strong> - Quadratic function  
            </div>
            <div class="bg-white p-3 rounded cursor-pointer hover:bg-blue-100 border border-blue-200">
              <strong>h(x) = sin(x)</strong> - Trigonometric function
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-sm text-gray-500 mt-8">Page 3 of ${totalPages}</div>
    </div>
  `);

  // Interactive graph page
  pages.push(`
    <div class="p-6">
      <h3 class="text-xl font-bold mb-4">Interactive Function Graphing</h3>
      
      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <div class="text-center mb-4">
          <div class="w-full h-64 bg-white border-2 border-gray-300 rounded relative">
            <svg class="w-full h-full" viewBox="0 0 400 300">
              <!-- Grid -->
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              <!-- Axes -->
              <line x1="0" y1="150" x2="400" y2="150" stroke="#374151" stroke-width="2"/>
              <line x1="200" y1="0" x2="200" y2="300" stroke="#374151" stroke-width="2"/>
              
              <!-- Function curve y = x² -->
              <path d="M 120 210 Q 200 90 280 210" stroke="#3b82f6" stroke-width="3" fill="none"/>
              
              <!-- Points -->
              <circle cx="160" cy="170" r="4" fill="#ef4444"/>
              <circle cx="200" cy="150" r="4" fill="#ef4444"/>
              <circle cx="240" cy="170" r="4" fill="#ef4444"/>
            </svg>
            
            <div class="absolute bottom-2 left-2 text-xs text-gray-600">
              Interactive: Drag points to modify the function
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <button class="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">
            📊 Change Function
          </button>
          <button class="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">
            ▶️ Animate
          </button>
          <button class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            🔄 Reset
          </button>
        </div>
      </div>
      
      <div class="text-sm text-gray-500 mt-8">Page 4 of ${totalPages}</div>
    </div>
  `);

  // Limits chapter with video placeholder
  pages.push(`
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-green-600">Chapter 2: Limits and Continuity</h2>
      
      <div class="mb-6">
        <p class="text-base leading-relaxed mb-4">
          The concept of a limit is fundamental to calculus. It describes the behavior of a function 
          as its input approaches a particular value.
        </p>
        
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-6">
          <h3 class="font-semibold text-green-800 mb-3">🎥 Watch: Understanding Limits</h3>
          
          <div class="bg-black rounded-lg overflow-hidden mb-4">
            <div class="aspect-video flex items-center justify-center bg-gray-800 text-white">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                </div>
                <p class="text-sm">Click to play interactive video</p>
                <p class="text-xs text-gray-400">Duration: 5:30</p>
              </div>
            </div>
          </div>
          
          <div class="flex justify-center space-x-2">
            <button class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">▶️ Play</button>
            <button class="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">⏸️ Pause</button>
            <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">📝 Take Notes</button>
          </div>
        </div>
      </div>
      
      <div class="text-sm text-gray-500 mt-8">Page 5 of ${totalPages}</div>
    </div>
  `);

  // Interactive limit calculator
  pages.push(`
    <div class="p-6">
      <h3 class="text-xl font-bold mb-4">Interactive Limit Calculator</h3>
      
      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Enter a function:</label>
          <input type="text" value="x² - 1" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., x² - 1">
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Approaching value:</label>
          <input type="text" value="1" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., 1">
        </div>
        
        <button class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full mb-4">
          Calculate Limit
        </button>
        
        <div class="bg-white p-4 rounded border-2 border-blue-200">
          <h4 class="font-semibold mb-2">Result:</h4>
          <div class="text-lg font-mono">
            lim<sub>x→1</sub> (x² - 1) = <span class="text-blue-600 font-bold">0</span>
          </div>
          <div class="text-sm text-gray-600 mt-2">
            Step-by-step solution available in premium version
          </div>
        </div>
      </div>
      
      <div class="text-sm text-gray-500 mt-8">Page 6 of ${totalPages}</div>
    </div>
  `);

  // Quiz/Assessment page
  pages.push(`
    <div class="p-6">
      <h3 class="text-xl font-bold mb-4 text-purple-600">📝 Quick Assessment: Limits</h3>
      
      <div class="space-y-6">
        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-3">Question 1:</h4>
          <p class="mb-4">What is lim<sub>x→2</sub> (3x + 1)?</p>
          
          <div class="space-y-2">
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q1" class="mr-3">
              <span>A) 5</span>
            </label>
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q1" class="mr-3">
              <span>B) 7</span>
            </label>
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q1" class="mr-3">
              <span>C) 6</span>
            </label>
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q1" class="mr-3">
              <span>D) Does not exist</span>
            </label>
          </div>
        </div>
        
        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-3">Question 2:</h4>
          <p class="mb-4">A function is continuous at x = a if:</p>
          
          <div class="space-y-2">
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q2" class="mr-3">
              <span>A) f(a) exists</span>
            </label>
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q2" class="mr-3">
              <span>B) lim<sub>x→a</sub> f(x) exists</span>
            </label>
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q2" class="mr-3">
              <span>C) lim<sub>x→a</sub> f(x) = f(a)</span>
            </label>
            <label class="flex items-center cursor-pointer hover:bg-white p-2 rounded">
              <input type="radio" name="q2" class="mr-3">
              <span>D) All of the above</span>
            </label>
          </div>
        </div>
        
        <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 w-full">
          Submit Quiz
        </button>
      </div>
      
      <div class="text-sm text-gray-500 mt-8">Page 7 of ${totalPages}</div>
    </div>
  `);

  // Add more pages with similar interactive content...
  for (let i = 8; i <= totalPages; i++) {
    if (i === totalPages) {
      // Final page with summary and links
      pages.push(`
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Course Summary</h2>
          
          <div class="space-y-4 mb-8">
            <div class="bg-green-50 border-l-4 border-green-400 p-4">
              <h3 class="font-semibold text-green-800">✅ Completed Topics</h3>
              <ul class="text-green-700 mt-2 space-y-1">
                <li>• Introduction to Functions</li>
                <li>• Limits and Continuity</li>
                <li>• Basic Derivatives</li>
                <li>• Integration Fundamentals</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 class="font-semibold text-blue-800">🎯 Your Progress</h3>
              <div class="mt-2">
                <div class="bg-blue-200 rounded-full h-3">
                  <div class="bg-blue-500 h-3 rounded-full" style="width: 85%"></div>
                </div>
                <p class="text-blue-700 text-sm mt-1">85% Complete</p>
              </div>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 class="font-semibold text-yellow-800">📚 Next Steps</h3>
              <p class="text-yellow-700">Continue with Advanced Calculus II</p>
            </div>
          </div>
          
          <div class="text-center space-y-3">
            <button class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full">
              📊 View Detailed Progress Report
            </button>
            <button class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full">
              📖 Continue to Next Book
            </button>
            <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 w-full">
              🔄 Review Previous Chapters
            </button>
          </div>
          
          <div class="text-center text-sm text-gray-500 mt-8">
            <p>Page ${i} of ${totalPages} • Course Complete!</p>
          </div>
        </div>
      `);
    } else {
      // Other content pages with various interactive elements
      const chapterTopics = [
        'Derivative Rules and Techniques',
        'Applications of Derivatives', 
        'Introduction to Integration',
        'Integration Techniques',
        'Applications of Integration',
        'Practice Problems Set A',
        'Practice Problems Set B'
      ];
      
      const topic = chapterTopics[i - 8] || 'Advanced Topics';
      
      pages.push(`
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-6 text-indigo-600">Chapter ${i - 4}: ${topic}</h2>
          
          <div class="mb-6">
            <p class="text-base leading-relaxed mb-4">
              This chapter covers essential concepts in ${topic.toLowerCase()}. 
              Understanding these principles will provide a solid foundation for advanced calculus topics.
            </p>
            
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <h3 class="font-semibold text-indigo-800 mb-3">🔍 Key Concepts</h3>
              <ul class="space-y-2 text-indigo-700">
                <li class="flex items-center">
                  <div class="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                  Mathematical foundations and theory
                </li>
                <li class="flex items-center">
                  <div class="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                  Practical applications and examples
                </li>
                <li class="flex items-center">
                  <div class="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                  Step-by-step problem solving
                </li>
              </ul>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <button class="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg text-blue-800 text-sm">
                💡 Show Examples
              </button>
              <button class="bg-green-100 hover:bg-green-200 p-3 rounded-lg text-green-800 text-sm">
                🎯 Practice Problems
              </button>
            </div>
          </div>
          
          <div class="text-sm text-gray-500 mt-8">Page ${i} of ${totalPages}</div>
        </div>
      `);
    }
  }
  
  return pages;
}

// Generate book content
function generateBookContent(resource: any): string {
  return `<div class="book-content">
    <h1>${resource.title}</h1>
    <p>${resource.description}</p>
    <p>This is a comprehensive ${resource.subject} resource for grade ${resource.grade} students.</p>
  </div>`;
}

// Get book open message
export function getBookOpenMessage(resource: any) {
  if (shouldUseBookViewer(resource)) {
    return {
      title: "Opening Book Viewer",
      description: `${resource.title} will open in the interactive book reader.`
    };
  } else {
    return {
      title: "Resource Accessed",
      description: `Opening ${resource.title}.`
    };
  }
}

// Convert a library resource to book configuration (alternative implementation)
function convertResourceToBookConfigAlternative(resource: LibraryResource): BookConfig {
  return {
    id: resource.id,
    title: resource.title,
    author: resource.authorId || 'Unknown Author',
    pages: generateSamplePages(resource),
    totalPages: calculatePageCount(resource),
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description,
    grade: resource.grade,
    subject: resource.curriculum,
    language: resource.language,
    type: resource.type,
    isInteractive: resource.type.includes('interactive') || resource.tags?.includes('interactive') || false,
    hasVideo: resource.tags?.includes('video') || resource.tags?.includes('multimedia') || false,
    hasAudio: resource.tags?.includes('audio') || resource.tags?.includes('sound') || false,
    xapiEnabled: true, // Enable learning analytics for all books
    content: resource.description,
    mediaAssets: [],
    interactiveElements: [],
    trackingConfig: {
      trackPageViews: true,
      trackReadingTime: true,
      trackCompletionRate: true
    }
  };
}

// Generate sample book pages based on the resource
function generateSamplePages(resource: LibraryResource): string[] {
  const pageCount = calculatePageCount(resource);
  const pages = [];
  
  for (let i = 1; i <= pageCount; i++) {
    pages.push(`data:image/svg+xml,${encodeURIComponent(
      `<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#pageGradient)" stroke="#e9ecef" stroke-width="1"/>
        
        <!-- Header -->
        <text x="50%" y="8%" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#2c3e50">${resource.title}</text>
        <line x1="10%" y1="10%" x2="90%" y2="10%" stroke="#3498db" stroke-width="2"/>
        
        <!-- Grade and Subject Badge -->
        <rect x="75%" y="12%" width="20%" height="6%" fill="#3498db" rx="8"/>
        <text x="85%" y="16%" text-anchor="middle" font-family="Arial" font-size="12" fill="white">Grade ${resource.grade}</text>
        
        <!-- Content Area -->
        <text x="10%" y="25%" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="#2c3e50">Chapter ${i}: Educational Content</text>
        
        <text x="10%" y="32%" font-family="Arial" font-size="14" fill="#34495e">This page contains curriculum-aligned content from the CBE framework.</text>
        <text x="10%" y="38%" font-family="Arial" font-size="14" fill="#34495e">Subject: ${resource.curriculum || 'General Studies'}</text>
        <text x="10%" y="44%" font-family="Arial" font-size="14" fill="#34495e">Language: ${resource.language || 'English'}</text>
        
        <!-- Sample Content -->
        <rect x="10%" y="50%" width="80%" height="35%" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1" rx="4"/>
        <text x="12%" y="55%" font-family="Arial" font-size="13" fill="#2c3e50">Learning Objectives:</text>
        <text x="12%" y="60%" font-family="Arial" font-size="12" fill="#34495e">• Understand key concepts in ${resource.curriculum}</text>
        <text x="12%" y="65%" font-family="Arial" font-size="12" fill="#34495e">• Apply knowledge to real-world scenarios</text>
        <text x="12%" y="70%" font-family="Arial" font-size="12" fill="#34495e">• Develop critical thinking skills</text>
        
        <text x="12%" y="78%" font-family="Arial" font-size="13" fill="#2c3e50">Page ${i} Content:</text>
        <text x="12%" y="83%" font-family="Arial" font-size="12" fill="#34495e">Interactive learning material designed for ${resource.grade} students</text>
        
        <!-- Footer -->
        <line x1="10%" y1="92%" x2="90%" y2="92%" stroke="#95a5a6" stroke-width="1"/>
        <text x="10%" y="96%" font-family="Arial" font-size="11" fill="#7f8c8d">© Edvirons Digital Library</text>
        <text x="90%" y="96%" text-anchor="end" font-family="Arial" font-size="11" fill="#7f8c8d">Page ${i} of ${pageCount}</text>
      </svg>`
    )}`);
  }
  
  return pages;
}

// Generate worksheet-specific pages with clean content
function generateWorksheetPages(resource: LibraryResource): string[] {
  const pageCount = Math.min(calculatePageCount(resource), 5); // Keep worksheets shorter
  const pages: string[] = [];
  
  const worksheetTypes = ['questions', 'exercises', 'activities', 'assessment', 'review'];
  
  for (let i = 1; i <= pageCount; i++) {
    const pageType = worksheetTypes[(i-1) % worksheetTypes.length];
    const content = generateWorksheetPageContent(resource, i, pageType);
    
    // Create simple HTML page instead of SVG to avoid encoding issues
    const htmlContent = `
      <div style="
        width: 100%; 
        height: 100vh; 
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        padding: 20px;
        font-family: 'Segoe UI', Arial, sans-serif;
        box-sizing: border-box;
        overflow-y: auto;
      ">
        ${content}
      </div>
    `;
    
    pages.push(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
  }
  
  return pages;
}

// Generate clean worksheet page content
function generateWorksheetPageContent(resource: LibraryResource, pageNum: number, pageType: string): string {
  const subject = extractSubjectFromCurriculum(resource.curriculum);
  
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; min-height: calc(100vh - 40px); padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3498db;">
        <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: bold;">${resource.title}</h1>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
          <span style="background: #3498db; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px;">
            Grade ${resource.grade || 'All'}
          </span>
          <span style="color: #7f8c8d; font-size: 14px;">Page ${pageNum}</span>
        </div>
      </div>

      <!-- Worksheet Content -->
      <div style="line-height: 1.8; color: #2c3e50;">
        ${getWorksheetContentByType(pageType, subject, resource.grade)}
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ecf0f1; display: flex; justify-content: space-between; align-items: center; color: #7f8c8d; font-size: 12px;">
        <span>© Edvirons Digital Library</span>
        <span>Subject: ${subject}</span>
      </div>
    </div>
  `;
}

// Generate content based on worksheet type
function getWorksheetContentByType(type: string, subject: string, grade: string): string {
  switch (type) {
    case 'questions':
      return `
        <h3 style="color: #3498db; margin-bottom: 20px;">📝 Practice Questions</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-weight: bold; color: #2c3e50;">Instructions:</p>
          <p style="margin: 10px 0 0 0;">Read each question carefully and provide complete answers. Show your work where applicable.</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Question 1:</h4>
          <p style="margin-bottom: 15px;">Explain the main concepts covered in this ${subject} lesson for ${grade || 'your grade level'} students.</p>
          <div style="border: 1px solid #ddd; min-height: 80px; padding: 10px; border-radius: 4px; background: #fafafa;">
            <span style="color: #999;">Your answer here...</span>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Question 2:</h4>
          <p style="margin-bottom: 15px;">Provide examples of how these concepts apply to real-world situations.</p>
          <div style="border: 1px solid #ddd; min-height: 80px; padding: 10px; border-radius: 4px; background: #fafafa;">
            <span style="color: #999;">Your answer here...</span>
          </div>
        </div>
      `;
      
    case 'exercises':
      return `
        <h3 style="color: #e74c3c; margin-bottom: 20px;">💪 Practice Exercises</h3>
        <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
          <p style="margin: 0; font-weight: bold; color: #2c3e50;">Exercise Instructions:</p>
          <p style="margin: 10px 0 0 0;">Complete the following exercises to reinforce your understanding.</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Exercise A: Problem Solving</h4>
          <ol style="margin-left: 20px;">
            <li style="margin-bottom: 15px;">Identify the key elements in the given scenario</li>
            <li style="margin-bottom: 15px;">Apply the learned principles to solve the problem</li>
            <li style="margin-bottom: 15px;">Verify your solution and explain your reasoning</li>
          </ol>
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Exercise B: Critical Thinking</h4>
          <p style="margin-bottom: 15px;">Analyze the following statement and provide your perspective:</p>
          <div style="background: #f0f8ff; padding: 15px; border-radius: 4px; font-style: italic; border-left: 3px solid #3498db;">
            "Understanding ${subject} concepts helps develop analytical and problem-solving skills essential for academic success."
          </div>
        </div>
      `;
      
    case 'activities':
      return `
        <h3 style="color: #27ae60; margin-bottom: 20px;">🎯 Learning Activities</h3>
        <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #27ae60;">
          <p style="margin: 0; font-weight: bold; color: #2c3e50;">Activity Guidelines:</p>
          <p style="margin: 10px 0 0 0;">Engage with these interactive activities to deepen your understanding.</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Activity 1: Research & Explore</h4>
          <ul style="margin-left: 20px;">
            <li style="margin-bottom: 10px;">Research additional examples related to today's topic</li>
            <li style="margin-bottom: 10px;">Create a mind map connecting different concepts</li>
            <li style="margin-bottom: 10px;">Discuss findings with classmates or family</li>
          </ul>
        </div>

        <div style="margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Activity 2: Creative Expression</h4>
          <p style="margin-bottom: 15px;">Choose one way to demonstrate your understanding:</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center;">📊 Create a diagram</div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center;">📝 Write a summary</div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center;">🎨 Draw illustrations</div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center;">💬 Record explanations</div>
          </div>
        </div>
      `;
      
    case 'assessment':
      return `
        <h3 style="color: #9b59b6; margin-bottom: 20px;">📊 Self-Assessment</h3>
        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #9b59b6;">
          <p style="margin: 0; font-weight: bold; color: #2c3e50;">Assessment Instructions:</p>
          <p style="margin: 10px 0 0 0;">Reflect on your learning and rate your understanding.</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h4 style="color: #2c3e50; margin-bottom: 20px;">Learning Objectives Checklist:</h4>
          <div style="space-y: 15px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
              <span>I can explain the main concepts from this lesson</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
              <span>I can apply these concepts to solve problems</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
              <span>I can connect this learning to other subjects</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
              <span>I feel confident to teach this to someone else</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Reflection Questions:</h4>
          <p style="margin-bottom: 10px;">1. What was the most interesting thing you learned today?</p>
          <p style="margin-bottom: 10px;">2. What questions do you still have?</p>
          <p style="margin-bottom: 10px;">3. How will you use this knowledge in the future?</p>
        </div>
      `;
      
    default: // review
      return `
        <h3 style="color: #f39c12; margin-bottom: 20px;">📚 Review & Summary</h3>
        <div style="background: #fffbf0; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f39c12;">
          <p style="margin: 0; font-weight: bold; color: #2c3e50;">Review Instructions:</p>
          <p style="margin: 10px 0 0 0;">Use this page to consolidate your learning and prepare for future lessons.</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Key Concepts Summary:</h4>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Main topic: ${subject} concepts for ${grade || 'current grade'}</li>
              <li style="margin-bottom: 10px;">Learning objectives achieved through practical exercises</li>
              <li style="margin-bottom: 10px;">Real-world applications and connections made</li>
              <li style="margin-bottom: 10px;">Skills developed: analysis, problem-solving, critical thinking</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin-bottom: 15px;">Next Steps:</h4>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; margin-bottom: 10px;">✅ Complete any remaining exercises</p>
            <p style="margin: 0; margin-bottom: 10px;">📖 Review related materials in your textbook</p>
            <p style="margin: 0; margin-bottom: 10px;">👥 Discuss concepts with classmates or teachers</p>
            <p style="margin: 0;">🎯 Apply knowledge to upcoming assignments</p>
          </div>
        </div>
      `;
  }
}

// Calculate appropriate page count based on resource properties
function calculatePageCount(resource: LibraryResource): number {
  // Base page count on resource type and grade level
  const basePages = {
    'book': 15,
    'ebook': 12,
    'textbook': 20,
    'storybook': 8,
    'interactive_book': 10,
    'flipbook': 6,
    'digital_book': 12,
    'reading_material': 5
  };
  
  const gradeMultiplier = {
    'Pre-K': 0.3,
    'K': 0.4,
    'Grade 1': 0.5,
    'Grade 2': 0.6,
    'Grade 3': 0.7,
    'Grade 4': 0.8,
    'Grade 5': 0.9,
    'Grade 6': 1.0,
    'Grade 7': 1.1,
    'Grade 8': 1.2,
    'Grade 9': 1.3,
    'Grade 10': 1.4,
    'Grade 11': 1.5,
    'Grade 12': 1.6
  };
  
  const base = basePages[resource.type.toLowerCase() as keyof typeof basePages] || 10;
  const multiplier = gradeMultiplier[resource.grade as keyof typeof gradeMultiplier] || 1.0;
  
  return Math.max(5, Math.min(25, Math.round(base * multiplier)));
}

// Extract subject from curriculum string
function extractSubjectFromCurriculum(curriculum: string | null): string {
  if (!curriculum) return 'General';
  
  // Look for common subject patterns
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Music'];
  const found = subjects.find(subject => 
    curriculum.toLowerCase().includes(subject.toLowerCase())
  );
  
  return found || curriculum.split(' ')[0] || 'General';
}

// Convert a library resource to worksheet configuration
export function convertResourceToWorksheetConfig(resource: LibraryResource): any {
  return {
    id: resource.id,
    title: resource.title,
    author: resource.authorId || 'Unknown Author',
    pages: generateWorksheetPages(resource),
    totalPages: calculatePageCount(resource),
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description,
    grade: resource.grade,
    subject: extractSubjectFromCurriculum(resource.curriculum),
    language: resource.language,
    type: resource.type,
    isInteractive: true, // Worksheets are interactive by nature
    hasAnswerKey: true, // Most worksheets have answer keys
    xapiEnabled: true, // Enable tracking for worksheets
    content: resource.description || 'Interactive worksheet content',
    instructions: generateWorksheetInstructions(resource),
    difficulty: resource.difficulty,
    duration: resource.duration,
    trackingConfig: {
      trackPageViews: true,
      trackReadingTime: true,
      trackCompletionRate: true,
    }
  };
}

// Generate worksheet-specific instructions
function generateWorksheetInstructions(resource: LibraryResource): string {
  const baseInstructions = [
    "Read each question carefully before answering.",
    "Show your work where applicable.",
    "Use the answer key to check your responses when finished."
  ];
  
  if (resource.type === 'quiz' || resource.type === 'test') {
    baseInstructions.push("Time limit applies - work efficiently.");
  }
  
  if (resource.difficulty === 'hard') {
    baseInstructions.push("Take your time with complex problems.");
  }
  
  return baseInstructions.join(' ');
}

// Duplicate function removed - using earlier definition