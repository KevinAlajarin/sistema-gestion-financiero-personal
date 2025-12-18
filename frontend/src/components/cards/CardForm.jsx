import React, { useState, useEffect } from 'react';
import cardService from '../../services/cardService';
import { X, Check, CreditCard } from 'lucide-react';

const CardForm = ({ onClose, onSuccess, onError, card = null }) => {
    const isEditing = !!card;
    
    const [formData, setFormData] = useState({
        name: '',
        full_name: '',
        type: 'CREDIT',
        card_number: '',
        lastFourDigits: '',
        cvv: '',
        expiry_date: '',
        creditLimit: '',
        closingDay: '',
        dueDay: ''
    });

    useEffect(() => {
        if (card) {
            // Formatear fecha de vencimiento para mostrar como MM/YY
            let expiryDateFormatted = '';
            if (card.expiry_date) {
                const date = new Date(card.expiry_date);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = String(date.getFullYear()).slice(-2);
                expiryDateFormatted = `${month}/${year}`;
            }
            
            setFormData({
                name: card.name || '',
                full_name: card.full_name || '',
                type: card.type || 'CREDIT',
                card_number: card.card_number || '',
                lastFourDigits: card.last_four_digits || '',
                cvv: card.cvv || '',
                expiry_date: expiryDateFormatted,
                creditLimit: card.credit_limit || '',
                closingDay: card.closing_day || '',
                dueDay: card.due_day || ''
            });
        }
    }, [card]);

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        if (value.length > 19) value = value.slice(0, 19);
        setFormData({ ...formData, card_number: value, lastFourDigits: value.slice(-4) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convertir MM/YY a fecha completa para guardar en BD
            let expiryDate = null;
            if (formData.expiry_date && formData.expiry_date.length === 5) {
                const [month, year] = formData.expiry_date.split('/');
                if (month && year && parseInt(month) >= 1 && parseInt(month) <= 12) {
                    const fullYear = 2000 + parseInt(year);
                    expiryDate = new Date(fullYear, parseInt(month) - 1, 1).toISOString().split('T')[0];
                }
            }

            const data = {
                ...formData,
                creditLimit: formData.type === 'CREDIT' ? parseFloat(formData.creditLimit) || 0 : 0,
                closingDay: formData.type === 'CREDIT' ? (formData.closingDay ? parseInt(formData.closingDay) : null) : null,
                dueDay: formData.type === 'CREDIT' ? (formData.dueDay ? parseInt(formData.dueDay) : null) : null,
                expiry_date: expiryDate
            };

            if (isEditing) {
                await cardService.update(card.id, data);
            } else {
                await cardService.create(data);
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <CreditCard size={24} className="text-emerald-400" />
                        <h3 className="font-bold text-lg">{isEditing ? 'Editar Tarjeta' : 'Nueva Tarjeta'}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Tarjeta *</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                                placeholder="Ej: Visa Galicia" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo del Titular *</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                                placeholder="Ej: Juan Pérez" 
                                value={formData.full_name} 
                                onChange={e => setFormData({...formData, full_name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo *</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-transparent" 
                                value={formData.type} 
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="CREDIT">Crédito</option>
                                <option value="DEBIT">Débito</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Número de Tarjeta *</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-primary focus:border-transparent" 
                                placeholder="1234 5678 9012 3456" 
                                value={formData.card_number.replace(/(.{4})/g, '$1 ').trim()} 
                                onChange={handleCardNumberChange}
                                maxLength={19}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">CVV *</label>
                            <input 
                                required 
                                type="text" 
                                maxLength="3" 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-primary focus:border-transparent" 
                                placeholder="123" 
                                value={formData.cvv} 
                                onChange={e => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Vencimiento *</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-primary focus:border-transparent" 
                                placeholder="02/28" 
                                value={formData.expiry_date} 
                                onChange={e => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    
                                    // Limitar a 4 dígitos (MMYY)
                                    if (value.length > 4) value = value.slice(0, 4);
                                    
                                    // Validar mes mientras se escribe (primeros 2 dígitos)
                                    if (value.length >= 1) {
                                        const firstDigit = parseInt(value[0]);
                                        if (firstDigit > 1 && value.length === 1) {
                                            // Si el primer dígito es > 1, solo puede ser 0
                                            value = '0';
                                        }
                                        if (value.length >= 2) {
                                            const month = parseInt(value.slice(0, 2));
                                            if (month > 12) {
                                                // Si el mes es > 12, corregir a 12
                                                value = '12' + value.slice(2);
                                            } else if (month === 0) {
                                                // Si el mes es 00, corregir a 01
                                                value = '01' + value.slice(2);
                                            }
                                        }
                                    }
                                    
                                    // Formatear como MM/YY
                                    if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                    }
                                    
                                    setFormData({...formData, expiry_date: value});
                                }}
                                onBlur={(e) => {
                                    // Validar formato completo
                                    const value = e.target.value;
                                    if (value && value.length === 5) {
                                        const [month, year] = value.split('/');
                                        const monthNum = parseInt(month);
                                        if (month && year) {
                                            // Validar mes (01-12)
                                            if (monthNum < 1 || monthNum > 12) {
                                                // Corregir mes inválido
                                                const correctedMonth = monthNum < 1 ? '01' : '12';
                                                const correctedValue = `${correctedMonth}/${year}`;
                                                setFormData({...formData, expiry_date: correctedValue});
                                            }
                                        }
                                    }
                                }}
                            />
                            <p className="mt-1 text-xs text-slate-500">Formato: MM/YY (ej: 02/28) - Mes debe ser entre 01 y 12</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Últimos 4 dígitos</label>
                            <input 
                                type="text" 
                                maxLength="4" 
                                readOnly
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-slate-50 font-mono" 
                                value={formData.lastFourDigits} 
                            />
                        </div>
                    </div>

                    {formData.type === 'CREDIT' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Límite de Crédito *</label>
                                <input 
                                    required 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                                    placeholder="0.00" 
                                    value={formData.creditLimit} 
                                    onChange={e => setFormData({...formData, creditLimit: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Día de Cierre</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="31" 
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                                        placeholder="Ej: 25" 
                                        value={formData.closingDay} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 31)) {
                                                setFormData({...formData, closingDay: val});
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Día de Vencimiento</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="31" 
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                                        placeholder="Ej: 5" 
                                        value={formData.dueDay} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 31)) {
                                                setFormData({...formData, dueDay: val});
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

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
                            <Check size={18}/> {isEditing ? 'Actualizar' : 'Guardar'} Tarjeta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;