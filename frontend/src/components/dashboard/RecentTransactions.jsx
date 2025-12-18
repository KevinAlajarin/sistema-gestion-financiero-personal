import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const RecentTransactions = ({ transactions }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Últimos Movimientos</h3>
            <div className="space-y-4">
                {transactions && transactions.length > 0 ? (
                    transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {t.type === 'INCOME' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{t.description}</p>
                                    <p className="text-xs text-slate-500">{formatDate(t.date)} • {t.category_name}</p>
                                </div>
                            </div>
                            <span className={`font-semibold text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 text-center py-4">No hay movimientos recientes.</p>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;