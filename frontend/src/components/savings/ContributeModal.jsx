import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const ContributeModal = ({ goal, onClose, onSuccess, onError, isWithdraw = false }) => {
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amountNum = parseFloat(amount);
        
        if (isNaN(amountNum) || amountNum <= 0) {
            if (onError) onError(new Error('El monto debe ser mayor a 0'));
            return;
        }

        if (isWithdraw && amountNum > goal.current_amount) {
            if (onError) onError(new Error(`No puedes retirar más de lo que tienes. Disponible: ${formatCurrency(goal.current_amount)}`));
            return;
        }

        setIsSubmitting(true);
        try {
            await onSuccess(amountNum);
            onClose();
        } catch (error) {
            if (onError) onError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                <div className={`p-6 flex justify-between items-center ${isWithdraw ? 'bg-amber-50 border-b border-amber-200' : 'bg-emerald-50 border-b border-emerald-200'}`}>
                    <div className="flex items-center gap-3">
                        {isWithdraw ? (
                            <TrendingDown className="text-amber-600" size={24} />
                        ) : (
                            <TrendingUp className="text-emerald-600" size={24} />
                        )}
                        <h3 className="font-bold text-lg text-slate-800">
                            {isWithdraw ? 'Retirar Fondos' : 'Sumar Fondos'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Meta: <span className="font-bold">{goal.name}</span>
                        </label>
                        <p className="text-xs text-slate-500 mb-4">
                            {isWithdraw ? (
                                <>Disponible: <span className="font-semibold">{formatCurrency(goal.current_amount)}</span></>
                            ) : (
                                <>Progreso: <span className="font-semibold">{formatCurrency(goal.current_amount)}</span> de {formatCurrency(goal.target_amount)}</>
                            )}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {isWithdraw ? 'Monto a Retirar' : 'Monto a Aportar'} *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                            <input
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                max={isWithdraw ? goal.current_amount : undefined}
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        {isWithdraw && amount && parseFloat(amount) > goal.current_amount && (
                            <p className="mt-1 text-xs text-rose-600">
                                No puedes retirar más de {formatCurrency(goal.current_amount)}
                            </p>
                        )}
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
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors disabled:opacity-50 ${
                                isWithdraw 
                                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                        >
                            {isSubmitting ? 'Procesando...' : (isWithdraw ? 'Retirar' : 'Aportar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContributeModal;

