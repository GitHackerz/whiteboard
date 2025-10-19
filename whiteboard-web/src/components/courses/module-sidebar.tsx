'use client';

import type { CourseModuleResponse } from '@/actions/utils/types';
import { Card } from '@/components/ui/card';
import { CheckCircle2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleSidebarProps {
  modules: CourseModuleResponse[];
  selectedModuleId: string | null;
  selectedResourceIndex: number;
  onModuleSelect: (moduleId: string) => void;
  onResourceSelect: (moduleId: string, resourceIndex: number) => void;
  completedResourceIds?: Set<string>;
}

export function ModuleSidebar({
  modules,
  selectedModuleId,
  selectedResourceIndex,
  onModuleSelect,
  onResourceSelect,
  completedResourceIds = new Set(),
}: ModuleSidebarProps) {
  return (
    <Card className="p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Course Content
      </h3>

      <div className="space-y-3">
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="space-y-2">
            {/* Module Header */}
            <button
              onClick={() => onModuleSelect(module.id)}
              className={cn(
                'w-full text-left p-2 rounded-lg text-sm font-medium transition-colors',
                selectedModuleId === module.id
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100'
                  : 'hover:bg-muted'
              )}
            >
              <div className="flex items-center justify-between">
                <span>Module {moduleIndex + 1}: {module.title}</span>
                {module.progress?.isCompleted && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
            </button>

            {/* Resources */}
            {selectedModuleId === module.id && module.resources && (
              <div className="ml-2 space-y-1">
                {module.resources.map((resource, resourceIndex) => {
                  const isCompleted = completedResourceIds.has(resource.id);
                  const isSelected = selectedResourceIndex === resourceIndex;
                  
                  return (
                    <button
                      key={resource.id}
                      onClick={() => onResourceSelect(module.id, resourceIndex)}
                      className={cn(
                        'w-full text-left p-2 rounded text-xs transition-colors',
                        isSelected
                          ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100'
                          : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                        )}
                        <span className={cn(
                          "truncate",
                          isCompleted && "line-through opacity-75"
                        )}>
                          {resource.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
