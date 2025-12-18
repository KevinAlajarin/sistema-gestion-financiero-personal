import React, { useState, useEffect } from 'react';
import cardService from '../../services/cardService';
import categoryService from '../../services/categoryService';
import { X, ShoppingBag, Loader } from 'lucide-react';

const InstallmentPurchaseModal = ({ onClose, onSuccess, onError, cards }) => {
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Solo mostramos tarjetas de CRÉDITO para cuotas
    const creditCards = cards.filter(c => c.type === 'CREDIT');

    const [formData, setFormData] = useState({
        cardId: creditCards.length > 0 ? creditCards[0].id : '',
        description: '',
        totalAmount: '',
        installments: '12', // Default típico
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const loadCats = async () => {
            const data = await categoryService.getAll('EXPENSE');
            setCategories(data);
        };
        loadCats();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await cardService.createPurchase({
                ...formData,
                totalAmount: parseFloat(formData.totalAmount),
                installments: parseInt(formData.installments)
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                console.error('Error:', error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calcular cuota estimada en tiempo real
    const estimatedQuota = formData.totalAmount && formData.installments 
        ? parseFloat(formData.totalAmount) / parseInt(formData.installments) 
        : 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <ShoppingBag size={20} className="text-purple-400"/>
                        Nueva Compra en Cuotas
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Tarjeta */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Tarjeta de Crédito</label>
                        <select 
                            name="cardId" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-purple-500"
                            value={formData.cardId}
                            onChange={handleChange}
                            required
                        >
                            {creditCards.map(c => (
                                <option key={c.id} value={c.id}>{c.name} (Disp: ${c.available_credit})</option>
                            ))}
                        </select>
                    </div>

                    {/* Descripción y Categoría */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Qué compraste?</label>
                            <input 
                                type="text" name="description" required 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-purple-500"
                                placeholder="Ej: TV Samsung"
                                value={formData.description} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
                            <select 
                                name="categoryId" required 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-purple-500"
                                value={formData.categoryId} onChange={handleChange}
                            >
                                <option value="">Elegir...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Montos y Cuotas */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Precio TOTAL</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-400">$</span>
                                <input 
                                    type="number" name="totalAmount" required min="1" step="0.01"
                                    className="w-full pl-6 pr-3 py-1.5 border border-slate-300 rounded outline-none"
                                    placeholder="1200000"
                                    value={formData.totalAmount} onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad Cuotas</label>
                            <select 
                                name="installments" required 
                                className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                                value={formData.installments} onChange={handleChange}
                            >
                                {[1,3,6,9,12,18,24].map(n => <option key={n} value={n}>{n} cuotas</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Resumen en tiempo real */}
                    <div className="text-center py-2">
                        <p className="text-sm text-slate-500">Pagarás aproximadamente:</p>
                        <p className="text-xl font-bold text-purple-600">
                            ${estimatedQuota.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ mes</span>
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold transition-colors flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? <Loader className="animate-spin"/> : <ShoppingBag size={18}/>}
                        Confirmar Compra
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InstallmentPurchaseModal;