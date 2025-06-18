export const generateInteractivePage = (title: string, content: string, interactiveElements?: any[]) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      min-height: 100vh;
      color: #333;
    }
    .interactive-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    .interactive-title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 30px;
      text-align: center;
      background: linear-gradient(135deg, #f093fb, #f5576c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .content-section {
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 30px;
      color: #444;
    }
    .interactive-element {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 15px;
      padding: 25px;
      margin: 20px 0;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }
    .draggable-item {
      background: #4ecdc4;
      color: white;
      padding: 15px;
      margin: 10px;
      border-radius: 10px;
      cursor: move;
      display: inline-block;
      transition: all 0.3s ease;
      user-select: none;
    }
    .draggable-item:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
    }
    .drop-zone {
      border: 3px dashed #ddd;
      border-radius: 10px;
      padding: 30px;
      margin: 20px 0;
      text-align: center;
      min-height: 100px;
      transition: all 0.3s ease;
    }
    .drop-zone.drag-over {
      border-color: #4ecdc4;
      background: rgba(78, 205, 196, 0.1);
    }
    .quiz-container {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
    }
    .quiz-question {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #333;
    }
    .quiz-option {
      background: white;
      border: 2px solid #e9ecef;
      padding: 12px 20px;
      margin: 8px 0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .quiz-option:hover {
      border-color: #4ecdc4;
      background: rgba(78, 205, 196, 0.05);
    }
    .quiz-option.selected {
      background: #4ecdc4;
      color: white;
      border-color: #4ecdc4;
    }
    .button {
      background: linear-gradient(135deg, #4ecdc4, #45b7d1);
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 10px 5px;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
    }
  </style>
</head>
<body>
  <div class="interactive-container">
    <h1 class="interactive-title">${title}</h1>
    <div class="content-section">${content}</div>
    
    ${interactiveElements ? interactiveElements.map(element => {
      switch(element.type) {
        case 'drag-drop':
          return `
            <div class="interactive-element">
              <h3>${element.title}</h3>
              <div class="drag-items">
                ${element.items.map(item => `
                  <div class="draggable-item" draggable="true" data-value="${item.value}">
                    ${item.text}
                  </div>
                `).join('')}
              </div>
              <div class="drop-zone" data-target="${element.target}">
                Drop items here
              </div>
            </div>
          `;
        case 'quiz':
          return `
            <div class="quiz-container">
              <div class="quiz-question">${element.question}</div>
              ${element.options.map((option, index) => `
                <div class="quiz-option" onclick="selectQuizOption(this, ${index})">
                  ${option}
                </div>
              `).join('')}
              <button class="button" onclick="checkAnswer(${element.correctAnswer})">
                Check Answer
              </button>
            </div>
          `;
        default:
          return `<div class="interactive-element">${element.content}</div>`;
      }
    }).join('') : ''}
  </div>

  <script>
    // Drag and Drop functionality
    let draggedElement = null;

    document.addEventListener('dragstart', function(e) {
      if (e.target.classList.contains('draggable-item')) {
        draggedElement = e.target;
        e.target.style.opacity = '0.5';
      }
    });

    document.addEventListener('dragend', function(e) {
      if (e.target.classList.contains('draggable-item')) {
        e.target.style.opacity = '1';
        draggedElement = null;
      }
    });

    document.addEventListener('dragover', function(e) {
      e.preventDefault();
    });

    document.addEventListener('dragenter', function(e) {
      if (e.target.classList.contains('drop-zone')) {
        e.target.classList.add('drag-over');
      }
    });

    document.addEventListener('dragleave', function(e) {
      if (e.target.classList.contains('drop-zone')) {
        e.target.classList.remove('drag-over');
      }
    });

    document.addEventListener('drop', function(e) {
      e.preventDefault();
      if (e.target.classList.contains('drop-zone') && draggedElement) {
        e.target.classList.remove('drag-over');
        e.target.appendChild(draggedElement.cloneNode(true));
        draggedElement.remove();
        
        // Check if drop is correct
        const targetValue = e.target.dataset.target;
        const itemValue = draggedElement.dataset.value;
        if (targetValue === itemValue) {
          e.target.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
          e.target.innerHTML += '<div style="color: green; font-weight: bold; margin-top: 10px;">✓ Correct!</div>';
        }
      }
    });

    // Quiz functionality
    function selectQuizOption(element, index) {
      const container = element.parentElement;
      const options = container.querySelectorAll('.quiz-option');
      options.forEach(opt => opt.classList.remove('selected'));
      element.classList.add('selected');
      element.dataset.selected = index;
    }

    function checkAnswer(correctIndex) {
      const selectedOption = document.querySelector('.quiz-option.selected');
      if (selectedOption) {
        const selectedIndex = parseInt(selectedOption.dataset.selected);
        if (selectedIndex === correctIndex) {
          selectedOption.innerHTML += ' ✓ Correct!';
          selectedOption.style.backgroundColor = '#4caf50';
        } else {
          selectedOption.innerHTML += ' ✗ Incorrect';
          selectedOption.style.backgroundColor = '#f44336';
        }
      }
    }

    // Initialize interactive elements
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Interactive page loaded successfully');
    });
  </script>
</body>
</html>`;
};

export const generateClickableHotspotPage = (title: string, imageUrl: string, hotspots: any[]) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #2196f3, #21cbf3);
      min-height: 100vh;
      color: white;
    }
    .hotspot-container {
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }
    .hotspot-title {
      font-size: 28px;
      margin-bottom: 30px;
      font-weight: bold;
    }
    .image-container {
      position: relative;
      display: inline-block;
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    }
    .hotspot-image {
      max-width: 100%;
      height: auto;
      border-radius: 10px;
    }
    .hotspot {
      position: absolute;
      width: 30px;
      height: 30px;
      background: rgba(255, 255, 255, 0.9);
      border: 3px solid #ff6b6b;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #ff6b6b;
    }
    .hotspot:hover {
      transform: scale(1.2);
      background: #ff6b6b;
      color: white;
      box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
    }
    .hotspot-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 14px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      margin-bottom: 10px;
    }
    .hotspot:hover .hotspot-tooltip {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="hotspot-container">
    <h1 class="hotspot-title">${title}</h1>
    <div class="image-container">
      <img src="${imageUrl}" alt="${title}" class="hotspot-image" id="hotspot-image">
      ${hotspots.map((hotspot, index) => `
        <div class="hotspot" 
             style="top: ${hotspot.y}%; left: ${hotspot.x}%;" 
             onclick="showHotspotInfo('${hotspot.title}', '${hotspot.description}')">
          ${index + 1}
          <div class="hotspot-tooltip">${hotspot.title}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    function showHotspotInfo(title, description) {
      alert(title + '\\n\\n' + description);
    }
  </script>
</body>
</html>`;
};