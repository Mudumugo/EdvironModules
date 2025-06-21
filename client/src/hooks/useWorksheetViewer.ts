import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WorksheetData {
  id: string;
  title: string;
  description: string;
  instructions: string;
  exercises: Exercise[];
  metadata: {
    subject: string;
    grade: string;
    difficulty: string;
    estimatedTime: number;
  };
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'essay' | 'drawing' | 'matching';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
}

export interface WorksheetResponse {
  exerciseId: string;
  answer: string | string[];
  isCorrect?: boolean;
  timeSpent: number;
}

export function useWorksheetViewer(worksheetData: WorksheetData | null) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [responses, setResponses] = useState<Record<string, WorksheetResponse>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { toast } = useToast();

  // Timer for tracking time spent on each exercise
  useEffect(() => {
    if (!worksheetData) return;

    const interval = setInterval(() => {
      const exerciseId = worksheetData.exercises[currentExercise]?.id;
      if (exerciseId) {
        setTimeSpent(prev => ({
          ...prev,
          [exerciseId]: (prev[exerciseId] || 0) + 1
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentExercise, worksheetData]);

  const submitAnswer = (exerciseId: string, answer: string | string[]) => {
    if (!worksheetData) return;

    const exercise = worksheetData.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const isCorrect = checkAnswer(exercise, answer);
    
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        exerciseId,
        answer,
        isCorrect,
        timeSpent: timeSpent[exerciseId] || 0
      }
    }));

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job on that answer.",
      });
    } else {
      toast({
        title: "Try again",
        description: "That's not quite right. Give it another try.",
        variant: "destructive",
      });
    }
  };

  const checkAnswer = (exercise: Exercise, answer: string | string[]): boolean => {
    if (!exercise.correctAnswer) return false;

    if (Array.isArray(exercise.correctAnswer)) {
      if (Array.isArray(answer)) {
        return exercise.correctAnswer.every(correct => answer.includes(correct)) &&
               answer.every(ans => exercise.correctAnswer!.includes(ans));
      }
      return false;
    }

    if (Array.isArray(answer)) {
      return answer.includes(exercise.correctAnswer);
    }

    return answer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
  };

  const nextExercise = () => {
    if (!worksheetData) return;

    if (currentExercise < worksheetData.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    } else {
      completeWorksheet();
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
    }
  };

  const goToExercise = (index: number) => {
    if (!worksheetData) return;
    
    if (index >= 0 && index < worksheetData.exercises.length) {
      setCurrentExercise(index);
    }
  };

  const completeWorksheet = () => {
    setIsCompleted(true);
    setShowResults(true);
    
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = Object.values(responses).filter(r => r.isCorrect).length;
    const totalQuestions = worksheetData?.exercises.length || 0;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    toast({
      title: "Worksheet completed!",
      description: `You scored ${score}% (${correctAnswers}/${totalQuestions}) in ${Math.floor(totalTime / 60)}:${String(totalTime % 60).padStart(2, '0')}`,
    });
  };

  const resetWorksheet = () => {
    setCurrentExercise(0);
    setResponses({});
    setTimeSpent({});
    setStartTime(Date.now());
    setIsCompleted(false);
    setShowResults(false);
  };

  const getProgress = () => {
    if (!worksheetData) return 0;
    return Math.round((Object.keys(responses).length / worksheetData.exercises.length) * 100);
  };

  const getScore = () => {
    const totalQuestions = worksheetData?.exercises.length || 0;
    const correctAnswers = Object.values(responses).filter(r => r.isCorrect).length;
    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  };

  return {
    // State
    currentExercise,
    responses,
    timeSpent,
    isCompleted,
    showResults,
    
    // Current exercise data
    currentExerciseData: worksheetData?.exercises[currentExercise] || null,
    currentResponse: worksheetData?.exercises[currentExercise] ? responses[worksheetData.exercises[currentExercise].id] : null,
    
    // Navigation
    canGoNext: worksheetData ? currentExercise < worksheetData.exercises.length - 1 : false,
    canGoPrevious: currentExercise > 0,
    
    // Progress and scoring
    progress: getProgress(),
    score: getScore(),
    
    // Actions
    submitAnswer,
    nextExercise,
    previousExercise,
    goToExercise,
    completeWorksheet,
    resetWorksheet,
    setShowResults,
  };
}