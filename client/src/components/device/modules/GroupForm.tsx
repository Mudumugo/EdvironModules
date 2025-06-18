import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { groupFormSchema, GroupFormType, predefinedColors, DeviceGroup } from "./DeviceGroupTypes";

interface GroupFormProps {
  onSubmit: (data: GroupFormType) => void;
  onCancel: () => void;
  editingGroup?: DeviceGroup | null;
  isLoading?: boolean;
}

export default function GroupForm({ onSubmit, onCancel, editingGroup, isLoading }: GroupFormProps) {
  const form = useForm<GroupFormType>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: editingGroup?.name || "",
      description: editingGroup?.description || "",
      color: editingGroup?.color || predefinedColors[0].value,
    },
  });

  const handleSubmit = (data: GroupFormType) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Group Name</Label>
        <Input
          id="name"
          placeholder="Enter group name"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter group description"
          rows={3}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {predefinedColors.map((color) => (
            <label
              key={color.value}
              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                form.watch("color") === color.value
                  ? "ring-2 ring-primary ring-offset-2"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                value={color.value}
                {...form.register("color")}
                className="sr-only"
              />
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.value }}
              />
              <span className="ml-2 text-sm">{color.name}</span>
            </label>
          ))}
        </div>
        {form.formState.errors.color && (
          <p className="text-sm text-red-600">
            {form.formState.errors.color.message}
          </p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : editingGroup ? "Update Group" : "Create Group"}
        </Button>
      </DialogFooter>
    </form>
  );
}