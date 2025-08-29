'use client';

import { CalendarDashboard } from '@/components/dashboard/CalendarDashboard';
import { AppLayout } from '@/components/layout/AppLayout';

export default function HomePage() {
  return (
    <AppLayout>
      <CalendarDashboard />
    </AppLayout>
  );
}