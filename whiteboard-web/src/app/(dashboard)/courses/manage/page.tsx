import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/auth-options";
import { getCourses } from "@/actions/courses";
import { CourseManagementClient } from "@/components/courses/course-management-client";

export default async function ManageCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/signin");
  }

  // Check if user is teacher or admin
  const userRole = session.user?.role?.toLowerCase();
  if (userRole !== "instructor" && userRole !== "admin") {
    redirect("/courses");
  }

  // Get all courses
  const coursesResult = await getCourses();
  
  // Extract courses array from the nested response structure
  const courses = coursesResult.success && coursesResult.data 
    ? (coursesResult.data.courses || coursesResult.data.data || [])
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your courses
          </p>
        </div>
      </div>

      <CourseManagementClient initialCourses={courses} />
    </div>
  );
}
