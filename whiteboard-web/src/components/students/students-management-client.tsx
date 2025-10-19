'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Mail, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '@/actions/utils/types';
import { Badge } from '@/components/ui/badge';
import { CreateUserDialog } from './create-user-dialog';
import { EditUserDialog } from './edit-user-dialog';
import { deleteUser } from '@/actions/users';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface StudentsManagementClientProps {
  initialUsers: User[];
  isAdminOrTeacher: boolean;
}

export function StudentsManagementClient({ 
  initialUsers, 
  isAdminOrTeacher 
}: StudentsManagementClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setDeletingId(userId);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully!');
      } else {
        toast.error(result.error?.message || 'Failed to delete user');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUserCreated = (newUser: User) => {
    setUsers([newUser, ...users]);
    setShowCreateDialog(false);
    router.refresh();
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
    router.refresh();
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
      INSTRUCTOR: 'bg-blue-100 text-blue-800 border-blue-200',
      STUDENT: 'bg-green-100 text-green-800 border-green-200',
    };
    
    const roleLabels: Record<string, string> = {
      ADMIN: 'Admin',
      INSTRUCTOR: 'Teacher',
      STUDENT: 'Student',
    };

    return (
      <Badge className={`${roleColors[role] || roleColors.STUDENT} border`}>
        {roleLabels[role] || role}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {isAdminOrTeacher && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <UserCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">
                {searchTerm ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : isAdminOrTeacher 
                    ? 'Get started by adding your first user' 
                    : 'No students to display'}
              </p>
              {isAdminOrTeacher && !searchTerm && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.firstName} {user.lastName}
                          </h3>
                          {getRoleBadge(user.role)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      {user.bio && (
                        <p className="text-muted-foreground line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>

                    {isAdminOrTeacher && session?.user?.id !== user.id && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === user.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {isAdminOrTeacher && (
        <>
          <CreateUserDialog
            open={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onUserCreated={handleUserCreated}
          />

          {editingUser && (
            <EditUserDialog
              user={editingUser}
              open={!!editingUser}
              onClose={() => setEditingUser(null)}
              onUserUpdated={handleUserUpdated}
            />
          )}
        </>
      )}
    </div>
  );
}
