import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Banknote, Landmark } from 'lucide-react';

const getMethodIcon = (method) => {
    switch(method) {
        case 'CREDIT_CARD':
        case 'DEBIT_CARD': return <CreditCard size={16}/>;
        case 'BANK_TRANSFER': return <Landmark size={16}/>;
        default: return <Banknote size={16}/>;
    }
};

const TransactionList = ({ transactions, isLoading }) => {
    if (isLoading) {
        return <div className="p-8 text-center text-slate-400">Cargando movimientos...</div>;
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No hay transacciones registradas.</p>
                <p className="text-sm text-slate-400 mt-1">Intenta cambiar los filtros o agrega una nueva.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Descripción</th>
                        <th className="px-6 py-4">Categoría</th>
                        <th className="px-6 py-4">Método</th>
                        <th className="px-6 py-4 text-right">Monto</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                {formatDate(t.date)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-slate-800">{t.description}</div>
                                {t.installment_id && (
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-2 inline-block">
                                        Cuota
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <span 
                                    className="px-2 py-1 rounded-full text-xs font-medium border"
                                    style={{
                                        backgroundColor: `${t.category_color}20`, 
                                        color: t.category_color || '#64748b',
                                        borderColor: `${t.category_color}40`
                                    }}
                                >
                                    {t.category_name || 'Sin Categoría'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-2 mt-1">
                                {getMethodIcon(t.payment_method)}
                                <span className="capitalize">{t.payment_method.replace('_', ' ').toLowerCase()}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className={`font-bold text-sm flex items-center justify-end gap-1 ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;