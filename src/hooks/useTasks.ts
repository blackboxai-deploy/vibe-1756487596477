'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, Priority } from '@/lib/types';
import { taskStorage, generateId } from '@/lib/storage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from storage on mount
  useEffect(() => {
    try {
      const storedTasks = taskStorage.getAll();
      setTasks(storedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new task
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      taskStorage.add(newTask);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }, []);

  // Update existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = taskStorage.update(taskId, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
        return updatedTask;
      }
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }, []);

  // Remove task
  const removeTask = useCallback((taskId: string) => {
    try {
      const success = taskStorage.remove(taskId);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
      return success;
    } catch (error) {
      console.error('Error removing task:', error);
      throw error;
    }
  }, []);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      return updateTask(taskId, { completed: !task.completed });
    }
    return null;
  }, [tasks, updateTask]);

  // Get tasks by completion status
  const getTasksByStatus = useCallback((completed: boolean) => {
    return tasks.filter(task => task.completed === completed);
  }, [tasks]);

  // Get tasks by priority
  const getTasksByPriority = useCallback((priority: Priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  // Get tasks by category
  const getTasksByCategory = useCallback((categoryId: string) => {
    return tasks.filter(task => task.category === categoryId);
  }, [tasks]);

  // Get tasks due today
  const getTasksDueToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  }, [tasks]);

  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < now;
    });
  }, [tasks]);

  // Get upcoming tasks (next 7 days)
  const getUpcomingTasks = useCallback(() => {
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    
    return tasks
      .filter(task => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= oneWeekFromNow;
      })
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [tasks]);

  // Search tasks
  const searchTasks = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      (task.description && task.description.toLowerCase().includes(lowerQuery))
    );
  }, [tasks]);

  // Get tasks statistics
  const getTaskStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = getOverdueTasks().length;
    const dueToday = getTasksDueToday().length;

    return {
      total,
      completed,
      pending,
      overdue,
      dueToday,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks, getOverdueTasks, getTasksDueToday]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    removeTask,
    toggleTaskCompletion,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByCategory,
    getTasksDueToday,
    getOverdueTasks,
    getUpcomingTasks,
    searchTasks,
    getTaskStats,
  };
}