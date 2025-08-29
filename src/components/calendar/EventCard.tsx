'use client';

import { Event } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  compact?: boolean;
  showActions?: boolean;
}

export function EventCard({ 
  event, 
  onClick, 
  onEdit, 
  onDelete, 
  compact = false,
  showActions = true 
}: EventCardProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  const isMultiDay = () => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return start.toDateString() !== end.toDateString();
  };

  const getDuration = () => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes > 0 ? `${diffMinutes}m` : ''}`;
    }
    return `${diffMinutes}m`;
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
          onClick && "cursor-pointer"
        )}
        onClick={() => onClick?.(event)}
      >
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: event.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{event.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(event.startDate)}
            {isMultiDay() && ` - ${formatDate(event.endDate)}`}
          </p>
        </div>
        {event.isRecurring && (
          <svg className="w-3 h-3 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div 
              className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  className={cn(
                    "font-semibold truncate",
                    onClick && "cursor-pointer hover:text-primary"
                  )}
                  onClick={() => onClick?.(event)}
                >
                  {event.title}
                </h3>
                {event.isRecurring && (
                  <Badge variant="secondary" className="text-xs">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Recurring
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {isMultiDay() ? (
                      `${formatDate(event.startDate)} ${formatTime(event.startDate)} - ${formatDate(event.endDate)} ${formatTime(event.endDate)}`
                    ) : (
                      `${formatTime(event.startDate)} - ${formatTime(event.endDate)} (${getDuration()})`
                    )}
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-sm line-clamp-2 mt-2">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {showActions && (onEdit || onDelete) && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}