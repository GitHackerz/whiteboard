import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/auth-options";
import { getCourseById } from "@/actions/courses";
import { getAssignments } from "@/actions/assignments";
import CourseDetailsClient from "@/components/courses/course-details-client";

interface CourseDetailsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/signin");
  }

  // Check if user is teacher or admin
  const userRole = session.user?.role?.toLowerCase();
  if (userRole !== "instructor" && userRole !== "admin") {
    redirect("/courses");
  }

  // Get course details
  const courseResult = await getCourseById(courseId);
  
  if (!courseResult.success || !courseResult.data) {
    redirect("/courses/manage");
  }

  const course = courseResult.data;

  // Check if user is the instructor of this course (or admin)
  if (userRole !== "admin" && course.instructor.id !== session.user.id) {
    redirect("/courses/manage");
  }

  // Get assignments for this course
  const assignmentsResult = await getAssignments(courseId);
  const assignments = assignmentsResult.success && assignmentsResult.data 
    ? assignmentsResult.data 
    : [];

  return (
    <CourseDetailsClient 
      course={course} 
      assignments={assignments}
    />
  );
}
