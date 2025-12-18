import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import transactionService from '../../services/transactionService';
import { X, Check, Loader } from 'lucide-react';

const TransactionForm = ({ onClose, onSuccess }) => {
    const [type, setType] = useState('EXPENSE');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0], 
        paymentMethod: 'CASH'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            try {
                const data = await categoryService.getAll(type);
                setCategories(data);
                setFormData(prev => ({ ...prev, categoryId: '' }));
            } catch (error) {
                console.error("Error cargando categorías", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, [type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await transactionService.create({
                ...formData,
                type,
                amount: parseFloat(formData.amount)
            });
            onSuccess(); 
            onClose(); 
        } catch (error) {
            alert("Error al guardar transacción: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button 
                        onClick={() => setType('EXPENSE')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${type === 'EXPENSE' ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Gasto
                    </button>
                    <button 
                        onClick={() => setType('INCOME')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${type === 'INCOME' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Ingreso
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Monto</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                            <input 
                                type="number" 
                                name="amount"
                                required
                                min="0.01"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-semibold"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
                        <input 
                            type="text" 
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder={type === 'EXPENSE' ? "Ej: Supermercado, Cena..." : "Ej: Sueldo, Freelance..."}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
                            <select 
                                name="categoryId"
                                required
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                                disabled={loadingCategories}
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Fecha</label>
                            <input 
                                type="date" 
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Método de Pago</label>
                        <select 
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
                        >
                            <option value="CASH">Efectivo</option>
                            <option value="DEBIT_CARD">Tarjeta Débito</option>
                            <option value="CREDIT_CARD">Tarjeta Crédito</option>
                            <option value="BANK_TRANSFER">Transferencia</option>
                            <option value="OTHER">Otro</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                                ${type === 'EXPENSE' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}
                                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                            `}
                        >
                            {isSubmitting ? <Loader className="animate-spin" size={18}/> : <Check size={18}/>}
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;