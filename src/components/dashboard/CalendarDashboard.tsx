'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarView } from '@/components/calendar/CalendarView';
import { QuickStats } from './QuickStats';
import { UpcomingEvents } from './UpcomingEvents';
import { TaskSummary } from './TaskSummary';
import { useEvents } from '@/hooks/useEvents';
import { useTasks } from '@/hooks/useTasks';

export function CalendarDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  const { events, getEventsByDate } = useEvents();
  const { getTaskStats } = useTasks();

  const today = new Date();
  const todayEvents = getEventsByDate(today);
  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Event
          </Button>
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} eventsToday={todayEvents.length} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={view === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant={view === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('week')}
                  >
                    Week
                  </Button>
                  <Button
                    variant={view === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('day')}
                  >
                    Day
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarView
                currentDate={currentDate}
                view={view}
                events={events}
                onDateClick={setCurrentDate}
                onEventClick={(event) => console.log('Event clicked:', event)}
                onViewChange={setView}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Today's Events
                <Badge variant="secondary">{todayEvents.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div 
                        className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.startDate).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {todayEvents.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{todayEvents.length - 3} more events
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No events scheduled for today
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <UpcomingEvents />

          {/* Task Summary */}
          <TaskSummary />
        </div>
      </div>
    </div>
  );
}