'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Megaphone, Pin } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateAnnouncementDialog } from './create-announcement-dialog';
import { EditAnnouncementDialog } from './edit-announcement-dialog';
import { deleteAnnouncement } from '@/actions/announcements';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  course: {
    id: string;
    title: string;
    code: string;
  };
}

interface AnnouncementsClientProps {
  initialAnnouncements: Announcement[];
  userRole: string;
}

export function AnnouncementsClient({ initialAnnouncements, userRole }: AnnouncementsClientProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const isInstructor = userRole === 'INSTRUCTOR' || userRole === 'ADMIN';

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    setDeletingId(announcementId);
    try {
      const result = await deleteAnnouncement(announcementId);
      if (result.success) {
        setAnnouncements(announcements.filter(a => a.id !== announcementId));
        toast.success('Announcement deleted successfully!');
      } else {
        toast.error(result.error?.message || 'Failed to delete announcement');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleAnnouncementCreated = (newAnnouncement: Announcement) => {
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowCreateDialog(false);
    router.refresh();
  };

  const handleAnnouncementUpdated = (updatedAnnouncement: Announcement) => {
    setAnnouncements(announcements.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a));
    setEditingAnnouncement(null);
    router.refresh();
  };

  const getPriorityBadge = (isPinned: boolean) => {
    if (isPinned) {
      return <Badge variant="default" className="gap-1 bg-blue-500"><Pin className="h-3 w-3" />Pinned</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Search and Create Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isInstructor && (
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Announcement
          </Button>
        )}
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">
                {searchQuery ? 'No announcements found' : 'No announcements yet'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery 
                  ? 'Try adjusting your search' 
                  : isInstructor 
                    ? 'Create your first announcement to notify students'
                    : 'Check back later for updates'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getPriorityBadge(announcement.isPinned)}
                        <Badge variant="secondary" className="text-xs">
                          {announcement.course.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(announcement.createdAt), 'PPP')}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {announcement.course.title}
                      </CardDescription>
                    </div>

                    {isInstructor && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAnnouncement(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
                          disabled={deletingId === announcement.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      {showCreateDialog && (
        <CreateAnnouncementDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleAnnouncementCreated}
        />
      )}

      {editingAnnouncement && (
        <EditAnnouncementDialog
          open={!!editingAnnouncement}
          announcement={editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
          onSuccess={handleAnnouncementUpdated}
        />
      )}
    </div>
  );
}
