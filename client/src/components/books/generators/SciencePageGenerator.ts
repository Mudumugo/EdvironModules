export const generateInteractiveLabPage = (experiment: string, materials: string[], steps: string[], safetyNotes: string[] = []) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Science Lab: ${experiment}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
      min-height: 100vh;
    }
    .lab-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .lab-header {
      background: linear-gradient(135deg, #00b894, #00cec9);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .experiment-title {
      font-size: 2.2em;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .lab-content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 1.4em;
      font-weight: 600;
      color: #00b894;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    .section-icon {
      margin-right: 10px;
      font-size: 1.2em;
    }
    .materials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .material-item {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .material-item:hover {
      border-color: #00b894;
      background: #e8f5e8;
      transform: translateY(-3px);
    }
    .material-item.selected {
      border-color: #00b894;
      background: #d4edda;
    }
    .steps-list {
      list-style: none;
      padding: 0;
    }
    .step-item {
      background: #f8f9fa;
      border-left: 4px solid #00b894;
      margin: 15px 0;
      padding: 20px;
      border-radius: 0 8px 8px 0;
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .step-item:hover {
      background: #e8f5e8;
      transform: translateX(10px);
    }
    .step-item.completed {
      background: #d4edda;
      border-left-color: #28a745;
    }
    .step-number {
      position: absolute;
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      background: #00b894;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .step-number.completed {
      background: #28a745;
    }
    .safety-alert {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 15px;
      margin: 10px 0;
    }
    .safety-icon {
      color: #f39c12;
      margin-right: 10px;
    }
    .progress-bar {
      width: 100%;
      height: 10px;
      background: #e9ecef;
      border-radius: 5px;
      margin: 20px 0;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00b894, #00cec9);
      width: 0%;
      transition: width 0.5s ease;
    }
    .lab-controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }
    .control-btn {
      background: linear-gradient(135deg, #00b894, #00cec9);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .control-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0,184,148,0.4);
    }
  </style>
</head>
<body>
  <div class="lab-container">
    <div class="lab-header">
      <h1 class="experiment-title">🧪 ${experiment}</h1>
      <p>Interactive Science Laboratory</p>
    </div>
    <div class="lab-content">
      ${safetyNotes.length > 0 ? `
        <div class="section">
          <h2 class="section-title">
            <span class="section-icon">⚠️</span>
            Safety First!
          </h2>
          ${safetyNotes.map(note => `
            <div class="safety-alert">
              <span class="safety-icon">⚠️</span>
              ${note}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <h2 class="section-title">
          <span class="section-icon">🔬</span>
          Materials Needed
        </h2>
        <div class="materials-grid">
          ${materials.map((material, index) => `
            <div class="material-item" data-material="${index}" onclick="toggleMaterial(${index})">
              ${material}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">
          <span class="section-icon">📋</span>
          Experiment Steps
        </h2>
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <ol class="steps-list">
          ${steps.map((step, index) => `
            <li class="step-item" data-step="${index}" onclick="completeStep(${index})">
              <div class="step-number" id="stepNum${index}">${index + 1}</div>
              ${step}
            </li>
          `).join('')}
        </ol>
      </div>
      
      <div class="lab-controls">
        <button class="control-btn" onclick="resetExperiment()">🔄 Reset</button>
        <button class="control-btn" onclick="showResults()">📊 Results</button>
      </div>
    </div>
  </div>
  
  <script>
    let completedSteps = new Set();
    let selectedMaterials = new Set();
    
    function toggleMaterial(index) {
      const material = document.querySelector(\`[data-material="\${index}"]\`);
      if (selectedMaterials.has(index)) {
        selectedMaterials.delete(index);
        material.classList.remove('selected');
      } else {
        selectedMaterials.add(index);
        material.classList.add('selected');
      }
    }
    
    function completeStep(index) {
      const step = document.querySelector(\`[data-step="\${index}"]\`);
      const stepNum = document.getElementById(\`stepNum\${index}\`);
      
      if (completedSteps.has(index)) {
        completedSteps.delete(index);
        step.classList.remove('completed');
        stepNum.classList.remove('completed');
        stepNum.textContent = index + 1;
      } else {
        completedSteps.add(index);
        step.classList.add('completed');
        stepNum.classList.add('completed');
        stepNum.textContent = '✓';
      }
      
      updateProgress();
    }
    
    function updateProgress() {
      const progress = (completedSteps.size / ${steps.length}) * 100;
      document.getElementById('progressFill').style.width = progress + '%';
    }
    
    function resetExperiment() {
      completedSteps.clear();
      selectedMaterials.clear();
      
      document.querySelectorAll('.step-item').forEach(step => {
        step.classList.remove('completed');
      });
      
      document.querySelectorAll('.step-number').forEach((num, index) => {
        num.classList.remove('completed');
        num.textContent = index + 1;
      });
      
      document.querySelectorAll('.material-item').forEach(material => {
        material.classList.remove('selected');
      });
      
      updateProgress();
    }
    
    function showResults() {
      if (completedSteps.size === ${steps.length}) {
        alert('🎉 Congratulations! You completed the experiment successfully!');
      } else {
        alert(\`📊 Progress: \${completedSteps.size}/${steps.length} steps completed. Keep going!\`);
      }
    }
  </script>
</body>
</html>`;
};

export const generateMoleculeVisualizerPage = (moleculeName: string, formula: string, atoms: Array<{element: string, x: number, y: number, bonds?: number[]}>) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Molecule Visualizer: ${moleculeName}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
      min-height: 100vh;
      color: white;
    }
    .molecule-container {
      max-width: 1000px;
      margin: 0 auto;
      background: rgba(255,255,255,0.1);
      border-radius: 15px;
      backdrop-filter: blur(10px);
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .molecule-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .molecule-name {
      font-size: 2.5em;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .molecule-formula {
      font-size: 1.5em;
      opacity: 0.8;
      font-family: monospace;
    }
    .visualizer {
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      height: 400px;
      position: relative;
      margin: 20px 0;
      overflow: hidden;
    }
    .atom {
      position: absolute;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .atom:hover {
      transform: scale(1.2);
      z-index: 10;
    }
    .bond {
      position: absolute;
      background: #ddd;
      height: 2px;
      transform-origin: left center;
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
    }
    .control-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .control-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="molecule-container">
    <div class="molecule-header">
      <h1 class="molecule-name">${moleculeName}</h1>
      <div class="molecule-formula">${formula}</div>
    </div>
    <div class="visualizer" id="visualizer"></div>
    <div class="controls">
      <button class="control-btn" onclick="rotateMolecule()">🔄 Rotate</button>
      <button class="control-btn" onclick="toggleAnimation()">⏯️ Animate</button>
      <button class="control-btn" onclick="resetView()">🏠 Reset</button>
    </div>
  </div>
  
  <script>
    const atomColors = {
      'H': '#ffffff', 'C': '#808080', 'N': '#3050f8', 'O': '#ff0d0d',
      'F': '#90e050', 'P': '#ff8000', 'S': '#ffff30', 'Cl': '#1ff01f'
    };
    
    const atomSizes = {
      'H': 25, 'C': 35, 'N': 35, 'O': 35, 'F': 30, 'P': 40, 'S': 40, 'Cl': 35
    };
    
    let isAnimating = false;
    let rotationAngle = 0;
    
    function createMolecule() {
      const visualizer = document.getElementById('visualizer');
      visualizer.innerHTML = '';
      
      const atoms = ${JSON.stringify(atoms)};
      
      atoms.forEach((atom, index) => {
        const atomElement = document.createElement('div');
        atomElement.className = 'atom';
        atomElement.id = \`atom\${index}\`;
        atomElement.textContent = atom.element;
        
        const size = atomSizes[atom.element] || 30;
        const color = atomColors[atom.element] || '#888888';
        
        atomElement.style.width = size + 'px';
        atomElement.style.height = size + 'px';
        atomElement.style.backgroundColor = color;
        atomElement.style.left = (atom.x * 400 + 200 - size/2) + 'px';
        atomElement.style.top = (atom.y * 300 + 150 - size/2) + 'px';
        atomElement.style.color = atom.element === 'H' ? '#000' : '#fff';
        
        visualizer.appendChild(atomElement);
      });
    }
    
    function rotateMolecule() {
      const visualizer = document.getElementById('visualizer');
      rotationAngle += 45;
      visualizer.style.transform = \`rotateY(\${rotationAngle}deg)\`;
    }
    
    function toggleAnimation() {
      isAnimating = !isAnimating;
      const atoms = document.querySelectorAll('.atom');
      
      if (isAnimating) {
        atoms.forEach((atom, index) => {
          atom.style.animation = \`float 2s ease-in-out infinite \${index * 0.2}s\`;
        });
      } else {
        atoms.forEach(atom => {
          atom.style.animation = '';
        });
      }
    }
    
    function resetView() {
      const visualizer = document.getElementById('visualizer');
      visualizer.style.transform = '';
      rotationAngle = 0;
      isAnimating = false;
      
      document.querySelectorAll('.atom').forEach(atom => {
        atom.style.animation = '';
      });
    }
    
    // Add floating animation keyframes
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    \`;
    document.head.appendChild(style);
    
    // Initialize molecule
    createMolecule();
  </script>
</body>
</html>`;
};