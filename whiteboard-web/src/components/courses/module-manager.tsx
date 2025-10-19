'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
    getCourseModules,
    createModule,
    deleteModule,
    deleteResource,
} from '@/actions/modules';
import type {
    CourseModuleResponse,
    CreateModuleDto,
    ResourceType,
} from '@/actions/utils/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Video,
    FileText,
    Link as LinkIcon,
} from 'lucide-react';

interface ModuleManagerProps {
  courseId: string;
}

const RESOURCE_ICONS: Record<ResourceType, React.ReactNode> = {
  VIDEO: <Video className="h-4 w-4" />,
  DOCUMENT: <FileText className="h-4 w-4" />,
  READING: <BookOpen className="h-4 w-4" />,
  LINK: <LinkIcon className="h-4 w-4" />,
  QUIZ: <BookOpen className="h-4 w-4" />,
  ASSIGNMENT: <FileText className="h-4 w-4" />,
};

export function ModuleManager({ courseId }: ModuleManagerProps) {
  const [modules, setModules] = useState<CourseModuleResponse[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Load modules on mount
  const loadModules = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getCourseModules(courseId);
      if (result.success && result.data) {
        setModules(result.data);
      } else {
        toast.error(result.error?.message || 'Failed to load modules');
      }
    } catch (error) {
      console.error('Error loading modules:', error);
      toast.error('Error loading modules');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Create module handler
  const handleCreateModule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title.trim()) {
      toast.error('Please enter a module title');
      return;
    }

    try {
      const result = await createModule(
        courseId,
        {
          title,
          description,
          order: modules.length,
          isPublished: false,
        } as CreateModuleDto
      );

      if (result.success) {
        toast.success('Module created successfully');
        setIsCreateDialogOpen(false);
        await loadModules();
        e.currentTarget.reset();
      } else {
        toast.error(result.error?.message || 'Failed to create module');
      }
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Error creating module');
    }
  };

  // Update module handler
  // const handleUpdateModule = async (moduleId: string, data: Partial<CreateModuleDto>) => {
  //   try {
  //     const result = await updateModule(moduleId, data, session?.accessToken);
  //     if (result.success) {
  //       toast.success('Module updated successfully');
  //       await loadModules();
  //     } else {
  //       toast.error(result.error?.message || 'Failed to update module');
  //     }
  //   } catch (error) {
  //     console.error('Error updating module:', error);
  //     toast.error('Error updating module');
  //   }
  // };

  // Delete module handler
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const result = await deleteModule(moduleId);
      if (result.success) {
        toast.success('Module deleted successfully');
        await loadModules();
      } else {
        toast.error(result.error?.message || 'Failed to delete module');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Error deleting module');
    }
  };

  // Delete resource handler
  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const result = await deleteResource(resourceId);
      if (result.success) {
        toast.success('Resource deleted successfully');
        await loadModules();
      } else {
        toast.error(result.error?.message || 'Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Error deleting resource');
    }
  };

  if (isLoading && modules.length === 0) {
    return <div className="text-center py-8">Loading modules...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Content</h2>
          <p className="text-muted-foreground">Manage modules and learning resources</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  name="title"
                  placeholder="Module title"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  placeholder="Module description (optional)"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Module</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {modules.length === 0 ? (
          <Card className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No modules yet. Create one to get started.</p>
          </Card>
        ) : (
          modules.map((module) => (
            <Card key={module.id} className="p-4">
              <div className="space-y-4">
                {/* Module Header */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() =>
                          setExpandedModuleId(
                            expandedModuleId === module.id ? null : module.id
                          )
                        }
                        className="p-0 h-auto"
                      >
                        {expandedModuleId === module.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <h3 className="font-semibold">{module.title}</h3>
                      <Badge variant={module.isPublished ? 'default' : 'secondary'}>
                        {module.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {module.description && (
                      <p className="text-sm text-muted-foreground ml-6">{module.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteModule(module.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Resources */}
                {expandedModuleId === module.id && (
                  <div className="ml-6 pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Resources</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Open add resource dialog
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Resource
                      </Button>
                    </div>

                    {module.resources && module.resources.length > 0 ? (
                      <div className="space-y-2">
                        {module.resources.map((resource) => (
                          <div
                            key={resource.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {RESOURCE_ICONS[resource.type]}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{resource.title}</p>
                                {resource.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {resource.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // TODO: Open edit resource dialog
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteResource(resource.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">No resources yet</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Floating action to refresh */}
      <Button
        onClick={loadModules}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        {isLoading ? 'Loading...' : 'Refresh'}
      </Button>
    </div>
  );
}
