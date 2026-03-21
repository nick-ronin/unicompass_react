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
    const [selected, setSelected] = useState<Date | Date[] | null>(selectedDate || new Date());

    const handleDateChange = (value: Date | Date[] | null) => {
        if (value instanceof Date) {
            setSelected(value);
            onDateSelect?.(value);
        } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Date) {
            setSelected(value);
            onDateSelect?.(value[0]);
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