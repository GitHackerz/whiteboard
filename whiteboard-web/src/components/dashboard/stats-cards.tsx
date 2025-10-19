"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Enrollment } from "@/actions/utils/types";

interface StatsCardsProps {
  enrollments?: Enrollment[];
  assignments?: any[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatsCards({ enrollments = [], assignments = [] }: StatsCardsProps) {
  // Calculate stats from real data
  const activeCourses = enrollments.length;
  const averageProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;
  const averageGrade = enrollments.length > 0 && enrollments.some(e => e.grade)
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.grade || 0), 0) / enrollments.filter(e => e.grade).length)
    : null;

  // Assignment stats
  const totalAssignments = assignments.length;
  const now = new Date();
  const dueThisWeek = assignments.filter((a: any) => {
    const dueDate = new Date(a.dueDate);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= now && dueDate <= weekFromNow && a.submissions.length === 0;
  }).length;

  const stats = [
    {
      title: "Active Courses",
      value: activeCourses.toString(),
      change: enrollments.length > 0 ? "Currently enrolled" : "No courses yet",
      icon: "📚",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Assignments",
      value: totalAssignments.toString(),
      change: dueThisWeek > 0 ? `${dueThisWeek} due this week` : "All caught up!",
      icon: "📝",
      bgColor: "bg-purple-500/10",
    },
    {
      title: averageGrade !== null ? "Average Grade" : "Progress",
      value: averageGrade !== null ? `${averageGrade}%` : `${averageProgress}%`,
      change: averageGrade !== null ? "Across all courses" : "Average completion",
      icon: "🏆",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Completion",
      value: `${assignments.filter((a: any) => a.submissions.length > 0).length}/${totalAssignments}`,
      change: "Assignments done",
      icon: "📈",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        return (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor} flex-shrink-0 text-xl sm:text-2xl`}
                >
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
