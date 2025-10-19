'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createAnnouncement } from '@/actions/announcements';
import { getCourses } from '@/actions/courses';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateAnnouncementDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (announcement: any) => void;
}

export function CreateAnnouncementDialog({ open, onClose, onSuccess }: CreateAnnouncementDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    courseId: '',
    isPinned: false,
  });

  useEffect(() => {
    async function loadCourses() {
      const result = await getCourses();
      if (result.success && result.data) {
        setCourses(result.data.courses || []);
      }
    }
    if (open) {
      void loadCourses();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.courseId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createAnnouncement({
        title: formData.title,
        content: formData.content,
        courseId: formData.courseId,
        isPinned: formData.isPinned,
      });

      if (result.success && result.data) {
        toast.success('Announcement created successfully!');
        onSuccess(result.data);
        setFormData({
          title: '',
          content: '',
          courseId: '',
          isPinned: false,
        });
      } else {
        toast.error(result.error?.message || 'Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('An error occurred while creating the announcement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => setFormData({ ...formData, courseId: value })}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter announcement content"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isPinned">Pin Announcement</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPinned" className="text-sm text-muted-foreground">
                Pin this announcement to the top
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
