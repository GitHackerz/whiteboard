'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { enrollInCourse } from '@/actions/courses';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface CourseEnrollButtonProps {
  courseId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function CourseEnrollButton({ 
  courseId, 
  variant = 'default',
  size = 'default',
  className 
}: CourseEnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const result = await enrollInCourse(courseId);
      
      if (result.success) {
        toast.success('Successfully enrolled in course!', {
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
        router.refresh();
      } else {
        toast.error(result.error?.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('An error occurred while enrolling');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={isEnrolling}
      variant={variant}
      size={size}
      className={className}
    >
      {isEnrolling ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Enrolling...
        </>
      ) : (
        'Enroll in Course'
      )}
    </Button>
  );
}
