import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QuizStep } from "./types";

interface NavigationButtonsProps {
  currentStep: QuizStep;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

export function NavigationButtons({ 
  currentStep, 
  canGoNext, 
  onPrev, 
  onNext, 
  isSubmitting 
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === "welcome";
  const isLastStep = currentStep === "review";

  return (
    <div className="flex justify-between items-center mt-8">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep}
        className={isFirstStep ? "invisible" : ""}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>

      <Button
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className="ml-auto"
      >
        {isSubmitting ? "Submitting..." : isLastStep ? "Complete Signup" : "Next"}
        {!isLastStep && !isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
}