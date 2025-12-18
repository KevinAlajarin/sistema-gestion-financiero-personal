import React from 'react';
import { Ghost } from 'lucide-react';

const EmptyState = ({ title, message, icon: Icon = Ghost, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <Icon size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">{message}</p>
            {action && <div>{action}</div>}
        </div>
    );
};

export default EmptyState;