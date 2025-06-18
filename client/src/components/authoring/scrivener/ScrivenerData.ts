import { DocumentNode, ResearchItem, Character, ProjectInfo } from "./ScrivenerTypes";

export const defaultProject: ProjectInfo = {
  title: "Advanced Chemistry Textbook",
  target: 50000,
  current: 12450,
  deadline: "2024-08-15"
};

export const defaultDocuments: DocumentNode[] = [
  {
    id: 'manuscript',
    title: 'Manuscript',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: 'chapter1',
        title: 'Chapter 1: Atomic Structure',
        type: 'chapter',
        expanded: true,
        wordCount: 3200,
        target: 5000,
        status: 'first-edit',
        content: 'Understanding the fundamental building blocks of matter...',
        children: [
          {
            id: 'scene1_1',
            title: 'Introduction to Atoms',
            type: 'scene',
            wordCount: 1200,
            status: 'complete',
            content: 'Atoms are the basic units of matter and the defining structure of elements...'
          },
          {
            id: 'scene1_2',
            title: 'Electron Configuration',
            type: 'scene',
            wordCount: 2000,
            status: 'first-edit',
            content: 'The arrangement of electrons in atomic orbitals follows specific patterns...'
          }
        ]
      },
      {
        id: 'chapter2',
        title: 'Chapter 2: Chemical Bonding',
        type: 'chapter',
        expanded: false,
        wordCount: 2800,
        target: 4500,
        status: 'draft',
        content: 'Chemical bonds form when atoms interact to achieve stable electron configurations...',
        children: [
          {
            id: 'scene2_1',
            title: 'Ionic Bonds',
            type: 'scene',
            wordCount: 1400,
            status: 'draft',
            content: 'Ionic bonds form between metals and non-metals through electron transfer...'
          },
          {
            id: 'scene2_2',
            title: 'Covalent Bonds',
            type: 'scene',
            wordCount: 1400,
            status: 'draft',
            content: 'Covalent bonds involve the sharing of electrons between atoms...'
          }
        ]
      }
    ]
  },
  {
    id: 'research',
    title: 'Research',
    type: 'folder',
    expanded: false,
    children: [
      {
        id: 'research_quantum',
        title: 'Quantum Mechanics Principles',
        type: 'research',
        content: 'Key quantum mechanical concepts for chemistry education...'
      },
      {
        id: 'research_pedagogy',
        title: 'Chemistry Teaching Methods',
        type: 'research',
        content: 'Effective approaches to teaching complex chemistry concepts...'
      }
    ]
  },
  {
    id: 'characters',
    title: 'Characters',
    type: 'folder',
    expanded: false,
    children: [
      {
        id: 'char_dr_chen',
        title: 'Dr. Sarah Chen',
        type: 'character',
        content: 'Main instructor character who guides readers through chemistry concepts'
      },
      {
        id: 'char_alex',
        title: 'Alex Rodriguez',
        type: 'character',
        content: 'Student character who asks questions and provides reader perspective'
      }
    ]
  }
];

export const defaultResearch: ResearchItem[] = [
  {
    id: 'research1',
    title: 'Quantum Chemistry Fundamentals',
    type: 'pdf',
    content: 'Comprehensive overview of quantum mechanical principles in chemistry...',
    tags: ['quantum', 'chemistry', 'fundamentals'],
    created: new Date('2024-06-01')
  },
  {
    id: 'research2',
    title: 'Modern Teaching Methods',
    type: 'web',
    content: 'Latest research on effective chemistry education techniques...',
    url: 'https://example.com/teaching-methods',
    tags: ['education', 'pedagogy', 'chemistry'],
    created: new Date('2024-06-02')
  },
  {
    id: 'research3',
    title: 'Periodic Table History',
    type: 'pdf',
    content: 'Historical development of the periodic table...',
    tags: ['history', 'periodic-table'],
    created: new Date('2024-06-02')
  }
];

export const defaultCharacters: Character[] = [
  {
    id: 'char1',
    name: 'Dr. Sarah Chen',
    role: 'protagonist',
    description: 'Modern chemistry professor who guides students through complex concepts',
    traits: ['patient', 'innovative', 'encouraging'],
    notes: 'Uses real-world examples to make chemistry accessible'
  },
  {
    id: 'char2',
    name: 'Alex Rodriguez',
    role: 'supporting',
    description: 'Curious student who asks insightful questions',
    traits: ['inquisitive', 'analytical', 'determined'],
    notes: 'Represents the reader\'s perspective and common questions'
  }
];