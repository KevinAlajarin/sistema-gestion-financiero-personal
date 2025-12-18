import React, { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import { Plus, Filter } from 'lucide-react';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Filtros básicos (podríamos expandir esto luego)
    const [filterType, setFilterType] = useState(''); // '' | 'INCOME' | 'EXPENSE'

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // Pasamos filtros al servicio
            const data = await transactionService.getAll({ 
                type: filterType 
            });
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Recargar cuando cambian los filtros
    useEffect(() => {
        fetchTransactions();
    }, [filterType]);

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header de la página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Movimientos</h2>
                    <p className="text-slate-500 text-sm">Gestiona tus ingresos y gastos diarios</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Filtro Simple */}
                    <div className="relative">
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium"
                        >
                            <option value="">Todos</option>
                            <option value="INCOME">Ingresos</option>
                            <option value="EXPENSE">Gastos</option>
                        </select>
                        <Filter className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    {/* Botón Agregar */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm shadow-blue-200 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span className="hidden md:inline">Nueva Transacción</span>
                        <span className="md:hidden">Nuevo</span>
                    </button>
                </div>
            </div>

            {/* Listado */}
            <TransactionList transactions={transactions} isLoading={loading} />

            {/* Modal Form */}
            {isModalOpen && (
                <TransactionForm 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={fetchTransactions} // Al guardar, recarga la lista
                />
            )}
        </div>
    );
};

export default TransactionsPage;