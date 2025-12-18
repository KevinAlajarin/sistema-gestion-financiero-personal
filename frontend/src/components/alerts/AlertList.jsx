import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { Bell, Check, AlertTriangle } from 'lucide-react';

const AlertList = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        apiClient.get('/alerts/unread')
            .then(res => setAlerts(res.data || []))
            .catch(err => console.error(err));
    }, []);

    const markAsRead = async (id) => {
        try {
            await apiClient.put(`/alerts/${id}/read`);
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (alerts.length === 0) return null;

    return (
        <div className="mb-6 space-y-2">
            {alerts.map(alert => (
                <div key={alert.id} className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-3">
                        <AlertTriangle className="text-amber-500 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-medium text-amber-800">{alert.message}</p>
                            <p className="text-xs text-amber-600/80 mt-0.5">{new Date(alert.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button onClick={() => markAsRead(alert.id)} className="text-amber-600 hover:text-amber-800 p-1">
                        <Check size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AlertList;