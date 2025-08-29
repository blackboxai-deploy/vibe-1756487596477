'use client';

import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export function WeekView({ currentDate, events, onDateClick, onEventClick }: WeekViewProps) {
  // Get week days starting from Sunday
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEventPosition = (event: Event) => {
    const startHour = new Date(event.startDate).getHours();
    const startMinute = new Date(event.startDate).getMinutes();
    const endHour = new Date(event.endDate).getHours();
    const endMinute = new Date(event.endDate).getMinutes();
    
    const startPosition = (startHour * 60 + startMinute) / 60; // Convert to hours
    const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
    
    return {
      top: `${startPosition * 60}px`, // 60px per hour
      height: `${Math.max(duration * 60, 30)}px`, // Minimum 30px height
    };
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const weekDays = getWeekDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      {/* Header with days */}
      <div className="grid grid-cols-8 gap-px bg-border rounded-t-lg overflow-hidden">
        <div className="bg-muted/50 p-2 text-center text-sm font-medium text-muted-foreground">
          Time
        </div>
        {weekDays.map((day, index) => {
          const isTodayDay = isToday(day);
          return (
            <div
              key={index}
              className={cn(
                "bg-muted/50 p-2 text-center cursor-pointer hover:bg-muted transition-colors",
                isTodayDay && "bg-primary/10"
              )}
              onClick={() => onDateClick(day)}
            >
              <div className="text-xs text-muted-foreground">
                {weekdays[index]}
              </div>
              <div className={cn(
                "text-sm font-medium mt-1",
                isTodayDay && "text-primary font-semibold"
              )}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="relative bg-background rounded-b-lg overflow-hidden">
        <div className="grid grid-cols-8 gap-px">
          {/* Time column */}
          <div className="bg-muted/20">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-[60px] p-2 text-xs text-muted-foreground border-b border-border/50 flex items-start"
              >
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day);
            
            return (
              <div key={dayIndex} className="relative bg-background">
                {/* Time slots */}
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => {
                      const clickedTime = new Date(day);
                      clickedTime.setHours(hour, 0, 0, 0);
                      onDateClick(clickedTime);
                    }}
                  />
                ))}

                {/* Events */}
                <div className="absolute inset-0 pointer-events-none">
                  {dayEvents.map((event, eventIndex) => {
                    const position = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded px-2 py-1 text-xs font-medium cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity overflow-hidden"
                        style={{
                          ...position,
                          backgroundColor: event.color + '90',
                          color: 'white',
                          zIndex: 10 + eventIndex,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}