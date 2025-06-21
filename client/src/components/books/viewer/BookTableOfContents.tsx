import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, FileText } from 'lucide-react';

interface TableOfContentsData {
  chapter: string;
  title: string;
  pages: string;
  startPage: number;
  topics: {
    title: string;
    page: number;
    type?: 'reading' | 'exercise' | 'quiz' | 'video';
  }[];
}

interface BookTableOfContentsProps {
  isVisible: boolean;
  onGoToPage: (page: number) => void;
  onClose: () => void;
  currentPage?: number;
}

const generateTableOfContents = (): TableOfContentsData[] => {
  return [
    { 
      chapter: "Cover", 
      title: "Title Page", 
      pages: "1",
      startPage: 1,
      topics: [
        { title: "Cover Page", page: 1, type: 'reading' }
      ]
    },
    { 
      chapter: "Contents", 
      title: "Table of Contents", 
      pages: "2",
      startPage: 2,
      topics: [
        { title: "Table of Contents", page: 2, type: 'reading' }
      ]
    },
    { 
      chapter: "Chapter 1", 
      title: "Introduction", 
      pages: "3-4",
      startPage: 3,
      topics: [
        { title: "Introduction to Subject", page: 3, type: 'reading' },
        { title: "Interactive Learning Resources", page: 4, type: 'video' }
      ]
    },
    { 
      chapter: "Chapter 2", 
      title: "Interactive Elements", 
      pages: "5-8",
      startPage: 5,
      topics: [
        { title: "Chapter Quiz", page: 5, type: 'quiz' },
        { title: "Advanced Content", page: 6, type: 'reading' },
        { title: "Practice Exercises", page: 7, type: 'exercise' },
        { title: "Assessment", page: 8, type: 'quiz' }
      ]
    },
    { 
      chapter: "Chapter 3", 
      title: "Additional Content", 
      pages: "9-12",
      startPage: 9,
      topics: [
        { title: "Extended Learning", page: 9, type: 'reading' },
        { title: "Case Studies", page: 10, type: 'reading' },
        { title: "Real-world Applications", page: 11, type: 'exercise' },
        { title: "Summary", page: 12, type: 'reading' }
      ]
    },
    { 
      chapter: "Resources", 
      title: "References & Index", 
      pages: "13-15",
      startPage: 13,
      topics: [
        { title: "Additional Resources", page: 13, type: 'reading' },
        { title: "Glossary", page: 14, type: 'reading' },
        { title: "Index", page: 15, type: 'reading' }
      ]
    }
  ];
};

const getContentTypeIcon = (type?: string) => {
  switch (type) {
    case 'quiz':
      return '🧠';
    case 'exercise':
      return '✏️';
    case 'video':
      return '📹';
    case 'reading':
    default:
      return '📖';
  }
};

const getContentTypeColor = (type?: string) => {
  switch (type) {
    case 'quiz':
      return 'text-purple-600 bg-purple-50';
    case 'exercise':
      return 'text-green-600 bg-green-50';
    case 'video':
      return 'text-blue-600 bg-blue-50';
    case 'reading':
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const BookTableOfContents: React.FC<BookTableOfContentsProps> = ({
  isVisible,
  onGoToPage,
  onClose,
  currentPage = 1
}) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([0, 1, 2]));
  
  if (!isVisible) return null;

  const tableOfContents = generateTableOfContents();

  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  const handleNavigateToPage = (page: number) => {
    onGoToPage(page);
    onClose();
  };

  const handleNavigateToChapter = (chapter: TableOfContentsData) => {
    onGoToPage(chapter.startPage);
    onClose();
  };

  const isCurrentPage = (page: number) => page === currentPage;
  const isInCurrentChapter = (chapter: TableOfContentsData) => {
    const startPage = chapter.startPage;
    const endPage = chapter.topics[chapter.topics.length - 1]?.page || startPage;
    return currentPage >= startPage && currentPage <= endPage;
  };

  return (
    <div className="fixed inset-4 sm:absolute sm:top-full sm:left-0 sm:inset-auto sm:mt-2 sm:w-80 md:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[80vh] sm:max-h-80 md:max-h-96 overflow-y-auto">
      <div className="p-4 sm:p-4">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg sm:text-lg text-gray-900">Table of Contents</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl sm:text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            title="Close"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2">
          {tableOfContents.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className={`border border-gray-200 rounded-lg overflow-hidden ${isInCurrentChapter(chapter) ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
              
              {/* Chapter Header - Clickable */}
              <button
                onClick={() => handleNavigateToChapter(chapter)}
                className={`w-full p-3 sm:p-3 text-left transition-colors ${
                  isInCurrentChapter(chapter) 
                    ? 'bg-blue-50 hover:bg-blue-100' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChapter(chapterIndex);
                      }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {expandedChapters.has(chapterIndex) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </button>
                    <div>
                      <div className={`font-semibold text-base sm:text-sm ${
                        isInCurrentChapter(chapter) ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {chapter.chapter}
                      </div>
                      <div className={`text-sm ${
                        isInCurrentChapter(chapter) ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {chapter.title}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`text-xs px-2 py-1 rounded ${
                      isInCurrentChapter(chapter) 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      Pages {chapter.pages}
                    </div>
                    {isInCurrentChapter(chapter) && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
              
              {/* Chapter Topics - Expandable */}
              {expandedChapters.has(chapterIndex) && (
                <div className="bg-white border-t border-gray-200">
                  {chapter.topics.map((topic, topicIndex) => (
                    <button
                      key={topicIndex}
                      onClick={() => handleNavigateToPage(topic.page)}
                      className={`w-full text-left p-3 sm:p-2 pl-6 border-l-3 transition-all touch-manipulation group ${
                        isCurrentPage(topic.page)
                          ? 'bg-blue-100 border-blue-500 text-blue-900'
                          : 'hover:bg-blue-50 border-transparent hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-lg">{getContentTypeIcon(topic.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm sm:text-sm font-medium truncate ${
                              isCurrentPage(topic.page) ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {topic.title}
                            </div>
                            {topic.type && (
                              <div className={`text-xs capitalize mt-1 inline-block px-2 py-0.5 rounded-full ${getContentTypeColor(topic.type)}`}>
                                {topic.type}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded shrink-0 ml-2 ${
                          isCurrentPage(topic.page)
                            ? 'bg-blue-200 text-blue-800 font-medium'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                        }`}>
                          Page {topic.page}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Quick navigation footer */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Click chapters or topics to navigate • Currently on page {currentPage}
          </div>
        </div>
      </div>
    </div>
  );
};