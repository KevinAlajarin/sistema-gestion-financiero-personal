import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const DateRangeSelector = ({ startDate, endDate, onChange }) => {
    return (
        <div className="flex items-center gap-2 bg-white p-1 border border-slate-200 rounded-lg shadow-sm">
            <div className="p-2 text-slate-400">
                <CalendarIcon size={18} />
            </div>
            <input 
                type="date" 
                value={startDate} 
                onChange={(e) => onChange('startDate', e.target.value)}
                className="text-sm border-none focus:ring-0 text-slate-600 outline-none"
            />
            <span className="text-slate-300">-</span>
            <input 
                type="date" 
                value={endDate} 
                onChange={(e) => onChange('endDate', e.target.value)}
                className="text-sm border-none focus:ring-0 text-slate-600 outline-none"
            />
        </div>
    );
};

export default DateRangeSelector;