import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const SavingsProgress = ({ current, target }) => {
    const percent = Math.min((current / target) * 100, 100);
    return (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">{formatCurrency(current)}</span>
                <span className="text-slate-400">{formatCurrency(target)}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
};

export default SavingsProgress;