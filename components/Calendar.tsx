"use client"

import { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import { cn } from '@/lib/utils';

interface CalendarProps {
    onDateSelect?: (date: Date) => void;
    selectedDate?: Date;
    highlightedDates?: Date[];
}

export default function Calendar({ onDateSelect, selectedDate, highlightedDates = [] }: CalendarProps) {
    const [selected, setSelected] = useState<Date | undefined>(selectedDate || new Date());

    const handleDateChange = (date: Date | Date[]) => {
        if (date instanceof Date) {
            setSelected(date);
            onDateSelect?.(date);
        }
    };

    const isHighlighted = (date: Date) => {
        return highlightedDates.some(d => 
            d.getFullYear() === date.getFullYear() &&
            d.getMonth() === date.getMonth() &&
            d.getDate() === date.getDate()
        );
    };

    const getTileClassName = ({ date }: { date: Date }) => {
        if (isHighlighted(date)) {
            return 'highlighted-task';
        }
        return '';
    };

    return (
        <div className='calendar-wrapper'>
            <ReactCalendar
                onChange={handleDateChange}
                value={selected}
                locale="ru-RU"
                tileClassName={getTileClassName}
            />
        </div>
    );
}