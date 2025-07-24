// Dummy tooltip components for Replit webview compatibility
// These components prevent React hook conflicts while maintaining component interface

import * as React from "react"

// Simple wrapper that just renders children without any tooltip functionality
const TooltipProvider = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => {
  return <>{children}</>;
};

const Tooltip = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => {
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, ref } as any);
  }
  return <span {...props} ref={ref as any}>{children}</span>;
});

const TooltipContent = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => {
  return null; // Don't render tooltip content
};

TooltipTrigger.displayName = "TooltipTrigger";
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
