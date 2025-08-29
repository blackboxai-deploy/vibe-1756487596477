'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';

export function UpcomingEvents() {
  const { getUpcomingEvents } = useEvents();
  const upcomingEvents = getUpcomingEvents();

  const formatEventTime = (date: Date) => {
    return new Date(date).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Upcoming Events
          <Badge variant="secondary">{upcomingEvents.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div 
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatEventTime(event.startDate)}
                  </p>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {upcomingEvents.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                +{upcomingEvents.length - 5} more events
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming events in the next 7 days
          </p>
        )}
      </CardContent>
    </Card>
  );
}