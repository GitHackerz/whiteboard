'use client';

import type { ModuleResource } from '@/actions/utils/types';

interface ResourceViewerProps {
  resource: ModuleResource;
}

export function ResourceViewer({ resource }: ResourceViewerProps) {
  return (
    <div className="space-y-4">
      {resource.type === 'VIDEO' && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={resource.content}
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {resource.type === 'DOCUMENT' && (
        <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">Document: {resource.title}</p>
          <a
            href={resource.content}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Open Document
          </a>
        </div>
      )}

      {resource.type === 'READING' && (
        <div className="prose dark:prose-invert max-w-none p-6 bg-muted/30 rounded-lg">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {resource.content}
          </div>
        </div>
      )}

      {resource.type === 'LINK' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-muted-foreground mb-2">External Link:</p>
          <a
            href={resource.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline truncate"
          >
            {resource.content}
          </a>
        </div>
      )}

      {resource.type === 'QUIZ' && (
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="font-medium text-orange-900 dark:text-orange-100">
            This is a quiz resource
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Quiz content and functionality would be implemented here
          </p>
        </div>
      )}

      {resource.type === 'ASSIGNMENT' && (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <p className="font-medium text-green-900 dark:text-green-100">
            Assignment
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Assignment submission form would be displayed here
          </p>
        </div>
      )}
    </div>
  );
}
