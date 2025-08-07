import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { NewLanding } from "@/pages/NewLanding";

// Simplified App component that ONLY shows the landing page
// This completely eliminates all auth polling and complex routing
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewLanding />
      <Toaster />
    </QueryClientProvider>
  );
}