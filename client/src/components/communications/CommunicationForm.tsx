import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Send, Save } from "lucide-react";
import { CommunicationFormData, COMMUNICATION_TYPES, PRIORITY_LEVELS, TARGET_AUDIENCES, DELIVERY_CHANNELS } from "./types";

const communicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.string().min(1, "Communication type is required"),
  priority: z.string().min(1, "Priority is required"),
  targetAudience: z.array(z.string()).min(1, "At least one audience must be selected"),
  channels: z.array(z.string()).min(1, "At least one channel must be selected"),
  scheduledAt: z.string().optional()
});

interface CommunicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CommunicationFormData, action: 'draft' | 'schedule' | 'send') => void;
  initialData?: Partial<CommunicationFormData>;
  isLoading?: boolean;
}

export function CommunicationForm({ isOpen, onClose, onSubmit, initialData, isLoading }: CommunicationFormProps) {
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(initialData?.targetAudience || []);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(initialData?.channels || []);

  const form = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      type: initialData?.type || "",
      priority: initialData?.priority || "normal",
      targetAudience: initialData?.targetAudience || [],
      channels: initialData?.channels || [],
      scheduledAt: initialData?.scheduledAt || ""
    }
  });

  const handleAudienceToggle = (audienceId: string) => {
    const updated = selectedAudiences.includes(audienceId)
      ? selectedAudiences.filter(id => id !== audienceId)
      : [...selectedAudiences, audienceId];
    setSelectedAudiences(updated);
    form.setValue("targetAudience", updated);
  };

  const handleChannelToggle = (channelId: string) => {
    const updated = selectedChannels.includes(channelId)
      ? selectedChannels.filter(id => id !== channelId)
      : [...selectedChannels, channelId];
    setSelectedChannels(updated);
    form.setValue("channels", updated);
  };

  const handleFormSubmit = (data: CommunicationFormData, action: 'draft' | 'schedule' | 'send') => {
    onSubmit(data, action);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Communication</DialogTitle>
        </DialogHeader>

        <form className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Communication title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={form.watch("priority")} onValueChange={(value) => form.setValue("priority", value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_LEVELS.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <Badge variant="outline" className={`text-${priority.color}-600`}>
                      {priority.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...form.register("content")}
              placeholder="Enter your message content..."
              rows={6}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>

          {/* Target Audience */}
          <div>
            <Label>Target Audience</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {TARGET_AUDIENCES.map((audience) => (
                <div key={audience.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={audience.value}
                    checked={selectedAudiences.includes(audience.value)}
                    onCheckedChange={() => handleAudienceToggle(audience.value)}
                  />
                  <Label htmlFor={audience.value} className="text-sm flex items-center gap-1">
                    <span>{audience.icon}</span>
                    <span>{audience.label}</span>
                  </Label>
                </div>
              ))}
            </div>
            {selectedAudiences.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedAudiences.map((audienceId) => {
                  const audience = TARGET_AUDIENCES.find(a => a.value === audienceId);
                  return audience ? (
                    <Badge key={audienceId} variant="secondary" className="text-xs">
                      {audience.icon} {audience.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Delivery Channels */}
          <div>
            <Label>Delivery Channels</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {DELIVERY_CHANNELS.map((channel) => (
                <div key={channel.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={channel.value}
                    checked={selectedChannels.includes(channel.value)}
                    onCheckedChange={() => handleChannelToggle(channel.value)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={channel.value} className="text-sm flex items-center gap-2">
                      <span>{channel.icon}</span>
                      <span>{channel.label}</span>
                    </Label>
                    <p className="text-xs text-gray-500">{channel.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Option */}
          <div>
            <Label htmlFor="scheduledAt">Schedule for Later (Optional)</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              {...form.register("scheduledAt")}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleFormSubmit(form.getValues(), 'draft')}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              
              {form.watch("scheduledAt") ? (
                <Button
                  type="button"
                  onClick={() => handleFormSubmit(form.getValues(), 'schedule')}
                  disabled={isLoading}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleFormSubmit(form.getValues(), 'send')}
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}