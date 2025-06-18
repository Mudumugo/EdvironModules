export const generateVideoLessonPage = (videoUrl: string, title: string, description: string, chapters: Array<{time: number, title: string}> = []) => {
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .video-container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .video-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .video-title {
      font-size: 2.5em;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .video-description {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .video-player {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }
    .video-player video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .video-controls {
      padding: 20px;
      background: #f8f9fa;
    }
    .chapters-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .chapter-item {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .chapter-item:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .chapter-time {
      font-weight: 600;
      color: #667eea;
      font-size: 0.9em;
    }
    .chapter-title {
      font-weight: 500;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="video-container">
    <div class="video-header">
      <h1 class="video-title">${title}</h1>
      <p class="video-description">${description}</p>
    </div>
    <div class="video-player">
      <video controls>
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="video-controls">
      <h3>Lesson Chapters</h3>
      <div class="chapters-list">
        ${chapters.map(chapter => `
          <div class="chapter-item" onclick="seekToTime(${chapter.time})">
            <div class="chapter-time">${formatTime(chapter.time)}</div>
            <div class="chapter-title">${chapter.title}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  <script>
    const video = document.querySelector('video');
    
    function seekToTime(seconds) {
      video.currentTime = seconds;
      video.play();
    }
    
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
    }
  </script>
</body>
</html>`;
};

export const generateAnimatedStoryPage = (title: string, content: string, characters: Array<{name: string, dialogue: string}> = []) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
      min-height: 100vh;
      overflow-x: hidden;
    }
    .story-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      padding: 40px;
      position: relative;
    }
    .story-title {
      font-size: 2.5em;
      color: #2d3436;
      text-align: center;
      margin-bottom: 30px;
      animation: titleBounce 2s ease-in-out infinite;
    }
    .story-content {
      font-size: 1.3em;
      line-height: 1.8;
      color: #2d3436;
      margin-bottom: 40px;
    }
    .characters-section {
      margin-top: 30px;
    }
    .character {
      display: flex;
      align-items: center;
      margin: 20px 0;
      padding: 15px;
      background: linear-gradient(135deg, #fd79a8, #e84393);
      border-radius: 15px;
      color: white;
      animation: characterSlide 0.6s ease-out;
    }
    .character-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      margin-right: 15px;
    }
    .dialogue-bubble {
      background: white;
      color: #2d3436;
      padding: 15px 20px;
      border-radius: 20px;
      position: relative;
      flex: 1;
    }
    .dialogue-bubble::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      border: 10px solid transparent;
      border-right-color: white;
    }
    @keyframes titleBounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    @keyframes characterSlide {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }
    .floating-star {
      position: absolute;
      font-size: 20px;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
  </style>
</head>
<body>
  <div class="story-container">
    <div class="floating-elements">
      <div class="floating-star" style="top: 10%; left: 10%;">⭐</div>
      <div class="floating-star" style="top: 20%; right: 15%; animation-delay: 1s;">✨</div>
      <div class="floating-star" style="bottom: 20%; left: 20%; animation-delay: 2s;">🌟</div>
    </div>
    <h1 class="story-title">${title}</h1>
    <div class="story-content">${content}</div>
    <div class="characters-section">
      ${characters.map((character, index) => `
        <div class="character" style="animation-delay: ${index * 0.3}s;">
          <div class="character-avatar">${character.name.charAt(0)}</div>
          <div class="dialogue-bubble">
            <strong>${character.name}:</strong> "${character.dialogue}"
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
};