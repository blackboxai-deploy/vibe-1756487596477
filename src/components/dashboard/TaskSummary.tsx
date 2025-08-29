'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';

export function TaskSummary() {
  const { getTaskStats, getTasksDueToday, getOverdueTasks } = useTasks();
  const stats = getTaskStats();
  const tasksDueToday = getTasksDueToday();
  const overdueTasks = getOverdueTasks();

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.completed} completed</span>
            <span>{stats.total} total</span>
          </div>
        </div>

        {/* Due Today */}
        {tasksDueToday.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Due Today</h4>
              <Badge variant="outline">{tasksDueToday.length}</Badge>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tasksDueToday.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start gap-2 p-2 rounded border">
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                      priorityColors[task.priority]
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {tasksDueToday.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{tasksDueToday.length - 3} more tasks
                </p>
              )}
            </div>
          </div>
        )}

        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-red-600">Overdue</h4>
              <Badge variant="destructive">{overdueTasks.length}</Badge>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {overdueTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start gap-2 p-2 rounded border border-red-200">
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                      priorityColors[task.priority]
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-red-700">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-red-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {overdueTasks.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{overdueTasks.length - 3} more overdue
                </p>
              )}
            </div>
          </div>
        )}

        {/* No tasks message */}
        {stats.total === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <p className="text-xs text-muted-foreground">Create your first task to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}