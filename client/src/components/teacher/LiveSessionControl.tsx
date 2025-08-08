import { Button } from "@/components/ui/button";

interface LiveSessionControlProps {
  sessionId: string;
  onClose?: () => void;
}

export default function LiveSessionControl({ sessionId, onClose }: LiveSessionControlProps) {
  return (
    <div className="p-4 text-center">
      <h3 className="text-lg font-semibold mb-2">Live Session Control</h3>
      <p className="text-gray-600 mb-4">This feature is temporarily under maintenance.</p>
      <Button onClick={onClose} variant="outline">
        Close
      </Button>
    </div>
  );
}
