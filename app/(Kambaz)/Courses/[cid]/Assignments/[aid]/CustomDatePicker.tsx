"use client";

import { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

interface CustomDatePickerProps {
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function CustomDatePicker({
  defaultValue = "",
  placeholder = "",
  onChange,
  className = "",
  style = {}
}: CustomDatePickerProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Format date for display (e.g., "May 13, 2024, 11:59 PM")
  const formatDateForDisplay = (date: Date) => {
    const formatted = date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    // Remove "at" from the formatted string
    return formatted.replace(' at ', ', ');
  };

  // Format date for storage (ISO format)
  const formatDateForStorage = (date: Date) => {
    return date.toISOString().slice(0, 16); // Returns YYYY-MM-DDTHH:MM
  };

  // Parse date from ISO string
  const parseDateFromISO = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Initialize with default value
  useEffect(() => {
    console.log('[CustomDatePicker] defaultValue changed:', defaultValue, 'type:', typeof defaultValue);
    if (defaultValue && defaultValue.trim() !== '') {
      const date = parseDateFromISO(defaultValue);
      console.log('[CustomDatePicker] Parsed date:', date, 'isValid:', date && !isNaN(date.getTime()));
      if (date && !isNaN(date.getTime())) {
        setSelectedDate(date);
        const formatted = formatDateForDisplay(date);
        console.log('[CustomDatePicker] Setting display value:', formatted);
        setDisplayValue(formatted);
      } else {
        console.warn('[CustomDatePicker] Invalid date:', defaultValue, 'parsed as:', date);
        setSelectedDate(null);
        setDisplayValue("");
      }
    } else {
      console.log('[CustomDatePicker] No defaultValue, initializing empty');
      // Initialize with current date and time if no default value,
      // so time inputs are always populated when calendar opens
      setSelectedDate(new Date());
      setDisplayValue("");
    }
  }, [defaultValue]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = formatDateForDisplay(date);
    setDisplayValue(formattedDate);
    setIsOpen(false);
    
    if (onChange) {
      onChange(formatDateForStorage(date));
    }
  };

  // Handle time change
  const handleTimeChange = (timeString: string) => {
    if (timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const baseDate = selectedDate || new Date(); // Use current date if no date selected
      const newDate = new Date(baseDate);
      newDate.setHours(hours, minutes);
      
      setSelectedDate(newDate);
      const formattedDate = formatDateForDisplay(newDate);
      setDisplayValue(formattedDate);
      
      if (onChange) {
        onChange(formatDateForStorage(newDate));
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();

      days.push(
        <button
          key={i}
          type="button"
          className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(new Date(currentDate))}
          disabled={!isCurrentMonth}
        >
          {currentDate.getDate()}
        </button>
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-date-picker position-relative">
      <div className="input-with-icon position-relative">
        <Form.Control
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`${className} cursor-pointer pe-4`}
          style={style}
        />
        <FaCalendarAlt 
          className="calendar-icon position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      
      {isOpen && (
        <div ref={calendarRef} className="calendar-popup">
          <div className="calendar-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              ‹
            </button>
            <span className="calendar-month-year">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              ›
            </button>
          </div>
          
          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>
          
          <div className="calendar-days">
            {generateCalendarDays()}
          </div>
          
          <div className="time-selector">
            <label>Time:</label>
            <input
              type="time"
              value={selectedDate ? selectedDate.toTimeString().slice(0, 5) : "00:00"}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="time-input"
            />
          </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-date-picker {
          width: 100%;
        }
        
        .input-with-icon {
          width: 100%;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .calendar-icon {
          cursor: pointer;
          pointer-events: auto;
          z-index: 10;
        }
        
        .calendar-icon:hover {
          color: #007bff !important;
        }
        
        .calendar-popup {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          z-index: 1000;
          padding: 1rem;
          margin-top: 0.25rem;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .calendar-nav-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }
        
        .calendar-nav-btn:hover {
          background-color: #f8f9fa;
        }
        
        .calendar-month-year {
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        
        .weekday {
          text-align: center;
          font-weight: 600;
          font-size: 0.875rem;
          color: #6c757d;
          padding: 0.5rem;
        }
        
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        
        .calendar-day {
          background: none;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          padding: 0.5rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }
        
        .calendar-day:hover {
          background-color: #f8f9fa;
          border-color: #dee2e6;
        }
        
        .calendar-day.current-month {
          color: #212529;
        }
        
        .calendar-day.other-month {
          color: #6c757d;
        }
        
        .calendar-day.today {
          background-color: #e3f2fd;
          font-weight: 600;
        }
        
        .calendar-day.selected {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        .calendar-day.selected:hover {
          background-color: #0056b3;
        }
        
        .time-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #dee2e6;
        }
        
        .time-selector label {
          font-weight: 600;
          margin: 0;
        }
        
        .time-input {
          border: 1px solid #ced4da;
          border-radius: 0.375rem;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
