'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateAnnouncement } from '@/actions/announcements';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  course: {
    id: string;
    title: string;
    code: string;
  };
}

interface EditAnnouncementDialogProps {
  open: boolean;
  announcement: Announcement;
  onClose: () => void;
  onSuccess: (announcement: any) => void;
}

export function EditAnnouncementDialog({ open, announcement, onClose, onSuccess }: EditAnnouncementDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: announcement.title,
    content: announcement.content,
    isPinned: announcement.isPinned,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateAnnouncement(announcement.id, {
        title: formData.title,
        content: formData.content,
        isPinned: formData.isPinned,
      });

      if (result.success && result.data) {
        toast.success('Announcement updated successfully!');
        onSuccess(result.data);
      } else {
        toast.error(result.error?.message || 'Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('An error occurred while updating the announcement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Course</Label>
            <Input
              value={`${announcement.course.code} - ${announcement.course.title}`}
              disabled
              className="bg-muted"
            />
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
              Update Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
