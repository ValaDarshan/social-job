import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  maxDate?: string;
  minDate?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const YEARS_RANGE = 80; // show 80 years back and 10 years forward

export default function DatePicker({
  value,
  onChange,
  label,
  required,
  placeholder = 'Select date',
  maxDate,
  minDate,
}: DatePickerProps) {
  const today = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;

  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());
  const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowYearPicker(false);
        setShowMonthPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Scroll to selected year when year picker opens
  useEffect(() => {
    if (showYearPicker && yearScrollRef.current) {
      const selectedBtn = yearScrollRef.current.querySelector('[data-selected="true"]');
      if (selectedBtn) {
        selectedBtn.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [showYearPicker]);

  // Reset view when opening
  useEffect(() => {
    if (isOpen) {
      const d = value ? new Date(value + 'T00:00:00') : new Date();
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
      setShowYearPicker(false);
      setShowMonthPicker(false);
    }
  }, [isOpen, value]);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const isDateDisabled = useCallback((day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  const isToday = (day: number, month: number, year: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number, month: number, year: number) => {
    if (!parsed) return false;
    return day === parsed.getDate() && month === parsed.getMonth() && year === parsed.getFullYear();
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const displayValue = parsed
    ? parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  const prevMonthDays = getDaysInMonth(viewMonth === 0 ? 11 : viewMonth - 1, viewMonth === 0 ? viewYear - 1 : viewYear);

  const calendarDays: { day: number; currentMonth: boolean; disabled: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarDays.push({ day: d, currentMonth: false, disabled: isDateDisabled(d, m, y) });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, currentMonth: true, disabled: isDateDisabled(d, viewMonth, viewYear) });
  }

  // Next month leading days
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarDays.push({ day: d, currentMonth: false, disabled: isDateDisabled(d, m, y) });
  }

  // Year range
  const startYear = today.getFullYear() - YEARS_RANGE;
  const endYear = today.getFullYear() + 10;
  const years: number[] = [];
  for (let y = endYear; y >= startYear; y--) {
    years.push(y);
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full px-3 py-2 rounded-xl border cursor-pointer transition-colors text-sm ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
        } bg-white dark:bg-slate-800`}
      >
        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2 shrink-0" />
        <span className={`flex-1 ${displayValue ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
          {displayValue || placeholder}
        </span>
        {value && !required && (
          <button
            onClick={handleClear}
            className="ml-1 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-[300px] bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {/* Month selector */}
                <button
                  type="button"
                  onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}
                  className="px-2 py-1 rounded-lg text-sm font-semibold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {MONTHS[viewMonth]}
                </button>

                {/* Year selector */}
                <button
                  type="button"
                  onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}
                  className="px-2 py-1 rounded-lg text-sm font-semibold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {viewYear}
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Year Picker */}
          {showYearPicker && (
            <div ref={yearScrollRef} className="max-h-56 overflow-y-auto p-2 grid grid-cols-4 gap-1 border-b border-slate-100 dark:border-slate-700">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  data-selected={y === viewYear}
                  onClick={() => { setViewYear(y); setShowYearPicker(false); }}
                  className={`py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    y === viewYear
                      ? 'bg-blue-600 text-white'
                      : y === today.getFullYear()
                        ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Month Picker */}
          {showMonthPicker && (
            <div className="p-2 grid grid-cols-3 gap-1 border-b border-slate-100 dark:border-slate-700">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setViewMonth(i); setShowMonthPicker(false); }}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    i === viewMonth
                      ? 'bg-blue-600 text-white'
                      : i === today.getMonth() && viewYear === today.getFullYear()
                        ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {m.substring(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Calendar Grid */}
          {!showYearPicker && !showMonthPicker && (
            <div className="p-3">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((cell, idx) => {
                  const selected = cell.currentMonth && isSelected(cell.day, viewMonth, viewYear);
                  const todayMark = cell.currentMonth && isToday(cell.day, viewMonth, viewYear);

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={cell.disabled || !cell.currentMonth}
                      onClick={() => cell.currentMonth && !cell.disabled && handleDayClick(cell.day)}
                      className={`h-9 w-full rounded-lg text-sm font-medium transition-all duration-150 ${
                        !cell.currentMonth
                          ? 'text-slate-300 dark:text-slate-600 cursor-default'
                          : cell.disabled
                            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                            : selected
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 scale-105'
                              : todayMark
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                onChange(todayStr);
                setIsOpen(false);
              }}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
