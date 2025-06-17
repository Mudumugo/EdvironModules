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

  // Generate interactive book content based on subject and grade
  useEffect(() => {
    if (resource && resource.type === 'book') {
      const generateBookPages = () => {
        const subject = resource.curriculum.toLowerCase();
        const grade = resource.grade;
        
        // Create subject-specific interactive pages
        if (subject.includes('math')) {
          return [
            `data:image/svg+xml,${encodeURIComponent(generateMathPage(1, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateMathPage(2, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateMathPage(3, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateMathPage(4, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateMathPage(5, grade))}`
          ];
        } else if (subject.includes('science')) {
          return [
            `data:image/svg+xml,${encodeURIComponent(generateSciencePage(1, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateSciencePage(2, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateSciencePage(3, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateSciencePage(4, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateSciencePage(5, grade))}`
          ];
        } else if (subject.includes('english') || subject.includes('language')) {
          return [
            `data:image/svg+xml,${encodeURIComponent(generateLanguagePage(1, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateLanguagePage(2, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateLanguagePage(3, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateLanguagePage(4, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateLanguagePage(5, grade))}`
          ];
        } else {
          return [
            `data:image/svg+xml,${encodeURIComponent(generateGeneralPage(1, resource.title, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateGeneralPage(2, resource.title, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateGeneralPage(3, resource.title, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateGeneralPage(4, resource.title, grade))}`,
            `data:image/svg+xml,${encodeURIComponent(generateGeneralPage(5, resource.title, grade))}`
          ];
        }
      };

      setBookData({
        id: resource.id,
        title: resource.title,
        author: resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author',
        pages: generateBookPages(),
        totalPages: 5,
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
                {/* Subject-specific table of contents */}
                {(() => {
                  const subject = resource.curriculum.toLowerCase();
                  const chapters = subject.includes('math') ? [
                    "Introduction to Numbers",
                    "Addition Fun", 
                    "Subtraction Practice",
                    "Shapes and Patterns",
                    "Review and Practice"
                  ] : subject.includes('science') ? [
                    "The Solar System",
                    "Animal Habitats",
                    "Weather Patterns", 
                    "Plant Life Cycle",
                    "Simple Machines"
                  ] : subject.includes('english') || subject.includes('language') ? [
                    "Letter Recognition",
                    "Simple Words",
                    "Sentence Structure",
                    "Reading Comprehension", 
                    "Creative Writing"
                  ] : [
                    "Introduction",
                    "Basic Concepts",
                    "Practice Exercises",
                    "Advanced Topics",
                    "Summary"
                  ];
                  
                  return chapters.map((chapter, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Page {i + 1}</span>
                        <span className="font-medium">{chapter}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 5) + 3} min
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