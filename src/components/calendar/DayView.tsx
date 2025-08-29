'use client';

import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export function DayView({ currentDate, events, onDateClick, onEventClick }: DayViewProps) {
  // Generate time slots for the day (24 hours)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getEventsForDate = () => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === currentDate.getDate()
      );
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getEventPosition = (event: Event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();
    
    const startPosition = (startHour * 60 + startMinute) / 60; // Convert to hours
    const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
    
    return {
      top: `${startPosition * 60}px`, // 60px per hour
      height: `${Math.max(duration * 60, 30)}px`, // Minimum 30px height
    };
  };

  const isCurrentHour = (hour: number) => {
    const now = new Date();
    return (
      now.getFullYear() === currentDate.getFullYear() &&
      now.getMonth() === currentDate.getMonth() &&
      now.getDate() === currentDate.getDate() &&
      now.getHours() === hour
    );
  };

  const timeSlots = getTimeSlots();
  const dayEvents = getEventsForDate();

  return (
    <div className="w-full">
      {/* Day header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'} scheduled
          </p>
        </div>
      </div>

      {/* Time grid */}
      <div className="relative">
        {/* Time labels */}
        <div className="flex">
          <div className="w-20 flex-shrink-0">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-[60px] flex items-start justify-end pr-2 text-sm text-muted-foreground"
              >
                {hour > 0 && formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Day column */}
          <div className="flex-1 relative border-l">
            {/* Hour lines */}
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className={cn(
                  "h-[60px] border-b border-border relative",
                  isCurrentHour(hour) && "bg-primary/5"
                )}
                onClick={() => {
                  const clickedDate = new Date(currentDate);
                  clickedDate.setHours(hour, 0, 0, 0);
                  onDateClick(clickedDate);
                }}
              >
                {/* Half-hour line */}
                <div className="absolute top-[30px] left-0 right-0 border-b border-dashed border-border/50" />
                
                {/* Current time indicator */}
                {isCurrentHour(hour) && (
                  <div 
                    className="absolute left-0 right-0 h-0.5 bg-primary z-10"
                    style={{
                      top: `${(new Date().getMinutes() / 60) * 60}px`
                    }}
                  >
                    <div className="absolute -left-1 -top-1 w-2 h-2 bg-primary rounded-full" />
                  </div>
                )}
              </div>
            ))}

            {/* Events */}
            <div className="absolute inset-0 pointer-events-none">
              {dayEvents.map((event, index) => {
                const position = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className="absolute left-1 right-1 pointer-events-auto cursor-pointer rounded p-2 text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
                    style={{
                      ...position,
                      backgroundColor: event.color + '20',
                      borderLeft: `4px solid ${event.color}`,
                      color: event.color,
                      zIndex: 20 + index,
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-xs opacity-75">
                      {new Date(event.startDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(event.endDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {event.description && (
                      <div className="text-xs opacity-75 mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* All-day events */}
      {dayEvents.some(event => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        return start.getHours() === 0 && start.getMinutes() === 0 && 
               end.getHours() === 23 && end.getMinutes() === 59;
      }) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">All Day</h4>
          <div className="space-y-2">
            {dayEvents
              .filter(event => {
                const start = new Date(event.startDate);
                const end = new Date(event.endDate);
                return start.getHours() === 0 && start.getMinutes() === 0 && 
                       end.getHours() === 23 && end.getMinutes() === 59;
              })
              .map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: event.color + '20',
                    borderLeft: `4px solid ${event.color}`,
                    color: event.color,
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  {event.description && (
                    <div className="text-sm opacity-75 mt-1">
                      {event.description}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}