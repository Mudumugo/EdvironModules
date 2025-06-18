export const generateQuizPage = (question: string, options: string[], correctAnswer: number, explanation?: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Quiz</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }
    .quiz-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      padding: 40px;
    }
    .quiz-question {
      background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
      font-size: 1.2em;
      font-weight: 600;
    }
    .answer-option {
      display: block;
      margin: 10px 0;
      padding: 15px 20px;
      background: #f8f9fa;
      border: 2px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1em;
    }
    .answer-option:hover {
      border-color: #007bff;
      background: #e3f2fd;
      transform: translateX(5px);
    }
    .correct-answer {
      background: #d4edda !important;
      border-color: #28a745 !important;
    }
    .incorrect-answer {
      background: #f8d7da !important;
      border-color: #dc3545 !important;
    }
    .explanation {
      margin-top: 20px;
      padding: 15px;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 5px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <h2>Quiz Time!</h2>
    <div class="quiz-question">${question}</div>
    ${options.map((option, index) => 
      `<div class="answer-option" data-answer="${index}">${option}</div>`
    ).join('')}
    ${explanation ? `<div class="explanation" id="explanation">${explanation}</div>` : ''}
  </div>
  <script>
    const answers = document.querySelectorAll('.answer-option');
    const explanation = document.getElementById('explanation');
    
    answers.forEach((answer, index) => {
      answer.addEventListener('click', function() {
        answers.forEach(a => a.classList.remove('correct-answer', 'incorrect-answer'));
        
        if (index === ${correctAnswer}) {
          answer.classList.add('correct-answer');
        } else {
          answer.classList.add('incorrect-answer');
          answers[${correctAnswer}].classList.add('correct-answer');
        }
        
        if (explanation) {
          explanation.style.display = 'block';
        }
      });
    });
  </script>
</body>
</html>`;
};

export const generateClickableImagePage = (imageSrc: string, hotspots: Array<{x: number, y: number, info: string}>) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Image</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .image-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      padding: 40px;
      text-align: center;
    }
    .interactive-wrapper {
      position: relative;
      display: inline-block;
      margin: 20px 0;
    }
    .interactive-wrapper img {
      max-width: 100%;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .hotspot {
      position: absolute;
      width: 20px;
      height: 20px;
      background: #007bff;
      border-radius: 50%;
      cursor: pointer;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    }
    .hotspot:hover {
      background: #0056b3;
      transform: scale(1.2);
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
    }
    .info-popup {
      position: absolute;
      background: white;
      padding: 10px 15px;
      border-radius: 5px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      font-size: 14px;
      max-width: 200px;
      z-index: 1000;
      display: none;
    }
  </style>
</head>
<body>
  <div class="image-container">
    <h2>Interactive Image</h2>
    <p>Click on the blue dots to learn more!</p>
    <div class="interactive-wrapper">
      <img src="${imageSrc}" alt="Interactive content">
      ${hotspots.map((hotspot, index) => 
        `<div class="hotspot" data-info="${hotspot.info}" style="left: ${hotspot.x}%; top: ${hotspot.y}%;"></div>`
      ).join('')}
      <div class="info-popup" id="popup"></div>
    </div>
  </div>
  <script>
    const hotspots = document.querySelectorAll('.hotspot');
    const popup = document.getElementById('popup');
    
    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', function(e) {
        const info = this.getAttribute('data-info');
        popup.textContent = info;
        popup.style.display = 'block';
        popup.style.left = e.pageX + 10 + 'px';
        popup.style.top = e.pageY - 10 + 'px';
        
        setTimeout(() => {
          popup.style.display = 'none';
        }, 3000);
      });
    });
    
    document.addEventListener('click', function(e) {
      if (!e.target.classList.contains('hotspot')) {
        popup.style.display = 'none';
      }
    });
  </script>
</body>
</html>`;
};

export const generateDragDropPage = (items: string[], targets: string[]) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drag and Drop Activity</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .activity-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      padding: 40px;
    }
    .items-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 40px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 10px;
    }
    .draggable-item {
      padding: 15px 25px;
      background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
      border-radius: 25px;
      cursor: move;
      user-select: none;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .draggable-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .draggable-item.dragging {
      opacity: 0.5;
      transform: rotate(5deg);
    }
    .drop-zone {
      min-height: 80px;
      border: 3px dashed #ddd;
      border-radius: 10px;
      margin: 15px 0;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }
    .drop-zone.drag-over {
      border-color: #007bff;
      background: #e3f2fd;
    }
    .drop-zone.filled {
      border-color: #28a745;
      background: #d4edda;
    }
    .target-label {
      font-weight: bold;
      color: #495057;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="activity-container">
    <h2>Drag and Drop Activity</h2>
    <p>Drag the items below to their correct targets.</p>
    
    <div class="items-container">
      ${items.map((item, index) => 
        `<div class="draggable-item" draggable="true" data-item="${index}">${item}</div>`
      ).join('')}
    </div>
    
    ${targets.map((target, index) => 
      `<div class="drop-zone" data-target="${index}">
        <div class="target-label">${target}</div>
        <div class="drop-area">Drop items here</div>
      </div>`
    ).join('')}
  </div>
  
  <script>
    let draggedElement = null;
    
    // Add event listeners to draggable items
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.addEventListener('dragstart', function(e) {
        draggedElement = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
      });
      
      item.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        draggedElement = null;
      });
    });
    
    // Add event listeners to drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
      zone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
      });
      
      zone.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
      });
      
      zone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (draggedElement) {
          this.appendChild(draggedElement);
          this.classList.add('filled');
          
          // Check if all items are placed
          if (document.querySelectorAll('.items-container .draggable-item').length === 0) {
            setTimeout(() => {
              alert('Great job! You completed the activity!');
            }, 500);
          }
        }
      });
    });
  </script>
</body>
</html>`;
};