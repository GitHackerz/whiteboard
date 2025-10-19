'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUser } from '@/actions/users';
import { User, Role } from '@/actions/utils/types';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

export function CreateUserDialog({ open, onClose, onUserCreated }: CreateUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.STUDENT);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const userData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      role: selectedRole,
    };

    try {
      const result = await createUser(userData);
      
      if (result.success && result.data) {
        toast.success('User created successfully!');
        onUserCreated(result.data);
        (e.target as HTMLFormElement).reset();
        setSelectedRole(Role.STUDENT);
        onClose();
      } else {
        toast.error(result.error?.message || 'Failed to create user');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            Add New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-base flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                disabled={isSubmitting}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-base flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                disabled={isSubmitting}
                className="text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              required
              disabled={isSubmitting}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              This will be used for login credentials
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password *
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter secure password"
              required
              minLength={8}
              disabled={isSubmitting}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters required
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-base">
              User Role *
            </Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as Role)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full text-base">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.STUDENT}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Student</span>
                    <span className="text-xs text-muted-foreground">- Can enroll in courses</span>
                  </div>
                </SelectItem>
                <SelectItem value={Role.INSTRUCTOR}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Teacher</span>
                    <span className="text-xs text-muted-foreground">- Can manage courses</span>
                  </div>
                </SelectItem>
                <SelectItem value={Role.ADMIN}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Admin</span>
                    <span className="text-xs text-muted-foreground">- Full system access</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating User...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
