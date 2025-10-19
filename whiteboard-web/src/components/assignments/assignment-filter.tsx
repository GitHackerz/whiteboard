'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentList } from './assignment-list';
import { Badge } from '@/components/ui/badge';

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
  submissions?: Array<{
    id: string;
    status?: string;
    grade?: number | null;
    submittedAt?: string;
  }>;
}

interface AssignmentFilterProps {
  assignments: Assignment[];
}

export function AssignmentFilter({ assignments }: AssignmentFilterProps) {
  const [selectedTab, setSelectedTab] = useState('all');

  // Categorize assignments
  const now = new Date();
  
  const categorized = {
    all: assignments,
    pending: assignments.filter((a) => {
      const dueDate = new Date(a.dueDate);
      return dueDate >= now && (!a.submissions || a.submissions.length === 0);
    }),
    submitted: assignments.filter((a) => a.submissions && a.submissions.length > 0),
    overdue: assignments.filter((a) => {
      const dueDate = new Date(a.dueDate);
      return dueDate < now && (!a.submissions || a.submissions.length === 0);
    }),
    graded: assignments.filter((a) => {
      return (
        a.submissions &&
        a.submissions.length > 0 &&
        a.submissions[0].status === 'GRADED'
      );
    }),
  };

  const counts = {
    all: categorized.all.length,
    pending: categorized.pending.length,
    submitted: categorized.submitted.length,
    overdue: categorized.overdue.length,
    graded: categorized.graded.length,
  };

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all" className="relative">
          All
          {counts.all > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {counts.all}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="pending" className="relative">
          Pending
          {counts.pending > 0 && (
            <Badge variant="outline" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-amber-50 text-amber-700 border-amber-200">
              {counts.pending}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger value="submitted" className="relative">
          Submitted
          {counts.submitted > 0 && (
            <Badge variant="outline" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-50 text-blue-700 border-blue-200">
              {counts.submitted}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger value="overdue" className="relative">
          Overdue
          {counts.overdue > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {counts.overdue}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger value="graded" className="relative">
          Graded
          {counts.graded > 0 && (
            <Badge variant="outline" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-green-50 text-green-700 border-green-200">
              {counts.graded}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="all">
          <AssignmentList assignments={categorized.all as Parameters<typeof AssignmentList>[0]['assignments']} type="all" />
        </TabsContent>

        <TabsContent value="pending">
          <AssignmentList assignments={categorized.pending as Parameters<typeof AssignmentList>[0]['assignments']} type="upcoming" />
        </TabsContent>

        <TabsContent value="submitted">
          <AssignmentList assignments={categorized.submitted as Parameters<typeof AssignmentList>[0]['assignments']} type="submitted" />
        </TabsContent>

        <TabsContent value="overdue">
          <AssignmentList assignments={categorized.overdue as Parameters<typeof AssignmentList>[0]['assignments']} type="overdue" />
        </TabsContent>

        <TabsContent value="graded">
          <AssignmentList assignments={categorized.graded as Parameters<typeof AssignmentList>[0]['assignments']} type="all" />
        </TabsContent>
      </div>
    </Tabs>
  );
}
