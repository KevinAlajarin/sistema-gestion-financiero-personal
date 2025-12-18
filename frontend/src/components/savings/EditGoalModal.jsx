import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EditGoalModal = ({ goal, onClose, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        name: '',
        targetDate: ''
    });

    useEffect(() => {
        if (goal) {
            setFormData({
                name: goal.name || '',
                targetDate: goal.target_date ? goal.target_date.split('T')[0] : ''
            });
        }
    }, [goal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSuccess(formData);
            onClose();
        } catch (error) {
            if (onError) onError(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Editar Meta</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Meta *</label>
                        <input
                            required
                            type="text"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ej: Auto Nuevo"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de la Meta *</label>
                        <input
                            required
                            type="date"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={formData.targetDate}
                            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"
                        >
                            <Save size={18} />
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGoalModal;

