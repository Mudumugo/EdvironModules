// Default media assets for interactive books
export const DEFAULT_MEDIA_ASSETS = [
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
  },
  {
    id: 'widget_graph',
    type: 'widget',
    title: 'Interactive Graph Plotter',
    component: 'GraphWidget',
    config: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }
  },
  {
    id: 'calculator_basic',
    type: 'calculator',
    title: 'Scientific Calculator',
    component: 'Calculator',
    features: ['basic', 'scientific', 'graphing']
  },
  {
    id: 'assessment_quiz',
    type: 'assessment',
    title: 'Chapter Quiz',
    component: 'QuizWidget',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the limit of f(x) = x² as x approaches 2?',
        options: ['2', '4', '8', 'undefined'],
        correct: 1
      }
    ]
  }
];

export const DEFAULT_INTERACTIVE_ELEMENTS = [
  {
    id: 'highlight',
    type: 'annotation',
    enabled: true,
    config: { colors: ['yellow', 'green', 'blue', 'pink'] }
  },
  {
    id: 'bookmarks',
    type: 'navigation',
    enabled: true,
    config: { maxBookmarks: 10 }
  },
  {
    id: 'notes',
    type: 'annotation',
    enabled: true,
    config: { maxLength: 500 }
  },
  {
    id: 'progress_tracking',
    type: 'analytics',
    enabled: true,
    config: { trackReadingTime: true, trackPageViews: true }
  }
];