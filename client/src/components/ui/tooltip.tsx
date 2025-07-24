import React from "react";

// Replit-safe tooltip components that avoid all React hooks
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return asChild ? <>{children}</> : <span>{children}</span>;
};

export const TooltipContent = () => null;
