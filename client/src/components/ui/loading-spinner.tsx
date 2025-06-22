import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizeClasses[size], className)} />
  );
}

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

export function LoadingOverlay({ message = "Loading...", isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl border">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" className="text-blue-600" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface LoginLoadingAnimationProps {
  isVisible: boolean;
}

export function LoginLoadingAnimation({ isVisible }: LoginLoadingAnimationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-50 flex items-center justify-center">
      <div className="text-center text-white">
        {/* Logo Animation */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl font-bold text-blue-600">E</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">EdVirons</h1>
          <p className="text-blue-100">Educational Technology Platform</p>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" className="text-white" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium">Signing you in...</p>
            <p className="text-blue-200 text-sm">Please wait while we authenticate your account</p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-md mx-auto">
            <div className="space-y-3">
              <LoadingStep label="Verifying credentials" delay={0} />
              <LoadingStep label="Loading your profile" delay={1000} />
              <LoadingStep label="Preparing dashboard" delay={2000} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoadingStepProps {
  label: string;
  delay: number;
}

function LoadingStep({ label, delay }: LoadingStepProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`flex items-center space-x-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-400' : 'bg-blue-300'} transition-colors duration-300`} />
      <span className="text-sm text-blue-100">{label}</span>
      {isVisible && <LoadingSpinner size="sm" className="text-blue-300" />}
    </div>
  );
}