"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { motion } from "framer-motion";
import { Enrollment } from "@/actions/utils/types";
import Link from "next/link";

interface RecentCoursesProps {
  enrollments?: Enrollment[];
}

export function RecentCourses({ enrollments = [] }: RecentCoursesProps) {
  // Sort by most recent and take top 3
  const recentEnrollments = enrollments
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Courses</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/courses">
            View All
            <span className="ml-2 text-lg">→</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentEnrollments.length === 0 ? (
          <EmptyState
            title="No courses yet"
            description="Enroll in courses to see them here"
            icon="📚"
          />
        ) : (
          recentEnrollments.map((enrollment, index) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">
                    {enrollment.course?.title || 'Course'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {enrollment.course?.code || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{enrollment.progress || 0}%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={enrollment.progress || 0} className="h-2" />
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
