import React from 'react';
import { BookOpen, Bookmark } from 'lucide-react';

interface BookPageContentProps {
  bookData?: {
    pages?: string[];
    totalPages?: number;
  };
  currentPage: number;
  zoom: number;
  rotation: number;
  panOffset?: { x: number; y: number };
  isPageTurning: boolean;
  pageTransition: 'none' | 'next' | 'prev';
  bookmarkPages: number[];
  pageRef: React.RefObject<HTMLDivElement>;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

// Generate HTML5 interactive content similar to authoring preview
const generateDefaultPageContent = (currentPage: number): string => {
  const pages = [
    // Page 1 - Cover
    `<div class="p-6 text-center">
      <h1 class="text-4xl font-bold mb-4 text-gray-800">Interactive Digital Textbook</h1>
      <p class="text-xl text-gray-600 mb-6">by Digital Learning Team</p>
      <div class="mb-8">
        <div class="mx-auto max-w-xs h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg shadow-lg flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl mb-2">📚</div>
            <p class="text-sm text-gray-600">Interactive Learning</p>
          </div>
        </div>
      </div>
      <p class="text-gray-700">A comprehensive interactive textbook with multimedia elements and assessments</p>
      <div class="text-sm text-gray-500 mt-8">Page 1 of 15</div>
    </div>`,
    
    // Page 2 - Table of contents
    `<div class="p-6">
      <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Table of Contents</h2>
      <div class="space-y-3">
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Chapter 1: Introduction</span>
          <span class="text-gray-500">Page 3</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Chapter 2: Interactive Elements</span>
          <span class="text-gray-500">Page 5</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Chapter 3: Assessments</span>
          <span class="text-gray-500">Page 8</span>
        </div>
      </div>
      <div class="text-sm text-gray-500 mt-8">Page 2 of 15</div>
    </div>`,
    
    // Page 3 - Interactive content
    `<div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-indigo-600">Chapter 1: Introduction</h2>
      <div class="mb-6">
        <p class="text-base leading-relaxed mb-4">
          Welcome to interactive learning! This chapter introduces key concepts through engaging multimedia content.
        </p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-blue-800 mb-3">📖 Key Definition</h3>
          <p class="text-blue-700">
            Interactive learning combines traditional content with multimedia elements to enhance understanding.
          </p>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 class="font-semibold text-green-800 mb-3">💡 Interactive Example</h3>
          <p class="text-green-700 mb-3">Try this interactive element:</p>
          <div class="flex items-center space-x-3">
            <input type="text" placeholder="Enter your answer" class="flex-1 p-2 border border-gray-300 rounded" onclick="this.style.backgroundColor='#f0f9ff'">
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onclick="alert('Great job! This is an interactive element.')">Check</button>
          </div>
        </div>
      </div>
      <div class="text-sm text-gray-500">Page 3 of 15</div>
    </div>`,
    
    // Page 4 - Video content
    `<div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-purple-600">Interactive Learning Resources</h2>
      <div class="mb-6">
        <div class="bg-gray-100 rounded-lg p-8 text-center mb-6">
          <div class="bg-purple-500 text-white p-4 rounded-full inline-block mb-4">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l7-5-7-5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">Interactive Video: Learning Explained</h3>
          <p class="text-gray-600 mb-4">Watch this educational video to understand key concepts</p>
          <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600" onclick="alert('Video player would launch here with xAPI tracking')">
            ▶ Play Video
          </button>
        </div>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="font-semibold text-yellow-800 mb-3">🎯 Learning Outcomes</h3>
          <ul class="text-yellow-700 space-y-1">
            <li>• Understand core interactive principles</li>
            <li>• Apply knowledge to practical scenarios</li>
            <li>• Develop problem-solving skills</li>
          </ul>
        </div>
      </div>
      <div class="text-sm text-gray-500">Page 4 of 15</div>
    </div>`,
    
    // Page 5 - Quiz
    `<div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-purple-600">Chapter Quiz</h2>
      <p class="text-gray-600 mb-6">Test your understanding with these interactive questions.</p>
      
      <div class="space-y-6">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 class="font-semibold text-purple-800 mb-3">Question 1: What is the main benefit of interactive learning?</h3>
          <div class="space-y-2">
            <label class="flex items-center cursor-pointer">
              <input type="radio" name="q1" class="mr-3" onclick="document.getElementById('feedback1').style.display='block'">
              <span>Enhanced engagement and understanding</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input type="radio" name="q1" class="mr-3">
              <span>Faster completion time</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input type="radio" name="q1" class="mr-3">
              <span>Less content to learn</span>
            </label>
          </div>
          <div id="feedback1" style="display:none" class="mt-3 p-3 bg-green-100 border border-green-300 rounded text-green-800">
            ✓ Correct! Interactive learning enhances engagement and understanding.
          </div>
        </div>
        
        <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 w-full" onclick="alert('Quiz results would be tracked via xAPI')">
          Submit Quiz
        </button>
      </div>
      
      <div class="text-sm text-gray-500 mt-8">Page 5 of 15</div>
    </div>`
  ];
  
  return pages[currentPage - 1] || `<div class="p-6 text-center">
    <h2 class="text-2xl font-bold mb-4">Page ${currentPage}</h2>
    <p class="text-gray-600">Content for page ${currentPage} would appear here.</p>
    <div class="text-sm text-gray-500 mt-8">Page ${currentPage} of 15</div>
  </div>`;
};

export const BookPageContent: React.FC<BookPageContentProps> = ({
  bookData,
  currentPage,
  zoom,
  rotation,
  panOffset = { x: 0, y: 0 },
  isPageTurning,
  pageTransition,
  bookmarkPages,
  pageRef,
  onTouchStart,
  onTouchEnd
}) => {
  return (
    <div
      ref={pageRef}
      className={`w-full h-full flex items-center justify-center page-content-transition ${
        isPageTurning ? 'pointer-events-none' : ''
      } ${
        pageTransition === 'next' ? 'page-turn-animation-next' : 
        pageTransition === 'prev' ? 'page-turn-animation-prev' : ''
      }`}
      style={{
        transform: `scale(${zoom / 100}) rotate(${rotation}deg) translate(${panOffset.x}px, ${panOffset.y}px)`,
        transformOrigin: 'center center',
        transition: isPageTurning ? 'none' : 'transform 0.2s ease-out'
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {bookData?.pages && bookData?.pages[currentPage - 1] ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div 
            className="w-full h-full bg-white rounded-lg shadow-sm overflow-auto"
            style={{
              padding: zoom > 150 ? '1rem' : zoom > 100 ? '1.5rem' : '2rem'
            }}
            dangerouslySetInnerHTML={{ 
              __html: bookData.pages[currentPage - 1] || generateDefaultPageContent(currentPage)
            }}
          />
          
          {/* Bookmark indicator */}
          {bookmarkPages.includes(currentPage) && (
            <div className="absolute top-4 right-4 z-10">
              <Bookmark className="h-6 w-6 text-yellow-500 fill-current drop-shadow-lg" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-lg">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <p className="text-blue-600 font-medium text-lg">Page {currentPage}</p>
            <p className="text-sm text-blue-400 mt-2">Loading content...</p>
          </div>
        </div>
      )}
    </div>
  );
};