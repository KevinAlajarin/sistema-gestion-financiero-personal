import React from 'react';

const InstallmentTracker = ({ current, total }) => {
    const percentage = (current / total) * 100;
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <span className="text-xs font-mono text-slate-500">
                {current}/{total}
            </span>
        </div>
    );
};

export default InstallmentTracker;