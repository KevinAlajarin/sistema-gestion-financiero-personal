import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const BudgetVsActualChart = ({ data }) => {
    // data esperada: [{ category_name, planned_amount, spent_amount }]
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Presupuesto vs Real</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="category_name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="spent_amount" name="Gastado" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="planned_amount" name="Límite" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BudgetVsActualChart;