// Date utility functions for calendar operations
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, 
         addDays, addWeeks, addMonths, addYears, isSameDay, isSameMonth, isToday,
         startOfDay, endOfDay, parseISO } from 'date-fns';

// Get calendar grid for month view (6 weeks, 42 days)
export function getCalendarDays(date: Date, weekStartsOn: 0 | 1 = 0): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn });
  
  return eachDayOfInterval({ start, end });
}

// Get week days for week view
export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 0): Date[] {
  const start = startOfWeek(date, { weekStartsOn });
  const end = endOfWeek(date, { weekStartsOn });
  
  return eachDayOfInterval({ start, end });
}

// Format date for display
export function formatDate(date: Date, formatStr: string = 'MMM d, yyyy'): string {
  return format(date, formatStr);
}

// Format time for display
export function formatTime(date: Date, format24h: boolean = false): string {
  return format(date, format24h ? 'HH:mm' : 'h:mm a');
}

// Format datetime for display
export function formatDateTime(date: Date, format24h: boolean = false): string {
  const dateStr = format(date, 'MMM d, yyyy');
  const timeStr = formatTime(date, format24h);
  return `${dateStr} at ${timeStr}`;
}

// Get relative date description
export function getRelativeDateDescription(date: Date): string {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);
  
  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, tomorrow)) return 'Tomorrow';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  
  // Check if it's this week
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  if (date >= weekStart && date <= weekEnd) {
    return format(date, 'EEEE'); // Day name
  }
  
  // Check if it's this month
  if (isSameMonth(date, today)) {
    return format(date, 'MMM d');
  }
  
  // Otherwise show full date
  return format(date, 'MMM d, yyyy');
}

// Check if date is in current month
export function isDateInCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth);
}

// Get time slots for day/week view
export function getTimeSlots(start: number = 0, end: number = 24, interval: number = 60): string[] {
  const slots: string[] = [];
  
  for (let hour = start; hour < end; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      slots.push(format(date, 'HH:mm'));
    }
  }
  
  return slots;
}

// Create date from time string (HH:mm)
export function createDateFromTime(date: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

// Get date range for current view
export function getViewDateRange(date: Date, view: 'month' | 'week' | 'day', weekStartsOn: 0 | 1 = 0): { start: Date; end: Date } {
  switch (view) {
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date)
      };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn }),
        end: endOfWeek(date, { weekStartsOn })
      };
    case 'day':
      return {
        start: startOfDay(date),
        end: endOfDay(date)
      };
    default:
      return {
        start: startOfMonth(date),
        end: endOfMonth(date)
      };
  }
}

// Navigation helpers
export function navigateDate(currentDate: Date, direction: 'prev' | 'next', view: 'month' | 'week' | 'day'): Date {
  switch (view) {
    case 'month':
      return direction === 'prev' ? addMonths(currentDate, -1) : addMonths(currentDate, 1);
    case 'week':
      return direction === 'prev' ? addWeeks(currentDate, -1) : addWeeks(currentDate, 1);
    case 'day':
      return direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1);
    default:
      return currentDate;
  }
}

// Check if event spans multiple days
export function isMultiDayEvent(startDate: Date, endDate: Date): boolean {
  return !isSameDay(startDate, endDate);
}

// Get event duration in hours
export function getEventDuration(startDate: Date, endDate: Date): number {
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
}

// Round time to nearest interval
export function roundTimeToInterval(date: Date, intervalMinutes: number = 15): Date {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes;
  
  const rounded = new Date(date);
  rounded.setMinutes(roundedMinutes, 0, 0);
  
  return rounded;
}

// Get business hours
export function isBusinessHour(date: Date): boolean {
  const hour = date.getHours();
  const day = date.getDay();
  
  // Monday to Friday, 9 AM to 5 PM
  return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}

// Parse date string safely
export function parseDateSafely(dateStr: string): Date | null {
  try {
    const parsed = parseISO(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

// Get current time zone
export function getCurrentTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Helper to check if date is today
export { isToday };

// Helper to check if dates are the same day
export { isSameDay };

// Export commonly used date-fns functions
export { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  format
};