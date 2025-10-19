import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth-options';
import { redirect, notFound } from 'next/navigation';
import { getCourseById } from '@/actions/courses';
import { ModuleManager } from '@/components/courses/module-manager';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function CourseManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  const courseId = (await params).id;
  const courseResult = await getCourseById(courseId);

  if (!courseResult.success || !courseResult.data) {
    return notFound();
  }

  const course = courseResult.data;

  // Check if user is the instructor
  if (course.instructor?.id !== session.user?.id) {
    redirect(`/courses/${courseId}`);
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/courses/${courseId}`}>
          <Button variant="outline" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Course
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Manage course content and modules</p>
        </div>
      </div>

      {/* Module Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ModuleManager courseId={courseId} />
        </div>

        {/* Sidebar - Course Stats */}
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Course Stats</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="text-lg font-medium">{course.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrolled</p>
                <p className="text-lg font-medium">{course.enrollmentCount || 0} students</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-lg font-medium">
                  {new Date(course.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="text-lg font-medium">
                  {new Date(course.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={`/courses/${courseId}/assignments`}>
                <Button variant="outline" className="w-full justify-start">
                  View Assignments
                </Button>
              </Link>
              <Link href={`/courses/${courseId}`}>
                <Button variant="outline" className="w-full justify-start">
                  View as Student
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
