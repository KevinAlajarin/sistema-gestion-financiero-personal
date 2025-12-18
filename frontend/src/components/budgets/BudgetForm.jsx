import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import budgetService from '../../services/budgetService';
import { X, Save, Loader } from 'lucide-react';

const BudgetForm = ({ onClose, onSuccess, initialMonth, initialYear }) => {
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        categoryId: '',
        month: initialMonth || new Date().getMonth() + 1,
        year: initialYear || new Date().getFullYear(),
        plannedAmount: ''
    });

    useEffect(() => {
        const loadCategories = async () => {
            // Solo presupuestamos GASTOS
            const data = await categoryService.getAll('EXPENSE');
            setCategories(data);
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await budgetService.setBudget({
                ...formData,
                plannedAmount: parseFloat(formData.plannedAmount)
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Definir Presupuesto</h3>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
                        <select 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                            value={formData.categoryId}
                            onChange={e => setFormData({...formData, categoryId: e.target.value})}
                            required
                        >
                            <option value="">Seleccionar...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Mes</label>
                            <select 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
                                value={formData.month}
                                onChange={e => setFormData({...formData, month: parseInt(e.target.value)})}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i+1} value={i+1}>{i+1}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Año</label>
                            <input 
                                type="number" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none"
                                value={formData.year}
                                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Monto Límite</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                            <input 
                                type="number" 
                                required
                                min="0"
                                className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
                                placeholder="0.00"
                                value={formData.plannedAmount}
                                onChange={e => setFormData({...formData, plannedAmount: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 mt-2"
                    >
                        {isSubmitting ? <Loader className="animate-spin" size={18}/> : <Save size={18}/>}
                        Guardar Regla
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BudgetForm;