// Legacy page generators - use modular hooks from usePageGenerators.ts
export * from '../../hooks/usePageGenerators';

// Generate book pages based on resource content  
export function generateBookPages(resource: any): string[] {
  const pages = [];
  const totalPages = 15;

  // Cover page
  pages.push(`
    <div class="p-6 text-center">
      <h1 class="text-4xl font-bold mb-4 text-gray-800">${resource.title || 'Interactive Calculus Textbook'}</h1>
      <p class="text-xl text-gray-600 mb-6">by ${resource.author || 'Digital Learning Team'}</p>
      <div class="mb-8">
        <img src="/demo/calculus-cover.jpg" alt="Book Cover" class="mx-auto max-w-xs rounded-lg shadow-lg">
      </div>
      <p class="text-gray-700">${resource.description || 'An interactive guide to understanding calculus concepts'}</p>
      <div class="text-sm text-gray-500 mt-8">Page 1 of ${totalPages}</div>
    </div>
  `);

  // Table of contents
  pages.push(`
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Table of Contents</h2>
      <div class="space-y-3">
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Chapter 1: Introduction to Functions</span>
          <span class="text-gray-500">Page 3</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Chapter 2: Limits and Continuity</span>
          <span class="text-gray-500">Page 5</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Chapter 3: Derivatives</span>
          <span class="text-gray-500">Page 8</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Chapter 4: Integration</span>
          <span class="text-gray-500">Page 11</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-lg">Practice Problems</span>
          <span class="text-gray-500">Page 13</span>
        </div>
      </div>
      <div class="text-sm text-gray-500 mt-8">Page 2 of ${totalPages}</div>
    </div>
  `);

  // Interactive content pages
  pages.push(generateInteractivePage());
  pages.push(generateVideoPage());
  pages.push(generateCalculatorPage());
  pages.push(generateGraphPage());
  pages.push(generateQuizPage(totalPages));

  // Generate remaining content pages
  for (let i = 8; i <= totalPages; i++) {
    if (i === totalPages) {
      pages.push(generateSummaryPage(i, totalPages));
    } else {
      pages.push(generateChapterPage(i, totalPages));
    }
  }

  return pages;
}

function generateInteractivePage(): string {
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-indigo-600">Chapter 1: Introduction to Functions</h2>
      <div class="mb-6">
        <p class="text-base leading-relaxed mb-4">
          A function is a mathematical relationship between two sets of numbers. 
          Understanding functions is crucial for mastering calculus concepts.
        </p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-blue-800 mb-3">📖 Definition</h3>
          <p class="text-blue-700">
            A function f is a rule that assigns to each element x in a set D exactly one element, 
            called f(x), in a set E.
          </p>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 class="font-semibold text-green-800 mb-3">💡 Interactive Example</h3>
          <p class="text-green-700 mb-3">Try this: f(x) = 2x + 1</p>
          <div class="flex items-center space-x-3">
            <span>f(</span>
            <input type="number" value="3" class="w-16 p-2 border border-gray-300 rounded text-center">
            <span>) = </span>
            <span class="font-bold text-green-600">7</span>
          </div>
        </div>
      </div>
      <div class="text-sm text-gray-500">Page 3 of 15</div>
    </div>
  `;
}

function generateVideoPage(): string {
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-purple-600">Understanding Limits</h2>
      <div class="mb-6">
        <div class="bg-gray-100 rounded-lg p-8 text-center mb-6">
          <div class="bg-purple-500 text-white p-4 rounded-full inline-block mb-4">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l7-5-7-5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">Interactive Video: Limits Explained</h3>
          <p class="text-gray-600 mb-4">Watch this 5-minute video to understand limit concepts</p>
          <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">
            ▶ Play Video
          </button>
        </div>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="font-semibold text-yellow-800 mb-3">🎯 Video Summary</h3>
          <ul class="text-yellow-700 space-y-1">
            <li>• What limits represent in mathematics</li>
            <li>• How to calculate simple limits</li>
            <li>• Real-world applications of limits</li>
          </ul>
        </div>
      </div>
      <div class="text-sm text-gray-500">Page 4 of 15</div>
    </div>
  `;
}

function generateCalculatorPage(): string {
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-green-600">Interactive Calculator</h2>
      <div class="mb-6">
        <p class="text-base leading-relaxed mb-4">
          Use this built-in calculator to solve limit problems step by step.
        </p>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 class="font-semibold text-gray-800 mb-4">Calculate: lim(x→a) f(x)</h3>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Function f(x):</label>
              <input type="text" value="x² - 1" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., x² - 1">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Approaching value (a):</label>
              <input type="text" value="1" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., 1">
            </div>
          </div>
          
          <button class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full mb-4">
            Calculate Limit
          </button>
          
          <div class="bg-green-100 border border-green-300 rounded p-3">
            <strong>Result: </strong>
            <span class="text-green-800">lim(x→1) (x² - 1) = 0</span>
          </div>
        </div>
      </div>
      <div class="text-sm text-gray-500">Page 5 of 15</div>
    </div>
  `;
}

function generateGraphPage(): string {
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-blue-600">Interactive Graph Plotter</h2>
      <div class="mb-6">
        <p class="text-base leading-relaxed mb-4">
          Visualize functions and their limits using our interactive graphing tool.
        </p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="bg-white border-2 border-dashed border-blue-300 rounded-lg h-64 flex items-center justify-center mb-4">
            <div class="text-center text-blue-600">
              <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              <p>Interactive Graph Area</p>
              <p class="text-sm">Function: f(x) = x² - 4</p>
            </div>
          </div>
          
          <div class="flex justify-center space-x-3">
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Plot Function</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Reset</button>
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Zoom In</button>
          </div>
        </div>
      </div>
      <div class="text-sm text-gray-500">Page 6 of 15</div>
    </div>
  `;
}

function generateQuizPage(totalPages: number): string {
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-purple-600">Chapter Quiz</h2>
      <p class="text-gray-600 mb-6">Test your understanding with these interactive questions.</p>
      
      <div class="space-y-6">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 class="font-semibold text-purple-800 mb-3">Question 1: What is a limit?</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" name="q1" class="mr-3">
              <span>The maximum value of a function</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="q1" class="mr-3">
              <span>The value a function approaches as x approaches a certain value</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="q1" class="mr-3">
              <span>The minimum value of a function</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="q1" class="mr-3">
              <span>The derivative of a function</span>
            </label>
          </div>
        </div>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 class="font-semibold text-purple-800 mb-3">Question 2: Calculate lim(x→2) (x + 3)</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" name="q2" class="mr-3">
              <span>2</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="q2" class="mr-3">
              <span>3</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="q2" class="mr-3">
              <span>5</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="q2" class="mr-3">
              <span>undefined</span>
            </label>
          </div>
        </div>
        
        <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 w-full">
          Submit Quiz
        </button>
      </div>
      
      <div class="text-sm text-gray-500 mt-8">Page 7 of ${totalPages}</div>
    </div>
  `;
}

function generateChapterPage(pageNum: number, totalPages: number): string {
  const chapterTopics = [
    'Derivative Rules and Techniques',
    'Applications of Derivatives', 
    'Introduction to Integration',
    'Integration Techniques',
    'Applications of Integration',
    'Practice Problems Set A',
    'Practice Problems Set B'
  ];
  
  const topic = chapterTopics[pageNum - 8] || 'Advanced Topics';
  
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-indigo-600">Chapter ${pageNum - 4}: ${topic}</h2>
      
      <div class="mb-6">
        <p class="text-base leading-relaxed mb-4">
          This chapter covers essential concepts in ${topic.toLowerCase()}. 
          Understanding these principles will provide a solid foundation for advanced calculus topics.
        </p>
        
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-indigo-800 mb-3">🔍 Key Concepts</h3>
          <ul class="space-y-2 text-indigo-700">
            <li class="flex items-center">
              <div class="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              Mathematical foundations and theory
            </li>
            <li class="flex items-center">
              <div class="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              Practical applications and examples
            </li>
            <li class="flex items-center">
              <div class="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              Problem-solving strategies
            </li>
          </ul>
        </div>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-3">📝 Practice Exercise</h3>
          <p class="text-gray-700">
            Complete the exercises on the next page to reinforce your understanding of ${topic.toLowerCase()}.
          </p>
        </div>
      </div>
      
      <div class="text-sm text-gray-500">Page ${pageNum} of ${totalPages}</div>
    </div>
  `;
}

function generateSummaryPage(pageNum: number, totalPages: number): string {
  return `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Course Summary</h2>
      
      <div class="space-y-4 mb-8">
        <div class="bg-green-50 border-l-4 border-green-400 p-4">
          <h3 class="font-semibold text-green-800">✅ Completed Topics</h3>
          <ul class="text-green-700 mt-2 space-y-1">
            <li>• Introduction to Functions</li>
            <li>• Limits and Continuity</li>
            <li>• Basic Derivatives</li>
            <li>• Integration Fundamentals</li>
          </ul>
        </div>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
          <h3 class="font-semibold text-blue-800">🎯 Your Progress</h3>
          <div class="mt-2">
            <div class="bg-blue-200 rounded-full h-3">
              <div class="bg-blue-500 h-3 rounded-full" style="width: 85%"></div>
            </div>
            <p class="text-blue-700 text-sm mt-1">85% Complete</p>
          </div>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 class="font-semibold text-yellow-800">📚 Next Steps</h3>
          <p class="text-yellow-700">Continue with Advanced Calculus II</p>
        </div>
      </div>
      
      <div class="text-center space-y-3">
        <button class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full">
          📊 View Detailed Progress Report
        </button>
        <button class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full">
          📖 Continue to Next Book
        </button>
        <button class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 w-full">
          🔄 Review Previous Chapters
        </button>
      </div>
      
      <div class="text-center text-sm text-gray-500 mt-8">
        <p>Page ${pageNum} of ${totalPages} • Course Complete!</p>
      </div>
    </div>
  `;
}