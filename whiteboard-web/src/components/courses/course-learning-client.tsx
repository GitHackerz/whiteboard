'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { updateResourceProgress } from '@/actions/modules';
import type { CourseModuleResponse, Course } from '@/actions/utils/types';
import { ResourceViewer } from './resource-viewer';
import { ModuleSidebar } from './module-sidebar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface CourseLearningClientProps {
  courseId: string;
  course: Course;
  initialModules: CourseModuleResponse[];
  userId: string;
}

// Extended resource type with completion tracking
interface ResourceWithProgress {
  id: string;
  title: string;
  type: string;
  url?: string;
  content?: string;
  isCompleted?: boolean;
}

export function CourseLearningClient({
  courseId,
  course,
  initialModules,
}: CourseLearningClientProps) {
  const [modules, setModules] = useState<CourseModuleResponse[]>(initialModules);
  
  // Initialize completed resources from database progress
  // Backend returns progress as an array, so we need to check the first element
  const [completedResources, setCompletedResources] = useState<Set<string>>(() => {
    const completed = initialModules.flatMap(m => 
      m.resources?.filter(r => {
        const progress = (r as any).progress;
        // Progress can be an array or a single object
        if (Array.isArray(progress)) {
          const isCompleted = progress.length > 0 && progress[0]?.isCompleted;
          if (isCompleted) {
            console.log(`✅ Loaded completed resource from DB: ${r.title} (${r.id})`);
          }
          return isCompleted;
        }
        const isCompleted = progress?.isCompleted;
        if (isCompleted) {
          console.log(`✅ Loaded completed resource from DB: ${r.title} (${r.id})`);
        }
        return isCompleted;
      }).map(r => r.id) || []
    );
    
    console.log(`📊 Total completed resources loaded from DB: ${completed.length}`);
    return new Set(completed);
  });
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    initialModules[0]?.id || null
  );
  const [selectedResourceIndex, setSelectedResourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Update completed resources when initialModules change (after page refresh)
  useEffect(() => {
    const completed = initialModules.flatMap(m => 
      m.resources?.filter(r => {
        const progress = (r as any).progress;
        if (Array.isArray(progress)) {
          return progress.length > 0 && progress[0]?.isCompleted;
        }
        return progress?.isCompleted;
      }).map(r => r.id) || []
    );
    
    setCompletedResources(new Set(completed));
    console.log(`🔄 Refreshed completed resources from DB: ${completed.length}`);
  }, [initialModules]);

  const currentModule = modules.find((m) => m.id === selectedModuleId);
  const resources = currentModule?.resources || [];
  const currentResource = resources[selectedResourceIndex];

  // Calculate progress based on completed resources
  const totalResources = useMemo(() => 
    modules.reduce((sum, m) => sum + (m.resources?.length || 0), 0),
    [modules]
  );
  
  const completedCount = useMemo(() => completedResources.size, [completedResources]);
  
  const overallProgress = totalResources > 0 ? (completedCount / totalResources) * 100 : 0;

  // Check if current resource is completed
  const isCurrentResourceCompleted = currentResource ? completedResources.has(currentResource.id) : false;

  // Handle resource completion
  const handleMarkComplete = useCallback(async () => {
    if (!currentResource) return;

    // Optimistically update UI immediately
    setCompletedResources(prev => new Set([...prev, currentResource.id]));
    setIsLoading(true);

    try {
      const result = await updateResourceProgress(
        currentResource.id,
        {
          isCompleted: true,
        }
      );

      if (result.success) {
        toast.success('Resource marked as complete! ✓', {
          description: 'Your progress has been saved.',
        });

        console.log('✅ Resource completion saved to database:', {
          resourceId: currentResource.id,
          resourceTitle: currentResource.title,
          timestamp: new Date().toISOString(),
        });

        // Update modules state to include the completion
        setModules(prevModules => 
          prevModules.map(module => {
            if (module.id === selectedModuleId) {
              return {
                ...module,
                resources: module.resources?.map(resource =>
                  resource.id === currentResource.id
                    ? { ...resource, isCompleted: true }
                    : resource
                ),
              };
            }
            return module;
          })
        );

        // Auto-move to next resource
        setTimeout(() => {
          if (selectedResourceIndex < resources.length - 1) {
            setSelectedResourceIndex(selectedResourceIndex + 1);
          } else if (
            modules.findIndex((m) => m.id === selectedModuleId) <
            modules.length - 1
          ) {
            const nextModuleIndex = modules.findIndex((m) => m.id === selectedModuleId) + 1;
            setSelectedModuleId(modules[nextModuleIndex].id);
            setSelectedResourceIndex(0);
          }
        }, 500);
      } else {
        // Revert optimistic update on failure
        setCompletedResources(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentResource.id);
          return newSet;
        });
        
        console.error('❌ Failed to save completion:', result.error);
        toast.error(result.error?.message || 'Failed to mark resource complete');
      }
    } catch (error) {
      // Revert optimistic update on error
      setCompletedResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentResource.id);
        return newSet;
      });
      
      console.error('❌ Error marking resource complete:', error);
      toast.error('Error marking resource complete');
    } finally {
      setIsLoading(false);
    }
  }, [currentResource, selectedResourceIndex, selectedModuleId, resources.length, modules]);

  // Navigate to previous resource
  const handlePrevious = () => {
    if (selectedResourceIndex > 0) {
      setSelectedResourceIndex(selectedResourceIndex - 1);
    } else if (
      modules.findIndex((m) => m.id === selectedModuleId) > 0
    ) {
      const prevModuleIndex = modules.findIndex((m) => m.id === selectedModuleId) - 1;
      const prevModule = modules[prevModuleIndex];
      setSelectedModuleId(prevModule.id);
      setSelectedResourceIndex((prevModule.resources?.length || 1) - 1);
    }
  };

  // Navigate to next resource
  const handleNext = () => {
    if (selectedResourceIndex < resources.length - 1) {
      setSelectedResourceIndex(selectedResourceIndex + 1);
    } else if (
      modules.findIndex((m) => m.id === selectedModuleId) <
      modules.length - 1
    ) {
      const nextModuleIndex = modules.findIndex((m) => m.id === selectedModuleId) + 1;
      setSelectedModuleId(modules[nextModuleIndex].id);
      setSelectedResourceIndex(0);
    }
  };

  if (!currentModule) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No modules available</h2>
          <p className="text-muted-foreground mb-4">
            This course doesn&apos;t have any learning modules yet.
          </p>
          <Link href={`/courses/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-sm text-muted-foreground">
                {currentModule.title}
              </p>
            </div>
            <Link href={`/courses/${courseId}`}>
              <Button variant="outline">Exit Course</Button>
            </Link>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Course Progress</span>
              <span className="text-muted-foreground">
                {Math.round(overallProgress)}% ({completedCount}/{totalResources})
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module Navigation */}
          <div className="lg:col-span-1">
            <ModuleSidebar
              modules={modules}
              selectedModuleId={selectedModuleId}
              selectedResourceIndex={selectedResourceIndex}
              completedResourceIds={completedResources}
              onModuleSelect={(moduleId: string) => {
                setSelectedModuleId(moduleId);
                setSelectedResourceIndex(0);
              }}
              onResourceSelect={(moduleId: string, resourceIndex: number) => {
                setSelectedModuleId(moduleId);
                setSelectedResourceIndex(resourceIndex);
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {currentResource && (
              <>
                {/* Resource Viewer */}
                <Card className="p-6">
                  <ResourceViewer resource={currentResource} />
                </Card>

                {/* Resource Info */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{currentResource.title}</h3>
                      {currentResource.description && (
                        <p className="text-sm text-muted-foreground">
                          {currentResource.description}
                        </p>
                      )}
                    </div>

                    {currentResource.type === 'VIDEO' && currentResource.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{currentResource.duration} minutes</span>
                      </div>
                    )}

                    {/* Completion Status */}
                    {isCurrentResourceCompleted ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Completed!</p>
                          <p className="text-xs text-green-700">This resource has been marked as complete</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Not yet completed</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={selectedResourceIndex === 0 && modules[0].id === selectedModuleId}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={handleMarkComplete}
                    disabled={isLoading || isCurrentResourceCompleted}
                    className="flex-1"
                    variant={isCurrentResourceCompleted ? "outline" : "default"}
                  >
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : isCurrentResourceCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={
                      selectedResourceIndex === resources.length - 1 &&
                      modules[modules.length - 1].id === selectedModuleId
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Navigation Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Resource {selectedResourceIndex + 1} of {resources.length} in{' '}
                    <span className="font-medium">{currentModule.title}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
