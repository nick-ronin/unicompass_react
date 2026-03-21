"use client"

import { useState, MouseEvent } from 'react';
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
    const [selected, setSelected] = useState<Date | Date[] | [Date | null, Date | null] | null>(selectedDate || new Date());

    const handleDateChange = (value: unknown, _event?: MouseEvent<HTMLButtonElement>) => {
        // Handle single date
        if (value instanceof Date) {
            setSelected(value);
            onDateSelect?.(value);
        }
        // Handle date array (range selection)
        else if (Array.isArray(value)) {
            setSelected(value);
            // Pass the first valid date to onDateSelect
            const firstDate = value.find(d => d instanceof Date);
            if (firstDate instanceof Date) {
                onDateSelect?.(firstDate);
            }
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