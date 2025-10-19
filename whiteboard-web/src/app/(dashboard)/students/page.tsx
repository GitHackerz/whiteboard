import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/auth-options";
import { getUsers } from "@/actions/users";
import { StudentsManagementClient } from "@/components/students/students-management-client";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/signin");
  }

  const usersResult = await getUsers({});
  const usersData = usersResult.success && usersResult.data ? usersResult.data : null;
  const users = usersData?.data || [];

  const userRole = session.user?.role?.toLowerCase();
  const isAdminOrTeacher = userRole === "admin" || userRole === "instructor";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          {isAdminOrTeacher
            ? "Manage and view student information"
            : "View your classmates"}
        </p>
      </div>

      <StudentsManagementClient 
        initialUsers={users} 
        isAdminOrTeacher={isAdminOrTeacher}
      />
    </div>
  );
}
