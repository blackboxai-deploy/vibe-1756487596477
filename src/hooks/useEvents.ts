'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/lib/types';
import { eventStorage, generateId } from '@/lib/storage';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from storage on mount
  useEffect(() => {
    try {
      const storedEvents = eventStorage.getAll();
      setEvents(storedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new event
  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      eventStorage.add(newEvent);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }, []);

  // Update existing event
  const updateEvent = useCallback((eventId: string, updates: Partial<Event>) => {
    try {
      const updatedEvent = eventStorage.update(eventId, updates);
      if (updatedEvent) {
        setEvents(prev => prev.map(event => 
          event.id === eventId ? updatedEvent : event
        ));
        return updatedEvent;
      }
      return null;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }, []);

  // Remove event
  const removeEvent = useCallback((eventId: string) => {
    try {
      const success = eventStorage.remove(eventId);
      if (success) {
        setEvents(prev => prev.filter(event => event.id !== eventId));
      }
      return success;
    } catch (error) {
      console.error('Error removing event:', error);
      throw error;
    }
  }, []);

  // Get events for specific date range
  const getEventsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart <= endDate && eventEnd >= startDate;
    });
  }, [events]);

  // Get events for specific date
  const getEventsByDate = useCallback((date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  }, [events]);

  // Get events by category
  const getEventsByCategory = useCallback((categoryId: string) => {
    return events.filter(event => event.category === categoryId);
  }, [events]);

  // Search events
  const searchEvents = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(lowerQuery) ||
      (event.description && event.description.toLowerCase().includes(lowerQuery))
    );
  }, [events]);

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    
    return events
      .filter(event => {
        const eventStart = new Date(event.startDate);
        return eventStart >= now && eventStart <= oneWeekFromNow;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events]);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    removeEvent,
    getEventsByDateRange,
    getEventsByDate,
    getEventsByCategory,
    searchEvents,
    getUpcomingEvents,
  };
}