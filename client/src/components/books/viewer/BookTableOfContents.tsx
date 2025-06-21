import React from 'react';

interface TableOfContentsData {
  chapter: string;
  title: string;
  pages: string;
  topics: {
    title: string;
    page: number;
  }[];
}

interface BookTableOfContentsProps {
  isVisible: boolean;
  onGoToPage: (page: number) => void;
  onClose: () => void;
}

const generateTableOfContents = (): TableOfContentsData[] => {
  return [
    { 
      chapter: "Cover", 
      title: "Title Page", 
      pages: "1",
      topics: [
        { title: "Cover Page", page: 1 }
      ]
    },
    { 
      chapter: "Contents", 
      title: "Table of Contents", 
      pages: "2",
      topics: [
        { title: "Table of Contents", page: 2 }
      ]
    },
    { 
      chapter: "Chapter 1", 
      title: "Introduction", 
      pages: "3-4",
      topics: [
        { title: "Introduction to Subject", page: 3 },
        { title: "Interactive Learning Resources", page: 4 }
      ]
    },
    { 
      chapter: "Chapter 2", 
      title: "Interactive Elements", 
      pages: "5-8",
      topics: [
        { title: "Chapter Quiz", page: 5 },
        { title: "Advanced Content", page: 6 },
        { title: "Practice Exercises", page: 7 },
        { title: "Assessment", page: 8 }
      ]
    },
    { 
      chapter: "Chapter 3", 
      title: "Additional Content", 
      pages: "9-12",
      topics: [
        { title: "Extended Learning", page: 9 },
        { title: "Case Studies", page: 10 },
        { title: "Real-world Applications", page: 11 },
        { title: "Summary", page: 12 }
      ]
    },
    { 
      chapter: "Resources", 
      title: "References & Index", 
      pages: "13-15",
      topics: [
        { title: "Additional Resources", page: 13 },
        { title: "Glossary", page: 14 },
        { title: "Index", page: 15 }
      ]
    }
  ];
};

export const BookTableOfContents: React.FC<BookTableOfContentsProps> = ({
  isVisible,
  onGoToPage,
  onClose
}) => {
  if (!isVisible) return null;

  const tableOfContents = generateTableOfContents();

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 sm:max-h-96 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 border-b pb-2">
          <h3 className="font-semibold text-lg">Table of Contents</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-1">
          {tableOfContents.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border-b border-gray-100 last:border-b-0">
              <div className="p-2 bg-gray-50 rounded-t">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{chapter.chapter}</div>
                    <div className="text-sm text-gray-600">{chapter.title}</div>
                  </div>
                  <div className="text-sm text-gray-500">Pages {chapter.pages}</div>
                </div>
              </div>
              <div className="bg-white">
                {chapter.topics.map((topic, topicIndex) => (
                  <button
                    key={topicIndex}
                    onClick={() => {
                      onGoToPage(topic.page);
                      onClose();
                    }}
                    className="w-full text-left p-2 pl-4 hover:bg-blue-50 border-l-2 border-transparent hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-700">{topic.title}</div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Page {topic.page}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};