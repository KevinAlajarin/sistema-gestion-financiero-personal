import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const ExpenseByCategoryChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 flex flex-col items-center justify-center text-slate-400">
                <p>Sin datos de gastos este mes</p>
            </div>
        );
    }

    const chartData = data.map(item => ({
        ...item,
        value: parseFloat(item.total)
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Gastos por Categoría</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#cbd5e1'} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseByCategoryChart;