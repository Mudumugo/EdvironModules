import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, UserPlus } from "lucide-react";
import VisitorRegistrationForm from "@/components/security/VisitorRegistrationForm";

interface SecurityHeaderProps {
  onVisitorRegister: (data: any) => void;
  onEmergencyCall: () => void;
}

export function SecurityHeader({ onVisitorRegister, onEmergencyCall }: SecurityHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor campus security, manage incidents, and coordinate responses
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Register Visitor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Visitor</DialogTitle>
            </DialogHeader>
            <VisitorRegistrationForm 
              onSubmit={onVisitorRegister}
              onCancel={() => {}}
            />
          </DialogContent>
        </Dialog>
        <Button onClick={onEmergencyCall}>
          <Phone className="mr-2 h-4 w-4" />
          Emergency Call
        </Button>
      </div>
    </div>
  );
}