import { useEventForm, Event } from "@/hooks/useEventForm";
import { Form } from "@/components/ui/form";
import { EventFormBasicInfo } from "../modules/EventFormBasicInfo";
import { EventFormDateTime } from "../modules/EventFormDateTime";
import { EventFormNotifications } from "../modules/EventFormNotifications";
import { EventFormActions } from "../modules/EventFormActions";

interface EventFormProps {
  event?: Event;
  onSubmit?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export default function EventForm({ 
  event, 
  onSubmit, 
  onCancel, 
  onDelete, 
  onDuplicate 
}: EventFormProps) {
  const {
    form,
    showRecurringOptions,
    isSubmitting,
    isEditing,
    handleSubmit,
    handleRecurringChange,
    setStartTimeToNow,
    setEndTimeToOneHourLater,
    eventTypes,
    recurringPatterns,
    reminderOptions,
  } = useEventForm(event, onSubmit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isEditing ? "Edit Event" : "Create New Event"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <EventFormBasicInfo 
            form={form}
            eventTypes={eventTypes}
          />

          <EventFormDateTime
            form={form}
            showRecurringOptions={showRecurringOptions}
            recurringPatterns={recurringPatterns}
            onRecurringChange={handleRecurringChange}
            onSetStartTimeToNow={setStartTimeToNow}
            onSetEndTimeToOneHourLater={setEndTimeToOneHourLater}
          />

          <EventFormNotifications
            form={form}
            reminderOptions={reminderOptions}
          />

          <EventFormActions
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onCancel={onCancel}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        </form>
      </Form>
    </div>
  );
}