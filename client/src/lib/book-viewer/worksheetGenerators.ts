import type { LibraryResource } from "@/pages/DigitalLibraryNew";
import { calculatePageCount, extractSubjectFromCurriculum } from "./utils";

// Generate worksheet pages based on resource content
export function generateWorksheetPages(resource: LibraryResource): string[] {
  const pages = [];
  const totalPages = calculatePageCount(resource);
  const subject = extractSubjectFromCurriculum(resource.curriculum);
  const grade = resource.grade || 'Current Grade';

  // Cover page
  pages.push(generateWorksheetCoverPage(resource, totalPages));

  // Instructions page
  pages.push(generateInstructionsPage(resource, totalPages, subject, grade));

  // Content pages
  for (let i = 3; i <= totalPages; i++) {
    if (i === totalPages) {
      pages.push(generateReflectionPage(totalPages, subject, grade));
    } else {
      pages.push(generateContentPage(i, totalPages, subject, grade, resource.type));
    }
  }

  return pages;
}

function generateWorksheetCoverPage(resource: LibraryResource, totalPages: number): string {
  return `
    <div style="padding: 40px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h1 style="color: #2c3e50; margin-bottom: 20px; font-size: 2.5rem;">
        ${resource.title}
      </h1>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin: 30px 0;">
        <h2 style="margin: 0; font-size: 1.5rem;">Interactive Learning Experience</h2>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${resource.description || 'Enhance your learning with interactive exercises'}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; text-align: left;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff;">
          <strong style="color: #007bff;">Grade Level:</strong>
          <p style="margin: 5px 0 0 0; color: #2c3e50;">${resource.grade || 'All Grades'}</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
          <strong style="color: #28a745;">Subject:</strong>
          <p style="margin: 5px 0 0 0; color: #2c3e50;">${extractSubjectFromCurriculum(resource.curriculum)}</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107;">
          <strong style="color: #ffc107;">Duration:</strong>
          <p style="margin: 5px 0 0 0; color: #2c3e50;">${resource.duration || '30-45 minutes'}</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #dc3545;">
          <strong style="color: #dc3545;">Difficulty:</strong>
          <p style="margin: 5px 0 0 0; color: #2c3e50;">${resource.difficulty || 'Intermediate'}</p>
        </div>
      </div>
      
      <div style="margin-top: 40px;">
        <p style="color: #6c757d; font-size: 0.9rem;">Page 1 of ${totalPages}</p>
      </div>
    </div>
  `;
}

function generateInstructionsPage(resource: LibraryResource, totalPages: number, subject: string, grade: string): string {
  return `
    <div style="padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h2 style="color: #495057; margin-bottom: 25px; border-bottom: 3px solid #007bff; padding-bottom: 10px;">
        📋 Instructions & Guidelines
      </h2>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #2196f3;">
        <h3 style="color: #1976d2; margin-top: 0;">Getting Started</h3>
        <ul style="color: #424242; line-height: 1.6;">
          <li>Read each question carefully before answering</li>
          <li>Use the space provided for your work and answers</li>
          <li>Show your work step-by-step where applicable</li>
          <li>Take your time and think through each problem</li>
        </ul>
      </div>
      
      <div style="background: #f3e5f5; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #9c27b0;">
        <h3 style="color: #7b1fa2; margin-top: 0;">Learning Objectives</h3>
        <p style="color: #424242; margin: 0;">
          By completing this ${resource.type}, you will demonstrate understanding of key ${subject} concepts 
          appropriate for ${grade} level students.
        </p>
      </div>
      
      <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #4caf50;">
        <h3 style="color: #388e3c; margin-top: 0;">Tips for Success</h3>
        <ul style="color: #424242; line-height: 1.6;">
          <li>Review related materials before starting</li>
          <li>Use diagrams or drawings when helpful</li>
          <li>Check your answers when you're finished</li>
          <li>Ask for help if you get stuck</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; display: inline-block;">
          <strong style="color: #856404;">⏱️ Estimated Time: ${resource.duration || '30-45 minutes'}</strong>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
        Page 2 of ${totalPages}
      </div>
    </div>
  `;
}

function generateContentPage(pageNum: number, totalPages: number, subject: string, grade: string, type: string): string {
  const contentType = getContentTypeForPage(pageNum, type);
  
  switch (contentType) {
    case 'exercise':
      return generateExercisePage(pageNum, totalPages, subject, grade);
    case 'reflection':
      return generateReflectionPage(totalPages, subject, grade);
    default:
      return generateStandardContentPage(pageNum, totalPages, subject, grade);
  }
}

function getContentTypeForPage(pageNum: number, type: string): string {
  if (type === 'quiz' || type === 'test') {
    return pageNum <= 5 ? 'exercise' : 'reflection';
  }
  return pageNum % 3 === 0 ? 'reflection' : 'exercise';
}

function generateExercisePage(pageNum: number, totalPages: number, subject: string, grade: string): string {
  return `
    <div style="padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h2 style="color: #495057; margin-bottom: 25px;">Exercise ${pageNum - 2}</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #17a2b8;">
        <h3 style="color: #138496; margin-top: 0;">Problem Solving</h3>
        <p style="color: #2c3e50; line-height: 1.6;">
          Apply your knowledge of ${subject} concepts to solve the following problems. 
          Remember to show your work and explain your reasoning.
        </p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">Question 1:</h4>
        <div style="background: white; border: 2px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0; color: #2c3e50;">
            [Interactive problem based on ${subject} for ${grade} students]
          </p>
          <div style="border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 15px;">
            <strong style="color: #495057;">Your Answer:</strong>
            <div style="margin-top: 10px; min-height: 60px; border: 1px dashed #ced4da; padding: 10px; background: #fafafa;">
              [Space for student work]
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">Question 2:</h4>
        <div style="background: white; border: 2px solid #dee2e6; border-radius: 8px; padding: 20px;">
          <p style="margin: 0 0 15px 0; color: #2c3e50;">
            [Multi-step problem requiring analysis and explanation]
          </p>
          <div style="border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 15px;">
            <strong style="color: #495057;">Your Solution:</strong>
            <div style="margin-top: 10px; min-height: 80px; border: 1px dashed #ced4da; padding: 10px; background: #fafafa;">
              [Space for detailed student work]
            </div>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
        Page ${pageNum} of ${totalPages}
      </div>
    </div>
  `;
}

function generateStandardContentPage(pageNum: number, totalPages: number, subject: string, grade: string): string {
  return `
    <div style="padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h2 style="color: #495057; margin-bottom: 25px;">Learning Activity ${pageNum - 2}</h2>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
        <h3 style="margin: 0 0 10px 0;">🎯 Learning Focus</h3>
        <p style="margin: 0; opacity: 0.9;">
          Explore ${subject} concepts through guided activities and interactive exercises.
        </p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">Activity Instructions:</h4>
        <div style="background: #e7f3ff; border-left: 4px solid #2196f3; padding: 20px; margin-bottom: 20px;">
          <ol style="margin: 0; color: #2c3e50; line-height: 1.6;">
            <li>Read the concept explanation carefully</li>
            <li>Work through the guided examples</li>
            <li>Complete the practice problems</li>
            <li>Reflect on your learning progress</li>
          </ol>
        </div>
      </div>
      
      <div style="background: white; border: 2px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
        <h4 style="color: #495057; margin-top: 0;">Interactive Content Area</h4>
        <p style="color: #6c757d; margin-bottom: 20px;">
          [This section would contain subject-specific interactive content for ${grade} level]
        </p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
          <strong style="color: #495057;">Example:</strong>
          <p style="margin: 5px 0 0 0; color: #2c3e50;">
            Interactive demonstration of ${subject} concepts with step-by-step guidance.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <button style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">
            Start Interactive Activity
          </button>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
        Page ${pageNum} of ${totalPages}
      </div>
    </div>
  `;
}

function generateReflectionPage(totalPages: number, subject: string, grade: string): string {
  return `
    <div style="padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h2 style="color: #495057; margin-bottom: 25px; text-align: center;">🤔 Reflection & Self-Assessment</h2>
      
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">Think About Your Learning</h3>
        <p style="margin: 0; opacity: 0.9;">
          Take a moment to reflect on what you've learned about ${subject}.
        </p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">Self-Assessment Checklist:</h4>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
            <span>I understand the main concepts covered in this lesson</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
            <span>I can apply what I learned to solve new problems</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
            <span>I can explain these concepts to someone else</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);">
            <span>I feel confident to move on to the next topic</span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">Reflection Questions:</h4>
        <div style="space-y: 15px;">
          <div style="margin-bottom: 20px;">
            <p style="margin-bottom: 10px; color: #495057; font-weight: 500;">1. What was the most interesting thing you learned today?</p>
            <div style="min-height: 60px; border: 1px dashed #ced4da; padding: 10px; background: white; border-radius: 4px;">
              [Your reflection here]
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="margin-bottom: 10px; color: #495057; font-weight: 500;">2. What questions do you still have?</p>
            <div style="min-height: 60px; border: 1px dashed #ced4da; padding: 10px; background: white; border-radius: 4px;">
              [Your questions here]
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="margin-bottom: 10px; color: #495057; font-weight: 500;">3. How will you use this knowledge in the future?</p>
            <div style="min-height: 60px; border: 1px dashed #ced4da; padding: 10px; background: white; border-radius: 4px;">
              [Your thoughts here]
            </div>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
        Final Page: ${totalPages} of ${totalPages}
      </div>
    </div>
  `;
}

// Generate worksheet-specific instructions
export function generateWorksheetInstructions(resource: LibraryResource): string {
  const baseInstructions = [
    "Read each question carefully before answering.",
    "Show your work where applicable.",
    "Use the answer key to check your responses when finished."
  ];
  
  if (resource.type === 'quiz' || resource.type === 'test') {
    baseInstructions.push("Time limit applies - work efficiently.");
  }
  
  if (resource.difficulty === 'hard') {
    baseInstructions.push("Take your time with complex problems.");
  }
  
  return baseInstructions.join(' ');
}