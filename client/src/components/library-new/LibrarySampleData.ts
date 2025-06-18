import { LibraryResource } from "./LibraryTypes";

export const sampleResources: LibraryResource[] = [
  {
    id: 1,
    title: "Mathematics Grade 5",
    type: "book",
    grade: "Grade 5",
    curriculum: "CBE",
    description: "Comprehensive mathematics textbook for Grade 5 students",
    difficulty: "medium",
    duration: 45,
    tags: ["mathematics", "grade5", "textbook"],
    viewCount: 150,
    rating: "4.5",
    thumbnailUrl: "/api/placeholder/200/150",
    fileUrl: "#",
    accessTier: "free",
    isPublished: true,
    authorId: "math-publisher",
    language: "English",
  },
  {
    id: 2,
    title: "Science Experiments",
    type: "video",
    grade: "Grade 4",
    curriculum: "CBE",
    description: "Fun and educational science experiments for young learners",
    difficulty: "easy",
    duration: 30,
    tags: ["science", "experiments", "grade4"],
    viewCount: 200,
    rating: "4.8",
    thumbnailUrl: "/api/placeholder/200/150",
    fileUrl: "#",
    accessTier: "free",
    isPublished: true,
    authorId: "science-team",
    language: "English",
  },
  {
    id: 3,
    title: "English Reading Worksheet",
    type: "worksheet",
    grade: "Grade 3",
    curriculum: "CBE",
    description: "Interactive reading comprehension worksheet",
    difficulty: "easy",
    duration: 25,
    tags: ["english", "reading", "worksheet"],
    viewCount: 120,
    rating: "4.3",
    thumbnailUrl: "/api/placeholder/200/150",
    fileUrl: "#",
    accessTier: "premium",
    isPublished: true,
    authorId: "english-dept",
    language: "English",
  },
  {
    id: 4,
    title: "History Quiz: Ancient Civilizations",
    type: "quiz",
    grade: "Grade 6",
    curriculum: "CBE",
    description: "Test your knowledge of ancient civilizations",
    difficulty: "hard",
    duration: 20,
    tags: ["history", "quiz", "ancient", "civilizations"],
    viewCount: 85,
    rating: "4.2",
    thumbnailUrl: "/api/placeholder/200/150",
    fileUrl: "#",
    accessTier: "free",
    isPublished: true,
    authorId: "history-teacher",
    language: "English",
  },
];

// Generate sample media assets
export function generateSampleMediaAssets(type: string): any[] {
  if (type === 'video' || type === 'interactive' || type === 'html5') {
    return [
      {
        id: 'video-1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: 596,
        title: 'Introduction Video',
        subtitles: 'Sample video content with educational material'
      },
      {
        id: 'audio-1',
        type: 'audio',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        duration: 30,
        title: 'Audio Narration'
      }
    ];
  }
  return [];
}

// Generate sample interactive elements
export function generateSampleInteractiveElements(type: string): any[] {
  if (type === 'interactive' || type === 'html5') {
    return [
      {
        id: 'quiz-1',
        type: 'quiz',
        position: { x: 50, y: 30 },
        content: {
          question: 'What is the main concept discussed in this lesson?',
          options: [
            'Interactive Learning',
            'Traditional Teaching',
            'Assessment Methods',
            'Content Management'
          ],
          correctAnswer: 0
        },
        xapiVerb: 'answered',
        required: true
      },
      {
        id: 'hotspot-1',
        type: 'hotspot',
        position: { x: 25, y: 60 },
        content: {
          title: 'Click for More Info',
          description: 'Additional information about this topic'
        },
        xapiVerb: 'interacted'
      }
    ];
  }
  return [];
}