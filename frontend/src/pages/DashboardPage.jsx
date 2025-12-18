import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import salaryService from '../services/salaryService';
import KpiSummary from '../components/dashboard/KpiSummary';
import ExpenseByCategoryChart from '../components/dashboard/ExpenseByCategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Verificar y procesar sueldo automáticamente si es necesario
                try {
                    await salaryService.processSalary();
                } catch (err) {
                    // Ignorar errores de procesamiento de sueldo (puede no haber config)
                    console.log('No se pudo procesar sueldo automático:', err.message);
                }

                const result = await dashboardService.getSummary();
                setData(result);
            } catch (err) {
                console.error("Error fetching dashboard:", err);
                setError("No se pudieron cargar los datos del dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-400">Cargando inteligencia financiera...</div>;
    if (error) return <div className="p-8 text-center text-rose-500">{error}</div>;

    // Formatear fecha actual
    const formatCurrentDate = () => {
        const today = new Date();
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const dayName = days[today.getDay()];
        const day = today.getDate();
        const monthName = months[today.getMonth()];
        const year = today.getFullYear();
        
        return `${dayName} ${day} / ${monthName} / ${year}`;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Resumen Financiero</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2">
                    <p className="text-slate-500 text-sm">
                        Periodo: {data.period.month}/{data.period.year}
                    </p>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <p className="text-slate-600 font-medium text-sm">
                        {formatCurrentDate()}
                    </p>
                </div>
            </div>

            {/* 1. KPIs */}
            <KpiSummary summary={data.summary} />

            {/* 2. Gráficos y Listas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ExpenseByCategoryChart data={data.charts.expensesByCategory} />
                </div>
                <div className="lg:col-span-2">
                    <RecentTransactions transactions={data.recentTransactions} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;