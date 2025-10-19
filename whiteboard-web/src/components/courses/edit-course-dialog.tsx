'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Loader2 } from 'lucide-react';
import { updateCourse } from '@/actions/courses';
import { Course } from '@/actions/utils/types';
import { toast } from 'sonner';

interface EditCourseDialogProps {
  course: Course;
  open: boolean;
  onClose: () => void;
  onCourseUpdated: (course: Course) => void;
}

export function EditCourseDialog({ course, open, onClose, onCourseUpdated }: EditCourseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    course.startDate ? new Date(course.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    course.endDate ? new Date(course.endDate) : undefined
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const courseData: any = {};
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const schedule = formData.get('schedule') as string;
    const location = formData.get('location') as string;
    const maxEnrollment = formData.get('maxEnrollment') as string;

    if (title) courseData.title = title;
    if (description) courseData.description = description;
    if (schedule) courseData.schedule = schedule;
    if (location) courseData.location = location;
    if (maxEnrollment) courseData.maxEnrollment = parseInt(maxEnrollment);
    if (startDate) courseData.startDate = startDate.toISOString();
    if (endDate) courseData.endDate = endDate.toISOString();

    try {
      const result = await updateCourse(course.id, courseData);
      
      if (result.success && result.data) {
        toast.success('Course updated successfully!');
        onCourseUpdated(result.data);
        onClose();
      } else {
        toast.error(result.error?.message || 'Failed to update course');
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
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={course.code}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEnrollment">Max Enrollment</Label>
              <Input
                id="maxEnrollment"
                name="maxEnrollment"
                type="number"
                defaultValue={course.maxEnrollment}
                min="1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={course.title}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={course.description}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                name="schedule"
                defaultValue={course.schedule || ''}
                placeholder="Mon, Wed, Fri 10:00-11:30"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={course.location || ''}
                placeholder="Room 101"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
                placeholder="Pick start date"
                disabled={isSubmitting}
                disabledDates={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                date={endDate}
                onDateChange={setEndDate}
                placeholder="Pick end date"
                disabled={isSubmitting}
                disabledDates={(date) =>
                  startDate
                    ? date < startDate
                    : date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
