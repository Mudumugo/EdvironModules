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

const tableOfContents: TableOfContentsData[] = [
  { 
    chapter: "Chapter 1", 
    title: "Introduction to Numbers", 
    pages: "3-5",
    topics: [
      { title: "What are Numbers?", page: 3 },
      { title: "Counting 1-10", page: 4 },
      { title: "Number Recognition", page: 5 }
    ]
  },
  { 
    chapter: "Chapter 2", 
    title: "Addition and Subtraction", 
    pages: "6-9",
    topics: [
      { title: "Simple Addition", page: 6 },
      { title: "Adding with Objects", page: 7 },
      { title: "Basic Subtraction", page: 8 },
      { title: "Practice Problems", page: 9 }
    ]
  },
  { 
    chapter: "Chapter 3", 
    title: "Shapes and Patterns", 
    pages: "10-12",
    topics: [
      { title: "Basic Shapes", page: 10 },
      { title: "Pattern Recognition", page: 11 },
      { title: "Creating Patterns", page: 12 }
    ]
  },
  { 
    chapter: "Chapter 4", 
    title: "Review and Assessment", 
    pages: "13-15",
    topics: [
      { title: "Chapter Review", page: 13 },
      { title: "Assessment Quiz", page: 14 },
      { title: "Additional Practice", page: 15 }
    ]
  }
];

export const BookTableOfContents: React.FC<BookTableOfContentsProps> = ({
  isVisible,
  onGoToPage,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 sm:max-h-96 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">Table of Contents</h3>
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