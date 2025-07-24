// Completely safe tooltip components for Replit compatibility
// No React imports or hooks to prevent conflicts

export function TooltipProvider({ children }: { children: any }) {
  return children;
}

export function Tooltip({ children }: { children: any }) {
  return children;
}

export function TooltipTrigger({ children, asChild }: { children: any; asChild?: boolean }) {
  return asChild ? children : children;
}

export function TooltipContent() {
  return null;
}
