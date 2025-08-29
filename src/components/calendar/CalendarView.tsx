'use client';

import { useState } from 'react';
import { CalendarViewProps } from '@/lib/types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { CalendarHeader } from './CalendarHeader';

export function CalendarView({
  currentDate,
  view,
  events,
  onDateClick,
  onEventClick,
  onViewChange,
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick(date);
  };

  const renderCalendarView = () => {
    const props = {
      currentDate: selectedDate,
      events,
      onDateClick: handleDateClick,
      onEventClick,
    };

    switch (view) {
      case 'month':
        return <MonthView {...props} />;
      case 'week':
        return <WeekView {...props} />;
      case 'day':
        return <DayView {...props} />;
      default:
        return <MonthView {...props} />;
    }
  };

  return (
    <div className="w-full">
      <CalendarHeader
        currentDate={selectedDate}
        view={view}
        onDateChange={setSelectedDate}
        onViewChange={onViewChange}
      />
      <div className="mt-4">
        {renderCalendarView()}
      </div>
    </div>
  );
}