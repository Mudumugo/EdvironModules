import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, HelpCircle, MousePointer, Zap } from "lucide-react";
import { InteractiveElement } from "./types";

interface InteractiveElementsProps {
  elements: InteractiveElement[];
  currentTime: number;
  completedElements: Set<string>;
  onElementComplete: (elementId: string, data: any) => void;
  onElementInteraction: (elementId: string, data: any) => void;
}

export function InteractiveElements({
  elements,
  currentTime,
  completedElements,
  onElementComplete,
  onElementInteraction
}: InteractiveElementsProps) {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: any }>({});

  const getActiveElements = () => {
    return elements.filter(element => {
      if (element.timestamp <= currentTime) {
        if (element.duration) {
          return currentTime <= element.timestamp + element.duration;
        }
        return true;
      }
      return false;
    });
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'quiz': return HelpCircle;
      case 'poll': return Target;
      case 'hotspot': return MousePointer;
      case 'overlay': return Target;
      case 'link': return Zap;
      default: return Target;
    }
  };

  const handleQuizSubmit = (elementId: string, quiz: any) => {
    const answers = quizAnswers[elementId] || {};
    const allAnswered = quiz.questions.every((q: any) => answers[q.id] !== undefined);
    
    if (!allAnswered) {
      return;
    }

    const score = quiz.questions.reduce((total: number, question: any) => {
      const userAnswer = answers[question.id];
      const isCorrect = question.type === 'multiple-choice' 
        ? userAnswer === question.correctAnswer
        : question.acceptableAnswers?.includes(userAnswer.toLowerCase());
      return total + (isCorrect ? 1 : 0);
    }, 0);

    const result = {
      score,
      totalQuestions: quiz.questions.length,
      percentage: (score / quiz.questions.length) * 100,
      answers
    };

    onElementComplete(elementId, result);
    setActiveQuiz(null);
    setQuizAnswers(prev => ({ ...prev, [elementId]: {} }));
  };

  const handleQuizAnswer = (elementId: string, questionId: string, answer: any) => {
    setQuizAnswers(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        [questionId]: answer
      }
    }));
  };

  const renderQuizOverlay = (element: InteractiveElement) => {
    const quiz = element.data;
    const elementAnswers = quizAnswers[element.id] || {};

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {quiz.title}
            </CardTitle>
            {quiz.description && (
              <p className="text-sm text-gray-600">{quiz.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((question: any, index: number) => (
              <div key={question.id} className="space-y-3">
                <h3 className="font-medium">
                  {index + 1}. {question.text}
                </h3>
                
                {question.type === 'multiple-choice' && (
                  <div className="space-y-2">
                    {question.options.map((option: string, optionIndex: number) => (
                      <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={optionIndex}
                          checked={elementAnswers[question.id] === optionIndex}
                          onChange={() => handleQuizAnswer(element.id, question.id, optionIndex)}
                          className="radio"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'text' && (
                  <Input
                    placeholder="Enter your answer..."
                    value={elementAnswers[question.id] || ''}
                    onChange={(e) => handleQuizAnswer(element.id, question.id, e.target.value)}
                  />
                )}

                {question.type === 'true-false' && (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value="true"
                        checked={elementAnswers[question.id] === true}
                        onChange={() => handleQuizAnswer(element.id, question.id, true)}
                      />
                      <span>True</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value="false"
                        checked={elementAnswers[question.id] === false}
                        onChange={() => handleQuizAnswer(element.id, question.id, false)}
                      />
                      <span>False</span>
                    </label>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                {Object.keys(elementAnswers).length} of {quiz.questions.length} answered
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveQuiz(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleQuizSubmit(element.id, quiz)}
                  disabled={Object.keys(elementAnswers).length < quiz.questions.length}
                >
                  Submit Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHotspot = (element: InteractiveElement) => {
    const isCompleted = completedElements.has(element.id);
    const Icon = getElementIcon(element.type);

    return (
      <div
        key={element.id}
        className={`absolute cursor-pointer transition-all duration-300 ${
          isCompleted ? 'opacity-50' : 'hover:scale-110'
        }`}
        style={{
          left: `${element.position?.x}%`,
          top: `${element.position?.y}%`,
          width: element.position?.width || '40px',
          height: element.position?.height || '40px'
        }}
        onClick={() => {
          if (element.type === 'quiz') {
            setActiveQuiz(element.id);
          } else {
            onElementInteraction(element.id, { timestamp: currentTime });
          }
        }}
      >
        <div className={`w-full h-full rounded-full flex items-center justify-center ${
          isCompleted 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white animate-pulse'
        }`}>
          {isCompleted ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
        </div>
        
        {!isCompleted && (
          <div className="absolute -inset-2 rounded-full border-2 border-blue-500 animate-ping" />
        )}
      </div>
    );
  };

  const renderOverlay = (element: InteractiveElement) => {
    const overlay = element.data;
    
    return (
      <div
        key={element.id}
        className="absolute bg-black/80 text-white p-4 rounded-lg max-w-sm"
        style={{
          left: `${element.position?.x}%`,
          top: `${element.position?.y}%`,
          width: element.position?.width || 'auto',
          minWidth: '200px'
        }}
      >
        <h3 className="font-medium mb-2">{overlay.title}</h3>
        <p className="text-sm mb-3">{overlay.content}</p>
        
        {overlay.actionUrl && (
          <Button
            size="sm"
            onClick={() => {
              window.open(overlay.actionUrl, '_blank');
              onElementInteraction(element.id, { action: 'link_clicked' });
            }}
          >
            {overlay.actionText || 'Learn More'}
          </Button>
        )}
      </div>
    );
  };

  const activeElements = getActiveElements();
  const totalElements = elements.length;
  const completedCount = completedElements.size;
  const progressPercentage = totalElements > 0 ? (completedCount / totalElements) * 100 : 0;

  return (
    <>
      {/* Interactive Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {activeElements.map((element) => {
            switch (element.type) {
              case 'hotspot':
              case 'quiz':
              case 'poll':
                return renderHotspot(element);
              case 'overlay':
                return renderOverlay(element);
              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      {totalElements > 0 && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg min-w-48">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Progress</span>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <div className="text-xs text-gray-300">
            {completedCount} of {totalElements} completed ({Math.round(progressPercentage)}%)
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuiz && (
        renderQuizOverlay(elements.find(e => e.id === activeQuiz)!)
      )}
    </>
  );
}