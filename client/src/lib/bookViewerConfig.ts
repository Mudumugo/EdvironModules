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
export function shouldUseBookViewer(resource: LibraryResource): boolean {
  return BOOK_VIEWER_TYPES.includes(resource.type.toLowerCase());
}

// Check if a resource should use the WorksheetViewer
export function shouldUseWorksheetViewer(resource: LibraryResource): boolean {
  return WORKSHEET_VIEWER_TYPES.includes(resource.type.toLowerCase());
}

// Convert a library resource to book configuration
export function convertResourceToBookConfig(resource: LibraryResource): BookConfig {
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

// Get appropriate toast message for all resource types
export function getBookOpenMessage(resource: LibraryResource): { title: string; description: string } {
  if (shouldUseBookViewer(resource)) {
    return {
      title: "Opening Immersive Reader",
      description: `Loading ${resource.type} with enhanced reading features`
    };
  }
  
  if (shouldUseWorksheetViewer(resource)) {
    return {
      title: "Opening Interactive Worksheet",
      description: `Loading ${resource.type} with worksheet tools and answer key`
    };
  }
  
  return {
    title: "Opening Preview",
    description: `Loading preview for ${resource.title}`
  };
}