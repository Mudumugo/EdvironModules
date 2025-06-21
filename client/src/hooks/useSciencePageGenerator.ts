import { useState } from "react";

export interface Experiment {
  id: string;
  title: string;
  objective: string;
  hypothesis: string;
  materials: string[];
  procedure: string[];
  observations: string;
  conclusion: string;
  safetyNotes: string[];
  grade: string;
  subject: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ExperimentTemplate {
  id: string;
  name: string;
  description: string;
  grade: string;
  subject: string;
  materials: string[];
  estimatedTime: string;
}

export const EXPERIMENT_TEMPLATES: ExperimentTemplate[] = [
  {
    id: "density-water",
    name: "Density of Water Experiment",
    description: "Investigate how temperature affects water density",
    grade: "7",
    subject: "Physics",
    materials: ["Water", "Thermometer", "Food coloring", "Glass containers"],
    estimatedTime: "45 minutes"
  },
  {
    id: "plant-growth",
    name: "Plant Growth Factors",
    description: "Study how light affects plant growth",
    grade: "6",
    subject: "Biology",
    materials: ["Seeds", "Pots", "Soil", "Water", "Light source"],
    estimatedTime: "2 weeks observation"
  },
  {
    id: "chemical-reactions",
    name: "Acid-Base Reactions",
    description: "Observe color changes in acid-base reactions",
    grade: "8",
    subject: "Chemistry",
    materials: ["Vinegar", "Baking soda", "Indicator solution", "Test tubes"],
    estimatedTime: "30 minutes"
  }
];

export function useSciencePageGenerator() {
  const [experiment, setExperiment] = useState<Experiment>({
    id: '',
    title: '',
    objective: '',
    hypothesis: '',
    materials: [],
    procedure: [],
    observations: '',
    conclusion: '',
    safetyNotes: [],
    grade: '',
    subject: '',
    duration: '',
    difficulty: 'beginner'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState<string>('');

  const updateExperiment = (updates: Partial<Experiment>) => {
    setExperiment(prev => ({ ...prev, ...updates }));
  };

  const addMaterial = (material: string) => {
    if (material.trim() && !experiment.materials.includes(material.trim())) {
      setExperiment(prev => ({
        ...prev,
        materials: [...prev.materials, material.trim()]
      }));
    }
  };

  const removeMaterial = (index: number) => {
    setExperiment(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const addProcedureStep = (step: string) => {
    if (step.trim()) {
      setExperiment(prev => ({
        ...prev,
        procedure: [...prev.procedure, step.trim()]
      }));
    }
  };

  const removeProcedureStep = (index: number) => {
    setExperiment(prev => ({
      ...prev,
      procedure: prev.procedure.filter((_, i) => i !== index)
    }));
  };

  const updateProcedureStep = (index: number, step: string) => {
    setExperiment(prev => ({
      ...prev,
      procedure: prev.procedure.map((s, i) => i === index ? step : s)
    }));
  };

  const addSafetyNote = (note: string) => {
    if (note.trim() && !experiment.safetyNotes.includes(note.trim())) {
      setExperiment(prev => ({
        ...prev,
        safetyNotes: [...prev.safetyNotes, note.trim()]
      }));
    }
  };

  const removeSafetyNote = (index: number) => {
    setExperiment(prev => ({
      ...prev,
      safetyNotes: prev.safetyNotes.filter((_, i) => i !== index)
    }));
  };

  const loadTemplate = (template: ExperimentTemplate) => {
    setExperiment(prev => ({
      ...prev,
      title: template.name,
      grade: template.grade,
      subject: template.subject,
      materials: [...template.materials],
      duration: template.estimatedTime,
      objective: template.description
    }));
  };

  const generateExperimentPage = () => {
    setIsGenerating(true);
    
    try {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${experiment.title}</title>
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
      gap: 10px;
      margin-top: 15px;
    }
    .material-item {
      background: white;
      padding: 10px 15px;
      border-radius: 10px;
      border-left: 4px solid #00c6ff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .procedure-list {
      counter-reset: step-counter;
    }
    .procedure-step {
      counter-increment: step-counter;
      background: white;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 10px;
      border-left: 4px solid #0072ff;
      position: relative;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .procedure-step::before {
      content: counter(step-counter);
      position: absolute;
      left: -15px;
      top: 15px;
      background: #0072ff;
      color: white;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
    .safety-notes {
      background: linear-gradient(135deg, #ffebee, #ffcdd2);
      border: 2px solid #f44336;
      border-radius: 15px;
      padding: 20px;
    }
    .safety-note {
      background: white;
      padding: 10px 15px;
      border-radius: 8px;
      margin: 5px 0;
      border-left: 4px solid #f44336;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .experiment-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .info-card {
      background: linear-gradient(135deg, #e3f2fd, #bbdefb);
      padding: 15px;
      border-radius: 10px;
      text-align: center;
      border: 2px solid #2196f3;
    }
    .info-label {
      font-size: 12px;
      font-weight: bold;
      color: #1976d2;
      text-transform: uppercase;
    }
    .info-value {
      font-size: 16px;
      font-weight: bold;
      color: #0d47a1;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="experiment-container">
    <h1 class="experiment-title">${experiment.title}</h1>
    
    <div class="experiment-info">
      <div class="info-card">
        <div class="info-label">Grade</div>
        <div class="info-value">${experiment.grade}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Subject</div>
        <div class="info-value">${experiment.subject}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Duration</div>
        <div class="info-value">${experiment.duration}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Difficulty</div>
        <div class="info-value">${experiment.difficulty}</div>
      </div>
    </div>

    ${experiment.objective ? `
    <div class="section">
      <div class="section-title">🎯 Objective</div>
      <p>${experiment.objective}</p>
    </div>
    ` : ''}

    ${experiment.hypothesis ? `
    <div class="section">
      <div class="section-title">💡 Hypothesis</div>
      <p>${experiment.hypothesis}</p>
    </div>
    ` : ''}

    ${experiment.materials.length > 0 ? `
    <div class="section">
      <div class="section-title">🧪 Materials Needed</div>
      <div class="materials-list">
        ${experiment.materials.map(material => `
          <div class="material-item">${material}</div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${experiment.safetyNotes.length > 0 ? `
    <div class="safety-notes">
      <div class="section-title">⚠️ Safety Guidelines</div>
      ${experiment.safetyNotes.map(note => `
        <div class="safety-note">
          <span>⚠️</span>
          <span>${note}</span>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${experiment.procedure.length > 0 ? `
    <div class="section">
      <div class="section-title">📋 Procedure</div>
      <div class="procedure-list">
        ${experiment.procedure.map(step => `
          <div class="procedure-step">${step}</div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${experiment.observations ? `
    <div class="section">
      <div class="section-title">👁️ Observations</div>
      <p>${experiment.observations}</p>
    </div>
    ` : ''}

    ${experiment.conclusion ? `
    <div class="section">
      <div class="section-title">🎓 Conclusion</div>
      <p>${experiment.conclusion}</p>
    </div>
    ` : ''}
  </div>
</body>
</html>`;

      setGeneratedHTML(html);
      return html;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetExperiment = () => {
    setExperiment({
      id: '',
      title: '',
      objective: '',
      hypothesis: '',
      materials: [],
      procedure: [],
      observations: '',
      conclusion: '',
      safetyNotes: [],
      grade: '',
      subject: '',
      duration: '',
      difficulty: 'beginner'
    });
    setGeneratedHTML('');
  };

  return {
    experiment,
    isGenerating,
    generatedHTML,
    templates: EXPERIMENT_TEMPLATES,
    
    // Actions
    updateExperiment,
    addMaterial,
    removeMaterial,
    addProcedureStep,
    removeProcedureStep,
    updateProcedureStep,
    addSafetyNote,
    removeSafetyNote,
    loadTemplate,
    generateExperimentPage,
    resetExperiment,
    
    // Computed
    isComplete: experiment.title && experiment.objective && experiment.materials.length > 0,
    totalSteps: experiment.procedure.length,
  };
}