import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function useFormDialog<T extends z.ZodType>(
  schema: T,
  onSubmit: (data: z.infer<T>) => void | Promise<void>,
  defaultValues?: Partial<z.infer<T>>
) {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    setIsOpen(false);
    form.reset();
  };

  return {
    isOpen,
    openDialog,
    closeDialog,
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}