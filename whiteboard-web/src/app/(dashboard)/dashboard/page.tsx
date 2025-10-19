import { RecentAssignments } from "@/components/dashboard/recent-assignments";
import { RecentCourses } from "@/components/dashboard/recent-courses";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { getCurrentUser } from "@/actions/auth";
import { getMyEnrollments } from "@/actions/courses";
import { getAssignments } from "@/actions/assignments";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-options";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    redirect('/sign-out');
  }

  const userResult = await getCurrentUser();
  
  if (!userResult.success || !userResult.data) {
    redirect('/sign-out');
  }

  const user = userResult.data;

  const [enrollmentsResult, assignmentsResult] = await Promise.all([
    getMyEnrollments(),
    getAssignments(),
  ]);

  console.log(enrollmentsResult);
  

  const enrollments = enrollmentsResult.success ? enrollmentsResult.data : [];
  const assignments = assignmentsResult.success ? assignmentsResult.data.assignments || [] : [];

  return (
    <div className="space-y-6">
      <WelcomeBanner user={user} />
      <StatsCards enrollments={enrollments} assignments={assignments} />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCourses enrollments={enrollments} />
        <RecentAssignments assignments={assignments} />
      </div>
      <UpcomingEvents />
    </div>
  );
}
