import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VisitorRegistrationFormProps {
  onSubmit: (visitorData: any) => void;
  onCancel: () => void;
}

export default function VisitorRegistrationForm({ onSubmit, onCancel }: VisitorRegistrationFormProps) {
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorPhone: "",
    visitorEmail: "",
    purpose: "",
    hostName: "",
    hostDepartment: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register Visitor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="visitorName">Visitor Name *</Label>
            <Input
              id="visitorName"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="visitorPhone">Phone</Label>
            <Input
              id="visitorPhone"
              name="visitorPhone"
              type="tel"
              value={formData.visitorPhone}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="visitorEmail">Email</Label>
            <Input
              id="visitorEmail"
              name="visitorEmail"
              type="email"
              value={formData.visitorEmail}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="purpose">Purpose of Visit *</Label>
            <Input
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="hostName">Host Name *</Label>
            <Input
              id="hostName"
              name="hostName"
              value={formData.hostName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="hostDepartment">Host Department</Label>
            <Input
              id="hostDepartment"
              name="hostDepartment"
              value={formData.hostDepartment}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Register Visitor
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}