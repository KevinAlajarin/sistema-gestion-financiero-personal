import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const KpiCard = ({ title, amount, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(amount)}</h3>
        </div>
        <div className={`p-3 rounded-full ${bgClass}`}>
            <Icon size={24} className={colorClass} />
        </div>
    </div>
);

const KpiSummary = ({ summary }) => {
    if (!summary) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard 
                title="Ingresos (Mes)" 
                amount={summary.income} 
                icon={ArrowUpCircle} 
                colorClass="text-emerald-500" 
                bgClass="bg-emerald-50"
            />
            <KpiCard 
                title="Gastos (Mes)" 
                amount={summary.expense} 
                icon={ArrowDownCircle} 
                colorClass="text-rose-500" 
                bgClass="bg-rose-50"
            />
            <KpiCard 
                title="Balance Global" 
                amount={summary.balance} 
                icon={Wallet} 
                colorClass="text-blue-500" 
                bgClass="bg-blue-50"
            />
            <KpiCard 
                title="Ahorro Neto (Mes)" 
                amount={summary.savings} 
                icon={PiggyBank} 
                colorClass="text-amber-500" 
                bgClass="bg-amber-50"
            />
        </div>
    );
};

export default KpiSummary;