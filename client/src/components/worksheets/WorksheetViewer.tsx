import { useWorksheetViewer } from "@/hooks/useWorksheetViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Trophy
} from "lucide-react";
import type { WorksheetData } from "@/hooks/useWorksheetViewer";

interface WorksheetViewerProps {
  worksheetData: WorksheetData;
  onClose?: () => void;
}

export function WorksheetViewer({ worksheetData, onClose }: WorksheetViewerProps) {
  const {
    currentExercise,
    currentExerciseData,
    currentResponse,
    canGoNext,
    canGoPrevious,
    progress,
    score,
    isCompleted,
    showResults,
    submitAnswer,
    nextExercise,
    previousExercise,
    resetWorksheet,
    setShowResults
  } = useWorksheetViewer(worksheetData);

  const renderExercise = () => {
    if (!currentExerciseData) return null;

    const handleSubmit = (answer: string | string[]) => {
      submitAnswer(currentExerciseData.id, answer);
    };

    switch (currentExerciseData.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <RadioGroup
              value={currentResponse?.answer as string}
              onValueChange={handleSubmit}
            >
              {currentExerciseData.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Enter your answer..."
              value={currentResponse?.answer as string || ''}
              onChange={(e) => handleSubmit(e.target.value)}
            />
          </div>
        );

      case 'essay':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Write your answer..."
              value={currentResponse?.answer as string || ''}
              onChange={(e) => handleSubmit(e.target.value)}
              rows={6}
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Unsupported exercise type: {currentExerciseData.type}
          </div>
        );
    }
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Worksheet Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-blue-600">{score}%</div>
            <p className="text-gray-600">
              You answered {Object.values(worksheetData.exercises).filter((_, i) => 
                Object.values(currentExercise)[i]?.isCorrect
              ).length} out of {worksheetData.exercises.length} questions correctly.
            </p>
            
            <div className="flex justify-center space-x-4 mt-6">
              <Button onClick={() => setShowResults(false)} variant="outline">
                Review Answers
              </Button>
              <Button onClick={resetWorksheet}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              {onClose && (
                <Button onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{worksheetData.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{worksheetData.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {worksheetData.metadata.subject}
              </Badge>
              <Badge variant="outline">
                Grade {worksheetData.metadata.grade}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {currentExercise + 1} of {worksheetData.exercises.length}</span>
              <span>{progress}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Question {currentExercise + 1}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {currentResponse?.isCorrect === true && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {currentResponse?.isCorrect === false && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <Badge variant="outline">
                {currentExerciseData?.points} points
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium">
            {currentExerciseData?.question}
          </div>
          
          {renderExercise()}
          
          {currentResponse?.isCorrect === false && currentExerciseData?.explanation && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="font-medium text-blue-900">Explanation:</div>
              </div>
              <p className="text-blue-800 mt-1">{currentExerciseData.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousExercise}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          {worksheetData.exercises.map((_, index) => (
            <Button
              key={index}
              variant={index === currentExercise ? "default" : "outline"}
              size="sm"
              onClick={() => {/* goToExercise(index) */}}
              className="w-8 h-8 p-0"
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button
          onClick={canGoNext ? nextExercise : () => setShowResults(true)}
          className="flex items-center space-x-2"
        >
          <span>{canGoNext ? 'Next' : 'Finish'}</span>
          {canGoNext && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}