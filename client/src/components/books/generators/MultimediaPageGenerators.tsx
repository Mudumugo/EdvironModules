// This file has been refactored - use the new modular generators:
// - CoverPageGenerator.ts for cover pages
// - InteractivePageGenerator.ts for interactive content  
// - VideoPageGenerator.ts for video content
// - SciencePageGenerator.ts for science experiments

// Legacy function for backward compatibility
export const generateMultimediaCoverPage = (title: string, author: string, subject: string, grade: string) => {
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
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .cover-container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 60px;
      text-align: center;
      max-width: 600px;
      position: relative;
      overflow: hidden;
    }
    .cover-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
    }
    .title {
      font-size: 36px;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
      animation: titlePulse 3s ease-in-out infinite;
    }
    .subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 40px;
    }
    .multimedia-badges {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    .badge {
      background: linear-gradient(135deg, #4ecdc4, #45b7d1);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      animation: badgeFloat 2s ease-in-out infinite;
    }
    .badge:nth-child(2) { animation-delay: 0.5s; }
    .badge:nth-child(3) { animation-delay: 1s; }
    .badge:nth-child(4) { animation-delay: 1.5s; }
    .play-button {
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      border: none;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      font-size: 24px;
      cursor: pointer;
      margin: 30px auto;
      display: block;
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
      transition: all 0.3s ease;
      position: relative;
    }
    .play-button:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6);
    }
    .play-button::before {
      content: '▶';
      position: absolute;
      top: 50%;
      left: 52%;
      transform: translate(-50%, -50%);
    }
    .animated-bg {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffeaa7, #fab1a0);
      opacity: 0.1;
      animation: floatingOrb 6s ease-in-out infinite;
    }
    .animated-bg:nth-child(1) {
      top: -50px;
      right: -50px;
      animation-delay: 0s;
    }
    .animated-bg:nth-child(2) {
      bottom: -50px;
      left: -50px;
      animation-delay: 2s;
      background: linear-gradient(135deg, #74b9ff, #0984e3);
    }
    @keyframes titlePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes badgeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes floatingOrb {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-30px, 30px) rotate(240deg); }
    }
    .audio-controls {
      margin-top: 20px;
      display: none;
    }
    .audio-controls.active {
      display: block;
    }
    audio {
      width: 100%;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="cover-container">
    <div class="animated-bg"></div>
    <div class="animated-bg"></div>
    
    <h1 class="title">${title}</h1>
    <p class="subtitle">${grade} • ${subject} • Interactive Learning</p>
    <p style="color: #888; margin-bottom: 30px;">by ${author}</p>
    
    <div class="multimedia-badges">
      <span class="badge">🔊 Audio Narration</span>
      <span class="badge">🎥 Video Content</span>
      <span class="badge">🎮 Interactive Games</span>
      <span class="badge">✨ Animations</span>
    </div>
    
    <button class="play-button" onclick="startAdventure()"></button>
    <p style="color: #666; font-size: 14px;">Click to start your multimedia learning adventure!</p>
    
    <div class="audio-controls" id="audioControls">
      <audio id="narratorAudio" controls>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeCjOJ0fPTfyvAUUTLFT8AABAB" type="audio/wav">
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>

  <script>
    function startAdventure() {
      const button = document.querySelector('.play-button');
      const audioControls = document.getElementById('audioControls');
      const audio = document.getElementById('narratorAudio');
      
      button.style.transform = 'scale(0.8)';
      setTimeout(() => {
        button.style.transform = 'scale(1.1)';
      }, 100);
      
      // Show audio controls
      audioControls.classList.add('active');
      
      // Generate synthetic audio narration
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          \`Welcome to \${title}! Get ready for an amazing interactive learning adventure filled with videos, games, and fun activities. Let's explore together!\`
        );
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }
      
      // Trigger celebration animation
      createCelebrationParticles();
      
      // Send tracking event
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'multimedia_adventure_started',
          title: '${title}',
          grade: '${grade}',
          subject: '${subject}'
        }, '*');
      }
      
      // Auto-advance after 5 seconds
      setTimeout(() => {
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'advance_page',
            message: 'Ready to continue to the next page!'
          }, '*');
        }
      }, 5000);
    }
    
    function createCelebrationParticles() {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.style.cssText = \`
            position: fixed;
            width: 6px;
            height: 6px;
            background: \${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)]};
            border-radius: 50%;
            left: \${Math.random() * window.innerWidth}px;
            top: \${Math.random() * window.innerHeight}px;
            pointer-events: none;
            z-index: 1000;
            animation: particleFloat 3s ease-out forwards;
          \`;
          document.body.appendChild(particle);
          
          setTimeout(() => particle.remove(), 3000);
        }, i * 100);
      }
    }
    
    // Add particle animation
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes particleFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-200px) scale(0); opacity: 0; }
      }
    \`;
    document.head.appendChild(style);
  </script>
</body>
</html>`;
};

export const generateVideoLearningPage = (pageNum: number, title: string, grade: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video Learning - ${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      min-height: 100vh;
      color: white;
    }
    .video-container {
      max-width: 1000px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 30px;
      backdrop-filter: blur(10px);
    }
    .video-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .video-header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #3498db, #2980b9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .video-player {
      background: #000;
      border-radius: 15px;
      overflow: hidden;
      margin-bottom: 30px;
      position: relative;
      aspect-ratio: 16/9;
    }
    .video-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .video-placeholder:hover {
      transform: scale(1.02);
    }
    .play-icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    }
    .video-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      gap: 20px;
    }
    .control-btn {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .control-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
    }
    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      width: 0%;
      transition: width 0.3s ease;
    }
    .quiz-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
    }
    .quiz-overlay.active {
      display: flex;
    }
    .quiz-content {
      background: white;
      color: #333;
      padding: 30px;
      border-radius: 15px;
      max-width: 400px;
      text-align: center;
    }
    .quiz-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      margin: 5px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .quiz-btn:hover {
      background: #2980b9;
    }
    .interactive-notes {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 25px;
      margin-top: 20px;
    }
    .note-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 15px;
      border-radius: 10px;
      margin: 10px 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .note-item:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(10px);
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  </style>
</head>
<body>
  <div class="video-container">
    <div class="video-header">
      <h1>Science Exploration Video</h1>
      <p>Page ${pageNum} • ${grade} • Interactive Video Learning</p>
    </div>
    
    <div class="video-player" id="videoPlayer">
      <div class="video-placeholder" onclick="playVideo()">
        <div class="play-icon">▶️</div>
        <h3>The Water Cycle Adventure</h3>
        <p>Click to watch an animated explanation of how water moves through our environment</p>
      </div>
      
      <div class="quiz-overlay" id="quizOverlay">
        <div class="quiz-content">
          <h3>Quick Check!</h3>
          <p id="quizQuestion">What happens to water when it gets heated by the sun?</p>
          <button class="quiz-btn" onclick="answerQuiz('evaporation')">It evaporates</button>
          <button class="quiz-btn" onclick="answerQuiz('freeze')">It freezes</button>
          <button class="quiz-btn" onclick="answerQuiz('disappear')">It disappears</button>
        </div>
      </div>
    </div>
    
    <div class="video-controls">
      <button class="control-btn" onclick="replayVideo()">🔄 Replay</button>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <button class="control-btn" onclick="toggleNotes()">📝 Notes</button>
    </div>
    
    <div class="interactive-notes" id="interactiveNotes" style="display: none;">
      <h3>Interactive Learning Notes</h3>
      <div class="note-item" onclick="explainConcept('evaporation')">
        💨 <strong>Evaporation:</strong> Click to learn how water becomes vapor
      </div>
      <div class="note-item" onclick="explainConcept('condensation')">
        ☁️ <strong>Condensation:</strong> Click to see how clouds form
      </div>
      <div class="note-item" onclick="explainConcept('precipitation')">
        🌧️ <strong>Precipitation:</strong> Click to understand rain and snow
      </div>
      <div class="note-item" onclick="explainConcept('collection')">
        🌊 <strong>Collection:</strong> Click to see where water goes
      </div>
    </div>
  </div>

  <script>
    let videoProgress = 0;
    let isPlaying = false;
    let videoInterval;
    
    function playVideo() {
      const placeholder = document.querySelector('.video-placeholder');
      placeholder.innerHTML = \`
        <div style="text-align: center;">
          <h2>🌊 The Water Cycle Adventure</h2>
          <div style="font-size: 48px; animation: pulse 1s infinite;">🌞</div>
          <p>Watch as the sun heats the water...</p>
        </div>
      \`;
      
      isPlaying = true;
      simulateVideo();
      
      // Narrate the video content
      if ('speechSynthesis' in window) {
        const narration = new SpeechSynthesisUtterance(
          "Welcome to the water cycle adventure! Watch as the sun heats up water from oceans, lakes, and rivers. The water transforms into invisible water vapor and rises into the sky."
        );
        narration.rate = 0.9;
        speechSynthesis.speak(narration);
      }
    }
    
    function simulateVideo() {
      const progressFill = document.getElementById('progressFill');
      const placeholder = document.querySelector('.video-placeholder');
      
      videoInterval = setInterval(() => {
        videoProgress += 2;
        progressFill.style.width = videoProgress + '%';
        
        // Update video content based on progress
        if (videoProgress === 20) {
          placeholder.innerHTML = \`
            <div style="text-align: center;">
              <h2>☁️ Cloud Formation</h2>
              <div style="font-size: 48px; animation: pulse 1s infinite;">☁️</div>
              <p>Water vapor rises and cools to form clouds...</p>
            </div>
          \`;
        } else if (videoProgress === 40) {
          placeholder.innerHTML = \`
            <div style="text-align: center;">
              <h2>🌧️ Precipitation</h2>
              <div style="font-size: 48px; animation: pulse 1s infinite;">🌧️</div>
              <p>Clouds release water as rain or snow...</p>
            </div>
          \`;
        } else if (videoProgress === 60) {
          // Show interactive quiz
          document.getElementById('quizOverlay').classList.add('active');
          clearInterval(videoInterval);
        } else if (videoProgress === 100) {
          placeholder.innerHTML = \`
            <div style="text-align: center;">
              <h2>✅ Video Complete!</h2>
              <div style="font-size: 48px;">🎉</div>
              <p>Great job learning about the water cycle!</p>
            </div>
          \`;
          clearInterval(videoInterval);
          isPlaying = false;
        }
      }, 200);
    }
    
    function answerQuiz(answer) {
      const overlay = document.getElementById('quizOverlay');
      const content = overlay.querySelector('.quiz-content');
      
      if (answer === 'evaporation') {
        content.innerHTML = \`
          <h3>🎉 Correct!</h3>
          <p>When the sun heats water, it evaporates and becomes water vapor!</p>
          <button class="quiz-btn" onclick="continueVideo()">Continue Video</button>
        \`;
      } else {
        content.innerHTML = \`
          <h3>Try again!</h3>
          <p>Think about what happens when you heat water in a pot...</p>
          <button class="quiz-btn" onclick="answerQuiz('evaporation')">It evaporates</button>
        \`;
      }
      
      // Track quiz response
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'video_quiz_answered',
          answer: answer,
          correct: answer === 'evaporation',
          pageNumber: ${pageNum}
        }, '*');
      }
    }
    
    function continueVideo() {
      document.getElementById('quizOverlay').classList.remove('active');
      videoProgress = 60;
      simulateVideo();
    }
    
    function replayVideo() {
      videoProgress = 0;
      document.getElementById('progressFill').style.width = '0%';
      document.getElementById('quizOverlay').classList.remove('active');
      clearInterval(videoInterval);
      playVideo();
    }
    
    function toggleNotes() {
      const notes = document.getElementById('interactiveNotes');
      notes.style.display = notes.style.display === 'none' ? 'block' : 'none';
    }
    
    function explainConcept(concept) {
      const explanations = {
        evaporation: "Evaporation happens when water is heated by the sun and turns into invisible water vapor that rises into the air!",
        condensation: "Condensation occurs when water vapor cools down and turns back into tiny water droplets that form clouds!",
        precipitation: "Precipitation is when water falls from clouds as rain, snow, sleet, or hail back to Earth!",
        collection: "Collection is when water flows into rivers, lakes, and oceans, ready to start the cycle again!"
      };
      
      alert('💡 ' + explanations[concept]);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(explanations[concept]);
        speechSynthesis.speak(utterance);
      }
      
      // Track concept exploration
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'concept_explored',
          concept: concept,
          pageNumber: ${pageNum}
        }, '*');
      }
    }
  </script>
</body>
</html>`;
};

export const generateInteractiveGamePage = (pageNum: number, title: string, grade: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Game - ${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
    }
    .game-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .game-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .game-header h1 {
      font-size: 32px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .game-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin: 30px 0;
    }
    .game-card {
      aspect-ratio: 1;
      background: linear-gradient(135deg, #3498db, #2980b9);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    }
    .game-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(52, 152, 219, 0.5);
    }
    .game-card.flipped {
      background: linear-gradient(135deg, #2ecc71, #27ae60);
      transform: rotateY(180deg);
    }
    .game-card.matched {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      animation: matchedPulse 0.6s ease;
    }
    .game-stats {
      display: flex;
      justify-content: space-around;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 15px;
      margin: 20px 0;
    }
    .stat {
      text-align: center;
    }
    .stat h3 {
      margin: 0;
      font-size: 24px;
      color: #3498db;
    }
    .stat p {
      margin: 5px 0 0 0;
      color: #666;
    }
    .game-controls {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
    }
    .control-btn {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .control-btn:hover {
      transform: translateY(-2px);
    }
    .achievement {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
      padding: 15px;
      border-radius: 10px;
      margin: 10px 0;
      text-align: center;
      display: none;
      animation: slideIn 0.5s ease;
    }
    .achievement.show {
      display: block;
    }
    @keyframes matchedPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .progress-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 8px solid #ecf0f1;
      border-top: 8px solid #3498db;
      margin: 20px auto;
      animation: spin 2s linear infinite;
      display: none;
    }
    .progress-circle.show {
      display: block;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="game-container">
    <div class="game-header">
      <h1>🎮 Math Memory Challenge</h1>
      <p>Page ${pageNum} • ${grade} • Match the numbers with their words!</p>
    </div>
    
    <div class="game-stats">
      <div class="stat">
        <h3 id="matchesCount">0</h3>
        <p>Matches</p>
      </div>
      <div class="stat">
        <h3 id="movesCount">0</h3>
        <p>Moves</p>
      </div>
      <div class="stat">
        <h3 id="timeCount">0</h3>
        <p>Seconds</p>
      </div>
      <div class="stat">
        <h3 id="scoreCount">0</h3>
        <p>Score</p>
      </div>
    </div>
    
    <div class="game-board" id="gameBoard"></div>
    
    <div class="game-controls">
      <button class="control-btn" onclick="startNewGame()">🎯 New Game</button>
      <button class="control-btn" onclick="showHint()">💡 Hint</button>
      <button class="control-btn" onclick="pauseGame()">⏸️ Pause</button>
    </div>
    
    <div class="achievement" id="achievement">
      <h3>🏆 Achievement Unlocked!</h3>
      <p id="achievementText"></p>
    </div>
    
    <div class="progress-circle" id="loadingSpinner"></div>
  </div>

  <script>
    let gameCards = [];
    let flippedCards = [];
    let matches = 0;
    let moves = 0;
    let score = 0;
    let gameTime = 0;
    let gameTimer;
    let isGameActive = false;
    
    const cardPairs = [
      { number: '1', word: 'ONE' },
      { number: '2', word: 'TWO' },
      { number: '3', word: 'THREE' },
      { number: '4', word: 'FOUR' },
      { number: '5', word: 'FIVE' },
      { number: '6', word: 'SIX' },
      { number: '7', word: 'SEVEN' },
      { number: '8', word: 'EIGHT' }
    ];
    
    function initializeGame() {
      // Create card array with pairs
      gameCards = [];
      cardPairs.forEach(pair => {
        gameCards.push({ content: pair.number, type: 'number', id: pair.number });
        gameCards.push({ content: pair.word, type: 'word', id: pair.number });
      });
      
      // Shuffle cards
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
      
      renderGameBoard();
      resetStats();
    }
    
    function renderGameBoard() {
      const board = document.getElementById('gameBoard');
      board.innerHTML = '';
      
      gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'game-card';
        cardElement.dataset.index = index;
        cardElement.dataset.id = card.id;
        cardElement.innerHTML = '❓';
        cardElement.onclick = () => flipCard(index);
        board.appendChild(cardElement);
      });
    }
    
    function flipCard(index) {
      if (!isGameActive || flippedCards.length >= 2) return;
      
      const cardElement = document.querySelector(\`[data-index="\${index}"]\`);
      if (cardElement.classList.contains('flipped')) return;
      
      // Start timer on first move
      if (moves === 0) {
        startTimer();
        isGameActive = true;
      }
      
      cardElement.classList.add('flipped');
      cardElement.innerHTML = gameCards[index].content;
      flippedCards.push(index);
      
      if (flippedCards.length === 2) {
        moves++;
        updateStats();
        setTimeout(checkMatch, 1000);
      }
      
      // Play flip sound
      playSound('flip');
    }
    
    function checkMatch() {
      const [first, second] = flippedCards;
      const firstCard = document.querySelector(\`[data-index="\${first}"]\`);
      const secondCard = document.querySelector(\`[data-index="\${second}"]\`);
      
      if (gameCards[first].id === gameCards[second].id) {
        // Match found!
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matches++;
        score += 100;
        playSound('match');
        
        // Check achievements
        checkAchievements();
        
        // Check win condition
        if (matches === cardPairs.length) {
          setTimeout(gameWon, 500);
        }
      } else {
        // No match, flip back
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerHTML = '❓';
        secondCard.innerHTML = '❓';
        playSound('miss');
      }
      
      flippedCards = [];
      updateStats();
    }
    
    function startTimer() {
      gameTimer = setInterval(() => {
        gameTime++;
        document.getElementById('timeCount').textContent = gameTime;
      }, 1000);
    }
    
    function updateStats() {
      document.getElementById('matchesCount').textContent = matches;
      document.getElementById('movesCount').textContent = moves;
      document.getElementById('scoreCount').textContent = score;
    }
    
    function resetStats() {
      matches = 0;
      moves = 0;
      score = 0;
      gameTime = 0;
      flippedCards = [];
      isGameActive = false;
      clearInterval(gameTimer);
      updateStats();
      document.getElementById('timeCount').textContent = '0';
    }
    
    function startNewGame() {
      const spinner = document.getElementById('loadingSpinner');
      spinner.classList.add('show');
      
      setTimeout(() => {
        initializeGame();
        spinner.classList.remove('show');
        playSound('start');
      }, 1000);
    }
    
    function showHint() {
      const unmatched = Array.from(document.querySelectorAll('.game-card:not(.matched)'));
      if (unmatched.length >= 2) {
        const randomCard = unmatched[Math.floor(Math.random() * unmatched.length)];
        randomCard.style.border = '3px solid #f39c12';
        setTimeout(() => {
          randomCard.style.border = 'none';
        }, 2000);
        
        score = Math.max(0, score - 25);
        updateStats();
      }
    }
    
    function pauseGame() {
      isGameActive = !isGameActive;
      if (isGameActive) {
        startTimer();
      } else {
        clearInterval(gameTimer);
      }
    }
    
    function checkAchievements() {
      const achievement = document.getElementById('achievement');
      const achievementText = document.getElementById('achievementText');
      
      if (matches === 1) {
        achievementText.textContent = 'First Match! Great start!';
        showAchievement();
      } else if (matches === 4) {
        achievementText.textContent = 'Halfway There! Keep going!';
        showAchievement();
      } else if (moves <= matches * 1.5) {
        achievementText.textContent = 'Memory Master! Excellent recall!';
        showAchievement();
        score += 50;
      }
    }
    
    function showAchievement() {
      const achievement = document.getElementById('achievement');
      achievement.classList.add('show');
      setTimeout(() => {
        achievement.classList.remove('show');
      }, 3000);
    }
    
    function gameWon() {
      clearInterval(gameTimer);
      
      // Calculate bonus score
      let bonusScore = Math.max(0, 500 - (gameTime * 5) - (moves * 10));
      score += bonusScore;
      updateStats();
      
      // Victory celebration
      if ('speechSynthesis' in window) {
        const victory = new SpeechSynthesisUtterance(
          \`Congratulations! You completed the memory game in \${gameTime} seconds with \${moves} moves. Your final score is \${score} points!\`
        );
        speechSynthesis.speak(victory);
      }
      
      // Send completion tracking
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'game_completed',
          gameType: 'memory_match',
          score: score,
          time: gameTime,
          moves: moves,
          pageNumber: ${pageNum}
        }, '*');
      }
      
      setTimeout(() => {
        alert(\`🎉 Congratulations! You won!\\n⏱️ Time: \${gameTime} seconds\\n🎯 Moves: \${moves}\\n⭐ Score: \${score} points\`);
      }, 500);
    }
    
    function playSound(type) {
      // Generate different audio feedback for different actions
      if ('AudioContext' in window) {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
          case 'flip':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            break;
          case 'match':
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            break;
          case 'miss':
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            break;
          case 'start':
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            break;
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    }
    
    // Initialize game on page load
    document.addEventListener('DOMContentLoaded', function() {
      initializeGame();
      
      // Send page load tracking
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'interactive_game_loaded',
          gameType: 'memory_match',
          pageNumber: ${pageNum}
        }, '*');
      }
    });
  </script>
</body>
</html>`;
};

export const generateAnimatedStoryPage = (pageNum: number, title: string, grade: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animated Story - ${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
      min-height: 100vh;
      color: #333;
    }
    .story-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      position: relative;
      overflow: hidden;
    }
    .story-scene {
      height: 400px;
      background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
      border-radius: 15px;
      position: relative;
      overflow: hidden;
      margin-bottom: 30px;
    }
    .sun {
      position: absolute;
      top: 20px;
      right: 30px;
      width: 60px;
      height: 60px;
      background: #fdcb6e;
      border-radius: 50%;
      animation: sunShine 3s ease-in-out infinite;
    }
    .cloud {
      position: absolute;
      background: white;
      border-radius: 50px;
      animation: cloudFloat 8s ease-in-out infinite;
    }
    .cloud1 {
      width: 80px;
      height: 40px;
      top: 40px;
      left: 100px;
      animation-delay: 0s;
    }
    .cloud2 {
      width: 100px;
      height: 50px;
      top: 80px;
      right: 150px;
      animation-delay: 2s;
    }
    .tree {
      position: absolute;
      bottom: 0;
    }
    .tree-trunk {
      width: 20px;
      height: 80px;
      background: #8d4004;
      position: absolute;
      bottom: 0;
    }
    .tree-leaves {
      width: 80px;
      height: 80px;
      background: #00b894;
      border-radius: 50%;
      position: absolute;
      bottom: 60px;
      left: -30px;
      animation: treeWave 4s ease-in-out infinite;
    }
    .tree1 {
      left: 50px;
    }
    .tree2 {
      right: 80px;
    }
    .character {
      position: absolute;
      bottom: 20px;
      left: 200px;
      width: 60px;
      height: 100px;
      animation: characterWalk 6s ease-in-out infinite;
    }
    .character-body {
      width: 40px;
      height: 60px;
      background: #e17055;
      border-radius: 20px;
      position: relative;
    }
    .character-head {
      width: 35px;
      height: 35px;
      background: #fdcb6e;
      border-radius: 50%;
      position: absolute;
      top: -25px;
      left: 2.5px;
    }
    .story-text {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 15px;
      margin: 20px 0;
      border-left: 5px solid #e17055;
      position: relative;
    }
    .story-controls {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
    }
    .story-btn {
      background: linear-gradient(135deg, #e17055, #d63031);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .story-btn:hover {
      transform: translateY(-2px);
    }
    .dialogue-bubble {
      position: absolute;
      background: white;
      padding: 15px;
      border-radius: 20px;
      border: 3px solid #e17055;
      top: 50px;
      left: 300px;
      max-width: 200px;
      font-size: 14px;
      display: none;
      animation: bubbleFloat 2s ease-in-out infinite;
    }
    .dialogue-bubble:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 30px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid white;
    }
    .dialogue-bubble.show {
      display: block;
    }
    .interactive-elements {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
    }
    .clickable-item {
      background: linear-gradient(135deg, #a29bfe, #6c5ce7);
      color: white;
      padding: 15px;
      border-radius: 15px;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s ease;
    }
    .clickable-item:hover {
      transform: scale(1.05);
    }
    @keyframes sunShine {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(180deg); }
    }
    @keyframes cloudFloat {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(30px); }
    }
    @keyframes treeWave {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(5deg); }
    }
    @keyframes characterWalk {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(50px); }
      50% { transform: translateX(100px); }
      75% { transform: translateX(50px); }
    }
    @keyframes bubbleFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  </style>
</head>
<body>
  <div class="story-container">
    <h1 style="text-align: center; color: #e17055;">🌟 The Adventure of Ella the Explorer</h1>
    <p style="text-align: center; color: #666;">Page ${pageNum} • ${grade} • Interactive Animated Story</p>
    
    <div class="story-scene" id="storyScene">
      <div class="sun"></div>
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      
      <div class="tree tree1">
        <div class="tree-trunk"></div>
        <div class="tree-leaves"></div>
      </div>
      
      <div class="tree tree2">
        <div class="tree-trunk"></div>
        <div class="tree-leaves"></div>
      </div>
      
      <div class="character" id="character">
        <div class="character-head"></div>
        <div class="character-body"></div>
      </div>
      
      <div class="dialogue-bubble" id="dialogueBubble">
        Hello! I'm Ella. Let's explore together!
      </div>
    </div>
    
    <div class="story-text" id="storyText">
      <h3>🌅 Chapter 1: A Beautiful Day</h3>
      <p>Ella woke up to a beautiful sunny day. The birds were singing, the trees were swaying gently in the breeze, and fluffy white clouds danced across the bright blue sky. "What a perfect day for an adventure!" she thought.</p>
    </div>
    
    <div class="story-controls">
      <button class="story-btn" onclick="startStory()">▶️ Start Story</button>
      <button class="story-btn" onclick="nextChapter()">➡️ Next Chapter</button>
      <button class="story-btn" onclick="makeCharacterSpeak()">💬 Talk to Ella</button>
    </div>
    
    <div class="interactive-elements">
      <div class="clickable-item" onclick="interactWithSun()">
        ☀️<br>Touch the Sun
      </div>
      <div class="clickable-item" onclick="interactWithClouds()">
        ☁️<br>Move the Clouds
      </div>
      <div class="clickable-item" onclick="interactWithTrees()">
        🌳<br>Shake the Trees
      </div>
      <div class="clickable-item" onclick="interactWithCharacter()">
        👧<br>Help Ella
      </div>
    </div>
  </div>

  <script>
    let currentChapter = 1;
    let storyStarted = false;
    
    const chapters = [
      {
        title: "🌅 Chapter 1: A Beautiful Day",
        text: "Ella woke up to a beautiful sunny day. The birds were singing, the trees were swaying gently in the breeze, and fluffy white clouds danced across the bright blue sky. 'What a perfect day for an adventure!' she thought.",
        dialogue: "Hello! I'm Ella. Let's explore together!"
      },
      {
        title: "🌲 Chapter 2: Into the Forest",
        text: "Ella decided to explore the magical forest near her home. As she walked deeper into the woods, she discovered that the trees could talk and the sun followed her wherever she went, lighting her path.",
        dialogue: "Wow! Everything here is magical!"
      },
      {
        title: "☁️ Chapter 3: Cloud Dancing",
        text: "Looking up at the sky, Ella noticed the clouds were playing a game of hide and seek with the sun. She laughed and clapped her hands, and amazingly, the clouds began to dance just for her!",
        dialogue: "Look at those clouds dance! Magical!"
      },
      {
        title: "🎉 Chapter 4: The Adventure Continues",
        text: "Ella's adventure was just beginning. With her new magical friends - the talking trees, dancing clouds, and helpful sun - she knew that every day would bring new discoveries and excitement!",
        dialogue: "This is the best adventure ever!"
      }
    ];
    
    function startStory() {
      storyStarted = true;
      const bubble = document.getElementById('dialogueBubble');
      bubble.classList.add('show');
      
      // Add more animation to the scene
      const scene = document.getElementById('storyScene');
      scene.style.animation = 'sceneGlow 3s ease-in-out infinite';
      
      // Narrate the story
      if ('speechSynthesis' in window) {
        const narration = new SpeechSynthesisUtterance(chapters[0].text);
        narration.rate = 0.9;
        narration.pitch = 1.1;
        speechSynthesis.speak(narration);
      }
      
      // Track story start
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'animated_story_started',
          chapter: currentChapter,
          pageNumber: ${pageNum}
        }, '*');
      }
    }
    
    function nextChapter() {
      if (currentChapter < chapters.length) {
        currentChapter++;
        const chapter = chapters[currentChapter - 1];
        
        document.getElementById('storyText').innerHTML = \`
          <h3>\${chapter.title}</h3>
          <p>\${chapter.text}</p>
        \`;
        
        document.getElementById('dialogueBubble').textContent = chapter.dialogue;
        
        // Change scene based on chapter
        const scene = document.getElementById('storyScene');
        switch(currentChapter) {
          case 2:
            scene.style.background = 'linear-gradient(135deg, #00b894 0%, #00a085 100%)';
            break;
          case 3:
            scene.style.background = 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)';
            break;
          case 4:
            scene.style.background = 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)';
            break;
        }
        
        // Narrate new chapter
        if ('speechSynthesis' in window) {
          const narration = new SpeechSynthesisUtterance(chapter.text);
          narration.rate = 0.9;
          speechSynthesis.speak(narration);
        }
        
        // Track chapter progress
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'story_chapter_advanced',
            chapter: currentChapter,
            pageNumber: ${pageNum}
          }, '*');
        }
      } else {
        alert('🎉 Story Complete! You\'ve finished Ella\'s adventure!');
      }
    }
    
    function makeCharacterSpeak() {
      const bubble = document.getElementById('dialogueBubble');
      bubble.classList.add('show');
      
      const phrases = [
        "Hi there! Thanks for reading my story!",
        "Isn't this world beautiful?",
        "Want to explore more with me?",
        "I love making new friends!",
        "Every day is a new adventure!"
      ];
      
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      bubble.textContent = randomPhrase;
      
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(randomPhrase);
        speech.pitch = 1.3;
        speech.rate = 1.1;
        speechSynthesis.speak(speech);
      }
      
      setTimeout(() => {
        bubble.classList.remove('show');
      }, 3000);
    }
    
    function interactWithSun() {
      const sun = document.querySelector('.sun');
      sun.style.animation = 'sunShine 0.5s ease-in-out 3';
      sun.style.background = '#ff7675';
      
      setTimeout(() => {
        sun.style.background = '#fdcb6e';
      }, 2000);
      
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance("The sun is shining brightly just for you!");
        speechSynthesis.speak(speech);
      }
      
      trackInteraction('sun');
    }
    
    function interactWithClouds() {
      const clouds = document.querySelectorAll('.cloud');
      clouds.forEach((cloud, index) => {
        cloud.style.animation = \`cloudFloat 1s ease-in-out infinite\`;
        cloud.style.background = ['#ff7675', '#74b9ff', '#a29bfe'][index % 3];
        
        setTimeout(() => {
          cloud.style.background = 'white';
          cloud.style.animation = 'cloudFloat 8s ease-in-out infinite';
        }, 3000);
      });
      
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance("Look! The clouds are dancing in the sky!");
        speechSynthesis.speak(speech);
      }
      
      trackInteraction('clouds');
    }
    
    function interactWithTrees() {
      const trees = document.querySelectorAll('.tree-leaves');
      trees.forEach(tree => {
        tree.style.animation = 'treeWave 0.3s ease-in-out 5';
        tree.style.background = '#00cec9';
        
        setTimeout(() => {
          tree.style.background = '#00b894';
          tree.style.animation = 'treeWave 4s ease-in-out infinite';
        }, 2000);
      });
      
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance("The trees are waving hello to you!");
        speechSynthesis.speak(speech);
      }
      
      trackInteraction('trees');
    }
    
    function interactWithCharacter() {
      const character = document.getElementById('character');
      character.style.animation = 'characterWalk 1s ease-in-out 2';
      
      const bubble = document.getElementById('dialogueBubble');
      bubble.textContent = "Thanks for helping me explore!";
      bubble.classList.add('show');
      
      setTimeout(() => {
        character.style.animation = 'characterWalk 6s ease-in-out infinite';
        bubble.classList.remove('show');
      }, 3000);
      
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance("Thanks for helping me explore!");
        speech.pitch = 1.3;
        speechSynthesis.speak(speech);
      }
      
      trackInteraction('character');
    }
    
    function trackInteraction(element) {
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'story_element_interaction',
          element: element,
          chapter: currentChapter,
          pageNumber: ${pageNum}
        }, '*');
      }
    }
    
    // Add scene glow animation
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes sceneGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(225, 112, 85, 0.3); }
        50% { box-shadow: 0 0 40px rgba(225, 112, 85, 0.6); }
      }
    \`;
    document.head.appendChild(style);
    
    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'animated_story_loaded',
          totalChapters: chapters.length,
          pageNumber: ${pageNum}
        }, '*');
      }
    });
  </script>
</body>
</html>`;
};