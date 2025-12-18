import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertCircle
    };

    const colors = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        error: 'bg-rose-50 border-rose-200 text-rose-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800'
    };

    const Icon = icons[type] || Info;
    const colorClass = colors[type] || colors.info;

    return (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300 max-w-md`}>
            <div className={`${colorClass} border rounded-lg shadow-lg p-4 flex items-start gap-3`}>
                <Icon size={20} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Notification;

