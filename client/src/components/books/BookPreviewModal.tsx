import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookViewer } from './BookViewer';
import { 
  BookOpen, 
  Eye, 
  Download, 
  Star, 
  Clock, 
  User, 
  FileText,
  Bookmark,
  Share2,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';

interface BookResource {
  id: number;
  title: string;
  type: string;
  grade: string;
  curriculum: string;
  description: string;
  difficulty: string;
  duration: number;
  tags: string[];
  viewCount: number;
  rating: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  accessTier: string;
  isPublished: boolean;
  authorId: string;
  language: string;
}

interface BookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: BookResource;
  onDownload?: (resource: BookResource) => void;
}

export const BookPreviewModal: React.FC<BookPreviewModalProps> = ({
  isOpen,
  onClose,
  resource,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isBookViewerOpen, setIsBookViewerOpen] = useState(false);
  const [bookData, setBookData] = useState<any>(null);

  // Page generation functions
  const generateCoverPage = (title: string, author: string, subject: string, grade: string) => {
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

  const generateTableOfContents = (subject: string, grade: string) => {
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

  const generateChapterIntro = (chapterNum: string, chapterTitle: string, grade: string) => {
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

  const generateQuizPage = (quizNum: number, subject: string, grade: string) => {
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

  const generateFinalAssessment = (subject: string, grade: string) => {
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

  const generateGeneralPage = (pageNum: number, title: string, grade: string) => {
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
      <rect x="20" y="20" width="360" height="560" fill="white" stroke="#6c757d" stroke-width="2" rx="10"/>
      <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#495057">${title}</text>
      <text x="200" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6c757d">Page ${pageNum} • ${grade}</text>
      ${content.map((line, i) => 
        `<text x="40" y="${130 + i * 30}" font-family="Arial, sans-serif" font-size="14" fill="#212529">${line}</text>`
      ).join('')}
      <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#adb5bd">EdVirons Educational Platform</text>
    </svg>`;
  };

  // Generate interactive book content based on subject and grade
  useEffect(() => {
    if (resource && resource.type === 'book') {
      const generateBookPages = () => {
        const subject = resource.curriculum.toLowerCase();
        const grade = resource.grade;
        const author = resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author';
        
        let pages = [];
        
        // Cover Page
        pages.push(`data:image/svg+xml,${encodeURIComponent(generateCoverPage(resource.title, author, subject, grade))}`);
        
        // Table of Contents
        pages.push(`data:image/svg+xml,${encodeURIComponent(generateTableOfContents(subject, grade))}`);
        
        // Create subject-specific content
        if (subject.includes('math')) {
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 1", "Introduction to Numbers", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateMathPage(1, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(1, "math", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 2", "Addition and Subtraction", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateMathPage(2, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateMathPage(3, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(2, "math", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 3", "Shapes and Patterns", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateMathPage(4, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(3, "math", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 4", "Review and Assessment", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateMathPage(5, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateFinalAssessment("math", grade))}`);
          
        } else if (subject.includes('science')) {
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 1", "The Solar System", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateSciencePage(1, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(1, "science", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 2", "Animal Habitats", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateSciencePage(2, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(2, "science", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 3", "Weather and Climate", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateSciencePage(3, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateSciencePage(4, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(3, "science", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 4", "Simple Machines", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateSciencePage(5, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateFinalAssessment("science", grade))}`);
          
        } else if (subject.includes('english') || subject.includes('language')) {
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 1", "Letters and Sounds", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateLanguagePage(1, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(1, "language", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 2", "Building Words", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateLanguagePage(2, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateLanguagePage(3, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(2, "language", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 3", "Reading and Writing", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateLanguagePage(4, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateLanguagePage(5, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateFinalAssessment("language", grade))}`);
          
        } else {
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 1", "Introduction", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateGeneralPage(1, resource.title, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(1, "general", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 2", "Core Concepts", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateGeneralPage(2, resource.title, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateGeneralPage(3, resource.title, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateQuizPage(2, "general", grade))}`);
          
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro("Chapter 3", "Advanced Topics", grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateGeneralPage(4, resource.title, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateGeneralPage(5, resource.title, grade))}`);
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateFinalAssessment("general", grade))}`);
        }
        
        return pages;
      };

      const pages = generateBookPages();
      setBookData({
        id: resource.id,
        title: resource.title,
        author: resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author',
        pages: pages,
        totalPages: pages.length,
        thumbnailUrl: resource.thumbnailUrl,
        description: resource.description,
        grade: resource.grade,
        subject: resource.curriculum,
        language: resource.language
      });
    }
  }, [resource]);

  // Page generation functions
  const generateMathPage = (pageNum: number, grade: string) => {
    const problems = {
      1: {
        title: "Introduction to Numbers",
        content: [
          "Let's learn about numbers!",
          "Can you count these apples?",
          "🍎 🍎 🍎 🍎 🍎",
          "",
          "Exercise: Circle the correct number",
          "A) 3  B) 5  C) 7",
          "",
          "Remember: Counting helps us understand quantity!"
        ]
      },
      2: {
        title: "Addition Fun",
        content: [
          "Adding numbers together",
          "",
          "2 + 3 = ?",
          "",
          "🟦🟦 + 🟦🟦🟦 = 🟦🟦🟦🟦🟦",
          "",
          "Try these problems:",
          "1 + 4 = ___",
          "3 + 2 = ___",
          "5 + 1 = ___"
        ]
      },
      3: {
        title: "Subtraction Practice",
        content: [
          "Taking away numbers",
          "",
          "5 - 2 = ?",
          "",
          "🟨🟨🟨🟨🟨 - 🟨🟨 = 🟨🟨🟨",
          "",
          "Practice problems:",
          "6 - 1 = ___",
          "4 - 3 = ___",
          "7 - 2 = ___"
        ]
      },
      4: {
        title: "Shapes and Patterns",
        content: [
          "Learning about shapes",
          "",
          "Circle: ⭕",
          "Square: ⬜",
          "Triangle: 🔺",
          "",
          "Can you continue the pattern?",
          "⭕ ⬜ ⭕ ⬜ ⭕ ___"
        ]
      },
      5: {
        title: "Review and Practice",
        content: [
          "Let's review what we learned!",
          "",
          "1. Counting: 1, 2, 3, 4, 5",
          "2. Addition: 2 + 3 = 5",
          "3. Subtraction: 5 - 2 = 3",
          "4. Shapes: ⭕ ⬜ 🔺",
          "",
          "Great job learning math!"
        ]
      }
    };

    const page = problems[pageNum as keyof typeof problems];
    return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="600" fill="#f8f9fa"/>
      <rect x="20" y="20" width="360" height="560" fill="white" stroke="#e9ecef" stroke-width="2" rx="10"/>
      <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#495057">${page.title}</text>
      <text x="200" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6c757d">Page ${pageNum} • ${grade} • Mathematics</text>
      ${page.content.map((line, i) => 
        `<text x="40" y="${130 + i * 35}" font-family="Arial, sans-serif" font-size="16" fill="#212529">${line}</text>`
      ).join('')}
      <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#adb5bd">EdVirons Educational Platform</text>
    </svg>`;
  };

  const generateSciencePage = (pageNum: number, grade: string) => {
    const topics = {
      1: {
        title: "The Solar System",
        content: [
          "Our Solar System has 8 planets",
          "",
          "☀️ Sun (Our Star)",
          "🪐 Mercury, Venus, Earth, Mars",
          "🪐 Jupiter, Saturn, Uranus, Neptune",
          "",
          "Earth is the only planet with life!",
          "",
          "Fun Fact: Jupiter is the biggest planet"
        ]
      },
      2: {
        title: "Animal Habitats",
        content: [
          "Where do animals live?",
          "",
          "🏔️ Mountains: Bears, Eagles",
          "🌊 Ocean: Fish, Whales, Dolphins",
          "🏜️ Desert: Camels, Lizards",
          "🌳 Forest: Deer, Squirrels, Birds",
          "",
          "Each habitat provides what animals need!"
        ]
      },
      3: {
        title: "Weather Patterns",
        content: [
          "Understanding Weather",
          "",
          "☀️ Sunny: Clear skies, warm",
          "☁️ Cloudy: Gray skies, cooler",
          "🌧️ Rainy: Water from clouds",
          "❄️ Snowy: Frozen precipitation",
          "",
          "Weather changes every day!"
        ]
      },
      4: {
        title: "Plant Life Cycle",
        content: [
          "How do plants grow?",
          "",
          "1. 🌱 Seed: Starting point",
          "2. 🌿 Sprout: First leaves appear",
          "3. 🌳 Plant: Grows bigger",
          "4. 🌸 Flower: Makes new seeds",
          "",
          "Plants need water, sun, and soil!"
        ]
      },
      5: {
        title: "Simple Machines",
        content: [
          "Machines help us work!",
          "",
          "Lever: See-saw, crowbar",
          "Wheel: Bicycle, car",
          "Pulley: Flag pole",
          "Incline: Ramp, slide",
          "",
          "Machines make work easier!"
        ]
      }
    };

    const page = topics[pageNum as keyof typeof topics];
    return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="600" fill="#e8f5e8"/>
      <rect x="20" y="20" width="360" height="560" fill="white" stroke="#28a745" stroke-width="2" rx="10"/>
      <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#155724">${page.title}</text>
      <text x="200" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6c757d">Page ${pageNum} • ${grade} • Science</text>
      ${page.content.map((line, i) => 
        `<text x="40" y="${130 + i * 35}" font-family="Arial, sans-serif" font-size="16" fill="#212529">${line}</text>`
      ).join('')}
      <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#adb5bd">EdVirons Educational Platform</text>
    </svg>`;
  };

  const generateLanguagePage = (pageNum: number, grade: string) => {
    const lessons = {
      1: {
        title: "Letter Recognition",
        content: [
          "Learning the Alphabet",
          "",
          "A B C D E F G",
          "H I J K L M N",
          "O P Q R S T U",
          "V W X Y Z",
          "",
          "Practice writing these letters!",
          "Circle all the letter 'A's you can find."
        ]
      },
      2: {
        title: "Simple Words",
        content: [
          "Building Words with Letters",
          "",
          "CAT = C + A + T",
          "DOG = D + O + G",
          "SUN = S + U + N",
          "",
          "Try to read these words:",
          "BAT  HAT  RAT  SAT",
          "",
          "What rhymes with CAT?"
        ]
      },
      3: {
        title: "Sentence Structure",
        content: [
          "Making Complete Sentences",
          "",
          "A sentence needs:",
          "• Who (Subject)",
          "• What they do (Verb)",
          "",
          "Example: The cat runs.",
          "Who: The cat",
          "What: runs",
          "",
          "Try: The dog ___."
        ]
      },
      4: {
        title: "Reading Comprehension",
        content: [
          "Understanding Stories",
          "",
          "Tom has a red ball.",
          "He plays in the park.",
          "The ball rolls far away.",
          "Tom runs to get it.",
          "",
          "Questions:",
          "What color is Tom's ball?",
          "Where does Tom play?"
        ]
      },
      5: {
        title: "Creative Writing",
        content: [
          "Tell Your Own Story",
          "",
          "Think about:",
          "• Who is in your story?",
          "• Where does it happen?",
          "• What happens?",
          "",
          "Start with: Once upon a time...",
          "",
          "Draw a picture of your story!"
        ]
      }
    };

    const page = lessons[pageNum as keyof typeof lessons];
    return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="600" fill="#fff3cd"/>
      <rect x="20" y="20" width="360" height="560" fill="white" stroke="#ffc107" stroke-width="2" rx="10"/>
      <text x="200" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#856404">${page.title}</text>
      <text x="200" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6c757d">Page ${pageNum} • ${grade} • Language Arts</text>
      ${page.content.map((line, i) => 
        `<text x="40" y="${130 + i * 32}" font-family="Arial, sans-serif" font-size="15" fill="#212529">${line}</text>`
      ).join('')}
      <text x="200" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#adb5bd">EdVirons Educational Platform</text>
    </svg>`;
  };



  const handleDownload = () => {
    if (onDownload) {
      onDownload(resource);
    }
  };

  const handleOpenBook = () => {
    setIsBookViewerOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isBookViewerOpen && bookData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0">
          <BookViewer 
            bookData={bookData}
            onClose={() => setIsBookViewerOpen(false)}
            className="w-full h-[90vh]"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            {resource.title}
          </DialogTitle>
          <DialogDescription>
            by {resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="flex-shrink-0 grid w-full grid-cols-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contents">Contents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Book Cover and Quick Info */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  {resource.thumbnailUrl ? (
                    <img 
                      src={resource.thumbnailUrl} 
                      alt={resource.title}
                      className="w-48 h-64 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-48 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-md flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Quick Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <span>Type</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{resource.grade}</Badge>
                        <span>Grade Level</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{resource.curriculum}</Badge>
                        <span>Subject</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                        <span>Difficulty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{resource.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessTierColor(resource.accessTier)}>
                          {resource.accessTier}
                        </Badge>
                        <span>Access</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Statistics</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {resource.viewCount} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {resource.rating}/5 rating
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {resource.language}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleOpenBook} className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Book
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="default">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="default">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Book Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Title:</span>
                      <span>{resource.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Author:</span>
                      <span>{resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Language:</span>
                      <span>{resource.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Grade Level:</span>
                      <span>{resource.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Subject:</span>
                      <span>{resource.curriculum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Difficulty:</span>
                      <span>{resource.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Usage Statistics</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Views:</span>
                      <span>{resource.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rating:</span>
                      <span>{resource.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{resource.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Access Level:</span>
                      <span>{resource.accessTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span>{resource.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contents" className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Table of Contents</h3>
              <div className="space-y-2">
                {/* Enhanced table of contents with page structure */}
                {(() => {
                  const subject = resource.curriculum.toLowerCase();
                  const structure = [
                    { type: "cover", title: "Book Cover", page: 1, icon: "📖" },
                    { type: "toc", title: "Table of Contents", page: 2, icon: "📋" },
                    ...(subject.includes('math') ? [
                      { type: "chapter", title: "Chapter 1: Introduction to Numbers", page: 3, icon: "🔢" },
                      { type: "content", title: "Number Counting & Recognition", page: 4, icon: "📝" },
                      { type: "quiz", title: "Chapter 1 Quiz", page: 5, icon: "📝" },
                      { type: "chapter", title: "Chapter 2: Addition and Subtraction", page: 6, icon: "➕" },
                      { type: "content", title: "Addition Practice", page: 7, icon: "📝" },
                      { type: "content", title: "Subtraction Practice", page: 8, icon: "📝" },
                      { type: "quiz", title: "Chapter 2 Quiz", page: 9, icon: "📝" },
                      { type: "chapter", title: "Chapter 3: Shapes and Patterns", page: 10, icon: "🔺" },
                      { type: "content", title: "Geometric Shapes", page: 11, icon: "📝" },
                      { type: "quiz", title: "Chapter 3 Quiz", page: 12, icon: "📝" },
                      { type: "chapter", title: "Chapter 4: Review and Assessment", page: 13, icon: "🎯" },
                      { type: "content", title: "Comprehensive Review", page: 14, icon: "📝" },
                      { type: "assessment", title: "Final Assessment", page: 15, icon: "🏆" }
                    ] : subject.includes('science') ? [
                      { type: "chapter", title: "Chapter 1: The Solar System", page: 3, icon: "🌟" },
                      { type: "content", title: "Planets and Stars", page: 4, icon: "📝" },
                      { type: "quiz", title: "Chapter 1 Quiz", page: 5, icon: "📝" },
                      { type: "chapter", title: "Chapter 2: Animal Habitats", page: 6, icon: "🦅" },
                      { type: "content", title: "Where Animals Live", page: 7, icon: "📝" },
                      { type: "quiz", title: "Chapter 2 Quiz", page: 8, icon: "📝" },
                      { type: "chapter", title: "Chapter 3: Weather and Climate", page: 9, icon: "🌤️" },
                      { type: "content", title: "Weather Patterns", page: 10, icon: "📝" },
                      { type: "content", title: "Plant Life Cycle", page: 11, icon: "📝" },
                      { type: "quiz", title: "Chapter 3 Quiz", page: 12, icon: "📝" },
                      { type: "chapter", title: "Chapter 4: Simple Machines", page: 13, icon: "⚙️" },
                      { type: "content", title: "How Machines Work", page: 14, icon: "📝" },
                      { type: "assessment", title: "Final Assessment", page: 15, icon: "🏆" }
                    ] : subject.includes('language') ? [
                      { type: "chapter", title: "Chapter 1: Letters and Sounds", page: 3, icon: "🔤" },
                      { type: "content", title: "Alphabet Recognition", page: 4, icon: "📝" },
                      { type: "quiz", title: "Chapter 1 Quiz", page: 5, icon: "📝" },
                      { type: "chapter", title: "Chapter 2: Building Words", page: 6, icon: "🔤" },
                      { type: "content", title: "Simple Words", page: 7, icon: "📝" },
                      { type: "content", title: "Sentence Structure", page: 8, icon: "📝" },
                      { type: "quiz", title: "Chapter 2 Quiz", page: 9, icon: "📝" },
                      { type: "chapter", title: "Chapter 3: Reading and Writing", page: 10, icon: "✍️" },
                      { type: "content", title: "Reading Comprehension", page: 11, icon: "📝" },
                      { type: "content", title: "Creative Writing", page: 12, icon: "📝" },
                      { type: "assessment", title: "Final Assessment", page: 13, icon: "🏆" }
                    ] : [
                      { type: "chapter", title: "Chapter 1: Introduction", page: 3, icon: "📚" },
                      { type: "content", title: "Basic Concepts", page: 4, icon: "📝" },
                      { type: "quiz", title: "Chapter 1 Quiz", page: 5, icon: "📝" },
                      { type: "chapter", title: "Chapter 2: Core Concepts", page: 6, icon: "💡" },
                      { type: "content", title: "Advanced Topics", page: 7, icon: "📝" },
                      { type: "content", title: "Practice Exercises", page: 8, icon: "📝" },
                      { type: "quiz", title: "Chapter 2 Quiz", page: 9, icon: "📝" },
                      { type: "chapter", title: "Chapter 3: Advanced Topics", page: 10, icon: "🎓" },
                      { type: "content", title: "Summary Review", page: 11, icon: "📝" },
                      { type: "content", title: "Additional Practice", page: 12, icon: "📝" },
                      { type: "assessment", title: "Final Assessment", page: 13, icon: "🏆" }
                    ])
                  ];
                  
                  const getTypeColor = (type: string) => {
                    switch (type) {
                      case 'cover': return 'bg-blue-100 text-blue-800';
                      case 'toc': return 'bg-gray-100 text-gray-800';
                      case 'chapter': return 'bg-purple-100 text-purple-800';
                      case 'content': return 'bg-green-100 text-green-800';
                      case 'quiz': return 'bg-yellow-100 text-yellow-800';
                      case 'assessment': return 'bg-red-100 text-red-800';
                      default: return 'bg-gray-100 text-gray-800';
                    }
                  };
                  
                  return structure.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded min-w-16 text-center">
                          Page {item.page}
                        </span>
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.title}</span>
                          <Badge variant="outline" className={`text-xs w-fit ${getTypeColor(item.type)}`}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.type === 'quiz' || item.type === 'assessment' ? '5-10 min' : 
                           item.type === 'chapter' ? '2-3 min' : '3-5 min'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => setIsBookViewerOpen(true)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              {/* Learning objectives */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Learning Objectives</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Master fundamental concepts in {resource.curriculum}</li>
                  <li>• Develop critical thinking skills</li>
                  <li>• Apply knowledge through interactive exercises</li>
                  <li>• Build confidence in problem-solving</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Reviews & Ratings</h3>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-medium">{resource.rating}/5</span>
                  <span className="text-sm text-gray-500">(12 reviews)</span>
                </div>
              </div>

              {/* Mock reviews */}
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          U{i + 1}
                        </div>
                        <span className="font-medium">User {i + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, j) => (
                          <Star key={j} className={`h-4 w-4 ${j < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      This is a great educational resource. The content is well-structured and easy to understand for {resource.grade} students.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>2 days ago</span>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <ThumbsUp className="h-3 w-3" />
                        Helpful (5)
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <MessageCircle className="h-3 w-3" />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BookPreviewModal;