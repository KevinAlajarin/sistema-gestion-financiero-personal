import React, { useState, useEffect } from 'react';
import salaryService from '../../services/salaryService';
import categoryService from '../../services/categoryService';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, Calendar, Save, CheckCircle, AlertCircle, X } from 'lucide-react';

const SalaryConfig = ({ onClose }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        salary_amount: '',
        payday_day: '',
        category_id: '',
        is_active: true
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [configRes, categoriesRes] = await Promise.all([
                salaryService.getConfig().catch(() => null),
                categoryService.getAll({ type: 'INCOME' })
            ]);

            if (configRes) {
                setConfig(configRes);
                setFormData({
                    salary_amount: configRes.salary_amount || '',
                    payday_day: configRes.payday_day || '',
                    category_id: configRes.category_id || '',
                    is_active: configRes.is_active !== false
                });
            }

            setCategories(categoriesRes || []);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setMessage({ type: 'error', text: 'Error al cargar la configuración' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const paydayDay = parseInt(formData.payday_day);
            if (isNaN(paydayDay) || paydayDay < 1 || paydayDay > 31) {
                setMessage({ 
                    type: 'error', 
                    text: 'El día de cobro debe estar entre 1 y 31' 
                });
                setSaving(false);
                return;
            }

            const data = {
                salary_amount: parseFloat(formData.salary_amount),
                payday_day: paydayDay,
                category_id: formData.category_id || null,
                is_active: formData.is_active
            };

            const result = await salaryService.saveConfig(data);
            setConfig(result);
            setMessage({ type: 'success', text: 'Configuración guardada correctamente' });
            
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error al guardar la configuración' 
            });
        } finally {
            setSaving(false);
        }
    };

    const handleProcessNow = async () => {
        try {
            const result = await salaryService.processSalary();
            if (result.processed) {
                setMessage({ type: 'success', text: result.message });
            } else {
                setMessage({ type: 'info', text: result.message });
            }
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error al procesar el sueldo' 
            });
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={handleOverlayClick}>
                <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                    <div className="p-6">
                        <div className="animate-pulse">
                            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded w-2/3 mb-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200"
            onClick={handleOverlayClick}
        >
            <div 
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <DollarSign className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Configuración de Sueldo</h3>
                            <p className="text-sm text-slate-300">Configura tu sueldo para que se agregue automáticamente cada mes</p>
                        </div>
                    </div>
                    {onClose && (
                        <button 
                            onClick={onClose} 
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="p-6">

            {message.text && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
                    message.type === 'error' ? 'bg-rose-50 text-rose-700' :
                    'bg-blue-50 text-blue-700'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle size={18} />
                    ) : (
                        <AlertCircle size={18} />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sueldo Neto (ARS)
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={formData.salary_amount}
                            onChange={(e) => setFormData({ ...formData, salary_amount: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="1500000"
                        />
                    </div>
                    {formData.salary_amount && (
                        <p className="mt-1 text-xs text-slate-500">
                            {formatCurrency(parseFloat(formData.salary_amount) || 0)}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Día del Mes en que Cobras
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="number"
                            min="1"
                            max="31"
                            required
                            value={formData.payday_day}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                                    setFormData({ ...formData, payday_day: value });
                                }
                            }}
                            onBlur={(e) => {
                                const value = parseInt(e.target.value);
                                if (isNaN(value) || value < 1) {
                                    setFormData({ ...formData, payday_day: '1' });
                                } else if (value > 31) {
                                    setFormData({ ...formData, payday_day: '31' });
                                }
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="5"
                        />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        El sueldo se agregará automáticamente el día {formData.payday_day || 'X'} de cada mes (máximo 31)
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Categoría (Opcional)
                    </label>
                    <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="">Seleccionar categoría (se creará "Sueldo" si no hay)</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="is_active" className="text-sm text-slate-700">
                        Activar generación automática de sueldo
                    </label>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                    
                    {config && (
                        <button
                            type="button"
                            onClick={handleProcessNow}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm"
                        >
                            Procesar Ahora
                        </button>
                    )}
                </div>
            </form>

            {config && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Configuración Actual</h4>
                    <div className="space-y-1 text-sm text-slate-600">
                        <p><span className="font-medium">Sueldo:</span> {formatCurrency(config.salary_amount)}</p>
                        <p><span className="font-medium">Día de cobro:</span> {config.payday_day} de cada mes</p>
                        <p><span className="font-medium">Estado:</span> {config.is_active ? 'Activo' : 'Inactivo'}</p>
                        {config.last_processed_date && (
                            <p><span className="font-medium">Último procesado:</span> {new Date(config.last_processed_date).toLocaleDateString('es-AR')}</p>
                        )}
                    </div>
                </div>
            )}
                </div>
            </div>
        </div>
    );
};

export default SalaryConfig;

