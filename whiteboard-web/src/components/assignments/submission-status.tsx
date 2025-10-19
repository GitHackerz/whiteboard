'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Award } from 'lucide-react';

interface SubmissionStatusProps {
  submitted?: boolean;
  submittedAt?: string;
  grade?: number | null;
  maxPoints: number;
  feedback?: string | null;
  status?: 'PENDING' | 'SUBMITTED' | 'GRADED';
  dueDate: string;
}

export function SubmissionStatus({
  submitted,
  submittedAt,
  grade,
  maxPoints,
  feedback,
  status = 'PENDING',
  dueDate,
}: SubmissionStatusProps) {
  const isOverdue = new Date(dueDate) < new Date();
  const percentage = grade !== null && grade !== undefined ? (grade / maxPoints) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        {status === 'GRADED' ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-600">Graded</span>
          </>
        ) : status === 'SUBMITTED' ? (
          <>
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-600">Awaiting Grading</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="font-medium text-amber-600">Not Submitted</span>
          </>
        )}
      </div>

      {/* Submission Details */}
      {submitted && submittedAt && (
        <Card className="p-4 bg-muted/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Submitted:</span>
              <span className="font-medium">
                {new Date(submittedAt).toLocaleDateString()} at{' '}
                {new Date(submittedAt).toLocaleTimeString()}
              </span>
            </div>

            {isOverdue && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  Late Submission
                </Badge>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Grade Display */}
      {grade !== null && grade !== undefined && (
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">Your Grade</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {grade}/{maxPoints}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Grade Progress Bar */}
            <Progress value={percentage} className="h-2" />

            {/* Grade Interpretation */}
            <div className="text-sm text-green-700 dark:text-green-300">
              {percentage >= 90 && '🌟 Excellent work!'}
              {percentage >= 80 && percentage < 90 && '✓ Great job!'}
              {percentage >= 70 && percentage < 80 && 'Good effort'}
              {percentage >= 60 && percentage < 70 && 'Satisfactory'}
              {percentage < 60 && 'Needs improvement'}
            </div>
          </div>
        </Card>
      )}

      {/* Feedback */}
      {feedback && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Instructor Feedback</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
              {feedback}
            </p>
          </div>
        </Card>
      )}

      {/* Pending Status Message */}
      {!submitted && (
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="text-sm text-amber-900 dark:text-amber-100">
            <p className="font-medium mb-1">This assignment has not been submitted yet.</p>
            <p>Submit your work before the due date to avoid late penalties.</p>
          </div>
        </Card>
      )}

      {submitted && status === 'SUBMITTED' && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-1">Your submission has been received.</p>
            <p>The instructor will review and grade your work soon.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
