'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { createAssignment } from '@/actions/assignments';
import { getCourses } from '@/actions/courses';
import { Course } from '@/actions/utils/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
  maxPoints: number;
  courseId: string;
  course: {
    id: string;
    title: string;
    code: string;
  };
}

interface CreateAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssignmentCreated: (assignment: Assignment) => void;
}

export function CreateAssignmentDialog({
  open,
  onClose,
  onAssignmentCreated,
}: CreateAssignmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [dueTime, setDueTime] = useState('23:59');

  useEffect(() => {
    const loadCourses = async () => {
      const result = await getCourses();
      if (result.success && result.data?.courses) {
        setCourses(result.data.courses);
        if (result.data.courses.length > 0) {
          setSelectedCourseId(result.data.courses[0].id);
        }
      }
    };
    if (open) {
      loadCourses();
    }
  }, [open]);

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

    const assignmentData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      instructions: formData.get('instructions') as string,
      dueDate: dueDateWithTime.toISOString(),
      maxPoints: parseInt(formData.get('maxPoints') as string, 10),
      courseId: selectedCourseId,
    };

    try {
      const result = await createAssignment(assignmentData);

      if (result.success && result.data) {
        toast.success('Assignment created successfully!');
        onAssignmentCreated(result.data);
        onClose();
        (e.target as HTMLFormElement).reset();
        setDueDate(undefined);
        setDueTime('23:59');
      } else {
        toast.error(result.error?.message || 'Failed to create assignment');
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
          <DialogTitle className="text-2xl">Create New Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for your course. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="courseId" className="text-base">
              Course *
            </Label>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Assignment Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Chapter 5 Problem Set"
              required
              disabled={isSubmitting}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Choose a clear, descriptive title for the assignment
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief overview of the assignment..."
              required
              disabled={isSubmitting}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Provide a brief summary of what students need to do
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-base">
              Detailed Instructions
            </Label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="Detailed instructions, requirements, and guidelines..."
              disabled={isSubmitting}
              rows={5}
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add detailed instructions, rubrics, or special requirements
            </p>
          </div>

          {/* Due Date and Time */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-base">
                Due Date *
              </Label>
              <DatePicker
                date={dueDate}
                onDateChange={setDueDate}
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
              placeholder="100"
              required
              disabled={isSubmitting}
              min="1"
              max="1000"
              defaultValue="100"
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
            <Button type="submit" disabled={isSubmitting || !selectedCourseId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Assignment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
