// Simple non-hook tooltip components for Replit webview compatibility
// Completely eliminates React hook usage that causes conflicts in embedded browser

// Simple wrapper component that avoids all React hooks
const TooltipProvider = ({ children }: { children: React.ReactNode }) => children;

const Tooltip = ({ children }: { children: React.ReactNode }) => children;

const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return asChild ? children : <span>{children}</span>;
};

const TooltipContent = () => null;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
