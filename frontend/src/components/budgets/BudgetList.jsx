import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const BudgetCard = ({ budget, onDelete }) => {
    let colorClass = 'bg-emerald-500';
    let bgClass = 'bg-emerald-50 border-emerald-100';
    let textClass = 'text-emerald-700';

    if (budget.percentage >= 100) {
        colorClass = 'bg-rose-500';
        bgClass = 'bg-rose-50 border-rose-100';
        textClass = 'text-rose-700';
    } else if (budget.percentage >= 80) {
        colorClass = 'bg-amber-500';
        bgClass = 'bg-amber-50 border-amber-100';
        textClass = 'text-amber-700';
    }

    return (
        <div className={`p-5 rounded-xl border ${bgClass} shadow-sm transition-all hover:shadow-md mb-4`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-xl">
                        <span style={{ color: budget.color }}>●</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">{budget.category_name}</h4>
                        <p className="text-xs text-slate-500">
                            {budget.percentage >= 100 ? 'Presupuesto Excedido' : `${budget.remaining > 0 ? 'Disponible' : 'Excedido'}: ${formatCurrency(Math.abs(budget.remaining))}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className={`text-lg font-bold ${textClass}`}>
                            {budget.percentage.toFixed(0)}%
                        </p>
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(budget)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar presupuesto"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Barra de Progreso */}
            <div className="relative w-full h-3 bg-white rounded-full overflow-hidden border border-slate-200/50 mt-2">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} 
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
            </div>

            <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                <span>Gastado: {formatCurrency(budget.spent_amount)}</span>
                <span>Límite: {formatCurrency(budget.planned_amount)}</span>
            </div>

            {budget.percentage >= 100 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 bg-white/50 p-2 rounded-lg">
                    <AlertTriangle size={14} />
                    <span>Has superado el límite de esta categoría.</span>
                </div>
            )}
        </div>
    );
};

const BudgetList = ({ budgets, isLoading, onDelete }) => {
    if (isLoading) return <div className="text-center p-8 text-slate-400">Calculando finanzas...</div>;

    if (!budgets || budgets.length === 0) {
        return (
            <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-500 mb-2">No has definido presupuestos para este mes.</p>
                <p className="text-xs text-slate-400">Define límites para tus categorías de gasto y controla tu dinero.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(b => (
                <BudgetCard key={b.id} budget={b} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default BudgetList;