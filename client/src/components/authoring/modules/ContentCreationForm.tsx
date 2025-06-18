import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Send } from "lucide-react";
import type { ContentFormData, Taxonomy } from "../types";

interface ContentCreationFormProps {
  taxonomy?: Taxonomy;
  onSubmit: (data: ContentFormData) => void;
  isSubmitting?: boolean;
}

export function ContentCreationForm({ taxonomy, onSubmit, isSubmitting }: ContentCreationFormProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    type: "",
    subject: "",
    grade: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof ContentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter content title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Content Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {taxonomy?.contentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  )) || [
                    <SelectItem key="textbook" value="textbook">Textbook</SelectItem>,
                    <SelectItem key="video" value="video">Video</SelectItem>,
                    <SelectItem key="interactive" value="interactive">Interactive</SelectItem>,
                    <SelectItem key="assessment" value="assessment">Assessment</SelectItem>
                  ]}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {taxonomy?.subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  )) || [
                    <SelectItem key="mathematics" value="mathematics">Mathematics</SelectItem>,
                    <SelectItem key="science" value="science">Science</SelectItem>,
                    <SelectItem key="english" value="english">English</SelectItem>,
                    <SelectItem key="history" value="history">History</SelectItem>
                  ]}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {taxonomy?.grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  )) || [
                    <SelectItem key="k" value="k">Kindergarten</SelectItem>,
                    <SelectItem key="1" value="1">Grade 1</SelectItem>,
                    <SelectItem key="2" value="2">Grade 2</SelectItem>,
                    <SelectItem key="3" value="3">Grade 3</SelectItem>,
                    <SelectItem key="4" value="4">Grade 4</SelectItem>,
                    <SelectItem key="5" value="5">Grade 5</SelectItem>
                  ]}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your content..."
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Content"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}