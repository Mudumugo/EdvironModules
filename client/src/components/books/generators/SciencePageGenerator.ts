export const generateScienceExperimentPage = (title: string, experiment: any) => {
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
      background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
      min-height: 100vh;
      color: #333;
    }
    .experiment-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    .experiment-title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 30px;
      text-align: center;
      background: linear-gradient(135deg, #00c6ff, #0072ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .section {
      margin-bottom: 30px;
      padding: 25px;
      border-radius: 15px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #0072ff;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .materials-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .material-item {
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .material-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #4ecdc4, #45b7d1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .steps-container {
      counter-reset: step-counter;
    }
    .step {
      background: white;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      position: relative;
      padding-left: 70px;
      counter-increment: step-counter;
    }
    .step::before {
      content: counter(step-counter);
      position: absolute;
      left: 20px;
      top: 20px;
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .step-content {
      font-size: 16px;
      line-height: 1.6;
    }
    .safety-warning {
      background: linear-gradient(135deg, #ffd93d, #ff6b35);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      border-left: 5px solid #ff4757;
    }
    .observation-box {
      background: linear-gradient(135deg, #a8edea, #fed6e3);
      padding: 25px;
      border-radius: 15px;
      margin: 20px 0;
      border: 2px dashed #ff6b6b;
    }
    .interactive-sim {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 15px;
      padding: 30px;
      text-align: center;
      margin: 20px 0;
    }
    .sim-button {
      background: linear-gradient(135deg, #4ecdc4, #45b7d1);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 10px;
    }
    .sim-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
    }
    .result-display {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin-top: 15px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="experiment-container">
    <h1 class="experiment-title">${title}</h1>
    
    ${experiment.objective ? `
    <div class="section">
      <div class="section-title">🎯 Objective</div>
      <p>${experiment.objective}</p>
    </div>
    ` : ''}
    
    ${experiment.materials ? `
    <div class="section">
      <div class="section-title">🧪 Materials Needed</div>
      <div class="materials-list">
        ${experiment.materials.map((material, index) => `
          <div class="material-item">
            <div class="material-icon">${index + 1}</div>
            <span>${material}</span>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    ${experiment.safety ? `
    <div class="safety-warning">
      <strong>⚠️ Safety First!</strong><br>
      ${experiment.safety}
    </div>
    ` : ''}
    
    ${experiment.steps ? `
    <div class="section">
      <div class="section-title">📋 Procedure</div>
      <div class="steps-container">
        ${experiment.steps.map(step => `
          <div class="step">
            <div class="step-content">${step}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <div class="section">
      <div class="section-title">🔬 Interactive Simulation</div>
      <div class="interactive-sim">
        <p>Click the buttons below to simulate the experiment:</p>
        <button class="sim-button" onclick="startExperiment()">Start Experiment</button>
        <button class="sim-button" onclick="addReagent()">Add Reagent</button>
        <button class="sim-button" onclick="observeReaction()">Observe Reaction</button>
        <div id="result-display" class="result-display">
          <h4>Observation Results:</h4>
          <p id="result-text">Click buttons above to see results...</p>
        </div>
      </div>
    </div>
    
    <div class="observation-box">
      <div class="section-title">📝 Record Your Observations</div>
      <textarea placeholder="Write down what you observe during the experiment..." 
                style="width: 100%; height: 100px; border: none; border-radius: 8px; padding: 15px; font-size: 14px; resize: vertical;"></textarea>
    </div>
    
    ${experiment.conclusion ? `
    <div class="section">
      <div class="section-title">🧠 Conclusion</div>
      <p>${experiment.conclusion}</p>
    </div>
    ` : ''}
  </div>

  <script>
    let experimentStep = 0;
    const results = [
      "Experiment setup complete. Ready to begin!",
      "Reagent added successfully. Notice the color change?",
      "Chemical reaction in progress. Bubbling observed!"
    ];

    function startExperiment() {
      experimentStep = 0;
      showResult(results[experimentStep]);
      experimentStep++;
    }

    function addReagent() {
      if (experimentStep > 0) {
        showResult(results[Math.min(experimentStep, results.length - 1)]);
        experimentStep++;
      } else {
        showResult("Please start the experiment first!");
      }
    }

    function observeReaction() {
      if (experimentStep > 1) {
        showResult("Final result: " + results[results.length - 1]);
      } else {
        showResult("No reaction to observe yet. Follow the steps!");
      }
    }

    function showResult(text) {
      const resultDisplay = document.getElementById('result-display');
      const resultText = document.getElementById('result-text');
      resultText.textContent = text;
      resultDisplay.style.display = 'block';
    }
  </script>
</body>
</html>`;
};

export const generatePeriodicTablePage = (title: string, focusElement?: string) => {
  const elements = [
    {symbol: 'H', name: 'Hydrogen', number: 1, category: 'nonmetal'},
    {symbol: 'He', name: 'Helium', number: 2, category: 'noble-gas'},
    {symbol: 'Li', name: 'Lithium', number: 3, category: 'alkali-metal'},
    {symbol: 'Be', name: 'Beryllium', number: 4, category: 'alkaline-earth'},
    // Add more elements as needed
  ];

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
      color: white;
    }
    .periodic-container {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    .periodic-title {
      font-size: 32px;
      margin-bottom: 30px;
      font-weight: bold;
    }
    .periodic-table {
      display: grid;
      grid-template-columns: repeat(18, 1fr);
      gap: 2px;
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
    }
    .element {
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .element:hover {
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      z-index: 10;
    }
    .element.focus {
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      animation: pulse 2s infinite;
    }
    .element-symbol {
      font-size: 18px;
      font-weight: bold;
    }
    .element-number {
      font-size: 12px;
      opacity: 0.7;
    }
    .element-name {
      font-size: 10px;
      margin-top: 2px;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  </style>
</head>
<body>
  <div class="periodic-container">
    <h1 class="periodic-title">${title}</h1>
    <div class="periodic-table">
      ${elements.map(element => `
        <div class="element ${focusElement === element.symbol ? 'focus' : ''}" 
             onclick="showElementInfo('${element.symbol}', '${element.name}', ${element.number})">
          <div class="element-number">${element.number}</div>
          <div class="element-symbol">${element.symbol}</div>
          <div class="element-name">${element.name}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    function showElementInfo(symbol, name, number) {
      alert(\`Element: \${name}\\nSymbol: \${symbol}\\nAtomic Number: \${number}\`);
    }
  </script>
</body>
</html>`;
};