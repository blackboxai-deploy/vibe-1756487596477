'use client';

import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export function MonthView({ currentDate, events, onDateClick, onEventClick }: MonthViewProps) {
  // Get calendar grid (6 weeks, 42 days)
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    
    // Start from Sunday of the first week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = getCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-t-lg overflow-hidden">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className="bg-muted/50 p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-b-lg overflow-hidden">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonthDay = isCurrentMonth(day);
          const isTodayDay = isToday(day);

          return (
            <div
              key={index}
              className={cn(
                "bg-background min-h-[120px] p-2 cursor-pointer hover:bg-muted/50 transition-colors",
                !isCurrentMonthDay && "text-muted-foreground bg-muted/20"
              )}
              onClick={() => onDateClick(day)}
            >
              {/* Date number */}
              <div className={cn(
                "flex items-center justify-center w-6 h-6 text-sm rounded-full mb-1",
                isTodayDay && "bg-primary text-primary-foreground font-semibold",
                !isTodayDay && isCurrentMonthDay && "hover:bg-muted"
              )}>
                {day.getDate()}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 truncate"
                    style={{ 
                      backgroundColor: event.color + '20',
                      color: event.color,
                      borderLeft: `3px solid ${event.color}`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}