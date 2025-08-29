'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventForm } from '@/components/calendar/EventForm';
import { EventDetails } from '@/components/calendar/EventDetails';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useEvents } from '@/hooks/useEvents';
import { Event, ViewType } from '@/lib/types';
import { toast } from 'sonner';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { events, addEvent, updateEvent, removeEvent } = useEvents();

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    setShowEventForm(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addEvent(eventData);
      setShowEventForm(false);
      toast.success('Event created successfully');
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      await updateEvent(eventId, updates);
      setEditingEvent(null);
      setShowEventDetails(false);
      toast.success('Event updated successfully');
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await removeEvent(eventId);
      setShowEventDetails(false);
      setSelectedEvent(null);
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventDetails(false);
    setShowEventForm(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your events and schedule
            </p>
          </div>
          <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
            <DialogTrigger asChild>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <EventForm
                initialDate={currentDate}
                event={editingEvent}
                onSubmit={editingEvent ? 
                  (data) => handleUpdateEvent(editingEvent.id, data) : 
                  handleCreateEvent
                }
                onCancel={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-lg border p-6">
          <CalendarView
            currentDate={currentDate}
            view={view}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onViewChange={setView}
          />
        </div>

        {/* Event Details Modal */}
        <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
          <DialogContent className="max-w-md">
            {selectedEvent && (
              <EventDetails
                event={selectedEvent}
                onEdit={() => handleEditEvent(selectedEvent)}
                onDelete={() => handleDeleteEvent(selectedEvent.id)}
                onClose={() => setShowEventDetails(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}