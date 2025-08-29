'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface CalendarProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  initialFocus?: boolean;
  className?: string;
}

// Simplified Calendar component without external dependencies
function Calendar({ className, selected, onSelect, ...props }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const today = new Date();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onSelect?.(selectedDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  });

  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const isSelected =
      selected &&
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear();
    const isToday = date.toDateString() === today.toDateString();

    days.push(
      <Button
        key={day}
        variant={isSelected ? 'default' : 'ghost'}
        className={cn(
          'h-9 w-9 p-0 font-normal',
          isToday && 'bg-accent text-accent-foreground',
          isSelected && 'bg-primary text-primary-foreground'
        )}
        onClick={() => handleDateSelect(day)}
      >
        {day}
      </Button>
    );
  }

  return (
    <div className={cn('p-3', className)}>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={handlePrevMonth}>
          ←
        </Button>
        <div className="text-sm font-medium">{monthName}</div>
        <Button variant="outline" size="sm" onClick={handleNextMonth}>
          →
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        <div className="text-center text-xs font-medium p-2">So</div>
        <div className="text-center text-xs font-medium p-2">Mo</div>
        <div className="text-center text-xs font-medium p-2">Di</div>
        <div className="text-center text-xs font-medium p-2">Mi</div>
        <div className="text-center text-xs font-medium p-2">Do</div>
        <div className="text-center text-xs font-medium p-2">Fr</div>
        <div className="text-center text-xs font-medium p-2">Sa</div>
        {days}
      </div>
    </div>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
