'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { updateAssignment } from '@/actions/assignments';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
  maxPoints: number;
  course: {
    id: string;
    title: string;
    code: string;
  };
}

interface EditAssignmentDialogProps {
  open: boolean;
  assignment: Assignment;
  onClose: () => void;
  onAssignmentUpdated: (assignment: Assignment) => void;
}

export function EditAssignmentDialog({
  open,
  assignment,
  onClose,
  onAssignmentUpdated,
}: EditAssignmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(new Date(assignment.dueDate));
  const [dueTime, setDueTime] = useState(() => {
    const date = new Date(assignment.dueDate);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Combine date and time
    const [hours, minutes] = dueTime.split(':');
    const dueDateWithTime = new Date(dueDate);
    dueDateWithTime.setHours(parseInt(hours), parseInt(minutes));

    const updateData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      instructions: formData.get('instructions') as string,
      dueDate: dueDateWithTime.toISOString(),
      maxPoints: parseInt(formData.get('maxPoints') as string, 10),
    };

    try {
      const result = await updateAssignment(assignment.id, updateData);

      if (result.success && result.data) {
        toast.success('Assignment updated successfully!');
        onAssignmentUpdated(result.data);
        onClose();
      } else {
        toast.error(result.error?.message || 'Failed to update assignment');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Assignment</DialogTitle>
          <DialogDescription>
            Update the assignment details. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Info (Read-only) */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Course</p>
            <p className="font-medium">
              {assignment.course.code} - {assignment.course.title}
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Assignment Title *
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={assignment.title}
              placeholder="e.g., Chapter 5 Problem Set"
              required
              disabled={isSubmitting}
              className="text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={assignment.description}
              placeholder="Brief overview of the assignment..."
              required
              disabled={isSubmitting}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-base">
              Detailed Instructions
            </Label>
            <Textarea
              id="instructions"
              name="instructions"
              defaultValue={assignment.instructions || ''}
              placeholder="Detailed instructions, requirements, and guidelines..."
              disabled={isSubmitting}
              rows={5}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* Due Date and Time */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-base">
                Due Date *
              </Label>
              <DatePicker
                date={dueDate}
                onDateChange={(date) => date && setDueDate(date)}
                placeholder="Pick a date"
                disabled={isSubmitting}
                disabledDates={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime" className="text-base">
                Due Time *
              </Label>
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                required
                disabled={isSubmitting}
                className="text-base"
              />
            </div>
          </div>

          {/* Max Points */}
          <div className="space-y-2">
            <Label htmlFor="maxPoints" className="text-base">
              Maximum Points *
            </Label>
            <Input
              id="maxPoints"
              name="maxPoints"
              type="number"
              defaultValue={assignment.maxPoints}
              placeholder="100"
              required
              disabled={isSubmitting}
              min="1"
              max="1000"
              className="text-base"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Assignment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
