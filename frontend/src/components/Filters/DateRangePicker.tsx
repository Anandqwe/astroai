import React, { useState, useEffect } from 'react';

interface DateRangePickerProps {
  start?: string;
  end?: string;
  onDateChange: (start: string | null, end: string | null) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ start, end, onDateChange, className = '' }) => {
  const [startDate, setStartDate] = useState<string>(start || '');
  const [endDate, setEndDate] = useState<string>(end || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setStartDate(start || '');
    setEndDate(end || '');
  }, [start, end]);

  const apply = (): void => {
    setError('');
    if (startDate && endDate && startDate > endDate) {
      setError('Start date must be before end date');
      return;
    }
    onDateChange(startDate || null, endDate || null);
  };

  const clear = (): void => {
    setStartDate('');
    setEndDate('');
    setError('');
    onDateChange(null, null);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white"
        />
        <button
          className="px-3 py-2 rounded-lg bg-gradient-primary text-white text-sm"
          onClick={apply}
        >
          Apply
        </button>
        <button
          className="px-3 py-2 rounded-lg border border-primary/30 text-gray-300 text-sm hover:text-white hover:border-primary/60"
          onClick={clear}
        >
          Clear
        </button>
      </div>
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
};

export default DateRangePicker;
