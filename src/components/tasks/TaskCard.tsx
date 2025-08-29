'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  className?: string;
}

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  className 
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const priorityDots = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-blue-600' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: 'text-blue-600' };
    } else {
      return { text: dueDate.toLocaleDateString(), color: 'text-muted-foreground' };
    }
  };

  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        task.completed && "opacity-75",
        isOverdue && "border-red-200 bg-red-50/50",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1"
          />

          {/* Priority indicator */}
          <div 
            className={cn(
              "w-3 h-3 rounded-full mt-1.5 flex-shrink-0",
              priorityDots[task.priority]
            )}
          />

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium text-sm leading-5",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>

              {/* Action buttons - show on hover */}
              {isHovered && (
                <div className="flex items-center gap-1 opacity-0 animate-in fade-in-0 duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onEdit(task)}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    onClick={() => onDelete(task.id)}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className={cn(
                "text-xs text-muted-foreground mt-1 line-clamp-2",
                task.completed && "line-through"
              )}>
                {task.description}
              </p>
            )}

            {/* Footer with badges and due date */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {/* Priority badge */}
                <Badge 
                  variant="outline" 
                  className={cn("text-xs px-2 py-0.5", priorityColors[task.priority])}
                >
                  {task.priority}
                </Badge>

                {/* Category indicator */}
                <div className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: task.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {task.category}
                  </span>
                </div>
              </div>

              {/* Due date */}
              {dueDateInfo && (
                <span className={cn("text-xs font-medium", dueDateInfo.color)}>
                  {dueDateInfo.text}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}