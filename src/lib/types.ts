// Core data types for the calendar and planner app

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  category: string;
  color: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  completed: boolean;
  category: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: CategoryType;
  createdAt: Date;
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every X days/weeks/months/years
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6, for weekly patterns
  dayOfMonth?: number; // for monthly patterns
}

export type Priority = 'low' | 'medium' | 'high';
export type CategoryType = 'event' | 'task' | 'both';
export type ViewType = 'month' | 'week' | 'day';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultView: ViewType;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  timeFormat: '12h' | '24h';
  defaultEventDuration: number; // in minutes
  showWeekends: boolean;
}

export interface CalendarViewProps {
  currentDate: Date;
  view: ViewType;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onViewChange: (view: ViewType) => void;
}

// Default colors for categories
export const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#ec4899', // pink
  '#6b7280'  // gray
];

// Default categories
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Work', color: '#3b82f6', type: 'both' },
  { name: 'Personal', color: '#10b981', type: 'both' },
  { name: 'Health', color: '#ef4444', type: 'both' },
  { name: 'Education', color: '#8b5cf6', type: 'both' },
  { name: 'Social', color: '#f59e0b', type: 'event' },
  { name: 'Shopping', color: '#06b6d4', type: 'task' },
];