'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { CreateAssignmentDialog } from './create-assignment-dialog';
import { EditAssignmentDialog } from './edit-assignment-dialog';
import { deleteAssignment } from '@/actions/assignments';
import { format } from 'date-fns';
import {
    BookOpen,
    Calendar,
    Users,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Plus,
    Eye,
} from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  schedule?: string | null;
  location?: string | null;
  maxEnrollment: number;
  enrollmentCount?: number;
  startDate: string;
  endDate: string;
  _count?: {
    enrollments: number;
  };
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
  maxPoints: number;
  courseId: string;
  _count?: {
    submissions: number;
  };
}

interface CourseDetailsClientProps {
  course: Course;
  assignments: Assignment[];
}

export default function CourseDetailsClient({
  course,
  assignments: initialAssignments,
}: CourseDetailsClientProps) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateSuccess = (newAssignment: Assignment) => {
    setAssignments([...assignments, newAssignment]);
    setIsCreateDialogOpen(false);
    router.refresh();
  };

  const handleEditSuccess = (updatedAssignment: Assignment) => {
    setAssignments(
      assignments.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
    setIsEditDialogOpen(false);
    setSelectedAssignment(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!selectedAssignment) return;

    setIsDeleting(true);
    try {
      const result = await deleteAssignment(selectedAssignment.id);

      if (result.success) {
        setAssignments(assignments.filter((a) => a.id !== selectedAssignment.id));
        setIsDeleteDialogOpen(false);
        setSelectedAssignment(null);
        router.refresh();
      } else {
        console.error('Failed to delete assignment:', result.error?.message);
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewSubmissions = (assignmentId: string) => {
    router.push(`/assignments/${assignmentId}/submissions`);
  };

  const getAssignmentStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return { label: 'Overdue', variant: 'destructive' as const, icon: XCircle };
    } else if (diffHours < 24) {
      return { label: 'Due Soon', variant: 'default' as const, icon: Clock };
    } else {
      return { label: 'Active', variant: 'secondary' as const, icon: CheckCircle };
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">
              <BookOpen className="w-3 h-3 mr-1" />
              {course.code}
            </Badge>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course._count?.enrollments || course.enrollmentCount || 0} Students
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {assignments.length} Assignments
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">
            Assignments ({assignments.length})
          </TabsTrigger>
          <TabsTrigger value="students">
            Students ({course._count?.enrollments || course.enrollmentCount || 0})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{course._count?.enrollments || course.enrollmentCount || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Max Students</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{course.maxEnrollment}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    assignments.filter(
                      (a) => new Date(a.dueDate) > new Date()
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Detailed information about this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course Code</p>
                  <p className="text-lg">{course.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Max Enrollment</p>
                  <p className="text-lg">{course.maxEnrollment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instructor</p>
                  <p className="text-lg">{course.instructor.firstName} {course.instructor.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{course.instructor.email}</p>
                </div>
                {course.schedule && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Schedule</p>
                    <p className="text-lg">{course.schedule}</p>
                  </div>
                )}
                {course.location && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-lg">{course.location}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">{course.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>
                      Manage assignments for this course
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first assignment to get started
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Max Points</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => {
                        const status = getAssignmentStatus(assignment.dueDate);
                        const StatusIcon = status.icon;
                        
                        return (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">
                              {assignment.title}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {format(new Date(assignment.dueDate), 'MMM dd, yyyy HH:mm')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {assignment._count?.submissions || 0}
                            </TableCell>
                            <TableCell>{assignment.maxPoints}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewSubmissions(assignment.id)}
                                  title="View Submissions"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setIsEditDialogOpen(true);
                                  }}
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>
                  {course._count?.enrollments || course.enrollmentCount || 0} students enrolled in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Student Management</h3>
                  <p className="text-muted-foreground">
                    Student list and management features coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Manage course configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Course Settings</h3>
                  <p className="text-muted-foreground">
                    Course settings and configuration options coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateAssignmentDialog
        courseId={course.id}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedAssignment && (
        <>
          <EditAssignmentDialog
            assignment={selectedAssignment}
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedAssignment(null);
            }}
            onSuccess={handleEditSuccess}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{selectedAssignment.title}&quot;? This action
                  cannot be undone and will also delete all student submissions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
