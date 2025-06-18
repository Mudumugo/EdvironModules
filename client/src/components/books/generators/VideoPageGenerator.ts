export const generateVideoPage = (title: string, videoUrl: string, description?: string) => {
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
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      min-height: 100vh;
      color: white;
    }
    .video-container {
      max-width: 900px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 30px;
      backdrop-filter: blur(10px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    }
    .video-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
      background: linear-gradient(45deg, #fff, #e0e6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .video-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 56.25%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      margin-bottom: 25px;
    }
    .video-wrapper video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .video-description {
      font-size: 16px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
      margin-top: 20px;
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
    }
    .control-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
    }
    .control-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="video-container">
    <h1 class="video-title">${title}</h1>
    <div class="video-wrapper">
      <video controls>
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    ${description ? `<p class="video-description">${description}</p>` : ''}
    <div class="controls">
      <button class="control-btn" onclick="document.querySelector('video').play()">Play</button>
      <button class="control-btn" onclick="document.querySelector('video').pause()">Pause</button>
      <button class="control-btn" onclick="document.querySelector('video').currentTime = 0">Restart</button>
    </div>
  </div>
</body>
</html>`;
};

export const generateInteractiveVideoPage = (title: string, videoUrl: string, quizData?: any[]) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Interactive</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: white;
    }
    .interactive-container {
      max-width: 1000px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 30px;
      backdrop-filter: blur(10px);
    }
    .video-section {
      margin-bottom: 30px;
    }
    .quiz-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 25px;
      margin-top: 20px;
    }
    .quiz-question {
      font-size: 18px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .quiz-options {
      display: grid;
      gap: 10px;
      margin-bottom: 20px;
    }
    .quiz-option {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid transparent;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .quiz-option:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
    .quiz-option.selected {
      background: rgba(76, 175, 80, 0.3);
      border-color: #4caf50;
    }
  </style>
</head>
<body>
  <div class="interactive-container">
    <h1>${title}</h1>
    <div class="video-section">
      <video controls style="width: 100%; border-radius: 12px;">
        <source src="${videoUrl}" type="video/mp4">
      </video>
    </div>
    ${quizData ? `
    <div class="quiz-section">
      <h3>Interactive Quiz</h3>
      ${quizData.map((q, i) => `
        <div class="quiz-item">
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((opt, j) => `
              <div class="quiz-option" onclick="selectOption(${i}, ${j})">${opt}</div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
  </div>
  <script>
    function selectOption(questionIndex, optionIndex) {
      const options = document.querySelectorAll(\`.quiz-item:nth-child(\${questionIndex + 2}) .quiz-option\`);
      options.forEach(opt => opt.classList.remove('selected'));
      options[optionIndex].classList.add('selected');
    }
  </script>
</body>
</html>`;
};