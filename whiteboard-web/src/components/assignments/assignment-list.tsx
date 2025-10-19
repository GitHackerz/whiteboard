'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarDays, FileText, CheckCircle2 } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  course: {
    id: string;
    code: string;
    title: string;
  };
  submissions: Array<{
    id: string;
    status: string;
    grade: number | null;
    submittedAt: string;
  }>;
}

interface AssignmentListProps {
  assignments: Assignment[];
  type: 'upcoming' | 'submitted' | 'overdue' | 'all';
}

export function AssignmentList({ assignments, type }: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <EmptyState
        title={`No ${type} assignments`}
        description={
          type === 'upcoming'
            ? 'You have no upcoming assignments at the moment.'
            : type === 'submitted'
              ? 'You have not submitted any assignments yet.'
              : type === 'overdue'
                ? 'You have no overdue assignments.'
                : 'No assignments found.'
        }
        icon={<FileText size={64} />}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {assignments.map((assignment) => {
        const submission = assignment.submissions?.[0];
        const isOverdue = new Date(assignment.dueDate) < new Date();
        const daysUntilDue = Math.ceil(
          (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          <Card key={assignment.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{assignment.title}</h3>
                  {submission ? (
                    <Badge variant={submission.status === 'GRADED' ? 'default' : 'secondary'}>
                      {submission.status}
                    </Badge>
                  ) : isOverdue ? (
                    <Badge variant="destructive">Overdue</Badge>
                  ) : (
                    <Badge variant="outline">Not Submitted</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {assignment.course.code} - {assignment.course.title}
                </p>
                <p className="text-muted-foreground line-clamp-2">{assignment.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  {!isOverdue && daysUntilDue > 0 && daysUntilDue <= 7 && (
                    <Badge variant="outline" className="ml-2">
                      {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{assignment.maxPoints} points</span>
                </div>
                {submission && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>
                      Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <Link href={`/assignments/${assignment.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>

            {submission?.grade !== null && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Grade:</span>
                  <span className="text-lg font-semibold text-green-600">
                    {submission.grade}/{assignment.maxPoints}
                  </span>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
